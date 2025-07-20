const songs = [
  {
    title: "Feather",
    artist: "Sabrina Carpenter",
    image: "sabrina.jpg",
    file: "Feather .mp3"
  },
  {
    title: "Lover",
    artist: "Taylor Swift",
    image: "taylor.jpg",
    file: "Lover by taylor.mp3"
  },
  {
    title: "Fakira",
    artist: "Sanam Puri, Neeti Mohan, Vishal Shekhar",
    image: "fakira.jpg",
    file: "Fakira.mp3"
  },
  {
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    image: "found.jpg",
    file: "found.mp3"
  },
  {
    title: "Mann Mera",
    artist: "Gajendra Verma",
    image: "mann mera.jpg",
    file: "Mann Mera.mp3"
  }
];

const topPicks = [
  {
    title: "I Think They Call This Love",
    artist: "Elliot James Reay",
    image: "love.jpg",
    file: "I Think They Call This Love.mp3"
  },
  {
    title: "Pehli Baar",
    artist: "Ajay Atul",
    image: "pehli baar.jpg",
    file: "Pehli Baar.mp3"
  },
  {
    title: "The Winner Takes It All",
    artist: "ABBA",
    image: "winner.jpg",
    file: "The Winner Takes It All.mp3"
  }
];

// Save to localStorage
localStorage.setItem("allSongs", JSON.stringify([...songs, ...topPicks]));

// Load sections
function loadSection(sectionId, songList) {
  const section = document.getElementById(sectionId);
  section.innerHTML = ""; // clear first
  songList.forEach(song => {
    const card = document.createElement("div");
    card.className = "song-card";
    card.innerHTML = `
      <img src="${song.image}" alt="${song.title}">
      <h4>${song.title}</h4>
      <p>${song.artist}</p>
    `;
    card.addEventListener("click", () => {
      localStorage.setItem("currentSong", JSON.stringify(song));
      window.location.href = "player.html";
    });
    section.appendChild(card);
  });
}

const recent = JSON.parse(localStorage.getItem("recentSongs")) || [];

loadSection("recommended", songs);
loadSection("topPicks", topPicks);
loadSection("recent", recent);

// SEARCH FUNCTIONALITY
const searchInput = document.getElementById("search");
const noResults = document.getElementById("noResults");
const allSections = document.querySelectorAll(".music-section");

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  let matchFound = false;

  document.querySelectorAll(".song-card").forEach(card => {
    const text = card.innerText.toLowerCase();
    const match = text.includes(keyword);
    card.style.display = match ? "block" : "none";
    if (match) matchFound = true;
  });

  noResults.style.display = matchFound ? "none" : "block";

  allSections.forEach(section => {
    section.style.display = matchFound ? "block" : "none";
  });
});


// =====================
// LOGIN / SIGNUP MODAL
// =====================

const loginBtn = document.getElementById("loginBtn");
const authModal = document.getElementById("authModal");
const closeModal = document.querySelector(".close");
const authTitle = document.getElementById("authTitle");
const authUsername = document.getElementById("authUsername");
const authPassword = document.getElementById("authPassword");
const authSubmit = document.getElementById("authSubmit");
const toggleAuth = document.getElementById("toggleAuth");

let isLoginMode = true;

// Update Login button
function updateLoginState() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  loginBtn.textContent = loggedInUser ? "Logout" : "Login";
}

// Open modal
function openModal(mode) {
  isLoginMode = mode === "login";
  authTitle.textContent = isLoginMode ? "Login" : "Sign Up";
  authSubmit.textContent = isLoginMode ? "Login" : "Sign Up";
  toggleAuth.innerHTML = isLoginMode
    ? `Don't have an account? <span class="switch-mode">Sign Up</span>`
    : `Already have an account? <span class="switch-mode">Login</span>`;
  authModal.style.display = "flex";
  authUsername.value = "";
  authPassword.value = "";

  // Reattach toggle
  document.querySelector(".switch-mode").addEventListener("click", () => {
    openModal(isLoginMode ? "signup" : "login");
  });
}

loginBtn.addEventListener("click", () => {
  const currentUser = localStorage.getItem("loggedInUser");
  if (currentUser) {
    localStorage.removeItem("loggedInUser");
    updateLoginState();
  } else {
    openModal("login");
  }
});

closeModal.addEventListener("click", () => {
  authModal.style.display = "none";
});

authSubmit.addEventListener("click", () => {
  const username = authUsername.value.trim();
  const password = authPassword.value.trim();

  if (!username || !password) {
    alert("Please enter both fields.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (isLoginMode) {
    if (users[username] && users[username] === password) {
      localStorage.setItem("loggedInUser", username);
      updateLoginState();
      authModal.style.display = "none";
    } else {
      alert("Incorrect credentials or account doesn't exist.");
    }
  } else {
    if (users[username]) {
      alert("Username already exists.");
    } else {
      users[username] = password;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedInUser", username);
      updateLoginState();
      authModal.style.display = "none";
    }
  }
});

updateLoginState();
