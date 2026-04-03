"use client";

import dynamic from "next/dynamic";
import MusicPlayer from "@/components/MusicPlayer";
import ScrollProgress from "@/components/ScrollProgress";

const FloatingElements = dynamic(
  () => import("@/components/FloatingElements"),
  { ssr: false }
);

const EasterEggs = dynamic(
  () => import("@/components/EasterEggs"),
  { ssr: false }
);

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <FloatingElements />
      <MusicPlayer />
      <EasterEggs />
      {children}
    </>
  );
}
