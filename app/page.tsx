"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordGate from "@/components/PasswordGate";
import SuspenseInterstitial from "@/components/SuspenseInterstitial";

export default function Home() {
  const router = useRouter();
  const [showInterstitial, setShowInterstitial] = useState(false);

  const handleSuccess = () => {
    const seen = sessionStorage.getItem("interstitial-seen");
    if (seen) {
      router.push("/love");
    } else {
      setShowInterstitial(true);
    }
  };

  const handleInterstitialDone = () => {
    sessionStorage.setItem("interstitial-seen", "true");
    router.push("/love");
  };

  if (showInterstitial) {
    return <SuspenseInterstitial onComplete={handleInterstitialDone} />;
  }

  return <PasswordGate onSuccess={handleSuccess} />;
}
