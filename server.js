const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const records = {};

app.post("/record", (req, res) => {
  const content = req.body.content;
  if (!content) {
    return res.status(400).json({ error: "No content" });
  }

  const hash = crypto.createHash("sha256").update(content).digest("hex");
  const time = new Date().toISOString();
  const id = crypto.randomBytes(4).toString("hex");

  records[id] = { hash, time };

  res.json({ id, hash, time });
});

app.get("/c/:id", (req, res) => {
  const r = records[req.params.id];
  if (!r) return res.status(404).send("Not found");

  res.send(`
    <h2>Fact recorded</h2>
    <p><b>Time:</b> ${r.time}</p>
    <p><b>Hash:</b> ${r.hash}</p>
    <p>This page confirms only the fact of recording. Not a legal proof.</p>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
