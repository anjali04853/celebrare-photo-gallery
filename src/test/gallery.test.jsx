import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, renderHook } from '@testing-library/react';
import Gallery from '../components/Gallery';
import useFetchPhotos from '../hooks/useFetchPhotos';
import PhotoCard from '../components/PhotoCard';
import GalleryState from '../components/GalleryState';
import { STORAGE_KEY, readFavourites } from '../state/favourites';

const photos = [{ id: '0', author: 'Alejandro Escamilla' }, { id: '10', author: 'Paul Jarvis' }];
afterEach(() => vi.unstubAllGlobals());

describe('gallery requirements', () => {
  it('shows loading, filters locally ignoring case, and persists toggles after remount', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => photos });
    vi.stubGlobal('fetch', fetchMock);
    const { unmount } = render(<Gallery />);
    expect(screen.getByText('Gathering a little inspiration…')).toBeInTheDocument();
    await screen.findByText('Paul Jarvis');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '  PAUL ' } });
    expect(screen.queryByText('Alejandro Escamilla')).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: /Add Paul/ }));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(['10']);
    unmount();
    render(<Gallery />);
    const saved = await screen.findByRole('button', { name: /Remove Paul/ });
    expect(saved).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(saved);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([]);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'no-match' } });
    expect(screen.getByText('No moments found.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear search', exact: true }));
    expect(screen.getByRole('searchbox')).toHaveValue('');
    expect(screen.getByRole('searchbox')).toHaveFocus();
    expect(screen.getByText('Alejandro Escamilla')).toBeInTheDocument();
  });

  it('shows a useful message for failed HTTP responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    render(<Gallery />);
    expect(await screen.findByRole('alert')).toHaveTextContent('could not load');
  });

  it('handles network failure and invalid API data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const first = renderHook(() => useFetchPhotos());
    await waitFor(() => expect(first.result.current.loading).toBe(false));
    expect(first.result.current.error).toBeTruthy();
    first.unmount();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ invalid: true }) }));
    const second = renderHook(() => useFetchPhotos());
    await waitFor(() => expect(second.result.current.error).toBeTruthy());
  });

  it('aborts in-flight fetches when unmounted', () => {
    let signal;
    vi.stubGlobal('fetch', vi.fn((url, options) => { signal = options.signal; return new Promise(() => {}); }));
    const { unmount } = renderHook(() => useFetchPhotos());
    unmount();
    expect(signal.aborted).toBe(true);
  });

  it('recovers from corrupt or unexpected saved favourites', () => {
    localStorage.setItem(STORAGE_KEY, '{broken');
    expect(readFavourites()).toEqual([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['10', '10', null, 2]));
    expect(readFavourites()).toEqual(['10']);
  });

  it('keeps the author and favourite control usable after an image fails', () => {
    const toggle = vi.fn();
    render(<PhotoCard photo={photos[0]} index={0} favourite={false} onToggle={toggle} />);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByText('Photograph unavailable')).toBeInTheDocument();
    expect(screen.getByText(photos[0].author)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(toggle).toHaveBeenCalledWith('0');
  });

  it('refreshes the gallery from the API error screen', () => {
    const reload = vi.fn();
    vi.stubGlobal('location', { reload });
    render(<GalleryState type="error" error="Connection failed" />);
    fireEvent.click(screen.getByRole('button', { name: 'Refresh gallery' }));
    expect(reload).toHaveBeenCalledOnce();
  });
});
