require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path')
const app = express();
const PORT = 8080;

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: { rejectUnauthorized: false }
});

const cors = require('cors');

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.send('Welcome to the home page!');
});

app.get("/api/home", (req, res) => {
    res.json({ message: "Welcome to the home page!" });
});

app.get('/user', async (req, res) => {
    // console.log('Object:', pool);
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

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received login request:', { username, password });
  
    try {
      const query = 'SELECT username, password, position FROM staff WHERE username = $1';
      const result = await pool.query(query, [username]);
      
      console.log('Database result:', result.rows);
  
      if (result.rows.length === 0) {
        console.log('No user found with this username.');
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      const user = result.rows[0];
      
      const isPasswordValid = user.password === password; // Update to bcrypt.compare if using hashed passwords
      if (!isPasswordValid) {
        console.log('Password is incorrect.');
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      console.log('User authenticated successfully:', user);
  
      // Return role based on position
      if (user.position === 'Manager') {
        res.json({ role: 'manager' });
      } else if (user.position === 'Cashier') {
        res.json({ role: 'cashier' });
      } else {
        console.log('User has an unauthorized position:', user.position);
        res.status(403).json({ message: 'Unauthorized position' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});
