"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Heart, MapPin, CloudRain, Wind, Sun, CalendarDays } from "lucide-react";
import type { Product } from "@/lib/types";
import { filterLooks, getLookSlots, looks, temperatures, type Conditions, type Temperature } from "@/lib/looks";
import { formatMoney } from "@/lib/money";
import { LookPhoto } from "./LookPhoto";
import { useSavedLooks } from "./useSavedLooks";

export function Discovery({ products, savedOnly = false }: { products: Product[]; savedOnly?: boolean }) {
  const [city, setCity] = useState("Seattle");
  const [temperature, setTemperature] = useState<Temperature>("cool");
  const [conditions, setConditions] = useState<Conditions>("any");
  const [scene, setScene] = useState("All days");
  const [timing, setTiming] = useState("explore");
  const { saved, toggle, storageError } = useSavedLooks();
  useEffect(() => { try { const setting = JSON.parse(localStorage.getItem("digo-setting-v1") || "null");
    if (setting && typeof setting.city === "string") setCity(setting.city);
  } catch {} }, []);
  function changeCity(value: string) { setCity(value); try { localStorage.setItem("digo-setting-v1", JSON.stringify({ city: value })); } catch {} }
  const filtered = savedOnly ? looks.filter(l => saved.includes(l.slug)) : timing === "soon" ? [] : filterLooks(temperature, conditions, scene);
  return <main className="discovery">
    {!savedOnly && <>
      <section className="editorial-hero">
        <div className="hero-copy"><span className="small-label">A WARDROBE FOR REAL LIFE</span>
          <h1>Good days.<br /><em>Great layers.</em></h1>
          <p>Find a look for where you’re going.<br />Make it yours, one piece at a time.</p>
          <a className="editorial-button" href="#looks">Find your next look <ArrowUpRight size={19} /></a>
          <span className="hero-footnote">The cool-weather edit · No. 01</span>
        </div>
        <div className="hero-visual"><Image src="/images/autumn-editorial.png" width={1536} height={1024} alt="Three outfit ideas for dry mornings, rainy city days and breezy weekends" priority sizes="(max-width: 760px) 100vw, 65vw" />
          <span className="image-caption">AI styling inspiration · Shop related accessories below</span>
        </div>
      </section>
      <div className="value-strip"><span>Discover a whole look</span><span>Choose just what you need</span><span>Check delivery before you commit</span></div>
    </>}
    <section className="edit-section" id="looks">
      <div className="section-heading"><div><p className="small-label">{savedOnly ? "YOUR PERSONAL EDIT" : "DRESS FOR THE DAYS AHEAD"}</p>
        <h2>{savedOnly ? "Good looks, kept close." : "What does your day look like?"}</h2></div>
        {!savedOnly && <label className="city-control"><MapPin size={17}/><input aria-label="City or destination" value={city} maxLength={60} onChange={e => changeCity(e.target.value)} placeholder="City or destination" /></label>}
      </div>
      {!savedOnly && <>
        <p className="context-note">Planning for {city.trim() || "your destination"}. Set the conditions you expect — this is not a live weather forecast.</p>
        <div className="planning-tabs" aria-label="When you need it">
          {[['explore','Find inspiration'],['soon','I need it soon'],['next','Plan next season']].map(([id,label]) => <button key={id} aria-pressed={timing === id} className={timing === id ? "active" : ""} onClick={() => setTiming(id)}>{label}</button>)}
        </div>
        {timing === "next" && <p className="planning-message"><CalendarDays size={17}/> Choose your next season’s temperature below. Save ideas now; delivery dates must be confirmed before making plans.</p>}
        <div className="conditions-bar"><div className="temperature-options" aria-label="Expected temperature">
          {temperatures.map(t => <button key={t.id} onClick={() => setTemperature(t.id)} aria-pressed={temperature === t.id} className={temperature === t.id ? "active" : ""}><strong>{t.label}</strong><span>{t.note}</span></button>)}
        </div><div className="weather-options" aria-label="Expected weather">
          {([{id:"any",label:"Any weather",icon:null},{id:"dry",label:"Dry",icon:Sun},{id:"rain",label:"Rain",icon:CloudRain},{id:"wind",label:"Wind",icon:Wind}] as const).map(w => <button key={w.id} aria-pressed={conditions === w.id} className={conditions === w.id ? "active" : ""} onClick={() => setConditions(w.id)}>{w.icon && <w.icon size={16}/>}{w.label}</button>)}
        </div></div>
        <div className="scene-row"><div className="scene-options" aria-label="Day or occasion">{["All days","Everyday","City days","Weekends"].map(s => <button key={s} aria-pressed={scene === s} className={scene === s ? "active" : ""} onClick={() => setScene(s)}>{s}</button>)}</div><span aria-live="polite">{filtered.length} {filtered.length === 1 ? "look" : "looks"}</span></div>
      </>}
      {savedOnly && <p className="context-note">Your inspiration, saved on this browser. Revisit a look when you’re ready to choose your pieces.</p>}
      {storageError && <p role="status">{storageError}</p>}
      {filtered.length ? <div className="looks-grid">{filtered.map(look => {
        const slots = getLookSlots(look, products);
        const available = slots.flatMap(s => s.products.length ? [s.products[0]] : []);
        const total = available.reduce((n,p) => n + p.price_cents, 0);
        return <article className="look-card" key={look.slug}>
          <div className="look-card-visual"><Link href={`/looks/${look.slug}`} aria-label={`Explore ${look.title}`}><LookPhoto panel={look.panel} title={look.title}/></Link>
            <span className="look-badge">{look.scene}</span><button className={`save-look ${saved.includes(look.slug) ? "is-saved" : ""}`} onClick={() => toggle(look.slug)} aria-pressed={saved.includes(look.slug)} aria-label={`${saved.includes(look.slug) ? "Unsave" : "Save"} ${look.title}`}><Heart size={19} fill={saved.includes(look.slug) ? "currentColor" : "none"}/></button>
            <span className="look-image-note">AI outfit inspiration</span>
          </div>
          <div className="look-card-copy"><span className="look-style">{look.style}</span><Link href={`/looks/${look.slug}`}><h3>{look.title}</h3></Link><p>{look.subtitle}</p>
            <div className="look-price"><span>{available.length} related accessories</span><strong>{formatMoney(total)}</strong></div>
            <span className="delivery-note"><CalendarDays size={13}/> Delivery to be confirmed</span>
            <Link className="look-link" href={`/looks/${look.slug}`}>Explore the look <ArrowUpRight size={19}/></Link>
          </div>
        </article>;
      })}</div> : <div className="edit-empty"><span className="small-label">{savedOnly ? "MAKE A LITTLE COLLECTION" : timing === "soon" ? "LET’S BE CLEAR ABOUT TIMING" : "A NEW EDIT IS ON ITS WAY"}</span>
        <h3>{savedOnly ? "Found something you love?" : timing === "soon" ? "No confirmed delivery windows yet." : "We’re still putting this edit together."}</h3>
        <p>{savedOnly ? "Tap the heart on a look to keep it here." : timing === "soon" ? "We can’t currently promise arrival for an upcoming date. You can still explore and save looks while delivery is being confirmed." : "Try another temperature, weather or occasion. Our first collection focuses on cool-weather layering."}</p>
        {savedOnly ? <Link href="/#looks" className="editorial-button">Discover looks <ArrowRight size={17}/></Link> : <button className="editorial-button" onClick={() => {setTiming("explore");setTemperature("cool");setConditions("any");setScene("All days");}}>Explore the cool-weather edit <ArrowRight size={17}/></button>}
      </div>}
      <p className="edit-caption">Styling suggestions, not insulation ratings. Outfit images are illustrative; related accessories may differ in colour and design. Clothing and shoes are not included.</p>
    </section>
    <section className="about-edit" id="about"><span className="small-label">THE DIGO WAY</span><h2>A little inspiration.<br /><em>A wardrobe that’s yours.</em></h2>
      <div className="about-steps"><div><span>01 / DISCOVER</span><h3>Start with your day.</h3><p>A temperature, a place, a plan. Find a look that feels right for yours.</p></div><div><span>02 / MAKE IT YOURS</span><h3>Keep what you love.</h3><p>Use your own wardrobe. Choose a few accessories, swap a piece, or save the idea.</p></div><div><span>03 / PLAN AHEAD</span><h3>Know what comes next.</h3><p>See item prices and delivery status before adding anything to your bag.</p></div></div>
      <Link href="/shop" className="text-link">Already know what you need? Browse all pieces <ArrowUpRight size={16}/></Link>
    </section>
    <footer className="editorial-footer"><Link href="/" className="brand">digo.</Link><p>Find your look. Make it yours.</p><Link href="/shop">All pieces</Link><Link href="/saved">Saved looks</Link><Link href="/admin">Manage store</Link></footer>
  </main>;
}
