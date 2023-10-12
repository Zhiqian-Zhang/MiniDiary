/**
 * @author Yunke Nie
 * @author Naiyi Zhang
 */

import express from "express";
import { miniDiaryDB } from "./database.js";
import path from "path";
import { fileURLToPath } from "url";

export const router = express.Router();

router.get("/account.html", async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dashboardFilePath = path.join(__dirname, "../account.html");
  res.sendFile(dashboardFilePath);
});

router.post("/account.html", async (req, res) => {
  const resDiary = await miniDiaryDB.findDiary();
  const user = req.body;
  const diaryRes = await miniDiaryDB.findDiary(user);
  res.send(diaryRes);
});

router.get("/dashboard.html", async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dashboardFilePath = path.join(__dirname, "../dashboard.html");
  res.sendFile(dashboardFilePath);
});

router.post("/dashboard.html", async (req, res) => {
  const resDiary = await miniDiaryDB.findDiary();
  res.json(resDiary);
});

router.get("/registration.html", async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dashboardFilePath = path.join(__dirname, "../registration.html");
  res.sendFile(dashboardFilePath);
});

router.post("/registration.html", async (req, res) => {
  const user = req.body;
  const usern = {
    username: user.username,
  };

  const userRes = await miniDiaryDB.findUser(usern);
  if (userRes.length != 0) {
    res.send(false);
  } else {
    const userAdd = await miniDiaryDB.addUser(user);
    res.send(true);
  }
});

router.post("/", async (req, res) => {
  const user = req.body;
  const userRes = await miniDiaryDB.findUser(user);
  res.send({ users: userRes });
});

router.post("/diary", async (req, res) => {
  try {
    const result = await miniDiaryDB.insertDiaryEntry(req.body.entry);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to insert diary entry" });
  }
});

router.get("/diary/:id", async (req, res) => {
  try {
    const result = await miniDiaryDB.getDiaryEntryById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to get diary entry" });
  }
});

// Endpoint to update a diary entry by ID
router.put("/diary/:id", async (req, res) => {
  try {
    const result = await miniDiaryDB.updateDiaryEntryById(
      req.params.id,
      req.body
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update diary entry" });
  }
});

// Endpoint to delete a diary entry by ID
router.delete("/diary/:id", async (req, res) => {
  try {
    const result = await miniDiaryDB.deleteDiaryEntryById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete diary entry" });
  }
});

// Endpoint to get diary entries by user ID
router.get("/diary/user/:userid", async (req, res) => {
  try {
    const result = await miniDiaryDB.getDiaryEntriesByUserId(req.params.userid);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to get diary entries by user ID" });
  }
});

export default router;
