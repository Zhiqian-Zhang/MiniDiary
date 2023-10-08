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

async function insertDiaryEntry(entry) {
  return db.collection('diary').insertOne(entry);
}

async function getDiaryEntryById(id) {
  return db.collection('diary').findOne({ _id: new MongoClient.ObjectID(id) });
}

async function updateDiaryEntryById(id, update) {
  await db.collection('diary').updateOne(
    { _id: new MongoClient.ObjectID(id) },
    { $set: update }
  );
  return getDiaryEntryById(id);
}

async function deleteDiaryEntryById(id) {
  return db.collection('diary').deleteOne({ _id: new MongoClient.ObjectID(id) });
}

export {
  connect,
  insertDiaryEntry,
  getDiaryEntryById,
  updateDiaryEntryById,
  deleteDiaryEntryById
};
