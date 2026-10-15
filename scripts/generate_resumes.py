#!/usr/bin/env python3
"""Generate the public, ATS-readable software engineering resume."""

from __future__ import annotations

from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "resumes" / "Anas_Ahmed_Resume.pdf"
INK = colors.HexColor("#172127")
MUTED = colors.HexColor("#4a5960")
TEAL = colors.HexColor("#087668")
RULE = colors.HexColor("#c9d7d5")


def styles() -> dict[str, ParagraphStyle]:
    return {
        "name": ParagraphStyle("Name", fontName="Helvetica-Bold", fontSize=20, leading=23, alignment=TA_CENTER, textColor=INK, spaceAfter=2),
        "title": ParagraphStyle("Title", fontName="Helvetica", fontSize=10, leading=13, alignment=TA_CENTER, textColor=TEAL, spaceAfter=2),
        "contact": ParagraphStyle("Contact", fontName="Helvetica", fontSize=8.3, leading=11, alignment=TA_CENTER, textColor=MUTED, spaceAfter=1),
        "section": ParagraphStyle("Section", fontName="Helvetica-Bold", fontSize=10.3, leading=12, textColor=INK, spaceBefore=5, spaceAfter=2),
        "body": ParagraphStyle("Body", fontName="Helvetica", fontSize=9.2, leading=11.5, alignment=TA_LEFT, textColor=INK, spaceAfter=2),
        "role": ParagraphStyle("Role", fontName="Helvetica-Bold", fontSize=9.5, leading=11.5, textColor=INK, spaceBefore=4, spaceAfter=1),
        "bullet": ParagraphStyle("Bullet", fontName="Helvetica", fontSize=9.2, leading=11.5, leftIndent=11, firstLineIndent=-8, textColor=INK, spaceAfter=1),
        "project": ParagraphStyle("Project", fontName="Helvetica-Bold", fontSize=9.4, leading=11.5, textColor=INK, spaceBefore=3, spaceAfter=1),
    }


def heading(text: str, sheet: dict[str, ParagraphStyle]) -> list:
    return [Paragraph(text, sheet["section"]), HRFlowable(width="100%", thickness=0.5, color=RULE, spaceAfter=3)]


