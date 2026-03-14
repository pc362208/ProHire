import fs from 'node:fs/promises';
import path from 'node:path';

export async function persistUpload(buffer: Buffer, relativePath: string) {
  const driver = process.env.UPLOAD_DRIVER || 'local';

  if (driver === 's3') {
    console.warn('[storage] UPLOAD_DRIVER=s3 is scaffolded only in v7; falling back to local storage.');
  }

  const absolutePath = path.join(process.cwd(), 'public', relativePath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, buffer);
  return `/${relativePath.replaceAll('\\', '/')}`;
}
