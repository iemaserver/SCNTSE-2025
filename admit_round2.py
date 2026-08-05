"""
SCNTSE Admit Card Generator — Round 2
Reads candidate data from Sheet1 of _SCNTSE 2026 (Responses).xlsx.
Only generates admit cards for candidates who QUALIFIED Round 1
(i.e., Hall ticket numbers listed in QUALIFIED_HALL_TICKETS set, or all if left empty).
Generates admit card PDFs named <aadhar_number>_r2.pdf in admit_round2/ folder.
DO NOT RUN without verifying QUALIFIED_HALL_TICKETS is populated.
"""

import os
import re
import io
import pandas as pd
import requests
from PIL import Image, ImageFile
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from concurrent.futures import ThreadPoolExecutor

ImageFile.LOAD_TRUNCATED_IMAGES = True

from tqdm import tqdm

# ---------- PATH CONFIG ----------
SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
XLSX_PATH    = os.path.join(SCRIPT_DIR, "_SCNTSE 2026 (Responses).xlsx")
IEM_LOGO     = os.path.join(SCRIPT_DIR, "attached_assets", "logo.png")
UEM_LOGO     = os.path.join(SCRIPT_DIR, "attached_assets", "image_1752080086077.png")
OUT_DIR      = os.path.join(SCRIPT_DIR, "admit_round2")
PHOTO_DIR    = os.path.join(SCRIPT_DIR, "admit", "photos")   # reuse already-downloaded photos

PHOTO_COL  = "Your Recent Passport size photograph"
VENUE_COL  = "Preferred venue ( Preferred venue will be allocated Subjected to availability of the seats in that venue)"
AADHAR_COL = "Aadhar Number"

# -----------------------------------------------------------------------
# POPULATE THIS SET with the Hall Ticket Numbers of Round 1 qualifiers.
# Leave empty (set()) to generate for ALL candidates (testing / draft mode).
# -----------------------------------------------------------------------
QUALIFIED_HALL_TICKETS: set[int] = set()

# ---------- COLOURS ----------
NAVY = HexColor("#111111")
RED  = HexColor("#D93025")
GREY = HexColor("#333333")

# ---------- ROUND 2 EXAM DETAILS ----------
R2_DATE           = "9th August 2026 (Sunday)"
R2_TIME           = "10:30 AM – 1:30 PM  (3 hours)"
R2_REPORTING_TIME = "Reporting Time: 10:00 AM  |  Entry closes strictly at 10:15 AM"
R2_MARKS          = "100 Marks"
R2_PATTERN        = (
    "The Question Booklet consists of 7 questions each from Physics, Chemistry, "
    "Mathematics, and English. Candidates may attempt any 5 questions from each "
    "subject. Each question carries 5 marks."
)

# Venue details — same as Round 1
VENUE_MANAGEMENT = (
    "IEM Management House",
    "IEM Management Building, D-1, Street No. 13, EP Block, Sector V, Bidhannagar, Kolkata, West Bengal 700091",
    "02"
)
VENUE_NEWTOWN = (
    "IEM Newtown",
    "University Area, Plot No. III-B/5, New Town, Action Area III, Kolkata, West Bengal 700156",
    "04"
)


def resolve_venue(raw_venue):
    if not raw_venue or pd.isna(raw_venue):
        return VENUE_MANAGEMENT
    v = str(raw_venue).strip().lower()
    if "newtown" in v or "new town" in v:
        return VENUE_NEWTOWN
    return VENUE_MANAGEMENT


def clean_aadhar(raw_val):
    if pd.isna(raw_val):
        return ""
    val_str = str(raw_val).strip()
    if val_str.endswith(".0"):
        val_str = val_str[:-2]
    cleaned = re.sub(r"[^\d]", "", val_str)
    return cleaned if cleaned else val_str


def safe_filename(s):
    return re.sub(r"[^a-zA-Z0-9_+-]", "_", str(s).strip())


# Global requests session (for any future photo re-downloads)
session = requests.Session()
adapter = requests.adapters.HTTPAdapter(pool_connections=20, pool_maxsize=20)
session.mount("https://", adapter)


