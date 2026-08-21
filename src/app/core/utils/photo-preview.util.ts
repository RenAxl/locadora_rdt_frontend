import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export class PhotoPreview {
  private objectUrl?: string;

  constructor(private sanitizer: DomSanitizer) {}

  create(fileOrBlob: File | Blob): SafeUrl | null {
    if (!fileOrBlob || fileOrBlob.size === 0) {
      return null;
    }

    this.clear();
    this.objectUrl = URL.createObjectURL(fileOrBlob);

    return this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
  }

  clear(): void {
    if (!this.objectUrl) {
      return;
    }

    URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = undefined;
  }
}

export class PhotoUrlRegistry {
  private objectUrls: string[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  create(fileOrBlob: File | Blob): SafeUrl | null {
    if (!fileOrBlob || fileOrBlob.size === 0) {
      return null;
    }

    const objectUrl = URL.createObjectURL(fileOrBlob);
    this.objectUrls.push(objectUrl);

    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }

  clear(): void {
    this.objectUrls.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
    this.objectUrls = [];
  }
}
