import express from 'express';
import bodyParser from 'body-parser';
import { connect } from '../public/js/database.js';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

import { getDB } from '/public/js/database.js';



// Your routes will be added here
// Register route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = { username, password }; // In real-world scenarios, passwords should be hashed and salted
    const collection = getDB().collection('users');
    const result = await collection.insertOne(user);
    res.send(result.ops[0]);
  });
  
  // Login route
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const collection = getDB().collection('users');
    const user = await collection.findOne({ username, password });
    if (user) {
      res.send(user);
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
  
  // Add diary entry route
  app.post('/diary', async (req, res) => {
    const entry = req.body;
    const collection = getDB().collection('entries');
    const result = await collection.insertOne(entry);
    res.send(result.ops[0]);
  });
  
  // Get diary entries route
  app.get('/diary', async (req, res) => {
    const collection = getDB().collection('entries');
    const entries = await collection.find({}).toArray();
    res.send(entries);
  });
  
  // Get specific diary entry route
  app.get('/diary/:id', async (req, res) => {
    const { id } = req.params;
    const collection = getDB().collection('entries');
    const entry = await collection.findOne({ _id: new require('mongodb').ObjectID(id) });
    if (entry) {
      res.send(entry);
    } else {
      res.status(404).send('Entry not found');
    }
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connect();  // connect to the database
});
