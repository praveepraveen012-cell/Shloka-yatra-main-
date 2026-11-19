import React, { useEffect, useState } from 'react';
import { DollarSign, Save, Edit2, X, CheckCircle2 } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

export default function AdminPricingPage() {
  const [pricingTiers, setPricingTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [statusMsg, setStatusMsg] = useState(null);

  const loadPricing = async () => {
    try {
      const res = await api.getAdminPricing();
      setPricingTiers(res.pricingTiers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPricing();
  }, []);

  const handleEditClick = (tier) => {
    setEditingId(tier.id);
    setFormData({
      basePrice: tier.basePrice,
      gstPercentage: tier.gstPercentage,
      foreignAirfareSupplement: tier.foreignAirfareSupplement,
      depositRequired: tier.depositRequired,
    });
  };

  const handleSave = async (id) => {
    try {
      await api.updateAdminPricingTier(id, {
        basePrice: Number(formData.basePrice),
        gstPercentage: Number(formData.gstPercentage),
        foreignAirfareSupplement: Number(formData.foreignAirfareSupplement),
        depositRequired: Number(formData.depositRequired),
      });
      setStatusMsg('Pricing tier updated successfully');
      setEditingId(null);
      loadPricing();
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      alert('Error updating pricing: ' + err.message);
    }
  };

  return (
    <AdminLayout title="Database-Managed Route Pricing" subtitle="Control base rates, GST percentages, and foreign airfare sector supplements">
      {statusMsg && (
        <div style={{ background: 'rgba(47, 111, 237, 0.15)', border: '1px solid #2F6FED', color: '#FFFFFF', padding: '12px 18px', borderRadius: '10px', marginBottom: '20px' }}>
          {statusMsg}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#D9E2EF' }}>Loading pricing tiers...</p>
      ) : (
        <div style={{ overflowX: 'auto', background: '#071B3A', borderRadius: '18px', border: '1px solid #102C52' }}>
          <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', fontSize: '0.9rem', color: '#FFFFFF' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #102C52', background: '#041329', color: '#D9E2EF', textAlign: 'left' }}>
                <th style={{ padding: '16px 20px' }}>Route Package</th>
                <th style={{ padding: '16px 20px' }}>Passport Category</th>
                <th style={{ padding: '16px 20px' }}>Base Price (INR)</th>
                <th style={{ padding: '16px 20px' }}>GST Rate (%)</th>
                <th style={{ padding: '16px 20px' }}>Air Supplement (USD)</th>
                <th style={{ padding: '16px 20px' }}>Deposit Req. (INR)</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pricingTiers.map((tier) => {
                const isEditing = editingId === tier.id;
                return (
                  <tr key={tier.id} style={{ borderBottom: '1px solid #102C52' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <b>{tier.route?.name}</b>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: '#102C52',
                          color: '#FFFFFF',
                          border: '1px solid #2F6FED',
                        }}
                      >
                        {tier.passportType}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.basePrice}
                          onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                          style={{ width: '120px', padding: '6px 10px', fontSize: '0.85rem', background: '#102C52', color: '#FFFFFF', border: '1px solid #2F6FED', borderRadius: '6px' }}
                        />
                      ) : (
                        <b style={{ color: '#FFFFFF', fontSize: '1rem' }}>₹{tier.basePrice.toLocaleString('en-IN')}</b>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#D9E2EF' }}>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          value={formData.gstPercentage}
                          onChange={(e) => setFormData({ ...formData, gstPercentage: e.target.value })}
                          style={{ width: '60px', padding: '6px 10px', fontSize: '0.85rem', background: '#102C52', color: '#FFFFFF', border: '1px solid #2F6FED', borderRadius: '6px' }}
                        />
                      ) : (
                        <span>{tier.gstPercentage}%</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#D9E2EF' }}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.foreignAirfareSupplement}
                          onChange={(e) => setFormData({ ...formData, foreignAirfareSupplement: e.target.value })}
                          style={{ width: '80px', padding: '6px 10px', fontSize: '0.85rem', background: '#102C52', color: '#FFFFFF', border: '1px solid #2F6FED', borderRadius: '6px' }}
                        />
                      ) : (
                        <span>${tier.foreignAirfareSupplement}</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#D9E2EF' }}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={formData.depositRequired}
                          onChange={(e) => setFormData({ ...formData, depositRequired: e.target.value })}
                          style={{ width: '100px', padding: '6px 10px', fontSize: '0.85rem', background: '#102C52', color: '#FFFFFF', border: '1px solid #2F6FED', borderRadius: '6px' }}
                        />
                      ) : (
                        <span>₹{tier.depositRequired.toLocaleString('en-IN')}</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      {isEditing ? (
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => handleSave(tier.id)}
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
                          onClick={() => handleEditClick(tier)}
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
