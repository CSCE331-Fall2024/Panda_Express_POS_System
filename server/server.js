// server.js
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const axios = require('axios');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 8080;

// PostgreSQL pool setup
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: { rejectUnauthorized: false }
});

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/google/callback`
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    console.log('email:', email)
    // Check if the user's email exists in the database
    const query = 'SELECT staff_id, position FROM staff WHERE google_id = $1';
    const result = await pool.query(query, [email]);
    console.log('Database result:', result.rows);

    if (result.rows.length === 0) {
      console.log("user not found", email);
        return done(null, false, { message: 'User not found in the database.' });
    }
    console.log("user found", email);
    const user = result.rows[0];
    console.log('User authenticated successfully:', user);
    return done(null, user);
} catch (error) {
    console.error('Error during Google OAuth callback:', error);
    return done(error);
}
}));

const session = require('express-session');

// Set up express-session middleware
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// Passport session initialization
app.use(passport.session());

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Endpoint to start Google OAuth2 authentication
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback endpoint for Google OAuth2
app.get('/api/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/?error=authentication_failed',
    session: true
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect('/?error=User not found');
  }
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || 'http://localhost:3000';
  const redirectUrl = `${baseUrl}/login?staff_id=${req.user.staff_id}&role=${req.user.position.toLowerCase()}`;
    res.redirect(redirectUrl.toString());
  }
);

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(passport.initialize());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Google Translate API endpoint
app.post('/api/translate', async (req, res) => {
  const { texts, targetLanguage } = req.body;

  // Validate request body
  if (!texts || !Array.isArray(texts) || texts.length === 0 || typeof targetLanguage !== 'string' || targetLanguage.trim() === '') {
      return res.status(400).json({ error: 'Invalid request. Missing texts or target language.' });
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  
  // Check for API key
  if (!apiKey) {
      console.error('Google Translate API key is missing.');
      return res.status(500).json({ error: 'Translation service not configured' });
  }

  try {
      // Construct the request body for Google Translate API
      const requestBody = {
          q: texts,
          target: targetLanguage,
          format: 'text' // Optional: Specify the format of the source text
      };

      // Call Google Translate API
      const response = await axios.post(
          'https://translation.googleapis.com/language/translate/v2',
          requestBody,
          {
              params: {
                  key: apiKey
              },
              headers: {
                  'Content-Type': 'application/json'
              }
          }
      );

      // Extract translated texts
      const translations = response.data.data.translations.map(t => t.translatedText);
      res.json({ translatedTexts: translations });
  } catch (error) {
      console.error('Error with Google Translate API:', error.response ? error.response.data : error.message);
      
      // Handle specific Google Translate API errors
      if (error.response && error.response.data && error.response.data.error) {
          const apiError = error.response.data.error;
          return res.status(apiError.code || 500).json({ error: apiError.message || 'Translation failed' });
      }

      res.status(500).json({ error: 'Translation failed' });
  }
});

// Home page endpoint
app.get('/', (req, res) => {
    // res.send('You are not an authorized user.');
    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/login`;
    res.redirect(redirectUrl.toString());
});
app.get("/api/home", (req, res) => {
  res.json({ message: "Welcome to the home page!" });
});

// Example endpoint to get team members from PostgreSQL
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

// Example API endpoint to get orders
app.get('/api/orders', async (req, res) => {
    const { year, month, day } = req.query;

    try {
        let query = 'SELECT order_id, CAST(total AS FLOAT) AS total, time, staff_id, payment_id FROM orders WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (year) {
            query += ` AND EXTRACT(YEAR FROM time) = $${paramIndex++}`;
            params.push(year);
        }
        if (month) {
            query += ` AND EXTRACT(MONTH FROM time) = $${paramIndex++}`;
            params.push(month);
        }
        if (day) {
            query += ` AND EXTRACT(DAY FROM time) = $${paramIndex++}`;
            params.push(day);
        }

        query += ' ORDER BY time ASC';

        const result = await pool.query(query, params);
        res.status(200).json({ orders: result.rows });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
});

// OpenWeather endpoint (example)
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: lat,
        lon: lon,
        appid: apiKey,
        units: 'imperial' // or 'metric' for Celsius
      }
    });

    // console.log('Weather API response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Weather API error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Weather data retrieval failed' });
  }
});

// Example login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received login request:', { username, password });
  
    try {
      const query = 'SELECT staff_id, username, password, position FROM staff WHERE username = $1';
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
  
      if (user.position === 'Manager') {
        res.json({ role: 'manager', staff_id: user.staff_id });
      } else if (user.position === 'Cashier') {
        res.json({ role: 'cashier', staff_id: user.staff_id });
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
