import { NextResponse } from 'next/server';

// Converts ISO 8601 duration (PT3M45S) to total seconds
function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] || '0');
  const m = parseInt(match[2] || '0');
  const s = parseInt(match[3] || '0');
  return h * 3600 + m * 60 + s;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) return NextResponse.json([]);

  const apiKey = process.env.YOUTUBE_API_KEY || '';

  try {
    // Step 1: Search for videos
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=5&q=${encodeURIComponent(q)}&key=${apiKey}`
    );
    const searchData = await searchResponse.json();

    if (searchData.error) {
      return NextResponse.json({ error: 'YouTube API Error', details: searchData.error }, { status: 500 });
    }

    const videoIds = searchData.items?.map((item: any) => item.id.videoId).join(',') || '';

    // Step 2: Fetch durations for all found videos
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`
    );
    const detailsData = await detailsResponse.json();

    // Build duration map: videoId -> seconds
    const durationMap: Record<string, number> = {};
    for (const item of detailsData.items || []) {
      durationMap[item.id] = parseDuration(item.contentDetails.duration);
    }

    const items = searchData.items?.map((item: any) => {
      let title = item.snippet.title;
      title = title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

      return {
        id: item.id.videoId,
        name: title,
        artist: item.snippet.channelTitle.replace(/ - Topic$/, ''),
        albumArt: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        previewUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        duration: durationMap[item.id.videoId] || 0,
      };
    }) || [];

    return NextResponse.json(items);
  } catch (error: any) {
    console.error("YouTube API error:", error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
