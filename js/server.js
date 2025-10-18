import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Proxy server running");
});

app.get("/api/deezer/search", async (req, res) => {
  const q = req.query.q || "";
  if (!q) return res.status(400).json({ error: "Missing q" });

  try {
    const url = `https://api.deezer.com/search?q=${encodeURIComponent(q)}`;
    const r = await fetch(url);
    const data = await r.json();
    const tracks = (data.data || []).map(t => ({
      id: t.id,
      title: t.title,
      artist: t.artist?.name,
      preview: t.preview,
      cover: t.album?.cover_medium
    }));
    res.json({ tracks });
  } catch (err) {
    console.error("Deezer proxy error:", err);
    res.status(500).json({ error: "proxy error" });
  }
});

app.get("/api/deezer/preview", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing url");
  try {
    const r = await fetch(url);
    res.set("Content-Type", r.headers.get("content-type") || "audio/mpeg");
    r.body.pipe(res);
  } catch (err) {
    console.error("Preview proxy error:", err);
    res.status(500).send("preview proxy error");
  }
});

app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`));
