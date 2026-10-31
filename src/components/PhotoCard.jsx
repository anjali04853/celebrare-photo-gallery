import { useState } from 'react';

export function Heart({ filled = false, className = 'size-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg>;
}

export default function PhotoCard({ photo, favourite, onToggle, index }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <article className="group rounded-3xl border border-transparent bg-white p-3 shadow-[0_4px_20px_rgba(73,40,61,0.04)] transition-[box-shadow,border-color] duration-300 hover:shadow-[0_10px_28px_rgba(73,40,61,0.08)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f3ebee]">
        {imageFailed ? <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-[#766573]"><svg aria-hidden="true" className="mb-1 size-8 text-[#653b58]/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m3 3 18 18M9 5h10a2 2 0 0 1 2 2v10M5 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2M3 17l5-5 5 5 2-2" /></svg><p className="font-serif text-base text-[#302332]">Photograph unavailable</p><p className="text-xs">The image could not be loaded.</p></div> :
          <img src={`https://picsum.photos/id/${encodeURIComponent(photo.id)}/800/600`} alt={`Photograph by ${photo.author}`} onError={() => setImageFailed(true)} loading={index < 4 ? 'eager' : 'lazy'} width="800" height="600" className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />}
        {favourite && <span className="absolute top-3 left-3 rounded-full bg-[#653b58] px-3 py-1 text-[10px] font-semibold tracking-wide text-white">Saved</span>}
      </div>
      <div className="mt-3 flex min-h-11 items-center justify-between gap-2">
        <div className="min-w-0 pl-0.5"><h2 className="truncate text-sm font-semibold">{photo.author}</h2><p className="mt-0.5 text-xs text-[#766573]">Photo {photo.id} · Lorem Picsum</p></div>
        <button type="button" aria-label={`${favourite ? 'Remove' : 'Add'} ${photo.author} photo ${photo.id} ${favourite ? 'from' : 'to'} favourites`} aria-pressed={favourite} onClick={() => onToggle(photo.id)} className={`flex size-11 shrink-0 items-center justify-center rounded-full transition-colors ${favourite ? 'bg-[#eee0e9] text-[#653b58]' : 'text-[#766573] hover:bg-[#f3ebee] hover:text-[#653b58]'}`}><Heart filled={favourite} /></button>
      </div>
    </article>
  );
}
