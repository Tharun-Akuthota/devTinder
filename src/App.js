const express = require('express');
const app = express();

const PORT = 3000;

// request handlers
// install nodemon and update scripts inside package.json

app.use("/main",(req, res) => {
    res.send("Hello from the Main page!");
});

app.use("/about",(req, res) => {
    res.send("Hello from the About!");
});

app.listen(PORT, () => {
    console.log(`Server listening to ${PORT}....`);
});