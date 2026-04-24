export function validateVimeoId(vimeoId: string): string | null {
  // Extract ID and Hash if it's a URL
  // Supports: vimeo.com/123456789, vimeo.com/manage/videos/123456789/hash, etc.
  const urlMatch = vimeoId.match(/vimeo\.com\/(?:manage\/videos\/|video\/)?([0-9]+)(?:\/([a-z0-9]+))?/i);
  
  if (urlMatch) {
    const id = urlMatch[1];
    const hash = urlMatch[2];
    return hash ? `${id}?h=${hash}` : id;
  }

  // Fallback for simple ID
  const idMatch = vimeoId.match(/^[0-9]+$/);
  if (idMatch) {
    return vimeoId;
  }
  
  return null;
}

export function validateTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 255;
}

export function validatePassword(password: string): boolean {
  return password.length >= 4;
}
