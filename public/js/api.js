import {
    insertDiaryEntry,
    getDiaryEntryById,
    updateDiaryEntryById,
    deleteDiaryEntryById,
    getDiaryEntriesByUserId
  } from './database.js';
  
  async function getNextPrimeId(collection) {
    const highestDocument = await collection.find().sort({ primeId: -1 }).limit(1).toArray();
    if (highestDocument.length === 0) {
      return 1;
    }
    return highestDocument[0].primeId + 1;
  }
  
  export async function postDiary(req, res, collection) {
    try {
      const primeId = await getNextPrimeId(collection);
      const result = await insertDiaryEntry(req.body, primeId);
      
      console.log(result);
      res.status(201).send({ _id: result.insertedId, primeId: primeId });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
  }
  
  export async function getDiaryById(req, res) {
    try {
      const primeId = parseInt(req.params.id, 10);
      const diaryEntry = await getDiaryEntryById(primeId);
      console.log(diaryEntry);
      res.status(200).send(diaryEntry);
    } catch (err) {
      res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
  }
  
  export async function updateDiaryById(req, res) {
    try {
      const primeId = parseInt(req.params.id, 10);
      const updatedEntry = await updateDiaryEntryById(primeId, req.body);
      res.status(200).send(updatedEntry);
    } catch (err) {
      res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
  }
  
  export async function deleteDiaryById(req, res) {
    try {
      const primeId = parseInt(req.params.id, 10);
      const deletedEntry = await deleteDiaryEntryById(primeId);
      res.status(200).send(deletedEntry);
    } catch (err) {
      res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
  }
  
  export async function getDiaryByUserId(req, res) {
    try {
      const userid = req.params.userid;
      const diaryEntries = await getDiaryEntriesByUserId(userid);
      res.status(200).json(diaryEntries);
    } catch (err) {
      res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
  }
  