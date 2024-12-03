import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/components/ui/user_context';
import { useTheme } from '@/components/context/theme_context';


const LoginPage: React.FC = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "night");
  }, [theme]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      console.log('Login response data:', data);
      
      setUser({role: data.role});
      if (data.role) {
        sessionStorage.setItem('staff_id', data.staff_id);
        console.log(sessionStorage.getItem('staff_id'));

        if (data.role === 'cashier') router.push('/cashier');
        else if (data.role === 'manager') router.push('/manager');
      } else { 
        router.push('/login');
        setError('Unauthorized role');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error or server not reachable');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: 'url(https://thecounter.org/wp-content/uploads/2022/02/worker-takes-customers-order-at-panda-express-garden-grove-CA-Nov-17-2021-1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Dim Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: theme === 'day' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', // Adjust overlay based on theme
      }}></div>

      {/* Full-Width Navbar */}
      <nav
        style={{
          backgroundColor: 'var(--primary)',
          color: '#FFFFFF',
          padding: '15px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          position: 'absolute',
          top: 0,
          zIndex: 1
        }}
      >
        {/* Panda Express Logo aligned to the left */}
        <img
          src="https://s3.amazonaws.com/PandaExpressWebsite/Responsive/img/home/logo.png"
          alt="Panda Express Logo"
          style={{ width: '80px' }}
        />

        {/* Menu Text */}          
        <a 
          href="/" 
          style={{ 
            color: '#FFFFFF', 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)'
          }}
        >
          <span style={{ fontWeight: 'bold' }}>Menu</span>
        </a>
        
        {/* Panda Express Logo aligned to the left */}
        <img
          src="https://s3.amazonaws.com/PandaExpressWebsite/Responsive/img/home/logo.png"
          alt="Panda Express Logo"
          style={{ width: '80px' }}
        />
      </nav>

      {/* Login Box - Spans Full Screen Width */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          marginTop: '60px',
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.65)', // Slight white background for readability
          borderRadius: '8px',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Content Box */}
        <div style={{ textAlign: 'center', padding: '20px', width: '100%' }}>
          <img
            src="https://s3.amazonaws.com/PandaExpressWebsite/www/px-enrollment-2023-hero-logo.svg"
            alt="Panda Rewards Logo"
            style={{ width: '200px', marginBottom: '40px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          />
          <h2 style={{ fontSize: '22px', color: 'var(--primary)', margin: 0 }}>GOOD FORTUNE AWAITS</h2>
          <p style={{ color: '#888', fontSize: '14px' }}>Log in below to get started.</p>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                color: '#171717',
                margin: '10px 0',
                border: '1px solid #CCC',
                borderRadius: '4px'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                color: '#171717',
                margin: '10px 0',
                border: '1px solid #CCC',
                borderRadius: '4px'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              SIGN IN
            </button>
          </form>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
