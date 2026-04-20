/**
 * Compress a base64 image by resizing and reducing quality.
 * Returns a compressed base64 JPEG string.
 */
export function compressImage(
  base64: string,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.6
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Scale down proportionally if exceeds max dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL("image/jpeg", quality);
      resolve(compressed);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = base64;
  });
}

/**
 * Estimate the byte size of a string (UTF-16 in localStorage).
 */
export function estimateStorageSize(str: string): number {
  return str.length * 2; // localStorage uses UTF-16
}

/**
 * Safely set a value in localStorage with quota error handling.
 * Returns true if successful, false if quota exceeded.
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e: any) {
    if (
      e?.name === "QuotaExceededError" ||
      e?.code === 22 ||
      e?.code === 1014
    ) {
      return false;
    }
    throw e;
  }
}
