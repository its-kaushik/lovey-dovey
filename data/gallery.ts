export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  caption?: string;
  rotation?: number;
  isVideo?: boolean;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "/images/priyanshi-solo-1.jpeg",
    alt: "Priiyanshii",
    caption: "The face I can't stop thinking about.",
    rotation: -2,
  },
  {
    id: 2,
    src: "/images/priyanshi-solo-2.jpeg",
    alt: "Priiyanshii",
    caption: "Every time. Every single time.",
    rotation: 1,
  },
  {
    id: 3,
    src: "/images/together-picture-1.jpeg",
    alt: "Kushik and Priiyanshii together",
    caption: "Us. My favourite word.",
    rotation: -1,
  },
  {
    id: 4,
    src: "/images/priyanshi-solo-3.jpeg",
    alt: "Priiyanshii",
    caption: "How are you even real?",
    rotation: 2,
  },
  {
    id: 5,
    src: "/images/hot-wheels.jpeg",
    alt: "Hot Wheels collection in a lighted wooden case",
    caption: "Who gives Hot Wheels in a lighted case? You. That's who.",
    rotation: -1,
  },
  {
    id: 6,
    src: "/images/together-video-1.mp4",
    alt: "Our video together",
    caption: "This moment. On loop. Forever.",
    rotation: 0,
    isVideo: true,
  },
];
