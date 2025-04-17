'use client';

interface BunnyUploadOptions {
  file: File;
  path: string;
}

export async function uploadToBunny({ file, path }: BunnyUploadOptions): Promise<boolean> {
  try {
    const storageUrl = "https://storage.bunnycdn.com";
    const apiKey = "bccbe925-b280-4c20-a23efad7b73f-9fb9-4dda";
    const zone = "xmatchpro";

    if (!storageUrl || !apiKey || !zone) {
      return false;
    }

    // Upload to temp folder (or remove 'temp/' if unnecessary)
    const uploadUrl = `https://storage.bunnycdn.com/xmatchpro/temp/${path}`;

    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': apiKey,
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!res.ok) {
      return false;
    }

    return true;

  } catch (error) {
 
    return false;
  }
}