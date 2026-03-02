import React, { useState, useEffect, useCallback } from "react";
import { fetchStudents, searchStudents } from "../services/api";
import StudentCard from "./StudentCard";
import toast from "react-hot-toast";
import { FaSearch, FaDatabase, FaBolt, FaInbox } from "react-icons/fa";

const StudentList = ({ refreshKey, onEdit }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [source, setSource] = useState("");

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      if (searchTerm.trim()) {
        const { data } = await searchStudents(searchTerm.trim());
        setStudents(data.data);
        setSource("search");
      } else {
        const { data } = await fetchStudents();
        setStudents(data.data);
        setSource(data.source);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Re-fetch when refreshKey changes (after add/update/delete) or search changes
  useEffect(() => {
    const debounce = setTimeout(() => loadStudents(), 300);
    return () => clearTimeout(debounce);
  }, [refreshKey, loadStudents]);

  return (
    <div className="card list-card">
      <div className="list-header">
        <h2 className="card-title">
          <FaDatabase /> Student Records
          <span className="count-badge">{students.length}</span>
        </h2>

        {source && source !== "search" && (
          <span className={`source-badge ${source}`}>
            {source === "cache" ? (
              <>
                <FaBolt /> Redis Cache
              </>
            ) : (
              <>
                <FaDatabase /> MongoDB
              </>
            )}
          </span>
        )}
      </div>

      {/* Search Bar */}
      <div className="search-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, ID, class, section, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="search-clear"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>

      {/* Student Cards */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading students...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="empty-state">
          <FaInbox className="empty-icon" />
          <p>
            {searchTerm
              ? "No students match your search."
              : "No students yet. Add one above!"}
          </p>
        </div>
      ) : (
        <div className="student-grid">
          {students.map((s) => (
            <StudentCard
              key={s._id}
              student={s}
              onEdit={onEdit}
              onRefresh={loadStudents}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentList;
