require("./bot");
import express from "express";

const app = express();

app.listen(process.env.PORT, () => {
    console.log('Started listening...');
});