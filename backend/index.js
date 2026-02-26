const express = require("express");
const cors = require("cors");
const path = require("path");
const documents = require("./data/documents.json");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// API документов
app.get("/api/documents/:service", (req, res) => {
  const service = req.params.service;
  res.json(documents[service] || []);
});

// API подписки (mock)
app.get("/api/subscription/:userId/:service", (req, res) => {
  const paidUntil = null;
  res.json({ paidUntil });
});

// API оплаты (mock)
app.post("/api/pay/:userId/:service", (req, res) => {
  const paidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  res.json({ success: true, paidUntil });
});

// Раздача статических файлов фронтенда
app.use(express.static(path.join(__dirname, ".")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));