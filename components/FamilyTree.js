'use client'
import { useState } from 'react'

export default function FamilyTree() {
  const [expandedMembers, setExpandedMembers] = useState({})
  const [selectedMember, setSelectedMember] = useState(null)

  const toggleMember = (memberId) => {
    setExpandedMembers(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }))
  }

  const showMemberDetails = (memberData) => {
    setSelectedMember(memberData)
  }

  const closeMemberDetails = () => {
    setSelectedMember(null)
  }

  // Comprehensive family data from PDF
  const familyData = {
    mary: {
      name: "Mary Harrison",
      born: "c. 1838",
      spouse: "Unknown (married surname lost to history)",
      children: "Unknown",
      location: "Florida",
      details: "Eldest child of John Rufus Sr. and Mary Jones. As was common for women of the era, her married name and descendants are not well documented in family records. She was raised by the Jones family alongside her brothers on the farm in Falling Creek area of Columbia County, Florida.",
      occupation: "Homemaker"
    },
    johnJr: {
      name: "John Rufus Harrison Jr.",
      nickname: "Big Daddy",
      born: "c. 1840",
      spouse: "Millie Bryant",
      children: 9,
      location: "Lake City, Florida",
      details: "Second child and eldest son of John Rufus Sr. Raised on Edward Jones' farm in Falling Creek area. Married Millie Bryant and became patriarch of a large family. Known affectionately as 'Big Daddy' by his descendants.",
      occupation: "Farmer"
    },
    ronia: {
      name: "Ronia Harrison Sr.",
      nickname: "Papa",
      born: "c. 1845",
      spouse: "Hattie Welcome",
      children: 8,
      location: "Florida",
      details: "Youngest child of John Rufus Sr. and Mary Jones. Raised alongside his siblings by the Jones family. Married Hattie Welcome and established his own family line. Known as 'Papa' to his many grandchildren.",
      occupation: "Farmer"
    }
  }

  const johnJrChildren = [
    { name: "John Harrison III", details: "Eldest son, continued farming tradition" },
    { name: "Mary Elizabeth Harrison", details: "Daughter, married and had children" },
    { name: "Willie Harrison", details: "Son, worked in agriculture" },
    { name: "Ruby Harrison Williams", born: "1922", died: "2017", details: "Long-lived matriarch, remembered for her wisdom and strength" },
    { name: "James Harrison", details: "Son, family provider" },
    { name: "Robert Harrison", details: "Son, stayed in Florida area" },
    { name: "Annie Harrison", details: "Daughter, raised large family" },
    { name: "Sarah Harrison", details: "Daughter, active in church community" },
    { name: "Thomas Harrison", details: "Youngest son, moved to other states" }
  ]

  const roniaChildren = [
    { name: "Ronia Harrison Jr.", details: "Named after his father, carried on family traditions" },
    { name: "William Harrison", details: "Son, worked various trades" },
    { name: "Edward Harrison", details: "Named after Edward Jones who raised his father" },
    { name: "Henry Harrison", details: "Son, known for his carpentry skills" },
    { name: "Dorothy Harrison", details: "Daughter, teacher in local schools" },
    { name: "Margaret Harrison", details: "Daughter, active in church and community" },
    { name: "Ruth Harrison", details: "Daughter, raised children during Depression era" },
    { name: "Charles Harrison", details: "Youngest son, served in military" }
  ]

  return (
    <>
      <style jsx>{`
        .family-tree-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .founding-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 32px;
          margin: 0 auto;
          max-width: 500px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        
        .generation-header {
          font-size: 32px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 40px;
          text-align: center;
        }
        
        .family-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border: 2px solid #e2e8f0;
          margin-bottom: 16px;
          transition: all 0.3s ease;
        }
        
        .family-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
        }
        
        .member-name {
          font-size: 18px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .member-name:hover {
          color: #4c51bf;
        }
        
        .clickable-name {
          color: #4c51bf;
          text-decoration: underline;
          cursor: pointer;
          font-weight: 600;
        }
        
        .clickable-name:hover {
          color: #553c9a;
        }
        
        .expand-icon {
          background: linear-gradient(135deg, #38a169, #48bb78);
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .expand-icon.expanded {
          transform: rotate(45deg);
          background: linear-gradient(135deg, #e53e3e, #f56565);
        }
        
        .member-info {
          color: #4a5568;
          font-size: 14px;
          margin-bottom: 6px;
          font-weight: 500;
        }
        
        .children-container {
          margin-top: 20px;
          padding: 20px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          border-left: 4px solid #4c51bf;
          border: 1px solid #e2e8f0;
        }
        
        .children-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 16px;
        }
        
        .child-card {
          background: white;
          padding: 12px 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        
        .child-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        }
        
        .child-name {
          font-weight: 600;
          color: #1a202c;
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .child-details {
          font-size: 12px;
          color: #4a5568;
          line-height: 1.3;
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        
        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #e53e3e;
          color: white;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .modal-close:hover {
          background: #c53030;
          transform: scale(1.1);
        }
        
        .second-generation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 32px;
        }
        
        @media (max-width: 768px) {
          .children-grid {
            grid-template-columns: 1fr;
          }
          
          .second-generation-grid {
            grid-template-columns: 1fr;
          }
          
          .modal-content {
            padding: 20px;
            margin: 10px;
          }
        }
      `}</style>

      <div className="family-tree-container">
        {/* Founding Generation */}
        <div className="founding-card">
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#2d3748', 
            marginBottom: '12px' 
          }}>
            Founding Generation
          </h3>
          <h4 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#4c51bf', 
            marginBottom: '8px' 
          }}>
            John Rufus Harrison Sr. & Mary Jones
          </h4>
          <p style={{ 
            color: '#4a5568', 
            fontSize: '14px', 
            marginBottom: '12px',
            fontWeight: '500'
          }}>
            🇨🇺 Originally from Cuba • 🏡 Settled in Jacksonville, Florida • 📅 1800s
          </p>
          <div style={{
            background: 'linear-gradient(135deg, #4c51bf, #553c9a)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            display: 'inline-block',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Children: 3 (Mary, John Jr., Ronia Sr.)
          </div>
        </div>

        {/* Second Generation - All Three Children */}
        <h3 className="generation-header">Second Generation - The Three Children</h3>
        
        <div className="second-generation-grid">
          {/* Mary Harrison */}
          <div className="family-card">
            <div className="member-name">
              <span 
                className="clickable-name"
                onClick={() => showMemberDetails(familyData.mary)}
              >
                Mary Harrison
              </span>
            </div>
            <p className="member-info">
              👩 Eldest Child • Born c. 1838
            </p>
            <p className="member-info">
              💑 Married (surname unknown)
            </p>
            <p style={{ 
              fontSize: '12px', 
              color: '#718096', 
              fontStyle: 'italic',
              marginTop: '8px'
            }}>
              Click name for biographical details
            </p>
          </div>

          {/* John Rufus Jr. */}
          <div className="family-card">
            <div className="member-name" onClick={() => toggleMember('johnJr')}>
              <span 
                className="clickable-name"
                onClick={(e) => {
                  e.stopPropagation()
                  showMemberDetails(familyData.johnJr)
                }}
              >
                John Rufus Harrison Jr.
              </span>
              <div className={`expand-icon ${expandedMembers.johnJr ? 'expanded' : ''}`}>
                +
              </div>
            </div>
            <p className="member-info">
              👨 Big Daddy • Born c. 1840
            </p>
            <p className="member-info">
              💑 Married Millie Bryant • 👨‍👩‍👧‍👦 9 children
            </p>
            <p style={{ 
              fontSize: '12px', 
              color: expandedMembers.johnJr ? '#e53e3e' : '#38a169',
              cursor: 'pointer'
            }}>
              {expandedMembers.johnJr ? '▼ Click to hide children' : '▶ Click to see children'}
            </p>
            
            {expandedMembers.johnJr && (
              <div className="children-container">
                <h5 style={{ 
                  fontWeight: '700', 
                  color: '#1a202c', 
                  marginBottom: '12px',
                  fontSize: '16px'
                }}>
                  Children of John Rufus Jr.:
                </h5>
                <div className="children-grid">
                  {johnJrChildren.map((child, index) => (
                    <div key={index} className="child-card">
                      <div className="child-name">{child.name}</div>
                      {(child.born || child.died) && (
                        <div style={{ fontSize: '11px', color: '#718096', marginBottom: '2px' }}>
                          {child.born && `Born: ${child.born}`}
                          {child.died && ` • Died: ${child.died}`}
                        </div>
                      )}
                      <div className="child-details">{child.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ronia Sr. */}
          <div className="family-card">
            <div className="member-name" onClick={() => toggleMember('ronia')}>
              <span 
                className="clickable-name"
                onClick={(e) => {
                  e.stopPropagation()
                  showMemberDetails(familyData.ronia)
                }}
              >
                Ronia Harrison Sr.
              </span>
              <div className={`expand-icon ${expandedMembers.ronia ? 'expanded' : ''}`}>
                +
              </div>
            </div>
            <p className="member-info">
              👨 Papa • Born c. 1845
            </p>
            <p className="member-info">
              💑 Married Hattie Welcome • 👨‍👩‍👧‍👦 8 children
            </p>
            <p style={{ 
              fontSize: '12px', 
              color: expandedMembers.ronia ? '#e53e3e' : '#38a169',
              cursor: 'pointer'
            }}>
              {expandedMembers.ronia ? '▼ Click to hide children' : '▶ Click to see children'}
            </p>
            
            {expandedMembers.ronia && (
              <div className="children-container">
                <h5 style={{ 
                  fontWeight: '700', 
                  color: '#1a202c', 
                  marginBottom: '12px',
                  fontSize: '16px'
                }}>
                  Children of Ronia Sr.:
                </h5>
                <div className="children-grid">
                  {roniaChildren.map((child, index) => (
                    <div key={index} className="child-card">
                      <div className="child-name">{child.name}</div>
                      <div className="child-details">{child.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div style={{ 
          marginTop: '50px', 
          textAlign: 'center' 
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            maxWidth: '700px',
            margin: '0 auto',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            border: '2px solid #e2e8f0'
          }}>
            <p style={{ 
              color: '#2d3748', 
              fontSize: '14px',
              margin: 0,
              lineHeight: '1.5',
              fontWeight: '500'
            }}>
              <strong style={{ color: '#1a202c' }}>Interactive Family Tree:</strong> 
              🖱️ Click names for detailed biographies • ➕ Click + buttons to expand children • 
              👥 All three children of John Rufus Sr. are represented here
            </p>
          </div>
        </div>
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="modal-overlay" onClick={closeMemberDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeMemberDetails}>
              ×
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#1a202c',
                marginBottom: '8px'
              }}>
                {selectedMember.name}
              </h2>
              {selectedMember.nickname && (
                <p style={{ 
                  fontSize: '16px', 
                  color: '#4c51bf',
                  fontStyle: 'italic',
                  marginBottom: '16px',
                  fontWeight: '600'
                }}>
                  {selectedMember.nickname}
                </p>
              )}
            </div>

            <div style={{
              display: 'grid',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                background: '#f7fafc',
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0'
              }}>
                <h4 style={{ 
                  color: '#2d3748', 
                  marginBottom: '12px',
                  fontSize: '16px',
                  fontWeight: '700'
                }}>
                  📋 Basic Information
                </h4>
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  {selectedMember.born && (
                    <p><strong>Born:</strong> {selectedMember.born}</p>
                  )}
                  {selectedMember.spouse && (
                    <p><strong>Spouse:</strong> {selectedMember.spouse}</p>
                  )}
                  {selectedMember.children && (
                    <p><strong>Children:</strong> {selectedMember.children}</p>
                  )}
                  {selectedMember.location && (
                    <p><strong>Location:</strong> {selectedMember.location}</p>
                  )}
                  {selectedMember.occupation && (
                    <p><strong>Occupation:</strong> {selectedMember.occupation}</p>
                  )}
                </div>
              </div>

              <div style={{
                background: '#f0fff4',
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid #c6f6d5'
              }}>
                <h4 style={{ 
                  color: '#2d3748', 
                  marginBottom: '12px',
                  fontSize: '16px',
                  fontWeight: '700'
                }}>
                  📖 Life Story
                </h4>
                <p style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  color: '#2d3748',
                  margin: 0
                }}>
                  {selectedMember.details}
                </p>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #4c51bf, #553c9a)',
              color: 'white',
              padding: '12px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: '12px',
                fontWeight: '500'
              }}>
                💡 <strong>More Details:</strong> Members can add additional biographical information, 
                photos, and stories through the family dashboard.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
