import React, { useState, useEffect } from "react";
import { addStudent, updateStudent } from "../services/api";
import toast from "react-hot-toast";
import {
  FaUser,
  FaIdCard,
  FaSchool,
  FaLayerGroup,
  FaPhone,
  FaPlus,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const INITIAL = { name: "", studentId: "", className: "", section: "", phone: "" };

const StudentForm = ({ onSuccess, editingStudent, onCancelEdit }) => {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);

  // Pre-fill when editing
  useEffect(() => {
    if (editingStudent) {
      setForm({
        name: editingStudent.name,
        studentId: editingStudent.studentId,
        className: editingStudent.className,
        section: editingStudent.section,
        phone: editingStudent.phone,
      });
    } else {
      setForm(INITIAL);
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // No page reload

    // Client-side validation
    for (const key of Object.keys(INITIAL)) {
      if (!form[key].trim()) {
        toast.error("All fields are required");
        return;
      }
    }

    setLoading(true);
    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id, form);
        toast.success("Student updated successfully!");
        onCancelEdit();
      } else {
        await addStudent(form);
        toast.success("Student added successfully!");
      }
      setForm(INITIAL);
      onSuccess();
    } catch (err) {
      const msg =
        err.response?.data?.error || "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!editingStudent;

  return (
    <div className="card form-card">
      <h2 className="card-title">
        {isEditing ? (
          <>
            <FaSave /> Edit Student
          </>
        ) : (
          <>
            <FaPlus /> Add New Student
          </>
        )}
      </h2>

      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-group">
          <label>
            <FaUser className="label-icon" /> Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>
            <FaIdCard className="label-icon" /> Student ID
          </label>
          <input
            type="text"
            name="studentId"
            placeholder="e.g. STU-2026-001"
            value={form.studentId}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <FaSchool className="label-icon" /> Class
            </label>
            <input
              type="text"
              name="className"
              placeholder="e.g. 10th"
              value={form.className}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>
              <FaLayerGroup className="label-icon" /> Section
            </label>
            <input
              type="text"
              name="section"
              placeholder="e.g. A"
              value={form.section}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>
            <FaPhone className="label-icon" /> Phone Number
          </label>
          <input
            type="text"
            name="phone"
            placeholder="e.g. 9876543210"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Student"
              : "Add Student"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onCancelEdit();
                setForm(INITIAL);
              }}
            >
              <FaTimes /> Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
