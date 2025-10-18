import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";


// Minimal MD5 function - Gravatar
function md5(str) {
  const utf8 = new TextEncoder().encode(str);
  return crypto.subtle.digest("MD5", utf8).then(hashBuffer => {
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  });
}

const firebaseConfig = {
  apiKey: "AIzaSyBnIG0xDBgaJq80u_OuLIAKKPrxs9eOmgQ",
  authDomain: "ja-povoa-de-varzim.firebaseapp.com",
  projectId: "ja-povoa-de-varzim",
  storageBucket: "ja-povoa-de-varzim.firebasestorage.app",
  messagingSenderId: "398713857691",
  appId: "1:398713857691:web:771f73aef23645c85e083e",
  measurementId: "G-RTRE53XNCN"
};
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
// };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userName = document.getElementById("user-name");
const userAvatar = document.getElementById("user-avatar");

// login
export async function login() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await saveUser(user);
  } catch (err) {
    console.error("Login error:", err);
  }
}

// logout
export async function logout() {
  try {
    await signOut(auth);
    localStorage.removeItem("user");
    showGuest();

  } catch (err) {
    console.error("Logout error:", err);
  }
}

// observe user
export function observeUser() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await saveUser(user);
      showUser(user);
    } else {
      showGuest();
    }
  });
}

// save user locally
async function saveUser(user) {
  let photoURL = user.photoURL;
  if (!photoURL && user.email) {
    const hash = await md5(user.email.trim().toLowerCase());
    photoURL = `https://www.gravatar.com/avatar/${hash}?s=100&d=identicon`;
  }
  const storeUser = {
    displayName: user.displayName,
    email: user.email,
    photoURL,
  };

  localStorage.setItem("user", JSON.stringify(storeUser))
  showUser(storeUser);
}

// restore from localStorage
export function restoreUser() {
  const stored = localStorage.getItem("user");
  if (stored) {
    showUser(JSON.parse(stored));
  }
  else {
    showGuest();
  }
}

// UI helpers
function showUser(user) {
  loginBtn.style.display = "none";
  logoutBtn.style.display = "inline-block";
  userName.textContent = user.displayName;
  userAvatar.src = user.photoURL || "account-icon.png";
}

function showGuest() {
  loginBtn.style.display = "inline-block";
  logoutBtn.style.display = "none";
  userName.textContent = "Guest";
  userAvatar.src = "account-icon.png";
}
