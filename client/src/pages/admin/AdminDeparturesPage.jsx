import React, { useEffect, useState } from 'react';
import { Calendar, Users, Moon, Edit2, Save, X, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminDeparturesPage() {
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [statusMsg, setStatusMsg] = useState(null);

  const loadDepartures = async () => {
    try {
      const res = await api.getAdminDepartures();
      setDepartures(res.departures || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartures();
  }, []);

  const handleEditClick = (dep) => {
    setEditingId(dep.id);
    setFormData({
      name: dep.name,
      totalCapacity: dep.totalCapacity,
      bookedSeats: dep.bookedSeats,
      status: dep.status,
      isFullMoon: dep.isFullMoon,
      description: dep.description || '',
    });
  };

  const handleSave = async (id) => {
    try {
      await api.updateAdminDeparture(id, {
        name: formData.name,
        totalCapacity: Number(formData.totalCapacity),
        bookedSeats: Number(formData.bookedSeats),
        status: formData.status,
        isFullMoon: Boolean(formData.isFullMoon),
        description: formData.description,
      });
      setStatusMsg('Departure batch updated successfully');
      setEditingId(null);
      loadDepartures();
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      alert('Failed to update departure: ' + err.message);
    }
  };

  return (
    <AdminLayout title="2027 Departure Batches Management" subtitle="Manage capacity allocation, real-time seat bookings, and status flags">
      {statusMsg && (
        <div style={{ background: 'rgba(47, 111, 237, 0.15)', border: '1px solid #2F6FED', color: '#FFFFFF', padding: '12px 18px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} color="#2F6FED" />
          <span>{statusMsg}</span>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#D9E2EF' }}>Loading departures...</p>
      ) : (
        <div style={{ overflowX: 'auto', background: '#071B3A', borderRadius: '18px', border: '1px solid #102C52' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', fontSize: '0.9rem', color: '#FFFFFF' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #102C52', background: '#041329', color: '#D9E2EF', textAlign: 'left' }}>
                <th style={{ padding: '16px 20px' }}>#</th>
                <th style={{ padding: '16px 20px' }}>Batch Name</th>
                <th style={{ padding: '16px 20px' }}>Dates</th>
                <th style={{ padding: '16px 20px' }}>Capacity</th>
                <th style={{ padding: '16px 20px' }}>Booked Seats</th>
                <th style={{ padding: '16px 20px' }}>Full Moon</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departures.map((dep) => {
                const isEditing = editingId === dep.id;
                return (
                  <tr key={dep.id} style={{ borderBottom: '1px solid #102C52' }}>
                    <td style={{ padding: '16px 20px', color: '#2F6FED', fontWeight: 700 }}>{dep.batchNumber}</td>
                    <td style={{ padding: '16px 20px' }}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          style={{ padding: '6px 10px', fontSize: '0.85rem', background: '#102C52', color: '#FFFFFF', border: '1px solid #2F6FED', borderRadius: '6px' }}
                        />
                      ) : (
                        <b>{dep.name}</b>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#D9E2EF' }}>
                      {new Date(dep.arrivalDate).toLocaleDateString()} – {new Date(dep.departureDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.totalCapacity}
                          onChange={(e) => setFormData({ ...formData, totalCapacity: e.target.value })}
                          style={{ width: '70px', padding: '6px 10px', fontSize: '0.85rem', background: '#102C52', color: '#FFFFFF', border: '1px solid #2F6FED', borderRadius: '6px' }}
                        />
                      ) : (
                        <span>{dep.totalCapacity}</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.bookedSeats}
                          onChange={(e) => setFormData({ ...formData, bookedSeats: e.target.value })}
                          style={{ width: '70px', padding: '6px 10px', fontSize: '0.85rem', background: '#102C52', color: '#FFFFFF', border: '1px solid #2F6FED', borderRadius: '6px' }}
                        />
                      ) : (
                        <span>{dep.bookedSeats}</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={formData.isFullMoon}
                          onChange={(e) => setFormData({ ...formData, isFullMoon: e.target.checked })}
                          style={{ accentColor: '#2F6FED' }}
                        />
                      ) : dep.isFullMoon ? (
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, background: '#102C52', color: '#FFFFFF', border: '1px solid #2F6FED' }}>
                          Full Moon
                        </span>
                      ) : (
                        <span style={{ color: '#D9E2EF' }}>No</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {isEditing ? (
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          style={{ padding: '6px 10px', fontSize: '0.85rem', background: '#102C52', color: '#FFFFFF', border: '1px solid #2F6FED', borderRadius: '6px' }}
                        >
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="FAST_FILLING">FAST_FILLING</option>
                          <option value="SOLD_OUT">SOLD_OUT</option>
                        </select>
                      ) : (
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            background: dep.status === 'AVAILABLE' ? '#2F6FED' : dep.status === 'FAST_FILLING' ? '#102C52' : '#DC2626',
                            color: '#FFFFFF',
                            border: dep.status === 'FAST_FILLING' ? '1px solid #2F6FED' : 'none',
                          }}
                        >
                          {dep.status}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      {isEditing ? (
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handleSave(dep.id)}
                            style={{ padding: '6px 14px', borderRadius: '999px', background: '#2F6FED', color: '#FFFFFF', border: 'none', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Save size={14} /> Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{ padding: '6px 10px', borderRadius: '999px', background: 'transparent', color: '#FFFFFF', border: '1px solid #D9E2EF', fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(dep)}
                          style={{ padding: '6px 14px', borderRadius: '999px', background: '#102C52', color: '#FFFFFF', border: '1px solid #2F6FED', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
