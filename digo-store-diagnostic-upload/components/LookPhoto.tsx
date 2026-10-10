import Image from "next/image";
export function LookPhoto({ panel, title, priority = false }: { panel: number; title: string; priority?: boolean }) {
  return <div className="look-photo"><Image src="/images/autumn-editorial.png" alt={`${title} — AI-generated outfit inspiration`} width={1536} height={1024} priority={priority} style={{ left: `${panel * -100}%` }} /></div>;
}
