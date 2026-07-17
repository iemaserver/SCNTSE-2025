"""
SCNTSE Admit Card Generator v3
Reads candidate data from xlsx. Auto-downloads photo from Google Drive link column.
Draws admit card PDF per row, matched to sample design.
Output file name: <email>.pdf

Edge cases handled:
- Duplicate names: hall ticket / Ticket ID tied to row, not name.
- Duplicate emails: filename suffixed _2, _3, ...
- Photo any size: cover-fit crop into fixed box.
- Missing photo: placeholder box.
- Long address / long venue text: wraps to multiple lines, section box height grows to fit, nothing overlaps.
- "Ticket ID" column: if present in xlsx, used as-is; else falls back to generated hall ticket number.
- Venue: full address + maps link resolved from a hardcoded venue map, matched by keyword.
"""

import os
import re
import pandas as pd
from PIL import Image
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

try:
    import gdown
    HAS_GDOWN = True
except ImportError:
    HAS_GDOWN = False

from tqdm import tqdm

# ---------- CONFIG ----------
XLSX_PATH = "/mnt/user-data/uploads/_SCNTSE_2026__Responses_.xlsx"
IEM_LOGO = "/mnt/user-data/uploads/logo.png"
UEM_LOGO = "/mnt/user-data/uploads/image_1752080086077.png"
PHOTO_DIR = "/home/claude/admit_cards/photos"
OUT_DIR = "/mnt/user-data/outputs"
PHOTO_COL = "Your Recent Passport size photograph"
VENUE_COL = "Preferred venue ( Preferred venue will be allocated Subjected to availability of the seats in that venue)"
TICKET_COL = "Ticket ID"  # optional future column

NAVY = HexColor("#111111")
RED = HexColor("#D93025")
GREY = HexColor("#333333")
LINK_BLUE = HexColor("#1155CC")

HALL_TICKET_BASE = 2620000

# ---- hardcoded venue directory: keyword -> (display name, full address, maps link) ----
VENUE_MAP = [
    ("management", "IEM Management House",
     "IEM Management Building, D-1, Street No. 13, EP Block, Sector V, Bidhannagar, Kolkata, West Bengal 700091",
     "https://maps.app.goo.gl/eL7cenJFuB5ugS3c6"),
    ("gurukul", "IEM Gurukul Building",
     "IEM Gurukul Building, Y-12, EP Block, Sector V, Bidhannagar, Kolkata, West Bengal 700091",
     "https://maps.app.goo.gl/RbJfTfW6aw88mQ3d9"),
    ("ashram", "IEM Ashram Building",
     "IEM Ashram Building, Street Number 27, GN Block, Nalban Bheri, Dhapa, Kolkata, West Bengal 700098",
     "https://maps.app.goo.gl/AmEGBLRfDg8iMTep9"),
    ("newtown", "IEM Newtown",
     "University Area, Plot No. III-B/5, New Town, Action Area III, Kolkata, West Bengal 700156",
     None),
    ("new town", "IEM Newtown",
     "University Area, Plot No. III-B/5, New Town, Action Area III, Kolkata, West Bengal 700156",
     None),
]


def resolve_venue(raw_venue):
    """Match free-text venue value against VENUE_MAP keywords. Returns (name, address, link) or fallback."""
    if not raw_venue or pd.isna(raw_venue):
        return ("Not specified", "", None)
    v = str(raw_venue).strip().lower()
    for keyword, name, address, link in VENUE_MAP:
        if keyword in v:
            return (name, address, link)
    return (str(raw_venue).strip(), "", None)


def safe_filename(s):
    s = str(s).strip().lower()
    return re.sub(r"[^a-z0-9@._+-]", "_", s)


def extract_drive_id(url):
    if not isinstance(url, str):
        return None
    m = re.search(r"[?&]id=([a-zA-Z0-9_-]+)", url)
    if m:
        return m.group(1)
    m = re.search(r"/d/([a-zA-Z0-9_-]+)", url)
    if m:
        return m.group(1)
    return None


