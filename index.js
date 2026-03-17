import express from "express";
import fetch from "node-fetch";
import https from "https";

const app = express();

// Create an HTTPS agent that ignores certificate errors
const agent = new https.Agent({
  rejectUnauthorized: false
});

app.get("/", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing ?url=");

  try {
    const response = await fetch(target, { agent });
    const body = await response.text();

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "*");
    res.set("Content-Type", response.headers.get("content-type") || "text/plain");

    res.send(body);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

app.listen(3000, () => console.log("CORS proxy running on Render"));