def wrap_by_width(c, text, font, size, max_width_pt):
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
    top    = page_h - margin

    # ── Header ───────────────────────────────────────────────────────────
    header_h = 20 * mm
    if os.path.exists(IEM_LOGO):
        c.drawImage(IEM_LOGO, margin, top - header_h + 2 * mm,
                    width=18 * mm, height=18 * mm, preserveAspectRatio=True, mask='auto')
    if os.path.exists(UEM_LOGO):
        c.drawImage(UEM_LOGO, page_w - margin - 22 * mm, top - header_h + 2 * mm,
                    width=22 * mm, height=18 * mm, preserveAspectRatio=True, mask='auto')

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(page_w / 2, top - 8 * mm, "SCNTSE 2026 Admit Card — Round 2")
    c.setFont("Helvetica", 9.5)
    c.setFillColor(GREY)
    c.drawCentredString(page_w / 2, top - 14 * mm, "Prof. Dr. Satyajit Chakrabarti National Talent Search Examination")

    box_top  = top - header_h - 4 * mm
    box_left = margin
    box_w    = page_w - 2 * margin

    # ── Candidate Info + Photo ───────────────────────────────────────────
    photo_w_mm, photo_h_mm = 32 * mm, 42 * mm
    photo_x    = box_left + 4 * mm
    text_x     = photo_x + photo_w_mm + 6 * mm
    text_max_w = (box_left + box_w - 4 * mm) - text_x

    name   = row.get("Name", "")
    parent = row.get("Parent's Name", "")
    addr   = str(row.get("Communication Address", "") or "")
    gender = row.get("Gender", "")
    state  = row.get("State", "")
    nat    = row.get("Nationality", "")

    gap = 5.5 * mm
    addr_lines = wrap_by_width(c, f"Address: {addr}", "Helvetica", 9.5, text_max_w)

    fixed_lines    = 2 + 1 + len(addr_lines) + 3
    text_block_h   = fixed_lines * gap + 2 * mm
    name_sec_h     = max(text_block_h, photo_h_mm + 6 * mm)
    photo_y        = box_top - name_sec_h + (name_sec_h - photo_h_mm) / 2

    # Photo box
    if photo_path and os.path.exists(photo_path):
        try:
            img = Image.open(photo_path).convert("RGB")
            src_w, src_h = img.size
            box_ratio = photo_w_mm / photo_h_mm
            src_ratio  = src_w / src_h
            if src_ratio > box_ratio:
                new_w = int(src_h * box_ratio)
                x0    = (src_w - new_w) // 2
                img   = img.crop((x0, 0, x0 + new_w, src_h))
            else:
                new_h = int(src_w / box_ratio)
                y0    = (src_h - new_h) // 2
                img   = img.crop((0, y0, src_w, y0 + new_h))
            fitted   = img.resize((int(photo_w_mm * 6), int(photo_h_mm * 6)), Image.LANCZOS)
            tmp_path = os.path.join(OUT_DIR, f"_fit_{safe_filename(os.path.basename(photo_path))}")
            fitted.save(tmp_path, quality=90)
            c.drawImage(tmp_path, photo_x, photo_y, width=photo_w_mm, height=photo_h_mm)
        except Exception:
            _draw_photo_placeholder(c, photo_x, photo_y, photo_w_mm, photo_h_mm)
    else:
        _draw_photo_placeholder(c, photo_x, photo_y, photo_w_mm, photo_h_mm)

    # Candidate text fields
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

    # ── Round 2 Details Block ────────────────────────────────────────────
    y_cursor = round_top - 6 * mm
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(NAVY)
    c.drawString(box_left + 4 * mm, y_cursor, "Round 2 : Descriptive Written Examination")
    y_cursor -= 6 * mm

    c.setFont("Helvetica", 9.5)
    c.setFillColor(GREY)
    c.drawString(box_left + 4 * mm, y_cursor, f"Date:   {R2_DATE}")
    y_cursor -= 5 * mm
    c.drawString(box_left + 4 * mm, y_cursor, f"Time:   {R2_TIME}")
    y_cursor -= 5 * mm
    c.drawString(box_left + 4 * mm, y_cursor, R2_REPORTING_TIME)
    y_cursor -= 5 * mm
    c.drawString(box_left + 4 * mm, y_cursor, f"Marks:  {R2_MARKS}")
    y_cursor -= 6 * mm

    # Exam pattern (wrapped)
    pattern_max_w = box_w - 8 * mm
    for pl in wrap_by_width(c, f"Pattern:  {R2_PATTERN}", "Helvetica", 9.5, pattern_max_w):
        c.drawString(box_left + 4 * mm, y_cursor, pl)
        y_cursor -= 5 * mm

    y_cursor -= 2 * mm

    # Venue
    raw_venue  = row.get(VENUE_COL, "")
    venue_name, venue_addr, center_code = resolve_venue(raw_venue)

    c.setFont("Helvetica-Bold", 10.5)
    c.setFillColor(NAVY)
    c.drawString(box_left + 4 * mm, y_cursor, f"CENTER CODE : {center_code}")
    y_cursor -= 5.5 * mm

    venue_max_w = box_w - 8 * mm
    c.setFont("Helvetica-Bold", 10)
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
    box_h      = box_top - box_bottom
    c.setStrokeColor(NAVY)
    c.setLineWidth(1.2)
    c.rect(box_left, box_bottom, box_w, box_h, stroke=1, fill=0)

    # ── Instructions ─────────────────────────────────────────────────────
    y_cursor = box_bottom - 8 * mm
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(NAVY)
    c.drawString(box_left, y_cursor, "Admit Card Instructions:")
    y_cursor -= 5 * mm

    instructions = [
        "This admit card is valid only upon fulfillment of all Round 1 qualification criteria as declared by the examination committee.",
        f"Candidates must report to the examination hall by 10:00 AM. Entry will close strictly at 10:15 AM. The examination begins at {R2_TIME.split('–')[0].strip()}.",
        "Bring the original SCNTSE 2026 Round 2 Admit Card and a valid original photo ID (Aadhaar / PAN / Passport / School ID).",
        "Carry one passport-size colour photograph (same as uploaded during application).",
        "The examination will be of 100 marks. The Question Booklet consists of 7 questions each from Physics, Chemistry, Mathematics, and English. Candidates may attempt any 5 questions from each subject (5 marks each).",
        "On completion of the examination, the candidate must hand over the answer scripts AND the question booklet to the Invigilator before leaving the hall. No candidate is permitted to leave early.",
        "Usage of calculators, electronic devices such as mobile phones, digital watches, fitness bands, headphones, and similar devices is strictly prohibited inside the examination hall.",
        "Candidates are strictly instructed not to adopt any unfair means or malpractices and not to misbehave with examination officials. All cases of unfair means will lead to immediate cancellation of the candidature.",
        "Candidates must adhere to all examination rules and regulations. Decision of the Exam Coordinators is final in all regards.",
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
        "to fulfill all eligibility criteria as per the examination guidelines. However, if at any stage of the "
        "examination process it is found that the candidate has furnished false, incorrect, or misleading information, "
        "the Admit Card will be deemed invalid and the candidature will be cancelled immediately."
    )
    c.setFont("Helvetica-Bold", 7.5)
    c.setFillColor(HexColor("#000000"))
    for dl in wrap_by_width(c, disclaimer, "Helvetica-Bold", 7.5, box_w):
        c.drawString(box_left, y_cursor, dl)
        y_cursor -= 3.5 * mm

    # ── Signatures ───────────────────────────────────────────────────────
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

    # ── Page border ──────────────────────────────────────────────────────
    c.setStrokeColor(NAVY)
    c.setLineWidth(1)
    c.rect(margin - 4 * mm, margin - 4 * mm,
           page_w - 2 * margin + 8 * mm, page_h - 2 * margin + 8 * mm, stroke=1, fill=0)


