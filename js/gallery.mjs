import { fetchPosts } from "./posts.mjs";

function escapeHtml(s = "") {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

export async function renderPage() {
  const saved = JSON.parse(localStorage.getItem("posts") || "[]");
  const allPosts = saved.length ? saved : await fetchPosts();

  const imagePosts = allPosts.filter(p => p.imageUrl);

  const html = `
    <section class="gallery-grid">
      ${imagePosts.length ? imagePosts.map(p => `
        <div class="gallery-item" data-post-id="${p.id}">
          <img src="${p.imageUrl || './data/placeholder.png'}" alt="Post by ${escapeHtml(p.userName || '')}" />
        </div>
      `).join("") : `
        <div class="no-images">No images to display.</div>
      `}
    </section>

    <div id="gallery-modal" class="modal" style="display:none;">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div id="modal-post"></div>
      </div>
    </div>
  `;

  // Attach event handlers after render
  setTimeout(() => {
    const modal = document.getElementById("gallery-modal");
    const modalPost = document.getElementById("modal-post");
    const closeModal = modal ? modal.querySelector(".close-modal") : null;

    if (!modal || !modalPost) return;

    document.querySelectorAll(".gallery-item").forEach(item => {
      item.addEventListener("click", () => {
        const postId = item.dataset.postId;
        const post = imagePosts.find(p => String(p.id) === String(postId));
        if (!post) return;

        modalPost.innerHTML = `
          <article class="feed-card">
            <div class="feed-header">
              <img src="${post.userAvatar || 'account-icon.png'}" alt="avatar" class="avatar" />
              <div>
                <strong>${escapeHtml(post.userName || 'Anonymous')}</strong><br>
                <small>${new Date(post.date).toLocaleString()}</small>
              </div>
            </div>
            <p>${escapeHtml(post.text || '')}</p>
            ${post.imageUrl ? `<img src="${post.imageUrl}" class="feed-image" />` : ""}
            <div class="comments">
              ${Array.isArray(post.comments) ? post.comments.map(c => `
                <div class="comment">
                  <img src="${c.userAvatar || 'account-icon.png'}" class="comment-avatar" />
                  <div class="comment-body">
                    <strong>${escapeHtml(c.user || '')}</strong>: ${escapeHtml(c.text || '')}
                  </div>
                </div>
              `).join("") : ""}
            </div>
          </article>
        `;

        modal.style.display = "flex";
      });
    });

    if (closeModal) closeModal.addEventListener("click", () => modal.style.display = "none");
    modal.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });
  }, 0);

  return html;
}
