import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('Login failed');

      const resData = await res.json();
      const userRole = resData.data.role;
      localStorage.setItem('role', userRole);
      onLoginSuccess();

      if (userRole === "user") {
        navigate('/dashboard');
      } else {
        navigate('/reportManager');
      }

    } catch (err) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="login-container">
      <h2>เข้าสู่ระบบ</h2>
      <form onSubmit={handleLogin}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ชื่อผู้ใช้"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="รหัสผ่าน"
          required
        />
        <button type="submit">เข้าสู่ระบบ</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
