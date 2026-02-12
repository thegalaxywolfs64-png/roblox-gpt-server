const express = require("express");

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
    try {
        if (!req.body.message) {
            return res.status(400).json({ error: "No message provided" });
        }

        const userMessage = req.body.message;

        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await openaiResponse.json();

        if (!data.choices) {
            console.error("OpenAI Error:", data);
            return res.status(500).json({ error: "OpenAI failed", details: data });
        }

        const reply = data.choices[0].message.content;

        res.json({ reply: reply });

    } catch (error) {
        console.error("Server crash:", error);
        res.status(500).json({ error: "Server crashed" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running");
});
