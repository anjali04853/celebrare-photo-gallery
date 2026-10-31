export default function GalleryState({ type, query, error, onClear }) {
  if (type === 'loading') {
    return (
      <div role="status" className="rounded-3xl border border-[#e8dfe3]/40 bg-white/65 px-6 py-14 text-center sm:p-16">
        <div aria-hidden="true" className="relative mx-auto mb-8 size-20"><span className="absolute inset-0 animate-spin rounded-full border-[3px] border-[#e8dfe3] border-t-[#653b58] motion-reduce:animate-none" /><span className="absolute inset-7 rounded-full bg-[#f3ebee] p-2"><span className="block size-2 rounded-full bg-[#653b58]" /></span></div>
        <h3 className="font-serif text-2xl text-[#653b58] sm:text-3xl">Gathering a little inspiration…</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#766573]">Bringing together photographs and perspectives from the collection.</p>
        <div aria-hidden="true" className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">{[0, 1, 2, 3].map(id => <div key={id} className="aspect-[4/3] animate-pulse rounded-2xl bg-[#f3ebee]/70 motion-reduce:animate-none" />)}</div>
      </div>
    );
  }

  const failed = type === 'error';
  return (
    <div role={failed ? 'alert' : 'status'} className={`relative overflow-hidden rounded-3xl bg-[#f3ebee]/65 px-6 py-16 text-center sm:py-20 ${failed ? 'mx-auto max-w-2xl' : ''}`}>
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 bottom-0 size-64 rounded-full bg-[#d8b879]/10 blur-3xl" />
      <div aria-hidden="true" className="relative mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-[#e8dfe3] bg-[#e8dfe3]/40 text-[#653b58]">
        {failed ? <svg className="size-8 text-[#8a683a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m3 3 18 18M2 8a16 16 0 0 1 3-2m4-2a16 16 0 0 1 13 4M5 12a11 11 0 0 1 4-2m5 0a11 11 0 0 1 5 2m-11 4a6 6 0 0 1 8 0" /><circle cx="12" cy="20" r="1" /></svg> : <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4M8 8l5 5m0-5-5 5" /></svg>}
      </div>
      <h3 className={`font-serif text-2xl sm:text-3xl ${failed ? '' : 'text-[#653b58]'}`}>{failed ? 'We could not load the photos' : 'No moments found.'}</h3>
      <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#766573]">{failed ? error : <>We couldn’t find photographs by <span className="break-words font-semibold text-[#302332]">“{query.trim()}”</span>. Try another author name or clear your search.</>}</p>
      <button type="button" onClick={failed ? () => window.location.reload() : onClear} className="relative mt-7 min-h-11 rounded-full bg-[#653b58] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4c2941]">{failed ? 'Refresh gallery' : 'Clear search'}</button>
      {failed && <p className="mt-7 text-xs leading-6 text-[#766573]">Your saved favourites remain in this browser.</p>}
    </div>
  );
}
