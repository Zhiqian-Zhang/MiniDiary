import express from 'express';
import bodyParser from 'body-parser';
import {
  connect,
  insertDiaryEntry,
  getDiaryEntryById,
  updateDiaryEntryById,
  deleteDiaryEntryById
} from './server/database.js';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/diary', async (req, res) => {
  try {
    const diaryEntry = await insertDiaryEntry(req.body);
    res.status(201).send(diaryEntry.ops[0]);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/diary/:id', async (req, res) => {
  try {
    const diaryEntry = await getDiaryEntryById(req.params.id);
    res.status(200).send(diaryEntry);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put('/diary/:id', async (req, res) => {
  try {
    const updatedEntry = await updateDiaryEntryById(req.params.id, req.body);
    res.status(200).send(updatedEntry);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete('/diary/:id', async (req, res) => {
  try {
    await deleteDiaryEntryById(req.params.id);
    res.status(200).send({ message: "Diary entry deleted." });
  } catch (err) {
    res.status(500).send(err);
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
