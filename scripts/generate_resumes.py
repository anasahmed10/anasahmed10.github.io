#!/usr/bin/env python3
"""Generate local-only one-page resume drafts for recruiter role lenses."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "outputs" / "resume-drafts"
INK = colors.HexColor("#071118")
MUTED = colors.HexColor("#536268")
TEAL = colors.HexColor("#007E70")
RULE = colors.HexColor("#AFC4C3")


@dataclass(frozen=True)
class ResumeVariant:
    filename: str
    title: str
    summary: str
    skills: tuple[tuple[str, str], ...]
    staples_bullets: tuple[str, ...]


COMMON_SKILLS = (
    ("Languages", "Kotlin, Java, JavaScript, Swift, Python, C#, C++, C, SQL"),
    ("Android", "Android SDK, Jetpack Compose, Coroutines, Flow/StateFlow, ViewModel, Room, WorkManager, Navigation, Hilt/Dagger, MVVM"),
    ("Testing/Delivery", "JUnit, Espresso, MockK, REST/JSON, Gradle, Git, Jenkins, Azure DevOps, Splunk"),
)

CORE_STAPLES = (
    "Modernized a high-traffic self-service print application from Java/Android 7 to Kotlin/Android 13, enabling multilingual, Google Drive, and Dropbox workflows.",
    "Built Android workflows across Xerox AltaLink C8145/C8245 printers, scanners, Ingenico Lane 3000 and Verifone payment terminals, PIN pads, and store networks, including Apple Pay and Google Pay.",
    "Helped design a four-stage local payment-terminal update that reached 800+ locations with zero production failures and eliminated onsite vendor-technician cost for the rollout.",
    "Built real-time printer status-light monitoring and Splunk dashboards for production diagnosis.",
)

VARIANTS = (
    ResumeVariant(
        "Anas_Ahmed_Enterprise_Mobile_DRAFT.pdf",
        "Enterprise Mobile Engineer",
        "Enterprise mobile engineer with 5+ years building Android and cross-platform software around real devices and production systems. Strong in modernization, integration, automation, observability, and rollout reliability.",
        COMMON_SKILLS + (("Systems", "Hardware SDK/API Integration, Local Networking, NFC, Printers, Scanners, Payment Terminals, POS"),),
        CORE_STAPLES,
    ),
    ResumeVariant(
        "Anas_Ahmed_Android_Platform_DRAFT.pdf",
        "Senior Android / Android Platform Engineer",
        "Android engineer with 5+ years spanning Kotlin/Java modernization, maintainable architecture, cross-platform delivery, testing, CI/CD, observability, and production applications.",
        COMMON_SKILLS + (("Platform", "Kotlin Multiplatform, Compose Multiplatform, React Native, Firebase, SQLDelight, Ktor"),),
        (CORE_STAPLES[0], CORE_STAPLES[1], CORE_STAPLES[2], CORE_STAPLES[3]),
    ),
    ResumeVariant(
        "Anas_Ahmed_Payments_POS_DRAFT.pdf",
        "Android Payments / POS Engineer",
        "Enterprise Android engineer with 5+ years and production experience across contactless payments, PIN pads, POS scanner automation, printers, and distributed store systems.",
        COMMON_SKILLS + (("Payments/Devices", "Apple Pay, Google Pay, NFC, Ingenico Lane 3000, Verifone, PIN Pads, POS Scanners"),),
        (CORE_STAPLES[1], CORE_STAPLES[2], CORE_STAPLES[0], CORE_STAPLES[3]),
    ),
    ResumeVariant(
        "Anas_Ahmed_Mobile_Hardware_Systems_DRAFT.pdf",
        "Mobile + Hardware Systems Engineer",
        "Mobile engineer with 5+ years building Android software that interfaces with printers, scanners, payment terminals, tablets, local services, and store networks.",
        COMMON_SKILLS + (("Hardware Systems", "Hardware SDK/API Integration, Local Networking, NanoHttpd, NFC, Device Monitoring, Splunk"),),
        (CORE_STAPLES[1], CORE_STAPLES[0], CORE_STAPLES[3], CORE_STAPLES[2]),
    ),
)

GM_BULLETS = (
    "Developed Android, iOS, and React Native features for General Motors mobile applications, including authentication, push-notification routing, and Android deep linking.",
    "Built a Jenkins-data dashboard for Android and iOS app-size changes and deployed mobile build and release pipelines in Azure DevOps.",
)

PROJECTS = (
    ("Barcode Scanner", "Kotlin, Compose, MVVM, Coroutines, NanoHttpd", "Built the company's first Kotlin Android application with a tablet-hosted server and physical scanner; automated 65 POS tests, increased POS automation by 55%, won first place in the 2025 company hackathon, and provide technical direction to its 4-8-engineer maintainer group."),
    ("TabTally", "Kotlin Multiplatform, Compose Multiplatform, ML Kit, Apple Vision, Groq, SQLDelight", "Built a shared Android/iOS receipt-splitting product; submitted for Apple App Store review and in Google Play external testing."),
    ("SmartShopper", "Custom GPT, Prompt Engineering, Web Research", "Designed a shopping assistant for targeted clarification, product research, comparisons, purchase-ready links, and value-tradeoff analysis."),
)


def styles() -> dict[str, ParagraphStyle]:
    return {
        "name": ParagraphStyle("Name", fontName="Helvetica", fontSize=20, leading=21, alignment=TA_CENTER, textColor=INK, spaceAfter=1),
        "contact": ParagraphStyle("Contact", fontName="Helvetica", fontSize=8.2, leading=9.5, alignment=TA_CENTER, textColor=MUTED, spaceAfter=2),
        "title": ParagraphStyle("Title", fontName="Helvetica", fontSize=10.5, leading=12, alignment=TA_CENTER, textColor=TEAL, spaceAfter=4),
        "section": ParagraphStyle("Section", fontName="Helvetica-Bold", fontSize=9.2, leading=10, alignment=TA_LEFT, textColor=INK, spaceBefore=2, spaceAfter=1),
        "body": ParagraphStyle("Body", fontName="Helvetica", fontSize=9.5, leading=11.2, alignment=TA_LEFT, textColor=INK, spaceAfter=1),
        "role": ParagraphStyle("Role", fontName="Helvetica-Bold", fontSize=9.1, leading=10.2, alignment=TA_LEFT, textColor=INK),
        "meta": ParagraphStyle("Meta", fontName="Helvetica", fontSize=8.2, leading=9.3, alignment=TA_RIGHT, textColor=MUTED),
        "bullet": ParagraphStyle("Bullet", fontName="Helvetica", fontSize=9.5, leading=11, leftIndent=8, firstLineIndent=-6, textColor=INK, spaceAfter=0.7),
        "project": ParagraphStyle("Project", fontName="Helvetica", fontSize=9.5, leading=11, textColor=INK, spaceAfter=0.4),
    }


def section_heading(label: str, s: dict[str, ParagraphStyle]) -> list:
    return [Paragraph(label, s["section"]), HRFlowable(width="100%", thickness=0.45, color=RULE, spaceAfter=2)]


def role_block(company: str, role: str, place: str, dates: str, bullets: tuple[str, ...], s: dict[str, ParagraphStyle]) -> KeepTogether:
    heading = Table(
        [[Paragraph(f"{company} · {role}", s["role"]), Paragraph(f"{place} · {dates}", s["meta"])]],
        colWidths=[4.7 * inch, 2.75 * inch],
    )
    heading.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    items = [heading]
    items.extend(Paragraph(f"• {bullet}", s["bullet"]) for bullet in bullets)
    items.append(Spacer(1, 1))
    return KeepTogether(items)


def build_resume(variant: ResumeVariant) -> None:
    destination = OUTPUT / variant.filename
    document = SimpleDocTemplate(str(destination), pagesize=letter, leftMargin=0.48 * inch, rightMargin=0.48 * inch, topMargin=0.32 * inch, bottomMargin=0.28 * inch, title=f"Anas Ahmed - {variant.title} - Draft", author="Anas Ahmed", subject="Local resume draft")
    s = styles()
    story = [
        Paragraph("Anas Ahmed", s["name"]),
        Paragraph('774-300-7831 | <link href="mailto:anas.ahmed10@outlook.com" color="#007E70">anas.ahmed10@outlook.com</link> | <link href="https://anasahmed10.github.io/" color="#007E70">anasahmed10.github.io</link> | <link href="https://www.linkedin.com/in/anas-ahmed-28b391166" color="#007E70">LinkedIn</link> | <link href="https://github.com/anasahmed10" color="#007E70">GitHub</link>', s["contact"]),
        Paragraph(variant.title, s["title"]),
    ]
    story.extend(section_heading("TECHNICAL SKILLS", s))
    for label, value in variant.skills:
        story.append(Paragraph(f"<b>{label}:</b> {value}", s["body"]))
    story.extend(section_heading("SUMMARY", s))
    story.append(Paragraph(variant.summary, s["body"]))
    story.extend(section_heading("EXPERIENCE", s))
    story.append(role_block("Staples", "Software Engineer II, Mobile", "Framingham, MA", "Oct 2022 - Present", variant.staples_bullets, s))
    story.append(role_block("General Motors", "Sr. Mobile Device Software Developer", "Remote", "Jul 2021 - Jul 2022", GM_BULLETS, s))
    story.append(role_block("Syntax Tutoring", "Founder and CEO", "Foxborough, MA", "Aug 2021 - Jan 2024", ("Founded a programming tutoring company and designed practical Android and web curricula, applications, lectures, and hands-on labs.",), s))
    story.extend(section_heading("PROJECTS", s))
    for name, stack, description in PROJECTS:
        story.append(Paragraph(f"<b>{name}</b> | <font color='#536268'>{stack}</font>", s["project"]))
        story.append(Paragraph(f"• {description}", s["bullet"]))
    story.extend(section_heading("EDUCATION", s))
    story.append(Paragraph("<b>University of Massachusetts, Lowell</b> · Bachelor of Science in Computer Science · Dean's List Recipient", s["body"]))
    document.build(story)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for stale in OUTPUT.glob("*.pdf"):
        stale.unlink()
    for variant in VARIANTS:
        build_resume(variant)
        print(f"generated {variant.filename}")


if __name__ == "__main__":
    main()
