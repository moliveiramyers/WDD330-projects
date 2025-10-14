
import { renderPage as renderPosts } from "./posts.mjs";
import { renderPage as renderQuote } from "./quotes.mjs";

export async function renderPage() {
    const [pollsHtml, postsHtml, quoteHtml] = await Promise.all([
        renderQuote(),
        renderPosts()
    ]);

    return `
    <div id="home-posts" class="home-section">${postsHtml}</div>
    <div id="home-quote" class="home-section">${quoteHtml}</div>
  `;
}