const Student = require("../models/Student");
const redisClient = require("../config/redis");

const CACHE_KEY = "students:all";
const CACHE_TTL = 300; // 5 minutes

// ───────── Helper: Invalidate Cache ─────────
const invalidateCache = async () => {
  try {
    if (redisClient && redisClient.status === "ready") {
      await redisClient.del(CACHE_KEY);
      console.log("🗑️  Redis cache invalidated");
    }
  } catch (err) {
    console.error("Redis cache invalidation error:", err.message);
  }
};

// ───────── GET  /api/students ─────────
const getAllStudents = async (req, res) => {
  try {
    // 1. Check Redis cache first
    if (redisClient && redisClient.status === "ready") {
      const cached = await redisClient.get(CACHE_KEY);
      if (cached) {
        console.log("⚡ Serving students from Redis cache");
        return res.json({ source: "cache", data: JSON.parse(cached) });
      }
    }

    // 2. Cache miss → fetch from MongoDB
    const students = await Student.find().sort({ createdAt: -1 });

    // 3. Store in Redis with TTL
    if (redisClient && redisClient.status === "ready") {
      await redisClient.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(students));
      console.log("💾 Students cached in Redis");
    }

    return res.json({ source: "database", data: students });
  } catch (error) {
    console.error("getAllStudents error:", error.message);
    return res.status(500).json({ error: "Failed to fetch students" });
  }
};

// ───────── GET  /api/students/search?q=term ─────────
const searchStudents = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const regex = new RegExp(q, "i");
    const students = await Student.find({
      $or: [
        { name: regex },
        { studentId: regex },
        { className: regex },
        { section: regex },
        { phone: regex },
      ],
    }).sort({ createdAt: -1 });

    return res.json({ data: students });
  } catch (error) {
    console.error("searchStudents error:", error.message);
    return res.status(500).json({ error: "Search failed" });
  }
};

// ───────── POST /api/students ─────────
const addStudent = async (req, res) => {
  try {
    const { name, studentId, className, section, phone } = req.body;

    // Validate required fields
    if (!name || !studentId || !className || !section || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check for duplicate Student ID
    const existing = await Student.findOne({ studentId });
    if (existing) {
      return res
        .status(409)
        .json({ error: `Student ID "${studentId}" already exists` });
    }

    const student = await Student.create({
      name,
      studentId,
      className,
      section,
      phone,
    });

    // Invalidate cache
    await invalidateCache();

    return res.status(201).json({ message: "Student added successfully", data: student });
  } catch (error) {
    // Handle Mongoose unique-index violation as a fallback
    if (error.code === 11000) {
      return res.status(409).json({ error: "Duplicate Student ID" });
    }
    console.error("addStudent error:", error.message);
    return res.status(500).json({ error: "Failed to add student" });
  }
};

// ───────── PUT  /api/students/:id ─────────
const updateStudent = async (req, res) => {
  try {
    const { name, studentId, className, section, phone } = req.body;

    // If studentId is being changed, check for conflicts
    if (studentId) {
      const conflict = await Student.findOne({
        studentId,
        _id: { $ne: req.params.id },
      });
      if (conflict) {
        return res
          .status(409)
          .json({ error: `Student ID "${studentId}" is already taken` });
      }
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, studentId, className, section, phone },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Invalidate cache
    await invalidateCache();

    return res.json({ message: "Student updated successfully", data: student });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Duplicate Student ID" });
    }
    console.error("updateStudent error:", error.message);
    return res.status(500).json({ error: "Failed to update student" });
  }
};

// ───────── DELETE /api/students/:id ─────────
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Invalidate cache
    await invalidateCache();

    return res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("deleteStudent error:", error.message);
    return res.status(500).json({ error: "Failed to delete student" });
  }
};

module.exports = {
  getAllStudents,
  searchStudents,
  addStudent,
  updateStudent,
  deleteStudent,
};
