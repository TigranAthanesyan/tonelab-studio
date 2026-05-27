/**
 * YouTube URL helpers: extract video ID and fetch oEmbed metadata.
 * No API key required.
 */

export function extractYoutubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Patterns covered:
  //  - https://www.youtube.com/watch?v=ID
  //  - https://youtube.com/watch?v=ID&...
  //  - https://m.youtube.com/watch?v=ID
  //  - https://youtu.be/ID
  //  - https://www.youtube.com/embed/ID
  //  - https://www.youtube.com/shorts/ID
  //  - https://www.youtube.com/v/ID
  const patterns: RegExp[] = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const re of patterns) {
    const match = trimmed.match(re);
    if (match && match[1]) return match[1];
  }

  // Fallback: a bare 11-character ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  return null;
}

export interface YoutubeOEmbed {
  title: string;
  thumbnailUrl: string;
}

export async function fetchYoutubeOEmbed(videoUrl: string): Promise<YoutubeOEmbed> {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
  const res = await fetch(endpoint, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(
      `Unable to fetch YouTube metadata (status ${res.status}). The video may be private, deleted, or restricted.`
    );
  }

  const data = (await res.json()) as { title?: string; thumbnail_url?: string };

  if (!data.title || !data.thumbnail_url) {
    throw new Error('YouTube response missing title or thumbnail.');
  }

  return {
    title: data.title,
    thumbnailUrl: data.thumbnail_url
  };
}
