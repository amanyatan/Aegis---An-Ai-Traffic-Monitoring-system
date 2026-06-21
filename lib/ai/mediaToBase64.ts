type EncodedMedia = {
  base64: string;
  mimeType: string;
};

function guessMimeType(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.includes('.png')) return 'image/png';
  if (lower.includes('.webp')) return 'image/webp';
  if (lower.includes('.gif')) return 'image/gif';
  if (lower.includes('.mp4') || lower.includes('.mov')) return 'video/mp4';
  return 'image/jpeg';
}

export async function mediaUriToBase64(uri: string): Promise<EncodedMedia> {
  if (uri.startsWith('data:')) {
    const [header, base64] = uri.split(',');
    const mimeType = header.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg';
    return { base64, mimeType };
  }

  const response = await fetch(uri);
  const blob = await response.blob();
  const mimeType = blob.type || guessMimeType(uri);

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      resolve(result.includes(',') ? result.split(',')[1] : result);
    };
    reader.onerror = () => reject(new Error('Failed to read media file'));
    reader.readAsDataURL(blob);
  });

  return { base64, mimeType };
}
