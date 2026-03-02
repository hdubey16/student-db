const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  searchStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

// Search must come BEFORE the /:id route
router.get("/search", searchStudents);

router.get("/", getAllStudents);
router.post("/", addStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
