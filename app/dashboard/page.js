'use client'
import { useState, useEffect } from 'react'
import { getCurrentUser, signOut } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import PageLayout from '../../components/PageLayout'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
      } else {
        // Redirect to login if no user
        router.push('/login')
      }
    } catch (error) {
      console.error('Error checking user:', error)
      setError('Error loading user data')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      setError('Error signing out')
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)'
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#1a202c', marginBottom: '16px' }}>Loading...</h2>
            <p style={{ color: '#4a5568' }}>Please wait while we load your dashboard.</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
        minHeight: '100vh',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '8px'
              }}>
                Family Dashboard
              </h1>
              <p style={{
                color: '#4a5568',
                fontSize: '16px',
                margin: 0
              }}>
                Welcome back, {user?.email || 'Family Member'}!
              </p>
            </div>
            <button
              onClick={handleSignOut}
              style={{
                background: '#e53e3e',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c53030'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#e53e3e'}
            >
              Sign Out
            </button>
          </div>

          {error && (
            <div style={{
              background: '#fed7d7',
              color: '#c53030',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              {error}
            </div>
          )}

          {/* Dashboard Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {/* Family Members Section */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '16px'
              }}>
                👨‍👩‍👧‍👦 Family Members
              </h3>
              <p style={{ color: '#4a5568', marginBottom: '16px' }}>
                Manage family member information and relationships.
              </p>
              <button style={{
                background: '#4c51bf',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}>
                Add Family Member
              </button>
            </div>

            {/* Photo Gallery Section */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '16px'
              }}>
                📸 Photo Gallery
              </h3>
              <p style={{ color: '#4a5568', marginBottom: '16px' }}>
                Upload and manage family photos and memories.
              </p>
              <button style={{
                background: '#38a169',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}>
                Upload Photo
              </button>
            </div>

            {/* Family Updates Section */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '16px'
              }}>
                📢 Family Updates
              </h3>
              <p style={{ color: '#4a5568', marginBottom: '16px' }}>
                Share news and announcements with the family.
              </p>
              <button style={{
                background: '#d69e2e',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}>
                Post Update
              </button>
            </div>
          </div>

          {/* User Info Section */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginTop: '32px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '16px'
            }}>
              Account Information
            </h3>
            <div style={{
              background: '#f7fafc',
              padding: '16px',
              borderRadius: '8px'
            }}>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Created:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
