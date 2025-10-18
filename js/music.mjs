let currentAudio = null;

// Search Deezer via your proxy server
export async function searchMusic(query) {
    if (!query) return [];
    try {
        const res = await fetch(`http://localhost:3000/api/deezer/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        const json = await res.json();
        return json.tracks || [];
    } catch (err) {
        console.error("Music search error:", err);
        return [];
    }
}

// Render search results
export function renderMusicResults(tracks) {
    return tracks.map(t => `
    <div class="music-result" data-preview="${t.preview}">
      <img src="${t.cover}" class="music-cover" />
      <div class="music-info">
        <strong>${escapeHtml(t.title)}</strong><br>
        <small>${escapeHtml(t.artist)}</small>
      </div>
      <button class="select-music-btn" data-preview="${t.preview}">Select</button>
    </div>
  `).join("");
}

// Attach handlers for the music search input
export function attachMusicSearchHandlers() {
    const searchInput = document.getElementById("post-music-search");
    const resultsContainer = document.getElementById("music-search-results");
    const hiddenInput = document.getElementById("post-music");

    if (!searchInput || !resultsContainer || !hiddenInput) return;

    let timer = null;
    searchInput.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
            const q = searchInput.value.trim();
            if (!q) {
                resultsContainer.innerHTML = "";
                return;
            }

            resultsContainer.innerHTML = `<div class="loading">Searching…</div>`;
            const tracks = await searchMusic(q);
            resultsContainer.innerHTML = renderMusicResults(tracks);

            // Attach select buttons
            resultsContainer.querySelectorAll(".select-music-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const preview = btn.dataset.preview;
                    hiddenInput.value = preview;
                    searchInput.value = btn.previousElementSibling.querySelector("strong")?.textContent || "";
                    resultsContainer.innerHTML = `<div class="selected">Selected</div>`;
                });
            });
        }, 350);
    });
}

// Attach handlers to play music previews
export function attachMusicPlayHandlers() {
    document.querySelectorAll(".play-music-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const audioUrl = btn.dataset.music;
            if (!audioUrl) return;

            if (currentAudio && currentAudio.src === audioUrl) {
                currentAudio.paused ? currentAudio.play() : currentAudio.pause();
            } else {
                if (currentAudio) currentAudio.pause();
                currentAudio = new Audio(audioUrl);
                currentAudio.play();
            }

            // Update UI
            document.querySelectorAll(".play-music-btn").forEach(b => b.classList.remove("playing"));
            btn.classList.toggle("playing", !(currentAudio && currentAudio.paused));
            currentAudio.onpause = () => btn.classList.remove("playing");
            currentAudio.onended = () => btn.classList.remove("playing");
        });
    });
}

// Escape HTML to prevent XSS
function escapeHtml(s = "") {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
