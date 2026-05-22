import { NextResponse } from "next/server";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";

const ALLOWED_IMAGE = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
const ALLOWED_VIDEO = [".mp4", ".webm", ".mov"];
const MAX_IMAGE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO = 50 * 1024 * 1024; // 50MB

export async function POST(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const formData = await req.formData();
    const files = formData.getAll("files");
    const subfolder = formData.get("folder") || "general";

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadDir = join(
      process.cwd(),
      "public",
      "uploads",
      "case-studies",
      subfolder
    );
    await mkdir(uploadDir, { recursive: true });

    const urls = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const ext = extname(file.name).toLowerCase();
      const isImage = ALLOWED_IMAGE.includes(ext);
      const isVideo = ALLOWED_VIDEO.includes(ext);

      if (!isImage && !isVideo) {
        return NextResponse.json(
          { error: `File type ${ext} not allowed` },
          { status: 400 }
        );
      }

      if (isImage && file.size > MAX_IMAGE) {
        return NextResponse.json(
          { error: `Image ${file.name} exceeds 5MB limit` },
          { status: 400 }
        );
      }

      if (isVideo && file.size > MAX_VIDEO) {
        return NextResponse.json(
          { error: `Video ${file.name} exceeds 50MB limit` },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const safeName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .toLowerCase();
      const filename = `${timestamp}-${safeName}`;
      const filepath = join(uploadDir, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filepath, buffer);

      const publicUrl = `/uploads/case-studies/${subfolder}/${filename}`;
      urls.push({ url: publicUrl, name: file.name, type: isVideo ? "video" : "image" });
    }

    return NextResponse.json({ files: urls });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
