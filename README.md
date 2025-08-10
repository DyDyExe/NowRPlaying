# SpotGlow

SpotGlow is a dynamic web app that displays your currently playing Spotify track with album art, title, and artist — all wrapped in a visually appealing “cowhide” color gradient background based on the album’s dominant colors.

---

## Features

- Secure OAuth authentication with Spotify  
- Real-time display of currently playing track info (album art, title, artist)  
- Smooth, dynamic “cowhide” gradient background based on 3 main colors from the album cover  
- Responsive design for all screen sizes  
- Simple Node.js backend and clean frontend (HTML/CSS/JS)  
- No lyrics display to keep it lightweight and focused

---

## Requirements

- Node.js (recommended v18+)  
- npm  
- Spotify Developer account (for CLIENT_ID & CLIENT_SECRET)  
- Git (optional, for version control and deployment)

---

## Installation

1. Clone the repo:  
```bash
git clone <your_git_repo>
cd spotify-nowplaying
```
2. Create a `.env` file in the root folder with your Spotify credentials:

```env
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
REDIRECT_URI=http://127.0.0.1:5000/callback
```

3. Install dependencies:

```bash
npm install
```

---

## Usage

1. Start the server:

```bash
npm start
```

2. Open your browser at:

```
http://localhost:5000/login
```

3. Log in with your Spotify account and authorize the app.

4. Enjoy your track info with a dynamic background matching your album cover colors!

---

## Project Structure

```
/spotify-nowplaying
│
├── server.js          # Node.js backend with Spotify API
├── package.json       # npm dependencies and scripts
├── .env               # Environment variables (not committed)
├── /public
│   ├── index.html     # Frontend HTML
│   ├── style.css      # CSS styling
│   └── script.js      # Frontend JavaScript
```

---

## Security & Best Practices

* **Do not commit your `.env` file** to version control (add it to `.gitignore`)
* Tokens are refreshed automatically in the backend
* Keep your CLIENT\_ID and CLIENT\_SECRET private

---

## Contact

- Discord: dydyexe
- Instagram: [@livelo.off](https://instagram.com/livelo.off)

