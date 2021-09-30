const express = require('express');
const app = express();
require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const database = require('./data.json')

let PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}))
app.use(express.json())

// turn on less secure apps on gmail account
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})
app.use('/', express.static("./public"));
// app.get("/", express.static(path.join(__dirname, "./public")));
app.get("/", (req, res) => {
    res.sendFile('./public/index.html')
})

app.post('/', (req, res) => {
    const {from, to, subject, text, number} = req.body;
    if (from && subject && text) {
        // mail body
        let mailOptions = {
            from,
            to: to || "yoqub0102@gmail.com",
            subject,
            text: `From: ${from} \n\n Number: ${number} \n\n ${text}`
        };
        // send message
        transporter
            .sendMail(mailOptions)
            .then(response => res.send({ message: "Email sent successfuly!" }))
            .catch(err => {
                console.log(err)
                res.send({ message: "Error" });
            });
        
        database.push(mailOptions)
        fs.writeFile("./data.json", JSON.stringify(database, null, 4), 'utf8', (err) => {
            if (err) console.log(err);
        });
    } else {
        console.log(req.body)
        res.send({ message: "Error: Infromation is not enough"})
    }
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});