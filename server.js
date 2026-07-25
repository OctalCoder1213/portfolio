require("dotenv").config();
const { Resend } = require("resend");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/contact", async (req, res) => {

    const { name, email, message } = req.body;

    try {

        await resend.emails.send({

            from: "Portfolio <onboarding@resend.dev>",
            to: "kini.arnav@gmail.com",
            subject: `New Portfolio Message from ${name}`,

            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });
        res.json({
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false
        });
    }
});
app.get("/visitors", (req, res) => {

    fs.readFile("visitors.txt", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                error: "Couldn't read visitor count."
            });
        }
        res.json({
            visitors: Number(data)
        });
    });
});app.post("/visit", (req, res) => {

    fs.readFile("visitors.txt", "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                error: "Couldn't read visitor count."
            });
        }

        let visitors = Number(data);
        visitors++;
        fs.writeFile("visitors.txt", visitors.toString(), (err) => {

            if (err) {
                return res.status(500).json({
                    error: "Couldn't update visitor count."
                });
            }
            res.json({
                success: true
            });

        });

    });

});
app.get("/stock", async (req, res) => {

    try {
        const response = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${process.env.FINNHUB_API_KEY}`
        );
        res.json(response.data);
    } 
    catch (error) {
    console.error(error.message);

    res.status(500).json({
        error: "Failed to fetch stock price."
    });
}
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
/*const resend = new Resend(process.env.RESEND_API_KEY);*/