import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import { connect } from './public/js/database.js';
import {
  postDiary,
  getDiaryById,
  updateDiaryById,
  deleteDiaryById,
  getDiaryByUserId
} from './public/js/api.js';

const app = express();
const PORT = 3001;

const client = new MongoClient('mongodb://localhost:27017');
const dbname = 'diaryDB';
const db = client.db(dbname);
const collection = db.collection('diary');

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/diary', (req, res) => postDiary(req, res, collection));
app.get('/diary/:id', getDiaryById);
app.put('/diary/:id', updateDiaryById);
app.delete('/diary/:id', deleteDiaryById);
app.get('/diary/user/:userid', getDiaryByUserId);

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
