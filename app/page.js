'use client'
import PageLayout from '../components/PageLayout'
import FamilyTree from '../components/FamilyTree'

export default function HomePage() {
  return (
    <PageLayout>
      {/* Modern Clean Hero Section - Darker Colors */}
      <section id="home" style={{
        background: 'linear-gradient(135deg, #4c51bf 0%, #553c9a 25%, #9f7aea 50%, #e53e3e 75%, #3182ce 100%)',
        padding: '80px 0',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 64px)',
            fontWeight: '700',
            color: 'white',
            marginBottom: '24px',
            textShadow: '3px 3px 10px rgba(0,0,0,0.5)',
            lineHeight: '1.2'
          }}>
            Harrison Family Heritage
          </h1>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '24px',
            fontSize: '18px',
            color: 'white',
            marginBottom: '32px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '12px 20px',
              borderRadius: '25px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <span style={{ fontSize: '28px', marginRight: '8px' }}>🌿</span>
              <span style={{ fontWeight: '600' }}>Preserving Our Legacy</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '12px 20px',
              borderRadius: '25px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <span style={{ fontSize: '28px', marginRight: '8px' }}>🤝</span>
              <span style={{ fontWeight: '600' }}>Connecting Generations</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '12px 20px',
              borderRadius: '25px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <span style={{ fontSize: '28px', marginRight: '8px' }}>🏛️</span>
              <span style={{ fontWeight: '600' }}>Honoring Our Roots</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '24px',
            borderRadius: '16px',
            marginBottom: '32px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            maxWidth: '900px',
            margin: '0 auto 32px auto'
          }}>
            <p style={{
              fontSize: '20px',
              color: '#1a202c',
              margin: 0,
              lineHeight: '1.6',
              fontWeight: '500'
            }}>
              <strong style={{ color: '#4c51bf' }}>From Cuba to Florida:</strong> Discover the extraordinary journey of 
              <strong style={{ color: '#e53e3e' }}> John Rufus Harrison Sr.</strong> (originally Juan) who came from Cuba to Florida in the 1800s, 
              married <strong style={{ color: '#3182ce' }}>Mary Jones</strong>, and established a legacy through their <strong>three children: 
              Mary, John Rufus Jr., and Ronia Sr.</strong> Explore detailed family stories, birthdates, occupations, and the rich tapestry of our family heritage.
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <a href="#family-tree" style={{
              background: 'linear-gradient(135deg, #c53030, #9b2c2c)',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              boxShadow: '0 8px 20px rgba(155, 44, 44, 0.4)',
              transition: 'all 0.3s ease'
            }}>
              🌳 Explore Family Tree
            </a>
            <a href="/login" style={{
              background: 'linear-gradient(135deg, #2c5282, #2a4365)',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              boxShadow: '0 8px 20px rgba(42, 67, 101, 0.4)',
              transition: 'all 0.3s ease'
            }}>
              👤 Member Login
            </a>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </section>

      {/* Interactive Family Tree Section */}
      <section id="family-tree" style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
        padding: '80px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: 'clamp(36px, 6vw, 48px)', 
              fontWeight: '700', 
              color: '#1a202c',
              marginBottom: '16px'
            }}>
              Interactive Family Tree
            </h2>
            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              maxWidth: '800px',
              margin: '0 auto',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ 
                fontSize: '18px', 
                color: '#2d3748',
                margin: 0,
                lineHeight: '1.6',
                fontWeight: '500'
              }}>
                🔍 <strong style={{ color: '#1a202c' }}>Click any name</strong> to explore detailed biographical information including 
                birth dates, marriages, occupations, and life stories. <strong style={{ color: '#4c51bf' }}>All three children of John Rufus Sr. are represented:</strong> Mary, John Jr., and Ronia Sr.
              </p>
            </div>
          </div>

          <FamilyTree />
        </div>
      </section>

      {/* Family History Section */}
      <section id="history" style={{ 
        background: 'white',
        padding: '80px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: 'clamp(36px, 6vw, 48px)', 
              fontWeight: '700', 
              color: '#1a202c',
              marginBottom: '16px'
            }}>
              Our Family History
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#4a5568',
              maxWidth: '600px',
              margin: '0 auto',
              fontWeight: '500'
            }}>
              Detailed genealogical records spanning generations from the 1800s to present day
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {/* Cuban Origins */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
              border: '2px solid #9ae6b4'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
                🌿 Our Cuban Origins
              </h3>
              <p style={{ color: '#1a202c', lineHeight: '1.6', fontSize: '16px', fontWeight: '500' }}>
                <strong>John Rufus Harrison Sr.</strong> (originally <em>Juan</em>) was born in <strong>Cuba</strong> in the early 1800s. 
                He courageously journeyed to <strong style={{ color: '#e53e3e' }}>Jacksonville, Florida</strong> where he met and married 
                <strong style={{ color: '#3182ce' }}>Mary Jones</strong>. From this union came <strong style={{ color: '#4c51bf' }}>three children: 
                Mary Harrison, John Rufus Jr., and Ronia Sr.</strong>
              </p>
            </div>
            
            {/* Early Settlement */}
            <div style={{
              background: 'linear-gradient(135deg, #faf5ff 0%, #e9d8fd 100%)',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
              border: '2px solid #b794f6'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
                🏡 Lake City Upbringing
              </h3>
              <p style={{ color: '#1a202c', lineHeight: '1.6', fontSize: '16px', fontWeight: '500' }}>
                After John Sr. and Mary passed away, their <strong style={{ color: '#553c9a' }}>three young children</strong> were lovingly raised by 
                <strong> Edward Jones Sr.</strong> and his wife <strong>Jane</strong> on their farm in the 
                <strong> Falling Creek area</strong> of <strong style={{ color: '#e53e3e' }}>Columbia County, Florida</strong>. All three children - Mary, John Jr., and Ronia Sr. - grew up together on this farm.
              </p>
            </div>
            
            {/* Family Growth */}
            <div style={{
              background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
              border: '2px solid #fc8181'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
                👨‍👩‍👧‍👦 Growing Generations
              </h3>
              <p style={{ color: '#1a202c', lineHeight: '1.6', fontSize: '16px', fontWeight: '500' }}>
                Of the three children, the two sons established large families: <strong>John Rufus Jr.</strong> married <strong style={{ color: '#3182ce' }}>Millie Bryant</strong> and had <strong>9 children</strong>. 
                <strong>Ronia Sr.</strong> married <strong style={{ color: '#d69e2e' }}>Hattie Welcome</strong> and had <strong>8 children</strong>. 
                <strong style={{ color: '#e53e3e' }}>Mary Harrison</strong> also married, though her descendants are less documented in family records. 
                These children formed the foundation of our extensive family tree.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Family Directory Section */}
      <section id="directory" style={{ 
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        padding: '80px 0' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: 'clamp(36px, 6vw, 48px)', 
            fontWeight: '700', 
            color: 'white', 
            marginBottom: '16px'
          }}>
            📞 Family Directory
          </h2>
          <p style={{ 
            fontSize: '18px', 
            color: 'white', 
            marginBottom: '40px', 
            maxWidth: '600px', 
            margin: '0 auto 40px auto',
            fontWeight: '500'
          }}>
            Connect with family members across the country through our comprehensive directory
          </p>
          
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#1a202c', marginBottom: '32px' }}>
              🎯 Member Benefits
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              textAlign: 'left',
              marginBottom: '32px'
            }}>
              {[
                'Complete family contact directory with addresses, phone numbers, and emails',
                'Ability to update your own contact information',
                'Add new family members and update relationships',
                'Upload family photos to the gallery',
                'Access to family communication tools',
                'Reunion planning and coordination features'
              ].map((benefit, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ 
                    color: '#38a169', 
                    fontWeight: 'bold', 
                    marginRight: '12px',
                    fontSize: '20px'
                  }}>✓</span>
                  <span style={{ 
                    color: '#1a202c', 
                    fontSize: '16px', 
                    lineHeight: '1.5',
                    fontWeight: '500'
                  }}>{benefit}</span>
                </div>
              ))}
            </div>
            
            <a href="/login" style={{
              background: 'linear-gradient(135deg, #c53030, #9b2c2c)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              boxShadow: '0 8px 20px rgba(155, 44, 44, 0.4)',
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}>
              🚀 Create Member Account
            </a>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section id="gallery" style={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '80px 0' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: 'clamp(36px, 6vw, 48px)', 
              fontWeight: '700', 
              color: '#1a202c', 
              marginBottom: '16px'
            }}>
              📸 Family Photo Gallery
            </h2>
            
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              marginBottom: '40px',
              maxWidth: '900px',
              margin: '0 auto 40px auto',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>
                📤 How to Add Family Photos
              </h3>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontWeight: '600', color: '#1a202c', marginBottom: '16px', fontSize: '18px' }}>
                  👨‍👩‍👧‍👦 For Family Members:
                </h4>
                <ol style={{
                  listStyleType: 'decimal',
                  paddingLeft: '24px',
                  color: '#2d3748',
                  lineHeight: '1.6',
                  marginBottom: '20px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  <li><strong>Create a member account</strong> and log in</li>
                  <li>Go to your <strong>Member Dashboard</strong></li>
                  <li>Click <strong>&ldquo;Upload Photo&rdquo;</strong> button</li>
                  <li>Add photo, caption, date, and event details</li>
                  <li><strong>Submit</strong> - your photo will appear in the gallery for all to enjoy!</li>
                </ol>
                <div style={{
                  background: '#1a202c',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  ✨ <strong>Note:</strong> Photos are visible to everyone, but only logged-in family members can upload new ones.
                </div>
              </div>
            </div>
          </div>

          {/* Photo Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                title: 'Family Reunion 2018',
                subtitle: 'Lake City, Florida - July 20-22, 2018',
                icon: '📸',
                gradient: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
                border: '#fc8181'
              },
              {
                title: 'Harrison Family Heritage',
                subtitle: 'Historical family photos and documents',
                icon: '🏛️',
                gradient: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)',
                border: '#93c5fd'
              },
              {
                title: 'Multi-Generational Gathering',
                subtitle: 'Celebrating our family connections',
                icon: '👨‍👩‍👧‍👦',
                gradient: 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)',
                border: '#9ae6b4'
              }
            ].map((photo, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                border: `2px solid ${photo.border}`,
                transition: 'transform 0.3s ease'
              }}>
                <div style={{
                  background: photo.gradient,
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '60px' }}>{photo.icon}</span>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ 
                    fontWeight: '600', 
                    color: '#1a202c', 
                    marginBottom: '8px',
                    fontSize: '18px'
                  }}>
                    {photo.title}
                  </h3>
                  <p style={{ 
                    color: '#4a5568', 
                    fontSize: '14px',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {photo.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <div style={{
              background: 'white',
              padding: '32px',
              borderRadius: '12px',
              maxWidth: '600px',
              margin: '0 auto',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              border: '2px solid #9ae6b4'
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: '#1a202c', 
                marginBottom: '16px' 
              }}>
                📷 Share Your Family Memories
              </h3>
              <p style={{ 
                color: '#2d3748', 
                marginBottom: '20px',
                fontSize: '16px',
                lineHeight: '1.5',
                fontWeight: '500'
              }}>
                Help preserve our family legacy by contributing your photos and stories from reunions, 
                celebrations, and everyday moments.
              </p>
              <a href="/login" style={{
                background: 'linear-gradient(135deg, #2c5282, #2a4365)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                boxShadow: '0 8px 20px rgba(42, 67, 101, 0.4)',
                transition: 'all 0.3s ease'
              }}>
                🎯 Login to Upload Photos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Memorial Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
        padding: '80px 0',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: 'clamp(36px, 6vw, 48px)', 
              fontWeight: '700', 
              color: 'white', 
              marginBottom: '16px'
            }}>
              🕊️ In Memoriam
            </h2>
            <p style={{ 
              fontSize: '18px', 
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.5',
              fontWeight: '500'
            }}>
              Honoring those who have passed on but remain forever in our hearts and family legacy
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                name: 'Ruby (Harrison) Williams',
                dates: 'September 19, 1922 - October 29, 2017',
                relation: 'Daughter of John Rufus Jr.',
                years: '95 years',
                gradient: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
                border: '#fc8181'
              },
              {
                name: 'Pamela J. Harrison',
                dates: 'February 4, 1944 - May 20, 2018',
                relation: 'Beloved Family Member',
                years: '74 years',
                gradient: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)',
                border: '#93c5fd'
              },
              {
                name: 'Mr. Doc Graham, Jr.',
                dates: 'February 22, 1929 - October 15, 2016',
                location: 'Daytona Beach, Florida',
                years: '87 years',
                gradient: 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)',
                border: '#9ae6b4'
              }
            ].map((person, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                border: `2px solid ${person.border}`,
                color: '#1a202c'
              }}>
                <div style={{
                  background: person.gradient,
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  margin: '0 auto 16px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  🕊️
                </div>
                
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  marginBottom: '8px',
                  color: '#1a202c'
                }}>
                  {person.name}
                </h3>
                <p style={{ 
                  color: '#2d3748',
                  fontSize: '14px',
                  marginBottom: '6px',
                  fontWeight: '600'
                }}>
                  {person.dates}
                </p>
                {person.relation && (
                  <p style={{ 
                    color: '#4a5568',
                    fontSize: '13px',
                    marginBottom: '4px',
                    fontStyle: 'italic',
                    fontWeight: '500'
                  }}>
                    {person.relation}
                  </p>
                )}
                {person.location && (
                  <p style={{ 
                    color: '#4a5568',
                    fontSize: '13px',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}>
                    {person.location}
                  </p>
                )}
                <div style={{
                  background: person.gradient,
                  padding: '4px 12px',
                  borderRadius: '12px',
                  display: 'inline-block',
                  border: `1px solid ${person.border}`
                }}>
                  <span style={{ 
                    color: '#1a202c', 
                    fontSize: '12px', 
                    fontWeight: '600' 
                  }}>
                    {person.years}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
