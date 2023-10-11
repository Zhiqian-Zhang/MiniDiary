import express from "express";
import apiRouter from "./public/js/api.js";
import bodyParser from "body-parser";

import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

app.use(express.static("frontend"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname + '/public'));

// app.use(express.static('public', { 'extensions': ['html', 'css'] }));



app.use(bodyParser.json()); // Parse JSON bodies
// app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies


// http://localhost:3000/api/prompts
app.use("/", apiRouter);


const onListen = () => {
    console.log("I'm ready to pass the callback");
    return () => {
        console.log(`Server running on port ${PORT}`);
    }
};
app.listen(PORT, onListen());
