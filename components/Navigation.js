'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (sectionId) => {
    // If we're on the homepage, just scroll to section
    if (pathname === '/') {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // If we're on a different page, navigate to homepage with hash
      router.push(`/#${sectionId}`)
    }
    setMobileMenuOpen(false)
  }

  const handleHomeNavigation = () => {
    if (pathname === '/') {
      // If already on homepage, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Navigate to homepage
      router.push('/')
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      <style jsx>{`
        .nav-link {
          color: #4b5563;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          padding: 8px 16px;
          transition: color 0.3s ease;
          white-space: nowrap;
          cursor: pointer;
        }
        
        .nav-link:hover {
          color: #2563eb;
        }
        
        .login-btn {
          background-color: #2563eb;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: background-color 0.3s ease;
          white-space: nowrap;
          cursor: pointer;
        }
        
        .login-btn:hover {
          background-color: #1d4ed8;
        }
        
        .mobile-menu-btn {
          color: #4b5563;
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
        }
        
        .mobile-menu-btn:hover {
          color: #2563eb;
        }

        @media (min-width: 1024px) {
          .desktop-menu {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
      `}</style>
      
      <nav style={{
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0'
          }}>
            {/* Logo */}
            <div style={{ flexShrink: 0 }}>
              <h1 
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
                onClick={handleHomeNavigation}
              >
                Harrison Family
              </h1>
            </div>
            
            {/* Desktop Menu */}
            <div style={{
              display: 'none',
              alignItems: 'center',
              gap: '24px',
              flexShrink: 0
            }} className="desktop-menu">
              <span className="nav-link" onClick={handleHomeNavigation}>
                Home
              </span>
              <span className="nav-link" onClick={() => handleNavigation('family-tree')}>
                Family Tree
              </span>
              <span className="nav-link" onClick={() => handleNavigation('history')}>
                History
              </span>
              <span className="nav-link" onClick={() => handleNavigation('directory')}>
                Directory
              </span>
              <span className="nav-link" onClick={() => handleNavigation('gallery')}>
                Gallery
              </span>
              <span 
                className="login-btn" 
                onClick={() => {
                  router.push('/login')
                }}
              >
                Login
              </span>
            </div>
            
            {/* Mobile menu button */}
            <div style={{ display: 'block' }} className="mobile-menu-toggle">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-menu-btn"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '16px',
              paddingBottom: '16px'
            }} className="mobile-menu">
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <span className="nav-link" onClick={handleHomeNavigation}>
                  Home
                </span>
                <span className="nav-link" onClick={() => handleNavigation('family-tree')}>
                  Family Tree
                </span>
                <span className="nav-link" onClick={() => handleNavigation('history')}>
                  History
                </span>
                <span className="nav-link" onClick={() => handleNavigation('directory')}>
                  Directory
                </span>
                <span className="nav-link" onClick={() => handleNavigation('gallery')}>
                  Gallery
                </span>
                <span 
                  className="login-btn" 
                  style={{ textAlign: 'center', margin: '8px' }}
                  onClick={() => {
                    router.push('/login')
                    setMobileMenuOpen(false)
                  }}
                >
                  Login
                </span>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
