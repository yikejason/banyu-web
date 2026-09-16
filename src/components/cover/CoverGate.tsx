"use client";

import { CoverScreen } from "@/components/cover/CoverScreen";
import { MoodSelectScreen } from "@/components/mood/MoodSelectScreen";
import { setMoodCompanion } from "@/lib/mood/companion";
import { ensureDeviceVault } from "@/lib/storage/vault";
import { useEffect, useState } from "react";

const COVER_SESSION_KEY = "banyu-cover-entered";

type Gate = "cover" | "mood" | "app";

export function CoverGate({ children }: { children: React.ReactNode }) {
  const [gate, setGate] = useState<Gate>("cover");
  const [ready, setReady] = useState(false);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(COVER_SESSION_KEY) === "1") {
      setGate("app");
    }
    ensureDeviceVault()
      .then(() => setReady(true))
      .catch(() => setReady(true));
  }, []);

  useEffect(() => {
    if (entering && ready && gate === "cover") {
      setGate("mood");
      setEntering(false);
    }
  }, [entering, ready, gate]);

  if (gate === "app" && ready) return <>{children}</>;

  if (gate === "app" && !ready) {
    return <CoverScreen onEnter={() => {}} busy />;
  }

  if (gate === "mood") {
    return (
      <MoodSelectScreen
        onConfirm={(id) => {
          setMoodCompanion(id);
          sessionStorage.setItem(COVER_SESSION_KEY, "1");
          setGate("app");
        }}
      />
    );
  }

  return (
    <CoverScreen
      busy={entering && !ready}
      onEnter={() => {
        setEntering(true);
        if (ready) setGate("mood");
      }}
    />
  );
}
