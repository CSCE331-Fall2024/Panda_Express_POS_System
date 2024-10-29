const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = 8080;

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

app.get("/api/home", (req, res) => {
    res.json({ message: "Welcome to the home page!" });
});

app.get('/user', async (req, res) => {
    try {
        const query_res = await pool.query('SELECT * FROM teammembers;');
        const teammembers = query_res.rows;
        const data = { teammembers: teammembers };
        console.log(teammembers);
        res.render('user', data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving team members');
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});