def _draw_photo_placeholder(c, x, y, w, h):
    c.setFillColor(HexColor("#e0e0e0"))
    c.rect(x, y, w, h, fill=1, stroke=1)
    c.setFillColor(HexColor("#888888"))
    c.setFont("Helvetica", 8)
    c.drawCentredString(x + w / 2, y + h / 2, "PHOTO")


def main():
    print(f"Loading data from {XLSX_PATH} (Sheet1)...")
    df = pd.read_excel(XLSX_PATH, sheet_name="Sheet1")

    # Fix known Aadhar correction (same as Round 1 script)
    df.loc[df["Name"].astype(str).str.strip() == "Bhargobi Bhattacharyya", "Aadhar Number"] = "697634605370"

    # Clean & deduplicate by Aadhar
    df["_a_clean"] = [clean_aadhar(v) for v in df[AADHAR_COL]]
    df = df.drop_duplicates(subset=["_a_clean"], keep="first").reset_index(drop=True)

    # Filter to qualified candidates only (if list is provided)
    if QUALIFIED_HALL_TICKETS:
        if "Hall ticket number" not in df.columns:
            raise ValueError("'Hall ticket number' column not found in Excel. Run admit.py first.")
        df = df[df["Hall ticket number"].apply(
            lambda x: int(x) in QUALIFIED_HALL_TICKETS if pd.notna(x) else False
        )].reset_index(drop=True)
        print(f"Filtered to {len(df)} qualified Round 1 candidates.")
    else:
        print(f"QUALIFIED_HALL_TICKETS is empty — generating for ALL {len(df)} candidates (draft/test mode).")

    os.makedirs(OUT_DIR, exist_ok=True)

    page_w, page_h = A4
    pbar = tqdm(df.iterrows(), total=len(df), desc="Generating Round 2 admit cards", unit="card")

    for idx, row in pbar:
        aadhar_clean = row.get("_a_clean", "") or f"unknown_{idx+1}"
        hall_ticket_no = int(row["Hall ticket number"]) if "Hall ticket number" in df.columns and pd.notna(row.get("Hall ticket number")) else 0
        name = row.get("Name", "")
        pbar.set_postfix_str(f"{str(name)[:15]} ({aadhar_clean})")

        photo_path = os.path.join(PHOTO_DIR, f"{safe_filename(aadhar_clean)}.jpg")
        if not os.path.exists(photo_path) or os.path.getsize(photo_path) < 1000:
            photo_path = None

        out_pdf_path = os.path.join(OUT_DIR, f"{aadhar_clean}_r2.pdf")
        cv = canvas.Canvas(out_pdf_path, pagesize=A4)
        draw_card(cv, row, hall_ticket_no, page_w, page_h, photo_path)
        cv.save()

    print(f"\nDone! {len(df)} Round 2 admit card(s) saved to '{OUT_DIR}/'.")


if __name__ == "__main__":
    main()
