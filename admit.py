"""
SCNTSE Admit Card Generator v5
Reads candidate data from Sheet1 of _SCNTSE 2026 (Responses).xlsx.
Automatically deduplicates student entries by Aadhar Number (keeping the first submission).
Auto-downloads photos concurrently using ThreadPoolExecutor.
Generates admit card PDFs named <aadhar_number>.pdf in admit/ folder.
Updates Sheet1 of _SCNTSE 2026 (Responses).xlsx with a new column 'Hall ticket number'.
"""

import os
import re
import pandas as pd
import requests
from PIL import Image
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from concurrent.futures import ThreadPoolExecutor

try:
    import gdown
    HAS_GDOWN = True
except ImportError:
    HAS_GDOWN = False

from tqdm import tqdm

# ---------- PATH CONFIG ----------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
XLSX_PATH = os.path.join(SCRIPT_DIR, "_SCNTSE 2026 (Responses).xlsx")
IEM_LOGO = os.path.join(SCRIPT_DIR, "attached_assets", "logo.png")
UEM_LOGO = os.path.join(SCRIPT_DIR, "attached_assets", "image_1752080086077.png")
OUT_DIR = os.path.join(SCRIPT_DIR, "admit")
PHOTO_DIR = os.path.join(OUT_DIR, "photos")

PHOTO_COL = "Your Recent Passport size photograph"
VENUE_COL = "Preferred venue ( Preferred venue will be allocated Subjected to availability of the seats in that venue)"
AADHAR_COL = "Aadhar Number"

NAVY = HexColor("#111111")
RED = HexColor("#D93025")
GREY = HexColor("#333333")

# Venue details mapping: (name, address, maps_link, center_code)
# IEM Management House, IEM Gurukul, IEM Ashram -> IEM Management House (Center Code: 02)
VENUE_MANAGEMENT = (
    "IEM Management House",
    "IEM Management Building, D-1, Street No. 13, EP Block, Sector V, Bidhannagar, Kolkata, West Bengal 700091",
    "https://maps.app.goo.gl/eL7cenJFuB5ugS3c6",
    "02"
)

# IEM Newtown -> IEM Newtown (Center Code: 04)
VENUE_NEWTOWN = (
    "IEM Newtown",
    "University Area, Plot No. III-B/5, New Town, Action Area III, Kolkata, West Bengal 700156",
    None,
    "04"
)

def resolve_venue(raw_venue):
    """Assign venue and center code based on candidate preference rule."""
    if not raw_venue or pd.isna(raw_venue):
        return VENUE_MANAGEMENT
    v = str(raw_venue).strip().lower()
    if "newtown" in v or "new town" in v:
        return VENUE_NEWTOWN
    return VENUE_MANAGEMENT

def clean_aadhar(raw_val):
    """Clean Aadhar number to standard digits string."""
    if pd.isna(raw_val):
        return ""
    val_str = str(raw_val).strip()
    if val_str.endswith(".0"):
        val_str = val_str[:-2]
    cleaned = re.sub(r"[^\d]", "", val_str)
    return cleaned if cleaned else val_str

def safe_filename(s):
    s = str(s).strip()
    return re.sub(r"[^a-zA-Z0-9_+-]", "_", s)

def extract_drive_id(url):
    if not isinstance(url, str):
        return None
    m = re.search(r"id=([a-zA-Z0-9_-]+)", url)
    if m:
        return m.group(1)
    m = re.search(r"/d/([a-zA-Z0-9_-]+)", url)
    if m:
        return m.group(1)
    return None

def download_photo_single(args):
    url, aadhar_key = args
    if not url or pd.isna(url):
        return None
    os.makedirs(PHOTO_DIR, exist_ok=True)
    file_base = safe_filename(aadhar_key) if aadhar_key else "unknown"
    dest = os.path.join(PHOTO_DIR, f"{file_base}.jpg")
    
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return dest

    file_id = extract_drive_id(url)
    if not file_id:
        return None

    # Try fast LH3 direct endpoint
    try:
        lh3_url = f"https://lh3.googleusercontent.com/d/{file_id}"
        resp = requests.get(lh3_url, timeout=10)
        if resp.status_code == 200 and len(resp.content) > 1000:
            with open(dest, "wb") as f:
                f.write(resp.content)
            img = Image.open(dest).convert("RGB")
            img.save(dest, quality=92)
            return dest
    except Exception:
        pass

    # Fallback to gdown
    if HAS_GDOWN:
        try:
            gdown.download(url=f"https://drive.google.com/uc?id={file_id}", output=dest, quiet=True)
            if os.path.exists(dest) and os.path.getsize(dest) > 0:
                img = Image.open(dest).convert("RGB")
                img.save(dest, quality=92)
                return dest
        except Exception:
            pass

    return None

