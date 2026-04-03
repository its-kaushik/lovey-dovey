export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  caption?: string;
  rotation?: number;
}

// Populated by Kushik with actual photos
export const galleryItems: GalleryItem[] = [];
