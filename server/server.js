const express = require('express');
const app = express();
const PORT = 8080;

app.get("/api/home", (req, res) => {
    res.json({ message: "Welcome to the home page!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});
