import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import { Gameweek } from "../../types/Gameweek";
import AdminNav from "../../components/AdminNav/AdminNav";

export default function AdminGameweeksPage() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [gameweeks, setGameweeks] = useState<Gameweek[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGameweek, setEditingGameweek] = useState<Gameweek | null>(null);

  const [formData, setFormData] = useState({
    round_number: "",
    round_name: "",
    match_date: "",
    deadline_at: "",
  });

  useEffect(() => {
    if (!authLoading && (!profile || !profile.is_admin)) {
      router.push("/fantasy");
    }
  }, [profile, authLoading, router]);

  useEffect(() => {
    fetchGameweeks();
  }, []);

  const fetchGameweeks = async () => {
    try {
      const response = await fetch("/api/admin/gameweeks");
      const data = await response.json();

      // Validate data is an array
      if (Array.isArray(data)) {
        setGameweeks(data);
      } else {
        console.error("Invalid gameweeks data:", data);
        setGameweeks([]);
      }
    } catch (error) {
      console.error("Error fetching gameweeks:", error);
      setGameweeks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingGameweek(null);
    setFormData({
      round_number: "",
      round_name: "",
      match_date: "",
      deadline_at: "",
    });
    setShowModal(true);
  };

  const handleEdit = (gameweek: Gameweek) => {
    setEditingGameweek(gameweek);
    setFormData({
      round_number: gameweek.round_number.toString(),
      round_name: gameweek.round_name,
      match_date: gameweek.match_date.split("T")[0],
      deadline_at: new Date(gameweek.deadline_at).toISOString().slice(0, 16),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...(editingGameweek && { id: editingGameweek.id }),
        round_number: parseInt(formData.round_number),
        round_name: formData.round_name,
        match_date: formData.match_date,
        deadline_at: new Date(formData.deadline_at).toISOString(),
      };

      const response = await fetch("/api/admin/gameweeks", {
        method: editingGameweek ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save gameweek");

      setShowModal(false);
      fetchGameweeks();
    } catch (error: any) {
      alert("Error saving gameweek: " + error.message);
    }
  };

  const handleComplete = async (id: number) => {
    if (!confirm("Mark this gameweek as completed?")) return;

    try {
      const response = await fetch("/api/admin/gameweeks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_completed: true }),
      });

      if (!response.ok) throw new Error("Failed to complete gameweek");

      fetchGameweeks();
    } catch (error: any) {
      alert("Error completing gameweek: " + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this gameweek?")) return;

    try {
      const response = await fetch(`/api/admin/gameweeks?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete gameweek");

      fetchGameweeks();
    } catch (error: any) {
      alert("Error deleting gameweek: " + error.message);
    }
  };

  if (authLoading || loading) {
    return <div className="loading">Loading...</div>;
  }

  // Redirect non-admin users
  if (!profile || !profile.is_admin) {
    return null;
  }

  return (
    <div className="admin-page">
      <AdminNav currentPage="gameweeks" />
      <div className="admin-header">
        <h1>Manage Gameweeks</h1>
        <button onClick={handleAdd} className="add-button">
          Add Gameweek
        </button>
      </div>

      <table className="gameweeks-table">
        <thead>
          <tr>
            <th>Round</th>
            <th>Name</th>
            <th>Match Date</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gameweeks.map((gw) => (
            <tr key={gw.id}>
              <td>{gw.round_number}</td>
              <td>{gw.round_name}</td>
              <td>{new Date(gw.match_date).toLocaleDateString()}</td>
              <td>{new Date(gw.deadline_at).toLocaleString()}</td>
              <td>
                <span
                  className={`status ${gw.is_completed ? "completed" : "active"}`}
                >
                  {gw.is_completed ? "Completed" : "Active"}
                </span>
              </td>
              <td className="actions">
                {!gw.is_completed && (
                  <>
                    <button onClick={() => handleEdit(gw)} className="edit-btn">
                      Edit
                    </button>
                    <button
                      onClick={() => handleComplete(gw.id)}
                      className="complete-btn"
                    >
                      Complete
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(gw.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingGameweek ? "Edit Gameweek" : "Add Gameweek"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Round Number</label>
                <input
                  type="number"
                  value={formData.round_number}
                  onChange={(e) =>
                    setFormData({ ...formData, round_number: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Round Name</label>
                <input
                  type="text"
                  value={formData.round_name}
                  onChange={(e) =>
                    setFormData({ ...formData, round_name: e.target.value })
                  }
                  placeholder="e.g., Runde 1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Match Date</label>
                <input
                  type="date"
                  value={formData.match_date}
                  onChange={(e) =>
                    setFormData({ ...formData, match_date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="datetime-local"
                  value={formData.deadline_at}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline_at: e.target.value })
                  }
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-button">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 100vh;
          background: #0a0a0a;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        h1 {
          color: white;
          font-weight: bold;
        }
        .add-button {
          padding: 0.75rem 1.5rem;
          background: #5dbc6f;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .add-button:hover {
          background: #4da85e;
        }
        .gameweeks-table {
          width: 100%;
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 12px;
          overflow: hidden;
        }
        .gameweeks-table th,
        .gameweeks-table td {
          padding: 1rem;
          text-align: left;
          color: white;
        }
        .gameweeks-table th {
          background: #2a2a2a;
          font-weight: 600;
        }
        .gameweeks-table tr:not(:last-child) {
          border-bottom: 1px solid #2a2a2a;
        }
        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .status.active {
          background: #1a2a3a;
          color: #64b5f6;
        }
        .status.completed {
          background: #1a2a1a;
          color: #5dbc6f;
        }
        .actions {
          display: flex;
          gap: 0.5rem;
        }
        .edit-btn,
        .complete-btn,
        .delete-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .edit-btn {
          background: #2196f3;
          color: white;
        }
        .edit-btn:hover {
          background: #1976d2;
        }
        .complete-btn {
          background: #5dbc6f;
          color: white;
        }
        .complete-btn:hover {
          background: #4da85e;
        }
        .delete-btn {
          background: #ff4444;
          color: white;
        }
        .delete-btn:hover {
          background: #cc3333;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal {
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          padding: 2rem;
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
        }
        h2 {
          color: white;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: gray;
        }
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #2a2a2a;
          background: #0a0a0a;
          color: white;
          border-radius: 8px;
        }
        .form-group input:focus {
          outline: none;
          border-color: #5dbc6f;
        }
        .modal-actions {
          display: flex;
          gap: 1rem;
        }
        .submit-button,
        .cancel-button {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .submit-button {
          background: #5dbc6f;
          color: white;
        }
        .submit-button:hover {
          background: #4da85e;
        }
        .cancel-button {
          background: #2a2a2a;
          color: white;
        }
        .cancel-button:hover {
          background: #3a3a3a;
        }
        .loading {
          text-align: center;
          padding: 2rem;
          color: white;
        }
      `}</style>
    </div>
  );
}
