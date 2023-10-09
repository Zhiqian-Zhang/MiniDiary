import { MongoClient } from 'mongodb';

const DATABASE_URL = 'mongodb://localhost:27017';
const DATABASE_NAME = 'diaryDB';

let db;

async function connect() {
  try {
    const client = await MongoClient.connect(DATABASE_URL);
    db = client.db(DATABASE_NAME);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
}

async function insertDiaryEntry(entry, primeId) {
  const newDiaryEntry = {
    primeId: primeId,
    ...entry
  };
  return db.collection('diary').insertOne(newDiaryEntry);
}

async function getDiaryEntryById(id) {
  return db.collection('diary').findOne({ primeId: parseInt(id, 10) });
}

async function updateDiaryEntryById(id, update) {
  await db.collection('diary').updateOne(
    { primeId: parseInt(id, 10) },
    { $set: update }
  );
  return getDiaryEntryById(id);
}

async function deleteDiaryEntryById(id) {
  return db.collection('diary').deleteOne({ primeId: parseInt(id, 10) });
}

export {
  connect,
  insertDiaryEntry,
  getDiaryEntryById,
  updateDiaryEntryById,
  deleteDiaryEntryById
};
