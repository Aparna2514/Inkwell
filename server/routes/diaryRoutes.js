const express = require("express");
const router = express.Router();
const {
  getAllEntries,
  getEntryByDate,
  createEntry,
  updateEntry,
  deleteEntry,
} = require("../controllers/diaryController");
const { protect } = require("../middleware/authMiddleware");

// All diary routes are protected
router.use(protect);

router.get("/", getAllEntries);
router.get("/:date", getEntryByDate);
router.post("/", createEntry);
router.put("/:date", updateEntry);
router.delete("/:date", deleteEntry);

module.exports = router;

