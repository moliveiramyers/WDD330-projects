import { posts } from "./posts.mjs";

export async function renderPage() {

  const allPosts = posts.filter(p => p.imageUrl);

  const html = `
    <section class="gallery-grid">
      ${allPosts
      .filter(p => p.imageUrl)
      .map(p => `
          <div class="gallery-item" data-post-id="${p.id}">
            <img src="${p.imageUrl || './data/placeholder.png'}" alt="Post by ${p.userName}" />
          </div>
        `).join("")}
    </section>
    <div id="gallery-modal" class="modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div id="modal-post"></div>
      </div>
    </div>
  `;


  setTimeout(() => {
    const modal = document.getElementById("gallery-modal");
    const modalPost = document.getElementById("modal-post");
    const closeModal = modal.querySelector(".close-modal");

    document.querySelectorAll(".gallery-item").forEach(item => {
      item.addEventListener("click", () => {
        const postId = item.dataset.postId;
        const post = allPosts.find(p => p.id === postId);
        if (!post) return;

        modalPost.innerHTML = `
          <article class="feed-card">
            <div class="feed-header">
              <img src="${post.userAvatar}" alt="avatar" class="avatar" />
              <div>
                <strong>${post.userName}</strong><br>
                <small>${new Date(post.date).toLocaleString()}</small>
              </div>
            </div>
            <p>${post.text}</p>
            ${post.imageUrl ? `<img src="${post.imageUrl}" class="feed-image" />` : ""}
          </article>
        `;

        modal.style.display = "flex";
      });
    });

    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }, 0);

  return html;
}