def paragraph(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(escape(text), style)


def bullet(text: str, sheet: dict[str, ParagraphStyle]) -> Paragraph:
    return paragraph(f"- {text}", sheet["bullet"])


def build_resume() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        leftMargin=0.62 * inch,
        rightMargin=0.62 * inch,
        topMargin=0.42 * inch,
        bottomMargin=0.42 * inch,
        title="Anas Ahmed - Software Engineer",
        author="Anas Ahmed",
        subject="Software engineering resume",
    )
    sheet = styles()
    story = [
        Paragraph("Anas Ahmed", sheet["name"]),
        Paragraph("Software Engineer | Android, Cross-Platform Products, Connected Systems", sheet["title"]),
        Paragraph(
            '774-300-7831 | <link href="mailto:anas.ahmed10@outlook.com">anas.ahmed10@outlook.com</link> | '
            '<link href="https://anasahmed10.github.io/recruiter/">anasahmed10.github.io/recruiter</link>',
            sheet["contact"],
        ),
        Paragraph(
            '<link href="https://www.linkedin.com/in/anas-ahmed-28b391166">linkedin.com/in/anas-ahmed-28b391166</link> | '
            '<link href="https://github.com/anasahmed10">github.com/anasahmed10</link>',
            sheet["contact"],
        ),
        Spacer(1, 5),
    ]
    story += heading("Professional Summary", sheet)
    story.append(paragraph(
        "Software engineer with 5+ years of production mobile experience at Staples and General Motors. "
        "Leads Kotlin and Java Android architecture for connected retail devices, builds cross-platform applications, "
        "and ships independent mobile and web products. Focused on reliable integrations, automation, and maintainable software.",
        sheet["body"],
    ))
    story += heading("Technical Skills", sheet)
    for label, value in (
        ("Languages", "Kotlin, Java, TypeScript, JavaScript, Swift, Python, SQL"),
        ("Mobile and cross-platform", "Android SDK, Jetpack Compose, Kotlin Multiplatform, Compose Multiplatform, React Native, Coroutines, Flow/StateFlow, ViewModel, MVVM, Hilt/Dagger"),
        ("Systems and delivery", "Hardware/vendor SDK integration, Bluetooth, NFC, printers, scanners, payment terminals, POS automation, REST/JSON APIs, local networking, NanoHTTPD, Ktor, SQLDelight, Splunk, Jenkins, Azure DevOps, GitHub Actions"),
        ("Testing", "JUnit, Espresso, MockK, Android workflow automation"),
    ):
        story.append(Paragraph(f"<b>{escape(label)}:</b> {escape(value)}", sheet["body"]))
    story += heading("Professional Experience", sheet)
    story.append(paragraph("Software Engineer II, Mobile | Staples | Framingham, MA | October 2022 - Present", sheet["role"]))
    for text in (
        "Own Android architecture across 3,000+ devices in 827 retail locations; modernize a self-service print application from Java/Android 7 to Kotlin/Android 13 with multilingual, Google Drive, and Dropbox workflows.",
        "Build production integrations with Xerox AltaLink printers, scanners, Ingenico Lane 3000 and Verifone payment terminals, Bluetooth/NFC peripherals, PIN pads, and store networks; support Apple Pay and Google Pay.",
        "Helped design a four-stage local payment-terminal upgrade across 800+ locations with zero production failures and no onsite vendor-technician cost for the rollout.",
        "Built the company's first Kotlin Android scanner-automation app with a tablet-hosted NanoHTTPD server and LiveData-driven test state. Automated 65 POS cases, increased POS automation by 55%, and won first place in the 2025 company hackathon; provide technical direction to a 4-8-engineer maintainer group.",
        "Built real-time printer status monitoring and Splunk dashboards for issue duration, frequency, and production diagnosis.",
    ):
        story.append(bullet(text, sheet))
    story.append(paragraph("Sr. Mobile Device Software Developer | General Motors | Remote | July 2021 - July 2022", sheet["role"]))
    for text in (
        "Developed Android, iOS, and React Native features including authentication, push-notification routing, and a Universal Deep Link Handler.",
        "Built a Jenkins-backed dashboard tracking Android and iOS app-size changes and deployed mobile build and release pipelines in Azure DevOps.",
    ):
        story.append(bullet(text, sheet))
    story.append(paragraph("Founder and CEO | Syntax Tutoring | Foxborough, MA | August 2021 - January 2024", sheet["role"]))
    story.append(bullet("Founded a programming tutoring company and created Android and web curricula, interactive applications, lectures, and hands-on labs.", sheet))
    story += heading("Selected Projects", sheet)
    story.append(Paragraph(
        '<link href="https://apps.apple.com/us/app/splitdish/id6789408948"><b>SplitDish - Apple App Store release</b></link>',
        sheet["project"],
    ))
    story.append(bullet(
        "Built a Kotlin/Compose Multiplatform receipt-splitting app for Android and iOS with ML Kit and Apple Vision OCR, Groq extraction, editable review, deterministic split logic, and SQLDelight history. Android remains in Google Play external testing.",
        sheet,
    ))
    story.append(Paragraph(
        '<link href="https://highlightcorner.com/"><b>Highlight Corner - Live installable web app</b></link>',
        sheet["project"],
    ))
    story.append(bullet(
        "Shipped a responsive NFL site with ESPN and Sleeper data, live score refresh, outbound highlights, fantasy leaders, original recaps, game centers, and a service-worker offline shell.",
        sheet,
    ))
    story.append(paragraph("YardScape - Kotlin Multiplatform marketplace MVP", sheet["project"]))
    story.append(bullet(
        "Built shared Compose UI for Android, iOS, and web targets with a Ktor API separating public yard-sale previews from RSVP-gated location access; current MVP uses seeded app data.",
        sheet,
    ))
    story.append(Paragraph(
        '<link href="https://chatgpt.com/g/g-6a4be8c0f2ac8191a2e34a57b52f46ee-smartshopper"><b>SmartShopper - Custom GPT</b></link>',
        sheet["project"],
    ))
    story.append(bullet(
        "Designed a shopping assistant for targeted clarification, multi-source product research, purchase-ready recommendations, and explained value tradeoffs.",
        sheet,
    ))
    story += heading("Education", sheet)
    story.append(paragraph(
        "University of Massachusetts Lowell | Bachelor of Science in Computer Science | Dean's List Recipient",
        sheet["body"],
    ))
    story.append(Spacer(1, 2))
    document.build(story)
    print(f"Generated {OUTPUT}")


if __name__ == "__main__":
    build_resume()
