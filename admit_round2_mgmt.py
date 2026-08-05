"""
SCNTSE Round 2 Admit Card Generator — IEM Management House
Hardcoded candidate list (Hall Ticket No + Name only).
No photo, no personal info. All candidates at IEM Management House.
Output: admit_round2/ folder, named <hall_ticket_no>_r2.pdf
DO NOT RUN without verifying the candidate list below.
"""

import os
import re
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from tqdm import tqdm

# ---------- PATH CONFIG ----------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
IEM_LOGO   = os.path.join(SCRIPT_DIR, "attached_assets", "logo.png")
UEM_LOGO   = os.path.join(SCRIPT_DIR, "attached_assets", "image_1752080086077.png")
OUT_DIR    = os.path.join(SCRIPT_DIR, "admit_round2")

# ---------- COLOURS ----------
NAVY = HexColor("#111111")
RED  = HexColor("#D93025")
GREY = HexColor("#555555")

# ---------- EXAM DETAILS ----------
R2_DATE           = "9th August 2026 (Sunday)"
R2_TIME           = "10:30 AM – 1:30 PM  (3 hours)"
R2_REPORTING      = "Reporting Time: 10:00 AM  |  Entry closes strictly at 10:15 AM"
R2_MARKS          = "100 Marks"
R2_PATTERN        = (
    "The Question Booklet consists of 7 questions each from Physics, Chemistry, "
    "Mathematics, and English. Candidates may attempt any 5 questions from each "
    "subject. Each question carries 5 marks."
)

VENUE_NAME  = "IEM Management House"
VENUE_ADDR  = ("IEM Management Building, D-1, Street No. 13, EP Block, "
               "Sector V, Bidhannagar, Kolkata, West Bengal 700091")
CENTER_CODE = "02"

