#!/usr/bin/env python3
"""Generate the public one-page role-specific resumes."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "resumes"
INK = colors.HexColor("#071118")
MUTED = colors.HexColor("#536268")
TEAL = colors.HexColor("#008E7B")
RULE = colors.HexColor("#AFC4C3")


@dataclass(frozen=True)
class ResumeVariant:
    filename: str
    title: str
    summary: str
    skills: tuple[tuple[str, str], ...]
    staples_bullets: tuple[str, ...]
    project_ids: tuple[str, ...]


COMMON_GM = (
    "Built a web dashboard that used Jenkins pipeline data to track Android and iOS app-size changes, and deployed mobile build and release pipelines in Azure DevOps.",
    "Created a Universal Deep Link Handler in React Native to consolidate routing, improve user flow, and make future mobile development easier.",
)

COMMON_SYNTAX = (
    "Founded a programming tutoring company and designed practical Android and web curricula, interactive applications, lectures, and hands-on labs.",
)

PROJECTS = {
    "scanner": (
        "Barcode Scanner",
        "Kotlin, Jetpack Compose, MVVM, Coroutines, NanoHttpd, LiveData",
        "Built the company's first Kotlin Android application with a tablet-hosted local server and physical scanner; automated 65 POS tests, increased POS automation by 55%, and won first place in the 2025 company hackathon.",
    ),
    "tabtally": (
        "TabTally",
        "Kotlin Multiplatform, Compose Multiplatform, ML Kit, Vision, Groq, SQLDelight",
        "Designed and built a shared Android and iOS receipt-splitting product with on-device OCR, strict-schema AI extraction, editable review, and deterministic split calculation.",
    ),
    "yardscape": (
        "Yardscape",
        "Kotlin, Java, MVVM, Coroutines, Volley, Firebase",
        "Engineered an Android marketplace application with authentication, storage, and API-backed workflows for browsing and posting yard-sale listings.",
    ),
}

CORE_STAPLES = (
    "Owned Android architecture and primary implementation for modernizing a self-service print application from Java on Android 7 to Kotlin on Android 13, enabling multilingual, Google Drive, and Dropbox workflows.",
    "Delivered Android workflows across Xerox printers, scanners, payment terminals, PIN pads, and store networks supporting enterprise deployments across 500-1,000 locations.",
    "Implemented Apple Pay and Google Pay support and helped design a four-stage local update for bank-mandated payment-terminal software. The process brought vendor-technician cost for the rollout to $0 and reached 800+ locations with zero production failures.",
    "Built real-time printer status-light monitoring and Splunk dashboards for issue duration, frequency, and production diagnosis.",
)

VARIANTS = (
    ResumeVariant(
        "Anas_Ahmed_Enterprise_Android_Hardware.pdf",
        "Enterprise Android Engineer | Hardware-Integrated Mobile Systems",
        "Android engineer building enterprise mobile systems around printers, scanners, payment terminals, tablets, and store networks. Strong in Kotlin/Java modernization, hardware SDK/API integration, observability, troubleshooting, and production rollout reliability.",
        (
            ("Languages", "Kotlin, Java, JavaScript, Swift, Python, C#, C++, C, SQL"),
            ("Android/Mobile", "Android SDK, Jetpack Compose, Coroutines, MVVM, LiveData, RxJava, Retrofit, Gradle, React Native"),
            ("Systems/Tools", "Hardware SDK/API Integration, NanoHttpd, Local Networking, Jenkins, Azure DevOps, Firebase, Splunk, Git"),
        ),
        CORE_STAPLES,
        ("scanner", "tabtally"),
    ),
    ResumeVariant(
        "Anas_Ahmed_Healthcare_Medical_Device.pdf",
        "Android Medical Device / Enterprise Device Software Engineer",
        "Android engineer suited to specialized-device roles that require dependable communication, production stability, observability, and maintainable application architecture. Experience is strongest at the application and hardware SDK/API integration layer.",
        (
            ("Languages", "Kotlin, Java, JavaScript, Swift, Python, C#, C++, C, SQL"),
            ("Android/Mobile", "Android SDK, Jetpack Compose, Coroutines, MVVM, LiveData, RxJava, Retrofit, Gradle, React Native"),
            ("Reliability/Systems", "Hardware SDK/API Integration, Device Monitoring, Local Networking, Splunk, Jenkins, Azure DevOps, Firebase, Git"),
        ),
        (
            CORE_STAPLES[0],
            "Integrated Android workflows with Xerox printers, payment terminals, PIN pads, scanners, and store-network infrastructure across enterprise retail deployments.",
            CORE_STAPLES[2],
            "Built real-time hardware status monitoring with Splunk dashboards that exposed issue duration and frequency for faster device diagnosis.",
        ),
        ("scanner", "tabtally"),
    ),
    ResumeVariant(
        "Anas_Ahmed_Lead_Mobile_Engineer.pdf",
        "Lead Mobile Engineer | Technical Ownership & Enterprise Android",
        "Mobile engineer experienced in independent delivery, cross-functional work, and end-to-end Android ownership. Strongest in modernization, hardware-integrated workflows, production reliability, automation, observability, and maintainable handoff.",
        (
            ("Languages", "Kotlin, Java, JavaScript, Swift, Python, C#, C++, C, SQL"),
            ("Mobile Architecture", "Android SDK, Jetpack Compose, Coroutines, MVVM, LiveData, RxJava, Retrofit, Gradle, React Native"),
            ("Ownership/Systems", "Hardware SDK/API Integration, Jenkins, Azure DevOps, Firebase, Splunk, NanoHttpd, Local Networking, Git"),
        ),
        (
            CORE_STAPLES[0],
            CORE_STAPLES[2],
            CORE_STAPLES[3],
            "Owned implementation, debugging, deployment support, and maintenance for enterprise Android systems used in physical retail environments.",
        ),
        ("scanner", "tabtally"),
    ),
    ResumeVariant(
        "Anas_Ahmed_Mobile_AI_Integration.pdf",
        "Mobile Engineer | Android, AI Integration & Product Systems",
        "Mobile engineer with Android/Kotlin production experience and practical OCR and AI integration across cross-platform products. Strong fit for work combining mobile architecture, reviewed extraction, local persistence, and enterprise Android ownership.",
        (
            ("Languages", "Kotlin, Java, JavaScript, Swift, Python, C#, C++, C, SQL"),
            ("Mobile", "Android SDK, Jetpack Compose, Kotlin Multiplatform, Compose Multiplatform, Coroutines, MVVM, React Native, Gradle, Firebase"),
            ("AI/Platform", "Groq, ML Kit, Apple Vision, OCR, Ktor, SQLDelight, Jenkins, Azure DevOps, Splunk, NanoHttpd"),
        ),
        (
            CORE_STAPLES[0],
            "Delivered production Android work across contactless payments, payment-terminal updates, printer workflows, and Splunk-based device monitoring.",
            CORE_STAPLES[2],
            CORE_STAPLES[3],
        ),
        ("tabtally", "scanner", "yardscape"),
    ),
    ResumeVariant(
        "Anas_Ahmed_Payments_POS_Device_Integration.pdf",
        "Android Payments / POS Device Integration Engineer",
        "Android engineer with production experience across contactless payments, PIN pads, POS scanner automation, printers, and store devices. Strong in Kotlin/Java ownership, hardware-adjacent troubleshooting, and careful rollout execution.",
        (
            ("Languages", "Kotlin, Java, JavaScript, Swift, Python, C#, C++, C, SQL"),
            ("Android/Mobile", "Android SDK, Jetpack Compose, Coroutines, MVVM, LiveData, RxJava, Retrofit, Gradle, React Native"),
            ("Payments/Devices", "Apple Pay, Google Pay, NFC, PIN Pads, Ingenico Lane 3000, Verifone, POS Scanners, Splunk, Jenkins"),
        ),
        (
            "Implemented Apple Pay and Google Pay support within an enterprise Android application and integrated external payment-terminal workflows into production stores.",
            CORE_STAPLES[2],
            "Modernized a self-service Android application from Java on Android 7 to Kotlin on Android 13 while preserving print, payment, scanner, and store-network workflows.",
            CORE_STAPLES[3],
        ),
        ("scanner", "tabtally"),
    ),
    ResumeVariant(
        "Anas_Ahmed_Senior_Android_Platform.pdf",
        "Senior Android Engineer | Kotlin, Architecture & Mobile Platform",
        "Senior Android engineer experienced in Java-to-Kotlin modernization, maintainable mobile architecture, and enterprise production applications. Brings Android ownership, delivery tooling, observability, and practical device integration.",
        (
            ("Languages", "Kotlin, Java, JavaScript, Swift, Python, C#, C++, C, SQL"),
            ("Android", "Android SDK, Jetpack Compose, Kotlin Multiplatform, Coroutines, MVVM, LiveData, RxJava, Retrofit, Gradle, Firebase"),
            ("Platform/Tools", "Jenkins, Azure DevOps, Splunk, React Native, NanoHttpd, API Integration, SQLDelight, Git"),
        ),
        (
            CORE_STAPLES[0],
            "Enabled multilingual support, Google Drive and Dropbox workflows, contactless payments, and hardware-integrated Android flows across distributed retail deployments.",
            CORE_STAPLES[2],
            CORE_STAPLES[3],
        ),
        ("scanner", "tabtally", "yardscape"),
    ),
)


def styles() -> dict[str, ParagraphStyle]:
    return {
        "name": ParagraphStyle(
            "Name", fontName="Helvetica", fontSize=20, leading=21,
            alignment=TA_CENTER, textColor=INK, spaceAfter=1,
        ),
        "contact": ParagraphStyle(
            "Contact", fontName="Helvetica", fontSize=6.5, leading=8,
            alignment=TA_CENTER, textColor=MUTED, spaceAfter=2,
        ),
        "title": ParagraphStyle(
            "Title", fontName="Helvetica", fontSize=9.4, leading=11,
            alignment=TA_CENTER, textColor=TEAL, spaceAfter=5,
        ),
        "section": ParagraphStyle(
            "Section", fontName="Helvetica-Bold", fontSize=7.8, leading=9,
            alignment=TA_LEFT, textColor=INK, spaceBefore=2, spaceAfter=1,
        ),
        "body": ParagraphStyle(
            "Body", fontName="Helvetica", fontSize=6.75, leading=8.1,
            alignment=TA_LEFT, textColor=INK, spaceAfter=1,
        ),
        "role": ParagraphStyle(
            "Role", fontName="Helvetica-Bold", fontSize=7.25, leading=8.4,
            alignment=TA_LEFT, textColor=INK,
        ),
        "location": ParagraphStyle(
            "Location", fontName="Helvetica", fontSize=6.1, leading=7.2,
            alignment=TA_LEFT, textColor=MUTED,
        ),
        "date": ParagraphStyle(
            "Date", fontName="Helvetica", fontSize=6.1, leading=7.2,
            alignment=TA_RIGHT, textColor=MUTED,
        ),
        "bullet": ParagraphStyle(
            "Bullet", fontName="Helvetica", fontSize=6.45, leading=7.6,
            leftIndent=7, firstLineIndent=-5, textColor=INK, spaceAfter=0.5,
        ),
        "project": ParagraphStyle(
            "Project", fontName="Helvetica", fontSize=6.65, leading=7.9,
            textColor=INK, spaceAfter=0.5,
        ),
        "education": ParagraphStyle(
            "Education", fontName="Helvetica", fontSize=7.1, leading=8.5,
            textColor=INK,
        ),
    }


def section_heading(label: str, s: dict[str, ParagraphStyle]):
    return [
        Paragraph(label, s["section"]),
        HRFlowable(width="100%", thickness=0.45, color=RULE, spaceBefore=0, spaceAfter=2),
    ]


def role_block(
    company: str,
    role: str,
    location: str,
    dates: str,
    bullets: tuple[str, ...],
    s: dict[str, ParagraphStyle],
):
    heading = Table(
        [[Paragraph(f"{company} · {role}", s["role"]), Paragraph(dates, s["date"])]],
        colWidths=[6.55 * inch, 1.05 * inch],
        hAlign="LEFT",
    )
    heading.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    items = [heading, Paragraph(location, s["location"])]
    items.extend(Paragraph(f"- {bullet}", s["bullet"]) for bullet in bullets)
    items.append(Spacer(1, 1))
    return KeepTogether(items)


def build_resume(variant: ResumeVariant) -> None:
    destination = OUTPUT / variant.filename
    document = SimpleDocTemplate(
        str(destination),
        pagesize=letter,
        leftMargin=0.45 * inch,
        rightMargin=0.45 * inch,
        topMargin=0.34 * inch,
        bottomMargin=0.3 * inch,
        title=f"Anas Ahmed - {variant.title}",
        author="Anas Ahmed",
        subject="Professional resume",
    )
    s = styles()
    story = [
        Paragraph("Anas Ahmed", s["name"]),
        Paragraph(
            '774-300-7831&nbsp;&nbsp;|&nbsp;&nbsp;'
            '<link href="mailto:anas.ahmed10@outlook.com" color="#008E7B">anas.ahmed10@outlook.com</link>'
            '&nbsp;&nbsp;|&nbsp;&nbsp;'
            '<link href="https://www.linkedin.com/in/anas-ahmed-28b391166" color="#008E7B">LinkedIn</link>'
            '&nbsp;&nbsp;|&nbsp;&nbsp;'
            '<link href="https://github.com/anasahmed10" color="#008E7B">GitHub</link>',
            s["contact"],
        ),
        Paragraph(variant.title, s["title"]),
    ]
    story.extend(section_heading("SUMMARY", s))
    story.append(Paragraph(variant.summary, s["body"]))
    story.extend(section_heading("TECHNICAL SKILLS", s))
    for label, value in variant.skills:
        story.append(Paragraph(f"<b>{label}:</b> {value}", s["body"]))
    story.extend(section_heading("EXPERIENCE", s))
    story.append(role_block(
        "Staples", "Software Engineer II, Mobile", "Framingham, MA",
        "Oct. 2022 - Present", variant.staples_bullets, s,
    ))
    story.append(role_block(
        "General Motors", "Sr. Mobile Device Software Developer", "Remote",
        "Jul. 2021 - Jul. 2022", COMMON_GM, s,
    ))
    story.append(role_block(
        "Syntax Tutoring", "Founder and CEO", "Foxborough, MA",
        "Aug. 2021 - Jan. 2024", COMMON_SYNTAX, s,
    ))
    story.extend(section_heading("PROJECTS", s))
    for project_id in variant.project_ids:
        name, stack, description = PROJECTS[project_id]
        story.append(Paragraph(f"<b>{name}</b> | <font color='#536268'>{stack}</font>", s["project"]))
        story.append(Paragraph(f"- {description}", s["bullet"]))
    story.extend(section_heading("EDUCATION", s))
    education = Table(
        [[
            Paragraph("University of Massachusetts, Lowell · Bachelor of Science in Computer Science", s["education"]),
            Paragraph("Dean's List Recipient", s["date"]),
        ]],
        colWidths=[6.55 * inch, 1.05 * inch],
    )
    education.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(education)
    document.build(story)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for variant in VARIANTS:
        build_resume(variant)
        print(f"generated {variant.filename}")


if __name__ == "__main__":
    main()
