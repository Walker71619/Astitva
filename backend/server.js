import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chatbot", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: "You are a personal reflection AI. Provide motivational and insightful reflections." },
          { role: "user", content: prompt }
        ]
      })
    });
    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "The mirror is silent… try again later." });
  }
});

app.listen(process.env.PORT || 5000, () => console.log("Server running"));
