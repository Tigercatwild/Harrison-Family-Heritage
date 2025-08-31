'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setMessage('Login successful! Redirecting to dashboard...');
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        }
      } else {
        // Registration mode
        console.log('Starting registration process...');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          console.log('User created successfully:', data.user.id);
          console.log('Attempting to create profile via API...');
          
          // Create user profile using API route with service role
          try {
            const profileData = {
              user_id: data.user.id,
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              email: email.trim(),
              created_at: new Date().toISOString()
            };

            console.log('Profile data to send to API:', profileData);

            const response = await fetch('/api/create-profile', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(profileData),
            });

            const result = await response.json();
            console.log('API Response:', result);

            if (response.ok && result.success) {
              console.log('Profile created successfully via API');
              setMessage('Registration successful! Please check your email to confirm your account.');
            } else {
              console.error('Profile creation failed via API:', result.error);
              setMessage('Account created successfully, but there was an issue saving your profile. Please contact support.');
            }
          } catch (profileCatchError) {
            console.error('Profile creation API call error:', profileCatchError);
            setMessage('Account created successfully, but there was an issue saving your profile. Please contact support.');
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navigation />
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '48px 16px',
        paddingTop: '100px',
        flex: 1
      }}>
        <div style={{ 
          maxWidth: '480px', 
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          padding: '48px 40px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: '600', 
              color: '#333333',
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p style={{ 
              color: '#666666', 
              fontSize: '16px',
              margin: 0
            }}>
              {isLogin 
                ? 'Access the Harrison Family Heritage portal' 
                : 'Join the Harrison Family Heritage community'
              }
            </p>
          </div>
          
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {!isLogin && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="firstName" style={{ 
                    display: 'block', 
                    fontSize: '15px', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required={!isLogin}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '15px',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#fafafa'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366f1';
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = '#fafafa';
                    }}
                    placeholder="Enter your first name"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor="lastName" style={{ 
                    display: 'block', 
                    fontSize: '15px', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required={!isLogin}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '15px',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#fafafa'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366f1';
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = '#fafafa';
                    }}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" style={{ 
                display: 'block', 
                fontSize: '15px', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#fafafa'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = '#fafafa';
                }}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" style={{ 
                display: 'block', 
                fontSize: '15px', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#fafafa'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = '#fafafa';
                }}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '12px',
                color: 'white',
                background: loading 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                transform: loading ? 'none' : 'translateY(0)',
                boxShadow: loading 
                  ? 'none' 
                  : '0 4px 16px rgba(102, 126, 234, 0.4)',
                marginTop: '8px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
                }
              }}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>

            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage('');
                  setFirstName('');
                  setLastName('');
                }}
                style={{
                  color: '#6366f1',
                  fontSize: '15px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            {message && (
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                fontSize: '14px',
                marginTop: '8px',
                backgroundColor: message.includes('successful') || message.includes('check your email')
                  ? '#f0f9ff' : '#fef2f2',
                color: message.includes('successful') || message.includes('check your email')
                  ? '#0369a1' : '#dc2626',
                border: `2px solid ${message.includes('successful') || message.includes('check your email')
                  ? '#bae6fd' : '#fecaca'}`,
                fontWeight: '500'
              }}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