def download_photo(url, email):
    os.makedirs(PHOTO_DIR, exist_ok=True)
    dest = os.path.join(PHOTO_DIR, safe_filename(email) + ".jpg")
    if os.path.exists(dest):
        return dest
    file_id = extract_drive_id(url)
    if not file_id or not HAS_GDOWN:
        return None
    try:
        tmp = dest + ".tmp"
        gdown.download(f"https://drive.google.com/uc?id={file_id}", tmp, quiet=True)
        if os.path.exists(tmp):
            img = Image.open(tmp).convert("RGB")
            img.save(dest, quality=92)
            os.remove(tmp)
            return dest
    except Exception as e:
        tqdm.write(f"photo download failed for {email}: {e}")
    return None


def find_local_photo(email, name):
    candidates = [safe_filename(email), re.sub(r"\s+", "_", str(name).strip().lower())]
    for base in candidates:
        for ext in [".jpg", ".jpeg", ".png", ".webp"]:
            p = os.path.join(PHOTO_DIR, base + ext)
            if os.path.exists(p):
                return p
    return None


def fit_photo(src_path, box_w_px, box_h_px):
    img = Image.open(src_path).convert("RGB")
    src_w, src_h = img.size
    box_ratio = box_w_px / box_h_px
    src_ratio = src_w / src_h
    if src_ratio > box_ratio:
        new_h = src_h
        new_w = int(src_h * box_ratio)
        x0 = (src_w - new_w) // 2
        img = img.crop((x0, 0, x0 + new_w, new_h))
    else:
        new_w = src_w
        new_h = int(src_w / box_ratio)
        y0 = (src_h - new_h) // 2
        img = img.crop((0, y0, new_w, y0 + new_h))
    return img.resize((box_w_px, box_h_px), Image.LANCZOS)


def draw_placeholder(c, x, y, w, h):
    c.setFillColor(HexColor("#e0e0e0"))
    c.rect(x, y, w, h, fill=1, stroke=1)
    c.setFillColor(HexColor("#888888"))
    c.setFont("Helvetica", 8)
    c.drawCentredString(x + w / 2, y + h / 2, "PHOTO")


def wrap_by_width(c, text, font, size, max_width_pt):
    """Wrap text so each line's rendered width fits max_width_pt, using actual font metrics."""
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if c.stringWidth(trial, font, size) <= max_width_pt:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines or [""]


