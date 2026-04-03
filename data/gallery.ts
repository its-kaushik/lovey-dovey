export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  caption?: string;
  rotation?: number;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "/images/hot-wheels.jpeg",
    alt: "Hot Wheels collection in a lighted wooden case",
    caption: "Who gives Hot Wheels in a lighted case? You. That's who.",
    rotation: -2,
  },
];
