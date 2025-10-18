import { renderPage as renderPosts, attachPostHandlers, attachPostHandlersForm, attachCommentHandlers} from "./posts.mjs";
import { attachMusicSearchHandlers, attachMusicPlayHandlers } from "./music.mjs";
import { renderPage as renderQuote } from "./quotes.mjs";
import { loadPollNotifications } from "./polls.mjs";


export async function renderPage() {
    const [quoteHtml, postsHtml] = await Promise.all([
        renderQuote(),
        renderPosts()
    ]);

    const html = `
    <div id="home-quote" class="home-section">${quoteHtml}</div>
    <div id="feed">${postsHtml}</div>
  `;

    setTimeout(() => {
    attachPostHandlers();
    attachPostHandlersForm();
    attachCommentHandlers();
    attachMusicSearchHandlers();
    attachMusicPlayHandlers();
    }, 0);
    return html;
}
