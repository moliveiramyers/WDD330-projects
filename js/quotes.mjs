const scriptureFiles = [
  './data/book-of-mormon.json',
  './data/doctrine-and-covenants.json',
  './data/pearl-of-great-price.json',
  './data/new-testament.json',
  './data/old-testament.json'
];

async function loadScriptures() {
  // Fetch all files and parse JSON
  const promises = scriptureFiles.map(file =>
    fetch(file).then(res => {
      if (!res.ok) throw new Error(`Failed to load ${file}`);
      return res.json();
    })
  );
  const scripturesArrays = await Promise.all(promises);
  return scripturesArrays; // each one has a "books" array
}

async function getRandomVerse() {
  const allFiles = await loadScriptures();

  // Combine all books from all files
  const allBooks = allFiles.flatMap(file => file.books || []);
  const randomBook = allBooks[Math.floor(Math.random() * allBooks.length)];

  // Random chapter
  const randomChapter =
    randomBook.chapters[Math.floor(Math.random() * randomBook.chapters.length)];

  // Random verse
  const randomVerse =
    randomChapter.verses[Math.floor(Math.random() * randomChapter.verses.length)];

  // Return nicely formatted data
  return {
    text: randomVerse.text,
    reference: randomVerse.reference,
  };
}

export async function renderPage() {
  try {
    const randomVerse = await getRandomVerse();

    return `
      <section id="quote" class="quote-container">
          "${randomVerse.text}"
        </blockquote>
        <cite style="display:block; text-align:right; font-weight:bold; color:#555;">
          ${randomVerse.reference}
        </cite>
      </section>
    `;
  } catch (err) {
    console.error("Error loading quote:", err);
    return `<p style="color:red;">Unable to load scripture quote.</p>`;
  }
}
