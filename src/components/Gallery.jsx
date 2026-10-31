import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import useFetchPhotos from '../hooks/useFetchPhotos';
import { favouritesReducer, readFavourites, STORAGE_KEY } from '../state/favourites';
import PhotoCard, { Heart } from './PhotoCard';
import GalleryState from './GalleryState';

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [query, setQuery] = useState('');
  const searchInput = useRef(null);
  function clearSearch() {
    setQuery('');
    searchInput.current?.focus();
  }
  const [favourites, dispatch] = useReducer(favouritesReducer, undefined, readFavourites);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
      setStorageError(false);
    } catch { setStorageError(true); }
  }, [favourites]);

  const handleSearch = useCallback(event => setQuery(event.target.value), []);
  const filteredPhotos = useMemo(() => {
    const search = query.trim().toLowerCase();
    return photos.filter(photo => photo.author.toLowerCase().includes(search));
  }, [photos, query]);

  function toggleFavourite(id) { dispatch({ type: 'toggle', id }); }

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-clip">
      <header className="sticky top-0 z-20 border-b border-[#d8b879]/25 bg-[#fcf8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
          <a href="./" aria-label="Still gallery home" className="flex items-center gap-3 font-serif text-2xl tracking-tight">
            <svg viewBox="0 0 32 32" className="size-7 text-[#653b58]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M16 27V14M16 21C5 22 4 13 5 8c7 0 12 4 11 13ZM16 17C15 8 20 4 27 4c1 8-3 14-11 13Z" /></svg>
            still.
          </a>
          <span className="flex items-center gap-1.5 rounded-full border border-[#d8b879]/25 bg-[#f3ebee] px-3 py-1.5 text-xs text-[#574354]"><Heart className="size-4 text-[#653b58]" /><span>{favourites.length} saved</span></span>
        </div>
      </header>
      <div aria-hidden="true" className="pointer-events-none absolute top-0 -z-10 h-[420px] w-full bg-[radial-gradient(ellipse_at_50%_10%,#e7cadc55,transparent_65%),radial-gradient(ellipse_at_90%_50%,#d8b87933,transparent_55%)]" />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-24 lg:px-12">
        <section className="pt-10 sm:pt-14">
          <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a683a]"><span className="size-1.5 rounded-full bg-[#b7955e]" /> Archival collection — Volume IV</p>
          <h1 className="max-w-4xl font-serif text-3xl leading-[1.18] tracking-tight sm:text-4xl lg:text-5xl">Quiet moments, preserved in light.</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#766573] sm:text-lg">A curated photographic archive celebrating contemplative spaces and unhurried beauty.</p>
        </section>
        <section aria-label="Photo gallery">
          <div className="mt-10 mb-8 flex flex-col justify-between gap-4 border-b border-[#e8dfe3] py-4 sm:mt-12 sm:mb-12 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3"><h2 className="font-serif text-lg sm:text-xl">Curated Collection</h2><span className="rounded-full bg-[#f2e7d5] px-2.5 py-1 text-[11px] font-medium text-[#725c43]" aria-live="polite">{loading ? 'Loading…' : error ? 'Unavailable' : `${filteredPhotos.length} ${filteredPhotos.length === 1 ? 'photo' : 'photos'}`}</span></div>
            <div className="relative w-full sm:w-80"><svg className="pointer-events-none absolute top-3 left-3.5 size-4 text-[#766573]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg><label htmlFor="author-search" className="sr-only">Search photos by author</label><input ref={searchInput} id="author-search" type="search" value={query} onChange={handleSearch} placeholder="Search by author…" className="w-full rounded-full bg-[#f3ebee] py-2.5 pr-12 pl-10 text-sm text-[#302332] transition-colors placeholder:text-[#766573] focus:bg-white sm:rounded-xl [&::-webkit-search-cancel-button]:appearance-none" />{query && <button type="button" aria-label="Clear author search" onClick={clearSearch} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-[#766573] hover:text-[#653b58]"><svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 6 12 12M6 18 18 6" /></svg></button>}</div>
          </div>
          {storageError && <p role="status" className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Your browser could not save favourites. They will last only for this visit.</p>}
          {!loading && !error && query.trim() && <p className="mb-6 break-words text-xs text-[#766573]">Author: <span className="font-semibold text-[#653b58]">“{query.trim()}”</span> · {filteredPhotos.length} {filteredPhotos.length === 1 ? 'match' : 'matches'}</p>}
          {loading ? <GalleryState type="loading" /> :
            error ? <GalleryState type="error" error={error} /> :
            filteredPhotos.length === 0 ? <GalleryState type="empty" query={query} onClear={clearSearch} /> :
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">{filteredPhotos.map((photo, index) => <PhotoCard key={photo.id} photo={photo} index={index} favourite={favourites.includes(photo.id)} onToggle={toggleFavourite} />)}</div>}
        </section>
      </main>
      <footer className="border-t border-[#e8dfe3]/50 bg-[#f3ebee]/60 py-9"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 text-xs text-[#766573] sm:flex-row lg:px-12"><p>© Still Gallery. Quiet moments, preserved.</p><p>Photography from <a href="https://picsum.photos" className="underline underline-offset-4">Lorem Picsum</a><span className="ml-5 text-[10px] uppercase tracking-widest">Ivory & Plum</span></p></div></footer>
    </div>
  );
}