def draw_card(c, row, ticket_id, page_w, page_h, photo_path):
    margin = 15 * mm
    top = page_h - margin

    # header
    header_h = 22 * mm
    if os.path.exists(IEM_LOGO):
        c.drawImage(IEM_LOGO, margin, top - header_h + 3 * mm,
                    width=18 * mm, height=18 * mm, preserveAspectRatio=True, mask='auto')
    if os.path.exists(UEM_LOGO):
        c.drawImage(UEM_LOGO, page_w - margin - 22 * mm, top - header_h + 3 * mm,
                    width=22 * mm, height=18 * mm, preserveAspectRatio=True, mask='auto')

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(page_w / 2, top - 10 * mm, "SCNTSE 2026 Admit Card")
    c.setFont("Helvetica", 10)
    c.setFillColor(GREY)
    c.drawCentredString(page_w / 2, top - 16 * mm, "Prof. Dr. Satyajit Chakrabarti National Talent Search Examination")

    box_top = top - header_h - 6 * mm
    box_left = margin
    box_w = page_w - 2 * margin

    photo_w_mm, photo_h_mm = 34 * mm, 44 * mm
    photo_x = box_left + 5 * mm
    text_x = photo_x + photo_w_mm + 8 * mm
    text_max_w = (box_left + box_w - 5 * mm) - text_x

    name = row.get("Name", "")
    parent = row.get("Parent's Name", "")
    addr = str(row.get("Communication Address", "") or "")
    gender = row.get("Gender", "")
    state = row.get("State", "")
    nat = row.get("Nationality", "")

    # ---- pre-wrap all text lines to know exact height needed ----
    gap = 6.3 * mm
    addr_lines = wrap_by_width(c, f"Address: {addr}", "Helvetica", 10.5, text_max_w)

    fixed_lines = 2 + 1 + len(addr_lines) + 3  # Name+Ticket, Parent, Address(n), Gender/State/Nationality
    text_block_h = fixed_lines * gap + 4 * mm
    name_sec_h = max(text_block_h, photo_h_mm + 8 * mm)

    photo_y = box_top - name_sec_h + (name_sec_h - photo_h_mm) / 2

    if photo_path:
        try:
            scale = 6
            fitted = fit_photo(photo_path, int(photo_w_mm / mm * scale), int(photo_h_mm / mm * scale))
            tmp_path = f"/tmp/_fit_{os.path.basename(photo_path)}.jpg"
            fitted.save(tmp_path, quality=90)
            c.drawImage(tmp_path, photo_x, photo_y, width=photo_w_mm, height=photo_h_mm)
        except Exception:
            draw_placeholder(c, photo_x, photo_y, photo_w_mm, photo_h_mm)
    else:
        draw_placeholder(c, photo_x, photo_y, photo_w_mm, photo_h_mm)

    text_y = box_top - 10 * mm
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(NAVY)
    c.drawString(text_x, text_y, f"Name: {str(name).upper()}")
    text_y -= gap
    c.drawString(text_x, text_y, f"Ticket ID: {ticket_id}")
    text_y -= gap

    c.setFont("Helvetica", 10.5)
    c.setFillColor(GREY)
    c.drawString(text_x, text_y, f"Parent's Name: {parent}")
    text_y -= gap

    for al in addr_lines:
        c.drawString(text_x, text_y, al)
        text_y -= gap

    c.drawString(text_x, text_y, f"Gender: {gender}")
    text_y -= gap
    c.drawString(text_x, text_y, f"State: {state}")
    text_y -= gap
    c.drawString(text_x, text_y, f"Nationality: {nat}")

    round_top = box_top - name_sec_h

    # ---- round section ----
    y_cursor = round_top - 8 * mm
    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(NAVY)
    c.drawString(box_left + 5 * mm, y_cursor, "Round 1 : Written Examination")
    y_cursor -= 7 * mm
    c.setFont("Helvetica", 10.5)
    c.setFillColor(GREY)
    c.drawString(box_left + 5 * mm, y_cursor, "Date: To be announced")
    y_cursor -= 6 * mm
    c.drawString(box_left + 5 * mm, y_cursor, "Reporting Time: To be announced")
    y_cursor -= 9 * mm

    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(NAVY)
    c.drawString(box_left + 5 * mm, y_cursor, "CENTER CODE : —")
    y_cursor -= 6.5 * mm

    raw_venue = row.get(VENUE_COL, "")
    venue_name, venue_addr, venue_link = resolve_venue(raw_venue)

    c.setFont("Helvetica-Bold", 10.5)
    c.setFillColor(NAVY)
    venue_max_w = (box_left + box_w - 5 * mm) - (box_left + 5 * mm)
    for vl in wrap_by_width(c, f"Venue: {venue_name}", "Helvetica-Bold", 10.5, venue_max_w):
        c.drawString(box_left + 5 * mm, y_cursor, vl)
        y_cursor -= 5.5 * mm

    if venue_addr:
        c.setFont("Helvetica", 9)
        c.setFillColor(GREY)
        for al in wrap_by_width(c, venue_addr, "Helvetica", 9, venue_max_w):
            c.drawString(box_left + 5 * mm, y_cursor, al)
            y_cursor -= 4.8 * mm

    box_bottom = y_cursor - 4 * mm
    box_h = box_top - box_bottom
    c.setStrokeColor(NAVY)
    c.setLineWidth(1.2)
    c.rect(box_left, box_bottom, box_w, box_h, stroke=1, fill=0)

    # ---- instructions (outside box, below) ----
    y_cursor = box_bottom - 10 * mm
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(NAVY)
    c.drawString(box_left, y_cursor, "Instructions: Please read and follow the instructions below:")
    y_cursor -= 7 * mm

    instructions = [
        "All candidates must bring one photocopy of their 12th Standard marksheet, along with the Round 1 and Round 2 admit cards.",
        "You are required to submit one photocopy of the marksheet and one photocopy each of the Round 1, Round 2, and Round 3 admit cards to the invigilator.",
        "Carry a valid government-issued photo ID proof.",
        "The third and final round will be an interview, during which each student must present at least one project (hardware-based, software-based, app-based, scientific, etc.).",
    ]
    c.setFont("Helvetica", 9.5)
    c.setFillColor(HexColor("#222222"))
    bullet_max_w = box_w - 8 * mm
    for ins in instructions:
        lines = wrap_by_width(c, ins, "Helvetica", 9.5, bullet_max_w)
        c.drawString(box_left + 4 * mm, y_cursor, f"\u2022 {lines[0]}")
        y_cursor -= 5.2 * mm
        for extra in lines[1:]:
            c.drawString(box_left + 8 * mm, y_cursor, extra)
            y_cursor -= 5.2 * mm

    y_cursor -= 2 * mm
    disclaimer = (
        "The Admit Card has been issued based on the information provided by the candidate, which is presumed "
        "to fulfill all eligibility criteria as per the examination guidelines.However, if at any stage of the examination "
        "process it is found that the candidate has furnished false, incorrect, or misleading information, the Admit "
        "Card will be deemed invalid, and the candidature will be cancelled immediately. This cancellation may "
        "occur at any stage \u2014 before, during, or after the examination \u2014 without any further notice."
    )
    c.setFont("Helvetica-Bold", 8.7)
    c.setFillColor(HexColor("#000000"))
    for dl in wrap_by_width(c, disclaimer, "Helvetica-Bold", 8.7, box_w):
        c.drawString(box_left, y_cursor, dl)
        y_cursor -= 4.2 * mm

    # ---- signatures ----
    sig_y = margin + 8 * mm
    sig_w = 60 * mm
    sig_h = 16 * mm
    c.setFont("Helvetica", 9.5)
    c.setFillColor(RED)
    c.drawString(box_left, sig_y + sig_h + 2 * mm, "Candidate's Signature")
    c.setStrokeColor(NAVY)
    c.rect(box_left, sig_y, sig_w, sig_h, stroke=1, fill=0)

    right_x = box_left + box_w - sig_w
    c.setFillColor(RED)
    c.drawString(right_x, sig_y + sig_h + 2 * mm, "Invigilator's Signature")
    c.rect(right_x, sig_y, sig_w, sig_h, stroke=1, fill=0)

    # outer page border
    c.setStrokeColor(NAVY)
    c.setLineWidth(1)
    c.rect(margin - 6 * mm, margin - 6 * mm, page_w - 2 * margin + 12 * mm, page_h - 2 * margin + 12 * mm, stroke=1, fill=0)


