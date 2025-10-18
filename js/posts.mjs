import { attachMusicSearchHandlers, attachMusicPlayHandlers } from "./music.mjs";




export let posts = [];


export async function renderPage() {
    const saved = JSON.parse(localStorage.getItem("posts") || "[]");
    posts = saved.length ? saved : await fetchPosts();


    const postsHtml = posts.map((p, index) => `
    <article class="feed-card">
      <div class="feed-header">
        <img src="${p.userAvatar}" alt="avatar" class="avatar" />
        <div>
          <strong>${p.userName}</strong><br>
          <small>${new Date(p.date).toLocaleString()}</small>
        </div>
      </div>
      <p>${p.text}</p>
      ${p.musicPreview ? `
        <div class="feed-image-wrapper">
            <img src="${p.imageUrl || 'https://via.placeholder.com/500'}" class="feed-image" />
            <button class="play-music-btn overlay-btn" data-music="${p.musicPreview}">▶</button>
        </div>
        ` : (p.imageUrl ? `<img src="${p.imageUrl}" class="feed-image" />` : "")}


      <div class="comments">
        ${p.comments.map(c => `
          <div class="comment">
            <img src="${c.userAvatar || 'account-icon.png'}" class="comment-avatar" />
            <div class="comment-body">
              <strong>${c.user}</strong>: ${c.text}
            </div>
          </div>
        `).join("")}
      </div>


      <div class="comment-form">
        <input type="text" placeholder="Write a comment..." data-index="${index}" class="comment-input"/>
        <button class="add-comment-btn" data-index="${index}">Comment</button>
      </div>
    </article>
  `).join("");


    const html = `
    <h2>Community Feed</h2>
    ${renderCreatePostForm()}
    ${postsHtml || "<p>No posts yet.</p>"}
  `;


    // wait for DOM update
    setTimeout(initFeedHandlers, 0);


    return html;
}


function initFeedHandlers() {
    attachPostHandlers();
    attachPostHandlersForm();
    attachCommentHandlers();
    attachMusicSearchHandlers();
    attachMusicPlayHandlers();
}



// CREATE POST
export function attachPostHandlers() {
    const createForm = document.getElementById("create-post-form");
    if (!createForm) return;
    createForm.addEventListener("submit", handlePostSubmit);
}


function handlePostSubmit(e) {
    e.preventDefault();


    // TEXT, MUSIC & IMAGE UPLOAD DOM
    const text = document.getElementById("post-text").value.trim();
    const musicPreview = document.getElementById("post-music").value.trim();
    const fileInput = document.getElementById("post-image-file");


    if (!text) return alert("Post cannot be empty!");


    const user = JSON.parse(localStorage.getItem("user")) || { displayName: "Guest", photoURL: "account-icon.png" };


    // POST ELEMENTS
    const newPost = {
        id: Date.now().toString(),
        userName: user.displayName,
        userAvatar: user.photoURL,
        text,
        imageUrl: "",
        musicPreview,
        comments: [],
        date: new Date().toISOString()
    };


    // ATTACHING POST TO FEED
    const addPostToFeed = () => {
        posts.unshift(newPost);
        savePosts();
        refreshFeed();
    };




    if (fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
            newPost.imageUrl = reader.result;
            addPostToFeed();
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        addPostToFeed();
    }


    newPost.musicPreview = musicPreview || "";


    e.target.reset();


}


function savePosts() {
    localStorage.setItem("posts", JSON.stringify(posts));
}


// SHOW/HIDE CREATE POST FORM
export function attachPostHandlersForm() {
    // ADD POST, SUBMIT POST & CANCEL FORM DOM
    const newPostBtn = document.getElementById("new-post-btn");
    const createForm = document.getElementById("create-post-form");
    const cancelBtn = document.getElementById("cancel-post-btn");


    if (!newPostBtn || !createForm || !cancelBtn) return;


    newPostBtn.addEventListener("click", () => {
        createForm.style.display = "block";
        newPostBtn.style.display = "none";
    });


    cancelBtn.addEventListener("click", () => {
        createForm.style.display = "none";
        newPostBtn.style.display = "inline-block";
        createForm.reset();
    });
}




// COMMENTS
export function attachCommentHandlers() {
    document.querySelectorAll(".add-comment-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            const input = document.querySelector(`.comment-input[data-index="${index}"]`);
            const text = input.value.trim();
            if (!text) return;


            const user = JSON.parse(localStorage.getItem("user")) || { displayName: "Guest", photoURL: "account-icon.png" };
            posts[index].comments.push({ user: user.displayName, userAvatar: user.photoURL, text });
            savePosts();
            refreshFeed();
        });
    });
}




// CREATE POST FORM TEMPLATE
export function renderCreatePostForm() {
    return `
    <div id="new-post-wrapper">
      <button id="new-post-btn" class="primary-btn">Add New Post</button>
    <form id="create-post-form" style="display:none;">
        <textarea id="post-text" placeholder="What's on your mind?" required></textarea>
        <input type="file" id="post-image-file" accept="image/*" />


        <!-- Music search -->
        <input id="post-music-search" type="text" placeholder="Search music..." />
        <div id="music-search-results"></div>
        <input type="hidden" id="post-music" />


        <div class="form-actions">
            <button type="submit" class="primary-btn">Post</button>
            <button type="button" id="cancel-post-btn" class="secondary-btn">Cancel</button>
        </div>
    </form>
    </form>
    </div>
  `;
}




export async function fetchPosts() {
    const sample = [
        {
            id: "1",
            userName: "Alice Johnson",
            userAvatar: "https://www.gravatar.com/avatar?d=identicon",
            text: "Loved today’s activity at the park 🌳",
            imageUrl: "https://picsum.photos/500/300?random=1",
            musicPreview: "",
            comments: [
                { user: "Bob", userAvatar: "account-icon.png", text: "Looks awesome!" },
                { user: "Clara", userAvatar: "account-icon.png", text: "Wish I could be there!" }
            ],
            date: "2025-10-15T08:30:00Z"
        },
        {
            id: "2",
            userName: "John Smith",
            userAvatar: "https://www.gravatar.com/avatar?d=monsterid",
            text: "Can’t stop listening to this hymn ❤️",
            imageUrl: "",
            musicPreview: "https://cdns-preview-6.dzcdn.net/stream/c-6.mp3",
            comments: [{ user: "Sara", userAvatar: "account-icon.png", text: "Beautiful message." }],
            date: "2025-10-14T10:00:00Z"
        }
    ];


    return sample.map(p => ({
        ...p,
        userAvatar: p.userAvatar || 'account-icon.png',
        comments: p.comments.map(c => ({ ...c, userAvatar: c.userAvatar || 'account-icon.png' }))
    }));
}


function refreshFeed() {
    const feed = document.getElementById("feed");
    if (!feed) return;
    renderPage().then(html => feed.innerHTML = html);

    renderPage().then(html => {
        feed.innerHTML = html;
        initFeedHandlers(); 
    });
    document.querySelectorAll(".play-music-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const url = btn.dataset.music;
            const audio = new Audio(url);
            audio.play();
        });
    });


}


