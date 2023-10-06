import { MongoClient } from 'mongodb';
const uri = 'mongodb://localhost:27017';
const dbName = 'diaryDB';

let db;

export const connect = async () => {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  console.log("Connected to the database");
  db = client.db(dbName);
}

const getDB = () => {
  if (!db) throw new Error('Database connection not established');
  return db;
}

export {getDB};
