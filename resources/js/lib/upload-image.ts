// resources/js/lib/upload-image.ts
// Upload an image from the rich text editor to the CMS (stored under /storage/uploads/editor).

function xsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export interface UploadedImage {
  url: string;
  width: number | null;
  height: number | null;
}

export async function uploadEditorImage(file: File): Promise<UploadedImage> {
  const body = new FormData();
  body.append('image', file);

  const response = await fetch(route('admin.editor-uploads.store'), {
    method: 'POST',
    body,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'X-XSRF-TOKEN': xsrfToken(),
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  if (!response.ok) {
    let message = 'Upload failed. Please try again.';
    try {
      const json = await response.json();
      message = json?.errors?.image?.[0] ?? json?.message ?? message;
    } catch {
      /* keep default message */
    }
    throw new Error(message);
  }

  return response.json();
}

/** "truck-at-dock_2.jpg" -> "Truck at dock 2" — a starting point for alt text. */
export function altFromFilename(name: string): string {
  const base = name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim();
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : '';
}