def main():
    df = pd.read_excel(XLSX_PATH)
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(PHOTO_DIR, exist_ok=True)
    has_ticket_col = TICKET_COL in df.columns

    seen = {}
    pbar = tqdm(df.iterrows(), total=len(df), desc="Generating admit cards", unit="card")
    for idx, row in pbar:
        email_raw = row.get("Email Address") or row.get("Email")
        if pd.isna(email_raw) or not str(email_raw).strip():
            email_raw = f"candidate_row{idx+1}@noemail"
        email_key = safe_filename(email_raw)
        count = seen.get(email_key, 0)
        seen[email_key] = count + 1
        out_name = email_key if count == 0 else f"{email_key}_{count+1}"

        name = row.get("Name", "")
        pbar.set_postfix_str(str(name)[:20])

        drive_url = row.get(PHOTO_COL)
        photo_path = find_local_photo(email_raw, name)
        if not photo_path and pd.notna(drive_url):
            photo_path = download_photo(drive_url, email_raw)

        if has_ticket_col and pd.notna(row.get(TICKET_COL)) and str(row.get(TICKET_COL)).strip():
            ticket_id = str(row.get(TICKET_COL)).strip()
        else:
            ticket_id = HALL_TICKET_BASE + idx + 1

        page_w, page_h = A4
        out_path = os.path.join(OUT_DIR, f"{out_name}.pdf")
        c = canvas.Canvas(out_path, pagesize=A4)
        draw_card(c, row, ticket_id, page_w, page_h, photo_path)
        c.save()

    tqdm.write(f"Done. {len(df)} admit card(s) saved to {OUT_DIR}")


if __name__ == "__main__":
    main()