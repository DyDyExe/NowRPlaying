async function fetchNowPlaying() {
  try {
    const res = await fetch('/nowplaying');
    if (res.status === 401) {
      document.getElementById('notplaying').style.display = 'block';
      document.getElementById('cover').src = '';
      document.getElementById('title').textContent = '—';
      document.getElementById('artist').textContent = '—';
      return;
    }
    const data = await res.json();
    if (!data.playing) {
      document.getElementById('notplaying').style.display = 'block';
      return;
    }
    document.getElementById('notplaying').style.display = 'none';
    document.getElementById('cover').src = data.coverUrl || '';
    document.getElementById('title').textContent = data.title || '';
    document.getElementById('artist').textContent = data.artist || '';
    document.documentElement.style.setProperty('--bg1', data.color1);
    document.documentElement.style.setProperty('--bg2', data.color2);
    document.documentElement.style.setProperty('--bg3', data.color3);

  } catch (err) {
    console.error('fetch error', err);
  }
}

fetchNowPlaying();
setInterval(fetchNowPlaying, 15000);
