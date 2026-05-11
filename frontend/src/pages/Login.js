import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { BASE_URL } from '../utils';


export default function Login() {
  const [nama, setNama] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!nama.trim() || !password.trim()) {
      setErr('Nama dan password wajib diisi.');
      return;
    }
    setErr('');
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/notes');
      } else {
        setErr(data.message || 'Login gagal.');
      }
    } catch {
      setErr('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>

        <h1 className="auth-title">Masuk ke akun</h1>
        <p className="auth-sub">Kelola catatan harianmu</p>

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
          placeholder="Masukkan password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKey}
        />

        <button className="btn-primary" onClick={handleLogin} disabled={loading}>
          {loading ? 'Memproses...' : 'Masuk'}
        </button>

        {err && <div className="auth-err">{err}</div>}

        <p className="auth-footer">
          Belum punya akun? <Link to="/register">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}