def wrap_by_width(c, text, font, size, max_width_pt):
    """Wrap text so each line's rendered width fits max_width_pt."""
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

def draw_card(c, row, hall_ticket_no, page_w, page_h, photo_path):
    margin = 12 * mm
    top = page_h - margin

    # Header section
    header_h = 20 * mm
    if os.path.exists(IEM_LOGO):
        c.drawImage(IEM_LOGO, margin, top - header_h + 2 * mm,
                    width=18 * mm, height=18 * mm, preserveAspectRatio=True, mask='auto')
    if os.path.exists(UEM_LOGO):
        c.drawImage(UEM_LOGO, page_w - margin - 22 * mm, top - header_h + 2 * mm,
                    width=22 * mm, height=18 * mm, preserveAspectRatio=True, mask='auto')

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(page_w / 2, top - 8 * mm, "SCNTSE 2026 Admit Card")
    c.setFont("Helvetica", 9.5)
    c.setFillColor(GREY)
    c.drawCentredString(page_w / 2, top - 14 * mm, "Prof. Dr. Satyajit Chakrabarti National Talent Search Examination")

    box_top = top - header_h - 4 * mm
    box_left = margin
    box_w = page_w - 2 * margin

    photo_w_mm, photo_h_mm = 32 * mm, 42 * mm
    photo_x = box_left + 4 * mm
    text_x = photo_x + photo_w_mm + 6 * mm
    text_max_w = (box_left + box_w - 4 * mm) - text_x

    name = row.get("Name", "")
    parent = row.get("Parent's Name", "")
    addr = str(row.get("Communication Address", "") or "")
    gender = row.get("Gender", "")
    state = row.get("State", "")
    nat = row.get("Nationality", "")

    gap = 5.5 * mm
    addr_lines = wrap_by_width(c, f"Address: {addr}", "Helvetica", 9.5, text_max_w)

    fixed_lines = 2 + 1 + len(addr_lines) + 3
    text_block_h = fixed_lines * gap + 2 * mm
    name_sec_h = max(text_block_h, photo_h_mm + 6 * mm)

    photo_y = box_top - name_sec_h + (name_sec_h - photo_h_mm) / 2

    # Draw Photo
    if photo_path and os.path.exists(photo_path):
        try:
            img = Image.open(photo_path).convert("RGB")
            src_w, src_h = img.size
            box_ratio = photo_w_mm / photo_h_mm
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
            fitted = img.resize((int(photo_w_mm * 6), int(photo_h_mm * 6)), Image.LANCZOS)
            tmp_path = os.path.join(PHOTO_DIR, f"_fit_{os.path.basename(photo_path)}")
            fitted.save(tmp_path, quality=90)
            c.drawImage(tmp_path, photo_x, photo_y, width=photo_w_mm, height=photo_h_mm)
        except Exception:
            c.setFillColor(HexColor("#e0e0e0"))
            c.rect(photo_x, photo_y, photo_w_mm, photo_h_mm, fill=1, stroke=1)
            c.setFillColor(HexColor("#888888"))
            c.setFont("Helvetica", 8)
            c.drawCentredString(photo_x + photo_w_mm / 2, photo_y + photo_h_mm / 2, "PHOTO")
    else:
        c.setFillColor(HexColor("#e0e0e0"))
        c.rect(photo_x, photo_y, photo_w_mm, photo_h_mm, fill=1, stroke=1)
        c.setFillColor(HexColor("#888888"))
        c.setFont("Helvetica", 8)
        c.drawCentredString(photo_x + photo_w_mm / 2, photo_y + photo_h_mm / 2, "PHOTO")

    text_y = box_top - 8 * mm
    c.setFont("Helvetica-Bold", 12.5)
    c.setFillColor(NAVY)
    c.drawString(text_x, text_y, f"Name: {str(name).upper()}")
    text_y -= gap
    c.drawString(text_x, text_y, f"Hall Ticket No: {hall_ticket_no}")
    text_y -= gap

    c.setFont("Helvetica", 9.5)
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

    # Round 1 section
    y_cursor = round_top - 6 * mm
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(NAVY)
    c.drawString(box_left + 4 * mm, y_cursor, "Round 1 : Written Examination")
    y_cursor -= 6 * mm
    c.setFont("Helvetica", 9.5)
    c.setFillColor(GREY)
    c.drawString(box_left + 4 * mm, y_cursor, "Date: To be announced")
    y_cursor -= 5 * mm
    c.drawString(box_left + 4 * mm, y_cursor, "Reporting Time: 10:00 AM (Exam: 11:00 AM - 1:00 PM)")
    y_cursor -= 7 * mm

    raw_venue = row.get(VENUE_COL, "")
    venue_name, venue_addr, venue_link, center_code = resolve_venue(raw_venue)

    c.setFont("Helvetica-Bold", 10.5)
    c.setFillColor(NAVY)
    c.drawString(box_left + 4 * mm, y_cursor, f"CENTER CODE : {center_code}")
    y_cursor -= 5.5 * mm

    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(NAVY)
    venue_max_w = (box_left + box_w - 4 * mm) - (box_left + 4 * mm)
    for vl in wrap_by_width(c, f"Venue: {venue_name}", "Helvetica-Bold", 10, venue_max_w):
        c.drawString(box_left + 4 * mm, y_cursor, vl)
        y_cursor -= 5 * mm

    if venue_addr:
        c.setFont("Helvetica", 8.5)
        c.setFillColor(GREY)
        for al in wrap_by_width(c, venue_addr, "Helvetica", 8.5, venue_max_w):
            c.drawString(box_left + 4 * mm, y_cursor, al)
            y_cursor -= 4.2 * mm

    box_bottom = y_cursor - 3 * mm
    box_h = box_top - box_bottom
    c.setStrokeColor(NAVY)
    c.setLineWidth(1.2)
    c.rect(box_left, box_bottom, box_w, box_h, stroke=1, fill=0)

    # Instructions Section
    y_cursor = box_bottom - 8 * mm
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(NAVY)
    c.drawString(box_left, y_cursor, "Admit card Instructions:")
    y_cursor -= 5 * mm

    instructions = [
        "This admit card shall be considered valid only upon the candidate's fulfillment of all eligibility criteria, including qualifying marks, year of passing Class 12, and successful completion of payment.",
        "The round 1 examination will be held from 11:00 AM to 1:00 PM, and candidates must report by 10:00 AM as entry will close strictly at 10:30 AM. No student is allowed to leave the exam hall before 1:00 PM.",
        "Bring the original SCNTSE-2026 Admit Card and a valid original photo ID (Aadhaar/PAN/Passport/School ID).",
        "Carry one passport size colour photograph (same as uploaded during application).",
        "Candidates are strictly instructed not to adopt any unfair means or malpractices and not to misbehave with the examination officials during the examination. Candidates must adhere to all the examination rules and regulations regarding their conduct in the Examination Hall. All cases of unfair means will lead to cancellation of examination of the concerned candidate.",
        "Decision of the Exam coordinators are final in all regards.",
        "Use only the blue/black ballpoint pen for filling the OMR sheet. Do not use any whitener, gel pen, correction fluid, or pencils.",
        "Submit your OMR sheet and the question booklet before leaving.",
        "Usage of calculators, electronic devices such as mobile phones, digital watch, fitness band, headphones and similar devices are strictly not allowed inside the examination hall.",
    ]
    c.setFont("Helvetica", 8)
    c.setFillColor(HexColor("#222222"))
    bullet_max_w = box_w - 6 * mm
    for ins in instructions:
        lines = wrap_by_width(c, ins, "Helvetica", 8, bullet_max_w)
        c.drawString(box_left + 2 * mm, y_cursor, f"\u2022 {lines[0]}")
        y_cursor -= 4 * mm
        for extra in lines[1:]:
            c.drawString(box_left + 5 * mm, y_cursor, extra)
            y_cursor -= 4 * mm
        y_cursor -= 0.5 * mm

    # Disclaimer
    y_cursor -= 1 * mm
    disclaimer = (
        "The Admit Card has been issued based on the information provided by the candidate, which is presumed "
        "to fulfill all eligibility criteria as per the examination guidelines. However, if at any stage of the examination "
        "process it is found that the candidate has furnished false, incorrect, or misleading information, the Admit "
        "Card will be deemed invalid, and the candidature will be cancelled immediately."
    )
    c.setFont("Helvetica-Bold", 7.5)
    c.setFillColor(HexColor("#000000"))
    for dl in wrap_by_width(c, disclaimer, "Helvetica-Bold", 7.5, box_w):
        c.drawString(box_left, y_cursor, dl)
        y_cursor -= 3.5 * mm

    # Signatures at bottom
    sig_y = margin + 6 * mm
    sig_w = 55 * mm
    sig_h = 14 * mm
    c.setFont("Helvetica-Bold", 8.5)
    c.setFillColor(RED)
    c.drawString(box_left, sig_y + sig_h + 1.5 * mm, "Candidate's Signature")
    c.setStrokeColor(NAVY)
    c.setLineWidth(1)
    c.rect(box_left, sig_y, sig_w, sig_h, stroke=1, fill=0)

    right_x = box_left + box_w - sig_w
    c.setFillColor(RED)
    c.drawString(right_x, sig_y + sig_h + 1.5 * mm, "Invigilator's Signature")
    c.rect(right_x, sig_y, sig_w, sig_h, stroke=1, fill=0)

    # Page border
    c.setStrokeColor(NAVY)
    c.setLineWidth(1)
    c.rect(margin - 4 * mm, margin - 4 * mm, page_w - 2 * margin + 8 * mm, page_h - 2 * margin + 8 * mm, stroke=1, fill=0)


