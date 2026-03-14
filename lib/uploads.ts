import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const allowedFolders = new Set(['resumes', 'logos', 'verification']);

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');
}

export async function saveUploadedFile(file: File, folder: string) {
  if (!allowedFolders.has(folder)) {
    throw new Error('Unsupported upload folder');
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || '';
  const base = path.basename(file.name, ext);
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}-${sanitizeFilename(base)}${ext}`;
  const targetDir = path.join(process.cwd(), 'public', 'uploads', folder);
  const targetPath = path.join(targetDir, filename);

  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(targetPath, bytes);

  return {
    url: `/uploads/${folder}/${filename}`,
    filename,
    size: file.size,
    type: file.type,
  };
}
