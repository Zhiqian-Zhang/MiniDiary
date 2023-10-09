import express from 'express';
import bodyParser from 'body-parser';
import {
  connect,
  insertDiaryEntry,
  getDiaryEntryById,
  updateDiaryEntryById,
  deleteDiaryEntryById,
  getDiaryEntriesByUserId
} from './server/database.js';
import { MongoClient } from 'mongodb';

const app = express();
const PORT = 3000;

const client = new MongoClient('mongodb://localhost:27017');
const dbname = 'diaryDB';
const db = client.db(dbname);
const collection = db.collection('diary');

app.use(bodyParser.json());
app.use(express.static('public'));

async function getNextPrimeId() {
  const highestDocument = await collection.find().sort({ primeId: -1 }).limit(1).toArray();
  if (highestDocument.length === 0) {
    return 1;
  }
  return highestDocument[0].primeId + 1;
}

app.post('/diary', async (req, res) => {
  try {
    const primeId = await getNextPrimeId();

    const result = await insertDiaryEntry(req.body, primeId);
    
    console.log(result);
    res.status(201).send({ _id: result.insertedId, primeId: primeId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
});

app.get('/diary/:id', async (req, res) => {
  try {
    const primeId = parseInt(req.params.id, 10); // Convert string ID to integer
    const diaryEntry = await getDiaryEntryById(primeId); // Modify your function to accept primeId
    console.log(diaryEntry);
    res.status(200).send(diaryEntry);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
});

app.put('/diary/:id', async (req, res) => {
  try {
    const primeId = parseInt(req.params.id, 10); // Convert string ID to integer
    console.log("About to update entry with primeId:", primeId);
    const updatedEntry = await updateDiaryEntryById(primeId, req.body); // Modify your function to accept primeId
    res.status(200).send(updatedEntry);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
});

app.delete('/diary/:id', async (req, res) => {
  try {
    const primeId = parseInt(req.params.id, 10); // Convert string ID to integer
    const deletedEntry = await deleteDiaryEntryById(primeId); // Modify your function to accept primeId
    res.status(200).send(deletedEntry);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
});

app.get('/diary/user/:userid', async (req, res) => {
  try {
      const userid = req.params.userid;
      const diaryEntries = await getDiaryEntriesByUserId(userid);
      res.status(200).json(diaryEntries);
  } catch (err) {
      res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
});


async function start() {
  try {
    await connect();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
}

start();
