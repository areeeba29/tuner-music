const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const audio = document.getElementById("audio");
const playPause = document.getElementById("playPause");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const backBtn = document.getElementById("backBtn");
const shuffleBtn = document.getElementById("shuffle");
const loopBtn = document.getElementById("loop");

let isShuffle = false;
let isLoop = false;
let isPlaying = false;

let currentSong = JSON.parse(localStorage.getItem("currentSong"));
let songList = JSON.parse(localStorage.getItem("allSongs")) || [];
let currentIndex = songList.findIndex(s => s.title === currentSong.title);

// Save current song to recent
function saveToRecent(song) {
  let recent = JSON.parse(localStorage.getItem("recentSongs")) || [];
  recent = recent.filter(s => s.title !== song.title);
  recent.unshift(song);
  if (recent.length > 5) recent.pop();
  localStorage.setItem("recentSongs", JSON.stringify(recent));
}

// Load and show song
function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.image;
  audio.src = song.file;
  playPause.textContent = "▶️";
  isPlaying = false;
}

// Initial load
loadSong(currentSong);
saveToRecent(currentSong);

// ▶️ Play / Pause
playPause.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    playPause.textContent = "▶️";
  } else {
    audio.play();
    playPause.textContent = "⏸️";
    saveToRecent(currentSong);
  }
  isPlaying = !isPlaying;
});

// 🎚 Volume control
volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

// 📈 Progress bar
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
});

// ⏩ Seek
progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// ⏭ Next song
document.getElementById("next").addEventListener("click", () => {
  nextSong();
});

// ⏮ Previous song
document.getElementById("prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + songList.length) % songList.length;
  currentSong = songList[currentIndex];
  localStorage.setItem("currentSong", JSON.stringify(currentSong));
  loadSong(currentSong);
  audio.play();
  isPlaying = true;
  playPause.textContent = "⏸️";
  saveToRecent(currentSong);
});

// 🔙 Back to home
backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

// 🔀 Shuffle toggle
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.opacity = isShuffle ? 1 : 0.5;
});

// 🔁 Loop toggle
loopBtn.addEventListener("click", () => {
  isLoop = !isLoop;
  loopBtn.style.opacity = isLoop ? 1 : 0.5;
});

// 🔄 Auto next / loop / shuffle when song ends
audio.addEventListener("ended", () => {
  if (isLoop) {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextSong();
  }
});

// 🎵 Helper: Go to next song
function nextSong() {
  if (isShuffle) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * songList.length);
    } while (newIndex === currentIndex && songList.length > 1);
    currentIndex = newIndex;
  } else {
    currentIndex = (currentIndex + 1) % songList.length;
  }

  currentSong = songList[currentIndex];
  localStorage.setItem("currentSong", JSON.stringify(currentSong));
  loadSong(currentSong);
  audio.play();
  isPlaying = true;
  playPause.textContent = "⏸️";
  saveToRecent(currentSong);
}
