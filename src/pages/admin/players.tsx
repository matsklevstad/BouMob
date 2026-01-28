import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase/client";
import { Player } from "../../types/Player";
import AdminNav from "../../components/AdminNav/AdminNav";

export default function AdminPlayersPage() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    position: "",
    price: "",
    photo_url: "",
  });

  useEffect(() => {
    if (!authLoading && (!profile || !profile.is_admin)) {
      router.push("/fantasy");
    }
  }, [profile, authLoading, router]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/admin/players");
      const data = await response.json();

      // Validate data is an array
      if (Array.isArray(data)) {
        setPlayers(data);
      } else {
        console.error("Invalid players data:", data);
        setPlayers([]);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPlayer(null);
    setFormData({
      first_name: "",
      last_name: "",
      position: "",
      price: "",
      photo_url: "",
    });
    setShowModal(true);
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      first_name: player.first_name || "",
      last_name: player.last_name || "",
      position: player.position || "",
      price: player.price?.toString() || "",
      photo_url: player.photo_url || "",
    });
    setShowModal(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("player-photos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("player-photos").getPublicUrl(filePath);

      setFormData({ ...formData, photo_url: publicUrl });
    } catch (error: any) {
      alert("Error uploading photo: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...(editingPlayer && { id: editingPlayer.id }),
        first_name: formData.first_name,
        last_name: formData.last_name,
        position: formData.position,
        price: parseFloat(formData.price),
        photo_url: formData.photo_url,
      };

      const response = await fetch("/api/admin/players", {
        method: editingPlayer ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save player");

      setShowModal(false);
      fetchPlayers();
    } catch (error: any) {
      alert("Error saving player: " + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this player?")) return;

    try {
      const response = await fetch(`/api/admin/players?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete player");

      fetchPlayers();
    } catch (error: any) {
      alert("Error deleting player: " + error.message);
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
      <AdminNav currentPage="players" />
      <div className="admin-header">
        <h1>Manage Players</h1>
        <button onClick={handleAdd} className="add-button">
          Add Player
        </button>
      </div>

      <div className="players-grid">
        {players.map((player) => (
          <div key={player.id} className="player-card">
            {player.photo_url && (
              <img
                src={player.photo_url}
                alt={`${player.first_name} ${player.last_name}`}
              />
            )}
            <div className="player-info">
              <h3>
                {player.first_name} {player.last_name}
              </h3>
              <p className="position">{player.position || "N/A"}</p>
              <p className="price">{player.price}M</p>
            </div>
            <div className="player-actions">
              <button
                onClick={() => handleEdit(player)}
                className="edit-button"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(player.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingPlayer ? "Edit Player" : "Add Player"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="e.g., Forward, Midfielder, Defender"
                />
              </div>
              <div className="form-group">
                <label>Price (in millions)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                />
                {uploading && <p>Uploading...</p>}
                {formData.photo_url && (
                  <img
                    src={formData.photo_url}
                    alt="Preview"
                    className="photo-preview"
                  />
                )}
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
        h3 {
          color: white;
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
        .players-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        .player-card {
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.2s;
        }
        .player-card:hover {
          border-color: #5dbc6f;
        }
        .player-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        .player-info h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          color: white;
        }
        .position {
          color: gray;
          font-size: 0.9rem;
          margin: 0.25rem 0;
        }
        .price {
          font-weight: bold;
          color: #5dbc6f;
          margin: 0.25rem 0;
        }
        .player-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .edit-button,
        .delete-button {
          flex: 1;
          padding: 0.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .edit-button {
          background: #2196f3;
          color: white;
        }
        .edit-button:hover {
          background: #1976d2;
        }
        .delete-button {
          background: #ff4444;
          color: white;
        }
        .delete-button:hover {
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
          max-height: 90vh;
          overflow-y: auto;
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
        .photo-preview {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          margin-top: 0.5rem;
          border-radius: 8px;
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
