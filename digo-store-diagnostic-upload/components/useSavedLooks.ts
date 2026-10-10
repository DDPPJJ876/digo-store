"use client";
import { useEffect, useState } from "react";
const key = "digo-saved-looks-v1";
export function useSavedLooks() {
  const [saved, setSaved] = useState<string[]>([]);
  const [storageError, setStorageError] = useState("");
  useEffect(() => { try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    if (Array.isArray(value)) setSaved(value.filter(v => typeof v === "string"));
  } catch {} }, []);
  function toggle(slug: string) {
    const next = saved.includes(slug) ? saved.filter(s => s !== slug) : [...saved, slug];
    setSaved(next);
    try { localStorage.setItem(key, JSON.stringify(next)); setStorageError(""); }
    catch { setStorageError("Saved for this visit. Your browser could not save it for later."); }
  }
  return { saved, toggle, storageError };
}
