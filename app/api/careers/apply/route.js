import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt", ".rtf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const phone = formData.get("phone")?.toString() || null;
    const linkedin = formData.get("linkedin")?.toString() || null;
    const coverLetter = formData.get("coverLetter")?.toString() || "";
    let jobPostingId = formData.get("jobPostingId")?.toString();
    const resumeFile = formData.get("resume");

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    if (!resumeFile || !(resumeFile instanceof File)) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
    }

    // Validate size
    if (resumeFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Resume file size exceeds the 10MB limit" },
        { status: 400 }
      );
    }

    // Validate extension
    const ext = extname(resumeFile.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed formats: ${ALLOWED_EXTENSIONS.join(", ")}` },
        { status: 400 }
      );
    }

    // Handle jobPostingId
    if (!jobPostingId || jobPostingId === "general" || jobPostingId === "null" || jobPostingId === "undefined") {
      jobPostingId = null;
    }

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads", "resumes");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique safe filename
    const timestamp = Date.now();
    const safeName = resumeFile.name.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();
    const filename = `${timestamp}-${safeName}`;
    const filepath = join(uploadDir, filename);

    // Save file
    const buffer = Buffer.from(await resumeFile.arrayBuffer());
    await writeFile(filepath, buffer);

    const resumeUrl = `/uploads/resumes/${filename}`;

    // Save to Database
    const application = await prisma.jobApplication.create({
      data: {
        name,
        email,
        phone,
        linkedin,
        resumeUrl,
        coverLetter,
        jobPostingId,
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (err) {
    console.error("Submit application error:", err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
