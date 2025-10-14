export async function renderPage() {
  try {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();

    return `
      <h2>Quote of the Day</h2>
      <blockquote>
        "${data.content}" — <em>${data.author}</em>
      </blockquote>
    `;
  } catch (err) {
    console.error(err);
    return `
      <h2>Quote of the Day</h2>
      <p>“Stay positive, keep learning!” — LifeHub</p>
    `;
  }
}
