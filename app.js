const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect("mongodb+srv://mohammadramiturki_db_user:IPXdN0O8OTloANk9@cluster0.9fh8ihs.mongodb.net/firstDB").then(() => console.log('connected to DB!')).catch(() => console.log("not connected to DB"));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set(`view engine`, `ejs`);
app.get("/", async (req, res) => {
    res.status(200).json({ message: "welcome to node js" });
});

app.use("/api/auth", require("./routers/auth"));
app.use("/password", require("./routers/password"));


const Port = process.env.PORT || 8000;
app.listen(Port, () => console.log(`connected to port: ${Port}`));