import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notes.css';
import { BASE_URL } from '../utils';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadNotes();
  }, []); // eslint-disable-line

  const loadNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/notes/user/${user.id}`);
      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!judul.trim()) return;
    setSaving(true);
    try {
      if (editId) {
        await fetch(`${BASE_URL}/api/notes/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ judul, isi }),
        });
        setEditId(null);
      } else {
        await fetch(`${BASE_URL}/api/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ judul, isi, user_id: user.id }),
        });
      }
      setJudul('');
      setIsi('');
      await loadNotes();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (note) => {
    setEditId(note.id);
    setJudul(note.judul);
    setIsi(note.isi);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus catatan ini?')) {
      await fetch(`${BASE_URL}/api/notes/${id}`, { method: 'DELETE' });
      loadNotes();
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setJudul('');
    setIsi('');
  };

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const initials = user?.nama?.slice(0, 2).toUpperCase() || 'U';

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch { return ''; }
  };

  return (
    <div className="notes-page">

      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-brand">
          <div className="topbar-brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          Notes
        </div>
        <div className="topbar-right">
          <div className="avatar">{initials}</div>
          <span className="user-name">{user?.nama}</span>
          <button className="btn-logout" onClick={logout}>Keluar</button>
        </div>
      </header>

      <main className="main">

        {/* Form */}
        <div className="form-card">
          <p className="form-card-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {editId ? 'Edit catatan' : 'Catatan baru'}
          </p>
          <input
            className="field-input"
            placeholder="Judul catatan"
            value={judul}
            onChange={e => setJudul(e.target.value)}
          />
          <textarea
            className="field-input"
            placeholder="Tulis isi catatanmu di sini..."
            value={isi}
            onChange={e => setIsi(e.target.value)}
          />
          <div className="form-actions">
            <button className="btn-save" onClick={handleSave} disabled={saving || !judul.trim()}>
              {saving ? 'Menyimpan...' : editId ? 'Simpan perubahan' : 'Simpan catatan'}
            </button>
            {editId && (
              <button className="btn-cancel" onClick={handleCancel}>Batal</button>
            )}
          </div>
        </div>

        {/* Notes list */}
        <div className="section-header">
          <span className="section-title">Catatanku</span>
          <span className="notes-count">{notes.length} catatan</span>
        </div>

        {loading ? (
          <div className="loading-row">
            {[1, 2, 3].map(i => <div key={i} className="skeleton" />)}
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <p>Belum ada catatan. Mulai tulis sekarang!</p>
          </div>
        ) : (
          <div className="notes-list">
            {notes.map(note => (
              <div key={note.id} className={`note-card${editId === note.id ? ' editing' : ''}`}>
                <div className="note-header">
                  <h3 className="note-title">{note.judul}</h3>
                </div>
                {note.isi && <p className="note-body">{note.isi}</p>}
                <div className="note-footer">
                  <span className="note-date">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {formatDate(note.tanggal_dibuat)}
                  </span>
                  <div className="note-actions">
                    <button className="btn-icon" onClick={() => handleEdit(note)} title="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="btn-icon danger" onClick={() => handleDelete(note.id)} title="Hapus">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}