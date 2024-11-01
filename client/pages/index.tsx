import React from 'react';
import { ShoppingBag } from 'lucide-react';

const LoginPage: React.FC = () => {
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // 50% black overlay to dim background
      }}></div>

      {/* Full-Width Navbar */}
      <nav
        style={{
          backgroundColor: '#FF0000',
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

        {/* Centered Sign In Text */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>SIGN IN</span>
        </div>

        {/* Order Now Icon aligned to the right */}
        <a href="/cashier" style={{ color: '#FFFFFF', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <ShoppingBag size={20} style={{ marginRight: '5px' }} />
          <span style={{ fontWeight: 'bold' }}>Order Now</span>
        </a>
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
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slight white background for readability
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
          <h2 style={{ fontSize: '22px', color: '#D32F2F', margin: 0 }}>GOOD FORTUNE AWAITS</h2>
          <p style={{ color: '#888', fontSize: '14px' }}>Log in below to get started.</p>

          {/* Form */}
          <form>
            <input
              type="email"
              placeholder="Email Address"
              style={{
                width: '100%',
                padding: '10px',
                margin: '10px 0',
                border: '1px solid #CCC',
                borderRadius: '4px'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              style={{
                width: '100%',
                padding: '10px',
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
                backgroundColor: '#D32F2F',
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

          {/* Sign Up Link */}
          <p style={{ fontSize: '14px', color: '#888', marginTop: '15px' }}>
            Don't have an account? <a href="#" style={{ color: '#D32F2F', textDecoration: 'none' }}>Sign up now</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
