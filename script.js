const CLIENT_ID = "dd4674b86bc64cb1ae13ee1ea21a6cc7";
const REDIRECT_URI = "https://Zaphod141.github.io/spotify-dashboard/";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize?client_id=dd4674b86bc64cb1ae13ee1ea21a6cc7&redirect_uri=https://Zaphod141.github.io/spotify-dashboard/
&response_type=token&scope=user-read-currently-playing
";
const RESPONSE_TYPE = "token";
const SCOPE = "user-read-currently-playing";

document.getElementById("login-button").onclick = () => {
  window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
};

const hash = window.location.hash;
let token = window.localStorage.getItem("token");

if (!token && hash) {
  token = new URLSearchParams(hash.substring(1)).get("access_token");
  window.location.hash = "";
  window.localStorage.setItem("token", token);
}

if (token) {
  document.getElementById("login-button").style.display = "none";
  document.getElementById("song-info").style.display = "block";
  setInterval(updateNowPlaying, 5000);
  updateNowPlaying();
}

async function updateNowPlaying() {
  const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 204 || res.status > 400) {
    document.getElementById("title").innerText = "Nichts läuft gerade";
    document.getElementById("artist").innerText = "";
    document.getElementById("cover").style.display = "none";
    return;
  }

  const data = await res.json();
  document.getElementById("title").innerText = data.item.name;
  document.getElementById("artist").innerText = data.item.artists.map(a => a.name).join(", ");
  document.getElementById("cover").src = data.item.album.images[0].url;
  document.getElementById("cover").style.display = "block";
}