def generate_hall_ticket_numbers(df):
    """
    Generate Hall ticket numbers for each student:
    - IEM Management House, Gurukul, Ashram group: 2602001, 2602002...
    - IEM Newtown group: 2604500, 2604501...
    """
    mgmt_counter = 2602001
    newtown_counter = 2604500
    hall_tickets = []

    for idx, row in df.iterrows():
        raw_v = row.get(VENUE_COL, "")
        name, _, _, _ = resolve_venue(raw_v)
        if name == "IEM Newtown":
            hall_tickets.append(newtown_counter)
            newtown_counter += 1
        else:
            hall_tickets.append(mgmt_counter)
            mgmt_counter += 1

    return hall_tickets


def update_excel_with_hall_tickets(excel_path, df_dedup):
    """Update Sheet1 in _SCNTSE 2026 (Responses).xlsx with deduplicated candidate rows."""
    all_sheets = pd.read_excel(excel_path, sheet_name=None)
    all_sheets["Sheet1"] = df_dedup

    with pd.ExcelWriter(excel_path, engine="openpyxl") as writer:
        for sheet_name, sheet_df in all_sheets.items():
            sheet_df.to_excel(writer, sheet_name=sheet_name, index=False)
    print(f"Updated '{excel_path}' (Sheet1) with deduplicated rows.")


