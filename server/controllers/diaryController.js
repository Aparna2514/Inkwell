const pool = require("../config/db");

// GET all entries for logged in user
const getAllEntries = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, entry_date, title, mood, cover_color, is_locked, created_at FROM entries WHERE user_id = $1 ORDER BY entry_date DESC",
      [req.user.id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET single entry by date
const getEntryByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM entries WHERE user_id = $1 AND entry_date = $2",
      [req.user.id, date]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// CREATE entry
const createEntry = async (req, res) => {
  const { entry_date, title, content, mood, cover_color } = req.body;
  try {
    const existing = await pool.query(
      "SELECT * FROM entries WHERE user_id = $1 AND entry_date = $2",
      [req.user.id, entry_date]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Entry already exists for this date" });
    }

    const result = await pool.query(
      "INSERT INTO entries (user_id, entry_date, title, content, mood, cover_color) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [req.user.id, entry_date, title, content, mood, cover_color]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// UPDATE entry
const updateEntry = async (req, res) => {
  const { date } = req.params;
  const { title, content, mood } = req.body;
  try {
    const existing = await pool.query(
      "SELECT * FROM entries WHERE user_id = $1 AND entry_date = $2",
      [req.user.id, date]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }

    const result = await pool.query(
      "UPDATE entries SET title = $1, content = $2, mood = $3, updated_at = NOW() WHERE user_id = $4 AND entry_date = $5 RETURNING *",
      [title, content, mood, req.user.id, date]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE entry
const deleteEntry = async (req, res) => {
  const { date } = req.params;
  try {
    const existing = await pool.query(
      "SELECT * FROM entries WHERE user_id = $1 AND entry_date = $2",
      [req.user.id, date]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }

    await pool.query(
      "DELETE FROM entries WHERE user_id = $1 AND entry_date = $2",
      [req.user.id, date]
    );
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllEntries,
  getEntryByDate,
  createEntry,
  updateEntry,
  deleteEntry,
};


