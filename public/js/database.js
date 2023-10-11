import { MongoClient } from "mongodb";

function MiniDiaryDB() {
  const miniDiaryDB = {};
  const URL = "mongodb://localhost:27017";
  const DB_NAME = "MiniDiaryDB";
  const USERS_COLLECTION = "users";
  const DIARIES_COLLECTION = "diaries";

  const connect = async () => {
    const client = new MongoClient(URL);
    const db = client.db(DB_NAME);
    return { client, db };
  };

  async function initializeCounter() {
    const { client, db } = await connect();
    const existing = await db
      .collection("counters")
      .findOne({ _id: "diaryEntryId" });
    if (!existing) {
      await db
        .collection("counters")
        .insertOne({ _id: "diaryEntryId", sequence_value: 0 });
    }

    client.close();
  }

  initializeCounter("diaryEntryId");

  async function getNextSequenceValue() {
    const { client, db } = await connect();
    const sequenceDocument = await db
      .collection("counters")
      .findOneAndUpdate(
        { _id: "diaryEntryId" },
        { $inc: { sequence_value: 1 } },
        { returnOriginal: false }
      );
    client.close();
    if (
      !sequenceDocument ||
      (sequenceDocument && !("sequence_value" in sequenceDocument))
    ) {
      throw new Error(`Failed to generate a sequence for diaryEntryID`);
    }

    return sequenceDocument.sequence_value;
  }

  miniDiaryDB.insertDiaryEntry = async (entry) => {
    const { client, db } = await connect();
    const newid = await getNextSequenceValue();
    const newDiaryEntry = {
      primeId: newid,
      ...entry,
    };
    try {
      return await db.collection(DIARIES_COLLECTION).insertOne(newDiaryEntry);
    } finally {
      client.close();
    }
  };

  miniDiaryDB.getDiaryEntryById = async (id) => {
    const { client, db } = await connect();
    try {
      return await db
        .collection(DIARIES_COLLECTION)
        .findOne({ primeId: parseInt(id, 10) });
    } finally {
      client.close();
    }
  };

  miniDiaryDB.updateDiaryEntryById = async (id, update) => {
    const { client, db } = await connect();
    try {
      await db
        .collection(DIARIES_COLLECTION)
        .updateOne({ primeId: parseInt(id, 10) }, { $set: update });
      return miniDiaryDB.getDiaryEntryById(id);
    } finally {
      client.close();
    }
  };

  miniDiaryDB.deleteDiaryEntryById = async (id) => {
    const { client, db } = await connect();
    try {
      return await db
        .collection(DIARIES_COLLECTION)
        .deleteOne({ primeId: parseInt(id, 10) });
    } finally {
      client.close();
    }
  };

  miniDiaryDB.getDiaryEntriesByUserId = async (userid) => {
    const { client, db } = await connect();
    try {
      return await db
        .collection(DIARIES_COLLECTION)
        .find({ userid: userid })
        .toArray();
    } finally {
      client.close();
    }
  };

  miniDiaryDB.findUser = async (user) => {
    const { client, db } = await connect();
    const collection = db.collection(USERS_COLLECTION);
    try {
      return await collection.find(user).toArray();
    } finally {
      client.close();
    }
  };

  miniDiaryDB.addUser = async (user) => {
    const { client, db } = await connect();
    const collection = db.collection(USERS_COLLECTION);
    try {
      await collection.insertOne(user);
    } finally {
      client.close();
    }
  };

  miniDiaryDB.findDiary = async (user = {}) => {
    const { client, db } = await connect();
    const collection = db.collection(DIARIES_COLLECTION);
    try {
      if (user.username === undefined) {
        return await collection.find().toArray();
      } else {
        return await collection.find({ username: user.username }).toArray();
      }
    } finally {
      client.close();
    }
  };

  return miniDiaryDB;
}

export const miniDiaryDB = MiniDiaryDB();