def main():
    print(f"Loading data from {XLSX_PATH} (Sheet1)...")
    df = pd.read_excel(XLSX_PATH, sheet_name="Sheet1")

    # Fix Bhargobi's Aadhar number if raw value is 6976
    df.loc[df["Name"].astype(str).str.strip() == "Bhargobi Bhattacharyya", "Aadhar Number"] = "697634605370"

    # Clean Aadhar numbers for exact deduplication
    cleaned_aadhars = [clean_aadhar(v) for v in df[AADHAR_COL]]
    df["_a_clean"] = cleaned_aadhars

    # Drop duplicate submissions by same candidate (keep first submission)
    df = df.drop_duplicates(subset=["_a_clean"], keep="first").drop(columns=["_a_clean"]).reset_index(drop=True)

    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(PHOTO_DIR, exist_ok=True)

    # Generate Hall ticket numbers according to venue rules
    if "Hall ticket number" not in df.columns:
        hall_tickets = generate_hall_ticket_numbers(df)
        df["Hall ticket number"] = hall_tickets

    # Save deduplicated rows back to Excel
    update_excel_with_hall_tickets(XLSX_PATH, df)

    # Fast parallel download of candidate photos
    download_tasks = []
    for idx, row in df.iterrows():
        raw_a = clean_aadhar(row.get(AADHAR_COL, ""))
        if not raw_a:
            raw_a = f"unknown_{idx+1}"
        download_tasks.append((row.get(PHOTO_COL), raw_a))

    print(f"Downloading {len(download_tasks)} candidate photos concurrently...")
    with ThreadPoolExecutor(max_workers=20) as executor:
        list(tqdm(executor.map(download_photo_single, download_tasks), total=len(download_tasks), desc="Downloading photos", unit="photo"))

    pbar = tqdm(df.iterrows(), total=len(df), desc="Generating admit cards", unit="card")

    page_w, page_h = A4

    for idx, row in pbar:
        raw_aadhar = row.get(AADHAR_COL, "")
        aadhar_clean = clean_aadhar(raw_aadhar)

        if not aadhar_clean:
            aadhar_clean = f"unknown_{idx+1}"

        hall_ticket_no = row["Hall ticket number"]

        name = row.get("Name", "")
        pbar.set_postfix_str(f"{str(name)[:15]} ({aadhar_clean})")

        photo_path = os.path.join(PHOTO_DIR, f"{safe_filename(aadhar_clean)}.jpg")
        if not os.path.exists(photo_path) or os.path.getsize(photo_path) == 0:
            photo_path = None

        out_pdf_path = os.path.join(OUT_DIR, f"{aadhar_clean}.pdf")
        c = canvas.Canvas(out_pdf_path, pagesize=A4)
        draw_card(c, row, hall_ticket_no, page_w, page_h, photo_path)
        c.save()

    print(f"\nSuccessfully generated {len(df)} admit card PDF(s) in '{OUT_DIR}' folder.")


if __name__ == "__main__":
    main()