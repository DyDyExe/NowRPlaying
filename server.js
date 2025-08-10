// server.js
require('dotenv').config();

const express = require('express');
const Vibrant = require('node-vibrant');
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  console.error('Mets bien tes variables CLIENT_ID, CLIENT_SECRET et REDIRECT_URI dans le fichier .env');
  process.exit(1);
}

const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});

let tokenData = {
  accessToken: null,
  refreshToken: null,
  expiresAt: 0,
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
  const scopes = ['user-read-currently-playing', 'user-read-playback-state'];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'state-nowplaying');
  res.redirect(authorizeURL);
});

app.get('/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.status(400).send('Auth error: ' + error);
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;
    tokenData.accessToken = access_token;
    tokenData.refreshToken = refresh_token;
    tokenData.expiresAt = Date.now() + expires_in * 1000 - 5000;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    console.log('Authed to Spotify, tokens saved.');
    res.redirect('/');
  } catch (err) {
    console.error('Callback error', err);
    res.status(500).send('Erreur lors de l\'authentification.');
  }
});

async function ensureToken() {
  if (!tokenData.accessToken) throw new Error('Not authenticated: go to /login');
  if (Date.now() > tokenData.expiresAt) {
    try {
      const data = await spotifyApi.refreshAccessToken();
      const { access_token, expires_in } = data.body;
      tokenData.accessToken = access_token;
      tokenData.expiresAt = Date.now() + expires_in * 1000 - 5000;
      spotifyApi.setAccessToken(access_token);
      console.log('Token rafraîchi.');
    } catch (err) {
      console.error('Erreur refresh token', err);
      throw err;
    }
  }
}

app.get('/nowplaying', async (req, res) => {
  try {
    await ensureToken();
    const data = await spotifyApi.getMyCurrentPlaybackState();
    if (!data.body || !data.body.item) {
      return res.json({ playing: false });
    }

    const track = data.body.item;
    const title = track.name;
    const artists = track.artists.map(a => a.name).join(', ');
    const images = track.album.images || [];
    const coverUrl = images.length ? images[0].url : null;

    let color1 = '#111111', color2 = '#333333', color3 = '#555555';
    if (coverUrl) {
      try {
        const palette = await Vibrant.from(coverUrl).getPalette();
        color1 = (palette.Vibrant && palette.Vibrant.hex) || color1;
        color2 = (palette.Muted && palette.Muted.hex) || color2;
        color3 = (palette.DarkVibrant && palette.DarkVibrant.hex) || color3;
      } catch (err) {
        console.warn('Vibrant error', err);
      }
    }

    res.json({
      playing: true,
      title,
      artist: artists,
      coverUrl,
      color1,
      color2,
      color3,
    });

  } catch (err) {
    console.error(err);
    if (err.message && err.message.includes('Not authenticated')) {
      return res.status(401).json({ error: 'not_authenticated' });
    }
    res.status(500).json({ error: 'server_error' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré -> http://localhost:${PORT}`);
  console.log('Va sur http://localhost:5000/login pour t\'authentifier à Spotify');
});
