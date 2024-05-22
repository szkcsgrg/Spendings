//////////////////////////////////////////////////////////////////////////////
//Server Imports & Configuration
//////////////////////////////////////////////////////////////////////////////
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const https = require('https');
const fs = require("fs");
require("dotenv").config();

//Server configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});


const app = express();

// try {
//     const key = fs.readFileSync('/etc/letsencrypt/live/vps.szakacsgergo.com/privkey.pem', 'utf8');
//     const cert = fs.readFileSync('/etc/letsencrypt/live/vps.szakacsgergo.com/fullchain.pem', 'utf8');
  
//     const options = { key, cert };
//     const httpsServer = https.createServer(options, app);
  
//     const port = 8801;
//     httpsServer.listen(port, () => {
//       console.log(`Server is listening on port ${port}`);
//     }).on('error', (err) => {
//       console.error('Server error: ', err);
//     });
// } catch (err) {
//     console.error('Failed to start server: ', err);
// }
const port = 8801;
app.listen(port, () =>{
    console.log(`Server listening on port: ${port}`);
})
app.use(express.json());
app.set("view engine", "ejs");


//Cors setup
const allowedOrigins = ['https://spending.szakacsgergo.com',
  'https://www.spending.szakacsgergo.com',
  'https://spending.szakacsgergo.com/login',
  'https://www.spending.szakacsgergo.com/login',
  'https://vps.szakacsgergo.com',
  'http://localhost:5173' ];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin '${origin}' is not allowed.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));


//////////////////////////////////////////////////////////////////////////////
//API Endpoints
//////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.send('This is the webserver for Spendings Application');
});


//
//POST Methods
//
//Login Insert into
app.post('/login', (req, res) => {
    const email = req.body.email;
    const displayName = req.body.displayName;
    const photoURL = req.body.photoURL;
  
    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
      if (err) throw err;
  
      if (result.length > 0) {
        // User already exists, just return
        res.send('User logged in');
      } else {
        // User doesn't exist, create new user
        db.query('INSERT INTO users (email, displayName, photoURL) VALUES (?, ?, ?)', [email, displayName, photoURL], (err, result) => {
          if (err) throw err;
          res.send('User created and logged in');
        });
      }
    });
});


//Update spendings and income values
app.post('/changespendings', (req, res) => {
    let { user_id, type_id, month, income, amount } = req.body;
  
    // Remove extra quotation marks from user_id
    user_id = user_id.replace(/"/g, '');

    if (type_id == 16) {
        amount = 0;
    }
    
    // First, check if the user exists
    db.query('SELECT * FROM users WHERE email = ?', [user_id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server error');
      } else if (result.length === 0) {
        // If the user does not exist, send an error message
        res.status(400).send('User does not exist');
      } else {
        // If the user exists, insert the spending record
        const query = 'INSERT INTO spending (user_email, type_id, month, income, amount) VALUES (?, ?, ?, ?, ?)';
        const values = [user_id, type_id, month, income, amount];
  
        db.query(query, values, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send('Server error');
          } else {
            res.status(200).send('Data inserted successfully');
          }
        });
      }
    });
});

app.post('/changesavings', (req, res) => {
    let { user_id, month, income, saving } = req.body;

    // Remove extra quotation marks from user_id
    user_id = user_id.replace(/"/g, '');

    const query = 'INSERT INTO spending (saving, income, user_email, month) VALUES (?, ?, ?, ?)';
    const values = [saving, income, user_id, month];

    db.query(query, values, (err, result) => {
        if (err) {
        console.error(err);
        res.status(500).send('Server error');
        } else {
        res.status(200).send('Data updated successfully');
        }
    });
})

app.post('/setIncomeAfterWipe', (req, res) => {
    let { userId, month, income } = req.body;

    userId = userId.replace(/"/g, '');

    const query = 'INSERT INTO spending (income, user_email, month) VALUES (?, ?, ?)';
    const values = [income, userId, month];
    
    db.query(query, values, (err, result) => {
        if (err) {
        console.error(err);
        res.status(500).send('Server error');
        } else {
        res.status(200).send('Data updated successfully');
        }
    });
})   


//
//GET Methods
//

//Get back the value from DB *
app.get('/getspendingsUser', (req, res) => {
    let { user_id } = req.query;

    // Remove extra quotation marks from user_id
    let cleaned_user_id = user_id.replace(/"/g, '');

    db.query('SELECT * FROM spending WHERE user_email = ?', [cleaned_user_id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            res.json(result);
        }
    });
})


//Get the values back from DB where USER AND MONTH to show on frontend
app.get('/getspendingsUserMonth', (req, res) => {
    let { user_id, month } = req.query;

    // Remove extra quotation marks from user_id
    let cleaned_user_id = user_id.replace(/"/g, '');

    // Query the database for the spending data associated with the user
    db.query('SELECT * FROM spending WHERE user_email = ? AND month = ?', [cleaned_user_id, month], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            // Send the spending data back to the client
            res.json(result);
        }
    });
});



//
//DELETE Methods
//
app.delete('/deletespendingsUserMonth', (req, res) => {
    const userId = req.query.userId;
    const month = req.query.month;
  
    // Remove extra quotation marks from user_id
    let cleaned_user_id = userId.replace(/"/g, '');
  
    // Connect to the database and delete the rows
    db.query('DELETE FROM spending WHERE user_email = ? AND month = ?', [cleaned_user_id, month], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server error');
      } else {
        // Send the spending data back to the client
        res.json(result);
      }
    });
  });