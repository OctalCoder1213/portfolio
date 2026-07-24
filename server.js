require("dotenv").config();

const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/contact", (req, res) => {

    console.log(req.body);
    res.json({
        success: true
    });
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
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
/*const resend = new Resend(process.env.RESEND_API_KEY);*/