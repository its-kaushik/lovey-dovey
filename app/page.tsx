"use client";

import { useRouter } from "next/navigation";
import PasswordGate from "@/components/PasswordGate";

export default function Home() {
  const router = useRouter();

  const handleSuccess = () => {
    // Interstitial will be wired in Sprint 2
    router.push("/love");
  };

  return <PasswordGate onSuccess={handleSuccess} />;
}
