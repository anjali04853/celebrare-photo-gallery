import { useEffect, useState } from 'react';

export const PHOTOS_URL = 'https://picsum.photos/v2/list?limit=30';

export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadPhotos() {
      try {
        const response = await fetch(PHOTOS_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const data = await response.json();
        if (!Array.isArray(data) || data.some(photo =>
          typeof photo.id !== 'string' || typeof photo.author !== 'string')) {
          throw new Error('Unexpected photo data');
        }
        if (active) setPhotos(data);
      } catch (err) {
        if (active && err.name !== 'AbortError') {
          setError('We could not load the photos. Check your connection and refresh to try again.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPhotos();
    return () => { active = false; controller.abort(); };
  }, []);

  return { photos, loading, error };
}
