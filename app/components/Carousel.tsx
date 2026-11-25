"use client";
import { useRef, useState } from "react";

export default function Carousel({ images, href, title }: { images: { id: number; caption: string }[]; href: string; title: string }) {
  const tr = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  const go = (d: number) => tr.current?.scrollBy({ left: tr.current.clientWidth * d });
  const onScroll = () => { const t = tr.current; if (t) setK(Math.round(t.scrollLeft / Math.max(1, t.clientWidth))); };
  return (
    <div className="car">
      <div className="track" ref={tr} onScroll={onScroll} tabIndex={0} aria-label={`Images from ${title}`}
        onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); } }}>
        {images.length ? images.map((m, i) => (
          <a className="slide" key={m.id} href={href} tabIndex={-1}>
            <img src={`/api/asset/${m.id}`} alt={m.caption || title} loading={i ? "lazy" : "eager"} />
          </a>
        )) : <a className="ph" href={href} tabIndex={-1} aria-hidden="true">{title.slice(0, 2)}</a>}
      </div>
      {images.length > 1 && (
        <>
          <button className="nav p" type="button" onClick={() => go(-1)} aria-label="Previous image" hidden={k === 0}>‹</button>
          <button className="nav n" type="button" onClick={() => go(1)} aria-label="Next image" hidden={k >= images.length - 1}>›</button>
          <div className="dots" aria-hidden="true">{images.map((m, i) => <i key={m.id} className={i === k ? "on" : ""} />)}</div>
        </>
      )}
    </div>
  );
}
