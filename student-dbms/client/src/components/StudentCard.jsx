import React from "react";
import { deleteStudent } from "../services/api";
import toast from "react-hot-toast";
import {
  FaEdit,
  FaTrash,
  FaUser,
  FaIdCard,
  FaSchool,
  FaLayerGroup,
  FaPhone,
} from "react-icons/fa";

const StudentCard = ({ student, onEdit, onRefresh }) => {
  const handleDelete = async () => {
    if (!window.confirm(`Delete student "${student.name}"?`)) return;

    try {
      await deleteStudent(student._id);
      toast.success("Student deleted");
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete student");
    }
  };

  return (
    <div className="student-card">
      <div className="student-card-header">
        <span className="student-avatar">
          {student.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <h3 className="student-name">{student.name}</h3>
          <span className="student-id-badge">{student.studentId}</span>
        </div>
      </div>

      <div className="student-card-body">
        <div className="detail-row">
          <FaSchool className="detail-icon" />
          <span>
            Class: <strong>{student.className}</strong>
          </span>
        </div>
        <div className="detail-row">
          <FaLayerGroup className="detail-icon" />
          <span>
            Section: <strong>{student.section}</strong>
          </span>
        </div>
        <div className="detail-row">
          <FaPhone className="detail-icon" />
          <span>
            Phone: <strong>{student.phone}</strong>
          </span>
        </div>
      </div>

      <div className="student-card-actions">
        <button className="btn btn-edit" onClick={() => onEdit(student)}>
          <FaEdit /> Edit
        </button>
        <button className="btn btn-delete" onClick={handleDelete}>
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
};

export default StudentCard;
