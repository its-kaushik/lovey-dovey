import Hero from "@/components/Hero";
import Timeline from "@/components/Timeline";
import ReasonsJar from "@/components/ReasonsJar";
import LoveLetter from "@/components/LoveLetter";
import TheMomentIKnew from "@/components/TheMomentIKnew";
import PhotoGallery from "@/components/PhotoGallery";
import PressIfYouMissMe from "@/components/PressIfYouMissMe";
import WhatIPromise from "@/components/WhatIPromise";
import Footer from "@/components/Footer";

import { milestones } from "@/data/milestones";
import { reasons } from "@/data/reasons";
import { promises } from "@/data/promises";
import { missYouMessages } from "@/data/missYouMessages";
import { galleryItems } from "@/data/gallery";

export default function LovePage() {
  return (
    <main>
      <Hero />
      <Timeline milestones={milestones} />
      <ReasonsJar reasons={reasons} />
      <LoveLetter />
      <TheMomentIKnew />
      <PhotoGallery items={galleryItems} />
      <PressIfYouMissMe messages={missYouMessages} />
      <WhatIPromise promises={promises} />
      <Footer />
    </main>
  );
}
