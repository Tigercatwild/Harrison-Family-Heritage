'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import PageLayout from '../../components/PageLayout'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(false) // Start with registration
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      console.log('Starting registration...')
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      })

      console.log('Registration result:', { data, error })

      if (error) {
        throw error
      }

      if (data?.user) {
        // Try to add user info to family_members table
        try {
          const { data: memberData, error: memberError } = await supabase
            .from('family_members')
            .insert([
              {
                user_id: data.user.id,
                first_name: firstName,
                last_name: lastName,
                email: email
              }
            ])
            .select()

          console.log('Member data insert:', { memberData, memberError })
        } catch (memberErr) {
          console.log('Member insert failed, but registration succeeded:', memberErr)
        }

        setMessage('Registration successful! You can now sign in.')
        // Clear form and switch to login
        setEmail('')
        setPassword('')
        setFirstName('')
        setLastName('')
        setIsLogin(true)
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError(error.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (error) throw error

      if (data?.user) {
        setMessage('Login successful!')
        // You can redirect to dashboard here later
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
        minHeight: '100vh',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: '40px',
          width: '100%',
          maxWidth: '500px'
        }}>
          <h1 style={{ 
            textAlign: 'center', 
            marginBottom: '30px',
            fontSize: '28px',
            color: '#1a202c'
          }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </h1>

          <form onSubmit={isLogin ? handleSignIn : handleSignUp}>
            {!isLogin && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {error && (
              <div style={{
                background: '#fed7d7',
                color: '#c53030',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {message && (
              <div style={{
                background: '#c6f6d5',
                color: '#22543d',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#a0aec0' : '#4c51bf',
                color: 'white',
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setMessage('')
              }}
              style={{
                color: '#4c51bf',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
