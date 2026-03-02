import React, { useState, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";

const App = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingStudent, setEditingStudent] = useState(null);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleEdit = useCallback((student) => {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingStudent(null);
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "12px", background: "#333", color: "#fff" },
        }}
      />
      <Navbar />
      <main className="container">
        <StudentForm
          onSuccess={triggerRefresh}
          editingStudent={editingStudent}
          onCancelEdit={handleCancelEdit}
        />
        <StudentList refreshKey={refreshKey} onEdit={handleEdit} />
      </main>
      <footer className="footer">
        <p>Student DBMS &mdash; Built with React, Express, MongoDB Atlas &amp; Redis</p>
      </footer>
    </>
  );
};

export default App;