# ---------- CANDIDATE LIST ----------
CANDIDATES = [
    (2602001, "Ambali Kar"),
    (2602002, "Aishiki Guha"),
    (2602003, "Kasturi Basu"),
    (2602006, "SHATABHISHA PAUL"),
    (2602007, "Anushka Agarwal"),
    (2602009, "Ankita Chatterjee"),
    (2602010, "Shivam Kumar Mahato"),
    (2602011, "Anshu Mandal"),
    (2602013, "RANIA ISLAM"),
    (2602015, "AHELI MITRA"),
    (2602018, "Siddhant Shaw"),
    (2602019, "Rithika Das"),
    (2602020, "Bhargobi Bhattacharyya"),
    (2602022, "SOUMYARAJ SAHA"),
    (2602024, "SNEHA SAHA"),
    (2602025, "Subhajit Saha"),
    (2602026, "Srijit Ghosal"),
    (2602027, "Mritwika Maity"),
    (2602029, "DEBLINA GORAI"),
    (2602031, "Poushali Chatterjee"),
    (2602034, "SUMONA BANERJEE"),
    (2602038, "Indronil Biswas"),
    (2602040, "Suvadip Mondal"),
    (2602041, "Alok Raj"),
    (2602042, "Sayantani Bhattacharjee"),
    (2602044, "Soumodeep Gorai"),
    (2602046, "RAJARSHI GANGULI"),
    (2602048, "Shibam Neogi"),
    (2602053, "SEIKH ASIF"),
    (2602054, "Aarshi Das"),
    (2602059, "Ritwika Saha"),
    (2602060, "RAJOSMIT BHATTACHARJI"),
    (2602062, "Shamayita Ghatak"),
    (2602067, "Ayon Kar"),
    (2602068, "ARPAN MONDAL"),
    (2602069, "Nilabha Saha"),
    (2602072, "Indrajit Mohanta"),
    (2602073, "Anirban Mondal"),
    (2602079, "Sayan Khan"),
    (2602082, "Anangsha Mitra"),
    (2602084, "Soumi Kundu"),
    (2602086, "Rudranil Khanra"),
    (2602088, "Sarit Mandal"),
    (2602091, "ANUSKA MANNA"),
    (2602092, "Sreejeeta Kundu"),
    (2602095, "ANUSHKA SHARMA"),
    (2602096, "Ipsita Maity"),
    (2602104, "Spandan Patra"),
    (2602107, "Saptarshi Ghosh"),
    (2602114, "Souparno Chatterjee"),
    (2602115, "Jhilam Sahu"),
    (2602124, "Partha Sarathi Pramanik"),
    (2602126, "Tufan Ghorai"),
    (2602142, "Gurjyot Singh"),
    (2602144, "Swapnil Ghosh"),
    (2602145, "Isha Shaw"),
    (2602149, "MEKHLA BASAK"),
    (2602150, "DIBYAJIT DAS"),
    (2602152, "Soumya Kundu"),
    (2602156, "Arkaprava Hazra"),
    (2602159, "MRINMOY MAZUMDAR"),
    (2602160, "Kabya Chakraborty"),
    (2602161, "Krishnangshu Mukhopadhyay"),
    (2602163, "SK MOINUDDIN"),
    (2602165, "Shreemoyee Majhi"),
    (2602166, "Mayank Kamath"),
    (2602167, "Shreya Paul"),
    (2602170, "Debarup Majhi"),
    (2602173, "Piuka Bhowmik"),
    (2602175, "Tanisha Upadhaya"),
    (2602179, "Arna Dash"),
    (2602180, "Partha Pratim Goswami"),
    (2602183, "SIDDHARTH DEB"),
    (2602185, "ARYA DAS"),
    (2602188, "Rohit Sarkar"),
    (2602189, "RAJATABHA KUITY"),
    (2602190, "ISHAYU BANERJEE"),
    (2602191, "Debdatta Nandi"),
    (2602192, "Sandipan Das"),
    (2602193, "SWARNOJ SAHA TALUKDAR"),
    (2602196, "Sreeparna Saha"),
    (2602206, "Sayantani Dutta"),
    (2602210, "Somnath Pal"),
    (2602211, "Chayan Bera"),
    (2602213, "Krishanu Mistri"),
    (2602218, "Srija Bandyopadhyay"),
    (2602223, "Adrita Si"),
    (2602224, "RIDDHIMA DAN"),
    (2602227, "SUBHAJEET DUTTA"),
    (2602228, "Utsav Mukherjee"),
    (2602229, "Sanondit Phani"),
    (2602238, "Debparno Mondal"),
    (2602239, "Souryadeep Dawn"),
    (2602242, "Sourav Roy"),
    (2602243, "Anomitra Kundu"),
    (2602250, "Amartya Kumar Ray"),
    (2602253, "ROCHISHNU MAJUMDER"),
    (2602851, "Protyush Ganguly"),
    (2602852, "Sarbajeet Maji"),
    (2602855, "Soham Biswas"),
    (2602861, "Md. Adil Mallick"),
    (2602864, "Anish Dhar"),
    (2602865, "Srija Pal"),
    (2602868, "Archisman Khanra"),
    (2602869, "Sayan Kundu"),
    (2602870, "Anurag Bera"),
    (2602871, "Shirsa Santra"),
    (2602951, "Kritikaa Paul"),
    (2602953, "Shirin Chatterjee"),
    (2602954, "Rumela Maity"),
    (2602956, "Debasmita Das"),
    (2602962, "Aryan Singh"),
    (2604503, "Shibam Sahoo"),
    (2604509, "Debabrata Majhi"),
    (2604519, "Aryapriya Ghosh"),
    (2604531, "Beer Majumder"),
    (2604533, "Soubhik Ghosh"),
    (2604535, "Sampurna Nag"),
    (2604536, "Albertini Ghosh"),
    (2604541, "Soham Bhowmick"),
    (2604545, "DEBABRATI MITRA"),
    (2604549, "Angshu Roy Chowdhury"),
    (2604551, "Pratik Ghosh"),
    (2604558, "Priyani Das"),
    (2604559, "Debojyoti Banerjee"),
    (2604566, "Surajit Pal"),
    (2604567, "ANAHITA ROY"),
    (2604569, "Soummojit Roy"),
    (2604570, "Sayantika Chanda"),
    (2604574, "Sankha Subhra Pal"),
    (2604580, "Aishiki Saha"),
    (2604650, "Adik Panigrahi"),
]


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


