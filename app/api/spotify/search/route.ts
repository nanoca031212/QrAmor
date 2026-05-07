import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) return NextResponse.json([]);

  const clientId = process.env.SPOTIFY_CLIENT_ID || '';
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';

  try {
    const authResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      },
      body: 'grant_type=client_credentials',
    });

    const authText = await authResponse.text();
    let authData;
    try {
      authData = JSON.parse(authText);
    } catch (e) {
      return NextResponse.json({ error: 'Auth failed', text: authText }, { status: 500 });
    }
    const token = authData.access_token;

    if (!token) {
      return NextResponse.json({ error: 'No token generated' }, { status: 500 });
    }

    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=5`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const searchText = await searchResponse.text();
    let searchData;
    try {
      searchData = JSON.parse(searchText);
    } catch (e) {
      if (searchText.includes('Active premium subscription required')) {
        return NextResponse.json({ error: 'PremiumRequired', message: 'Spotify requires the app owner to have an active Premium subscription.' }, { status: 403 });
      }
      return NextResponse.json({ error: 'Search failed', text: searchText }, { status: 500 });
    }
    return NextResponse.json(searchData.tracks?.items || []);
  } catch (error: any) {
    console.error("Spotify API error:", error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message, stack: error.stack }, { status: 500 });
  }
}
