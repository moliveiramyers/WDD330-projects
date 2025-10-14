// posts.mjs
export async function renderPage() {

  try {
    // Example Cloudinary API fetch (replace with your actual endpoint)
    const cloudinaryRes = await fetch("YOUR_CLOUDINARY_ENDPOINT");
    const cloudinaryData = await response.json();

    const postsHtml = cloudinaryData.resources.slice(0, 6).map(post => `
      <div class="post-card">
        <img src="${post.url}" alt="${post.public_id}" />
        <audio controls>
          <source src="https://api.deezer.com/track/123456789/preview" type="audio/mpeg">
        </audio>
      </div>
    `).join("");
  } catch (err) {
    postsHtml = "<p>Could not fetch posts.</p>";
    console.error(err);
  }

  return postsHtml;
}
