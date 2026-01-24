import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import { Gameweek } from "../../types/Gameweek";

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
      setGameweeks(data);
    } catch (error) {
      console.error("Error fetching gameweeks:", error);
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

  return (
    <div className="admin-page">
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
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .add-button {
          padding: 0.75rem 1.5rem;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .gameweeks-table {
          width: 100%;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .gameweeks-table th,
        .gameweeks-table td {
          padding: 1rem;
          text-align: left;
        }
        .gameweeks-table th {
          background: #f5f5f5;
          font-weight: 600;
        }
        .gameweeks-table tr:not(:last-child) {
          border-bottom: 1px solid #eee;
        }
        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .status.active {
          background: #e3f2fd;
          color: #1976d2;
        }
        .status.completed {
          background: #e8f5e9;
          color: #388e3c;
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
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .edit-btn {
          background: #2196f3;
          color: white;
        }
        .complete-btn {
          background: #4caf50;
          color: white;
        }
        .delete-btn {
          background: #f44336;
          color: white;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 500px;
          width: 90%;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
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
          border-radius: 4px;
          cursor: pointer;
        }
        .submit-button {
          background: #4caf50;
          color: white;
        }
        .cancel-button {
          background: #f5f5f5;
        }
        .loading {
          text-align: center;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}
