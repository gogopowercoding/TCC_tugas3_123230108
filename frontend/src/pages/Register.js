import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import { BASE_URL } from '../utils';

export default function Register() {
  const [nama, setNama] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!nama.trim() || !password.trim()) {
      setErr('Nama dan password wajib diisi.');
      return;
    }
    setErr('');
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, password }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/login');
      } else {
        setErr(data.message || 'Gagal mendaftar.');
      }
    } catch {
      setErr('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleRegister(); };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
            <line x1="12" y1="11" x2="12" y2="17"/>
            <line x1="9" y1="14" x2="15" y2="14"/>
          </svg>
        </div>

        <h1 className="auth-title">Buat akun baru</h1>
        <p className="auth-sub">Mulai catat idemu hari ini</p>

        <label className="field-label">Nama</label>
        <input
          className="field-input"
          placeholder="Masukkan nama"
          value={nama}
          onChange={e => setNama(e.target.value)}
          onKeyDown={handleKey}
        />

        <label className="field-label">Password</label>
        <input
          className="field-input"
          type="password"
          placeholder="Buat password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKey}
        />
        <p className="password-hint">Minimal 6 karakter</p>

        <button className="btn-primary" onClick={handleRegister} disabled={loading}>
          {loading ? 'Mendaftar...' : 'Daftar'}
        </button>

        {err && <div className="auth-err">{err}</div>}

        <p className="auth-footer">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}