const express = require("express");

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
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

        const data = await response.json();
        const reply = data.choices[0].message.content;

        res.send(reply);

    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running");
});
