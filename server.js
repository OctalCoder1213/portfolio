require("dotenv").config();
const { Resend } = require("resend");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();
const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;
const VISITORS_FILE = path.join(__dirname, "visitors.txt");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Ensure visitors file exists
if (!fs.existsSync(VISITORS_FILE)) {
    fs.writeFileSync(VISITORS_FILE, "1420", "utf8");
}

app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: "Missing required fields." });
    }

    try {
        if (resend) {
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
        } else {
            console.log(`[Contact Form Received] Name: ${name}, Email: ${email}, Message: ${message}`);
        }
        res.json({ success: true });
    } catch (error) {
        console.error("Resend Email Error:", error.message);
        res.status(500).json({ success: false, error: "Failed to send email message." });
    }
});

app.get("/visitors", (req, res) => {
    fs.readFile(VISITORS_FILE, "utf8", (err, data) => {
        if (err) {
            return res.json({ visitors: 1420 });
        }
        res.json({ visitors: Number(data) || 1420 });
    });
});

app.post("/visit", (req, res) => {
    fs.readFile(VISITORS_FILE, "utf8", (err, data) => {
        let visitors = err ? 1420 : Number(data) || 1420;
        visitors++;
        fs.writeFile(VISITORS_FILE, visitors.toString(), (err) => {
            if (err) {
                return res.status(500).json({ error: "Couldn't update visitor count." });
            }
            res.json({ success: true, visitors });
        });
    });
});

app.get("/stock", async (req, res) => {
    const finnhubKey = process.env.FINNHUB_API_KEY;
    if (!finnhubKey) {
        // Fallback AAPL quote data
        return res.json({
            c: 224.23,
            d: 3.45,
            dp: 1.56,
            h: 226.50,
            l: 221.10,
            o: 222.00,
            pc: 220.78
        });
    }

    try {
        const response = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${finnhubKey}`
        );
        res.json(response.data);
    } catch (error) {
        console.error("Stock API Error:", error.message);
        res.json({
            c: 224.23,
            d: 3.45,
            dp: 1.56,
            h: 226.50,
            l: 221.10,
            o: 222.00,
            pc: 220.78
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});