def draw_card(c, hall_ticket_no, name, page_w, page_h):
    margin = 12 * mm
    top    = page_h - margin
    box_left = margin
    box_w    = page_w - 2 * margin

    # ── Header ───────────────────────────────────────────────────────────
    header_h = 20 * mm
    if os.path.exists(IEM_LOGO):
        c.drawImage(IEM_LOGO, margin, top - header_h + 2 * mm,
                    width=18 * mm, height=18 * mm,
                    preserveAspectRatio=True, mask='auto')
    if os.path.exists(UEM_LOGO):
        c.drawImage(UEM_LOGO, page_w - margin - 22 * mm, top - header_h + 2 * mm,
                    width=22 * mm, height=18 * mm,
                    preserveAspectRatio=True, mask='auto')

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(page_w / 2, top - 8 * mm, "SCNTSE 2026 Admit Card — Round 2")
    c.setFont("Helvetica", 9.5)
    c.setFillColor(GREY)
    c.drawCentredString(page_w / 2, top - 14 * mm,
                        "Prof. Dr. Satyajit Chakrabarti National Talent Search Examination")

    # ── Candidate Info (Hall Ticket + Name only) ─────────────────────────
    box_top = top - header_h - 4 * mm
    y = box_top - 10 * mm

    c.setFont("Helvetica-Bold", 15)
    c.setFillColor(NAVY)
    c.drawString(box_left + 4 * mm, y, f"Hall Ticket No:  {hall_ticket_no}")
    y -= 9 * mm

    c.setFont("Helvetica-Bold", 15)
    c.setFillColor(NAVY)
    c.drawString(box_left + 4 * mm, y, f"Name:  {name.upper()}")
    y -= 12 * mm

    # ── Round 2 Details ──────────────────────────────────────────────────
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(NAVY)
    c.drawString(box_left + 4 * mm, y, "Round 2 : Descriptive Written Examination")
    y -= 7 * mm

    c.setFont("Helvetica", 10)
    c.setFillColor(GREY)
    for label, value in [
        ("Date",     R2_DATE),
        ("Time",     R2_TIME),
        ("",         R2_REPORTING),
        ("Marks",    R2_MARKS),
    ]:
        text = f"{label+':':8}  {value}" if label else f"           {value}"
        c.drawString(box_left + 4 * mm, y, text)
        y -= 5.5 * mm

    y -= 2 * mm
    pattern_max_w = box_w - 8 * mm
    c.setFont("Helvetica", 9.5)
    for pl in wrap_by_width(c, f"Pattern:  {R2_PATTERN}", "Helvetica", 9.5, pattern_max_w):
        c.drawString(box_left + 4 * mm, y, pl)
        y -= 5 * mm

    y -= 3 * mm

    # ── Venue ────────────────────────────────────────────────────────────
    c.setFont("Helvetica-Bold", 10.5)
    c.setFillColor(NAVY)
    c.drawString(box_left + 4 * mm, y, f"CENTER CODE : {CENTER_CODE}")
    y -= 5.5 * mm

    venue_max_w = box_w - 8 * mm
    c.setFont("Helvetica-Bold", 10)
    for vl in wrap_by_width(c, f"Venue:  {VENUE_NAME}", "Helvetica-Bold", 10, venue_max_w):
        c.drawString(box_left + 4 * mm, y, vl)
        y -= 5 * mm

    c.setFont("Helvetica", 8.5)
    c.setFillColor(GREY)
    for al in wrap_by_width(c, VENUE_ADDR, "Helvetica", 8.5, venue_max_w):
        c.drawString(box_left + 4 * mm, y, al)
        y -= 4.5 * mm

    box_bottom = y - 4 * mm
    box_h      = box_top - box_bottom
    c.setStrokeColor(NAVY)
    c.setLineWidth(1.2)
    c.rect(box_left, box_bottom, box_w, box_h, stroke=1, fill=0)

    # ── Instructions ─────────────────────────────────────────────────────
    y = box_bottom - 8 * mm
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(NAVY)
    c.drawString(box_left, y, "Admit Card Instructions:")
    y -= 5 * mm

    instructions = [
        "This admit card is valid only upon fulfillment of all Round 1 qualification criteria as declared by the examination committee.",
        "Candidates must report to the examination hall by 10:00 AM. Entry will close strictly at 10:15 AM. The examination begins at 10:30 AM.",
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
        c.drawString(box_left + 2 * mm, y, f"\u2022 {lines[0]}")
        y -= 4 * mm
        for extra in lines[1:]:
            c.drawString(box_left + 5 * mm, y, extra)
            y -= 4 * mm
        y -= 0.5 * mm

    # ── Disclaimer ───────────────────────────────────────────────────────
    y -= 1 * mm
    disclaimer = (
        "The Admit Card has been issued based on the information provided by the candidate, which is presumed "
        "to fulfill all eligibility criteria as per the examination guidelines. However, if at any stage of the "
        "examination process it is found that the candidate has furnished false, incorrect, or misleading information, "
        "the Admit Card will be deemed invalid and the candidature will be cancelled immediately."
    )
    c.setFont("Helvetica-Bold", 7.5)
    c.setFillColor(HexColor("#000000"))
    for dl in wrap_by_width(c, disclaimer, "Helvetica-Bold", 7.5, box_w):
        c.drawString(box_left, y, dl)
        y -= 3.5 * mm

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
           page_w - 2 * margin + 8 * mm,
           page_h - 2 * margin + 8 * mm,
           stroke=1, fill=0)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    page_w, page_h = A4

    print(f"Generating {len(CANDIDATES)} Round 2 admit cards → '{OUT_DIR}/'")
    for hall_ticket_no, name in tqdm(CANDIDATES, desc="Generating", unit="card"):
        cv = canvas.Canvas(
            os.path.join(OUT_DIR, f"{hall_ticket_no}_r2.pdf"),
            pagesize=A4
        )
        draw_card(cv, hall_ticket_no, name, page_w, page_h)
        cv.save()

    print(f"\nDone! {len(CANDIDATES)} admit cards saved to '{OUT_DIR}/'.")


if __name__ == "__main__":
    main()
