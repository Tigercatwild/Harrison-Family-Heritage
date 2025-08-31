'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function FamilyTree() {
  const [expandedMembers, setExpandedMembers] = useState({})
  const [selectedMember, setSelectedMember] = useState(null)
  const [familyMembers, setFamilyMembers] = useState([])
  const [relationships, setRelationships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [generations, setGenerations] = useState({})

  useEffect(() => {
    loadFamilyData()
  }, [])

  const loadFamilyData = async () => {
    try {
      setLoading(true)
      
      // Load family members
      const { data: membersData, error: membersError } = await supabase
        .from('family_members')
        .select('*')
        .order('birth_date')

      if (membersError) {
        throw membersError
      }

      // Load relationships
      const { data: relationshipsData, error: relationshipsError } = await supabase
        .from('family_relationships')
        .select(`
          *,
          person:family_members!family_relationships_person_id_fkey(first_name, last_name),
          related_to:family_members!family_relationships_related_to_id_fkey(first_name, last_name)
        `)

      if (relationshipsError) {
        throw relationshipsError
      }

      setFamilyMembers(membersData || [])
      setRelationships(relationshipsData || [])
      
      // Organize into generations
      organizeGenerations(membersData || [], relationshipsData || [])
      
    } catch (error) {
      console.error('Error loading family data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const organizeGenerations = (members, relationships) => {
    const generations = {}
    const processedMembers = new Set()
    
    // Find the true founding generation - people who have no parents AND are not spouses of people with no parents
    const childIds = relationships
      .filter(rel => rel.relationship_type === 'child')
      .map(rel => rel.person_id)
    
    // Get all people who are not children of anyone
    const potentialFounders = members.filter(member => !childIds.includes(member.id))
    
    // From potential founders, only keep the actual patriarchs/matriarchs (not their spouses)
    // We'll identify founders as people born before 1820 who are not spouses of other founders
    const trueFounders = potentialFounders.filter(member => {
      const birthYear = member.birth_date ? new Date(member.birth_date).getFullYear() : 9999
      
      // Check if this person is a spouse of another potential founder
      const isSpouseOfFounder = relationships.some(rel => {
        if (rel.relationship_type !== 'spouse') return false
        
        // If this member is in a spouse relationship
        if (rel.person_id === member.id || rel.related_to_id === member.id) {
          const otherId = rel.person_id === member.id ? rel.related_to_id : rel.person_id
          const otherMember = potentialFounders.find(m => m.id === otherId)
          
          if (otherMember) {
            const otherBirthYear = otherMember.birth_date ? new Date(otherMember.birth_date).getFullYear() : 9999
            // If the other person was born earlier, this person is likely the spouse
            return otherBirthYear < birthYear
          }
        }
        return false
      })
      
      return !isSpouseOfFounder && birthYear <= 1820 // Only people born 1820 or earlier as founders
    })
    
    console.log('True founders:', trueFounders.map(f => `${f.first_name} ${f.last_name}`))
    
    // Start with the true founding generation
    generations[0] = trueFounders
    trueFounders.forEach(member => processedMembers.add(member.id))
    
    // Add their spouses to the same generation
    trueFounders.forEach(founder => {
      const spouse = getSpouse(founder.id, relationships, members)
      if (spouse && !processedMembers.has(spouse.id)) {
        generations[0].push(spouse)
        processedMembers.add(spouse.id)
      }
    })
    
    // Build subsequent generations
    let currentGen = 0
    let hasMoreGenerations = true
    
    while (hasMoreGenerations && currentGen < 10) {
      const currentGenMembers = generations[currentGen] || []
      const nextGenMembers = []
      
      currentGenMembers.forEach(parent => {
        const children = getChildren(parent.id, relationships, members)
        children.forEach(child => {
          if (!processedMembers.has(child.id)) {
            nextGenMembers.push(child)
            processedMembers.add(child.id)
            
            // Add child's spouse to the same generation
            const spouse = getSpouse(child.id, relationships, members)
            if (spouse && !processedMembers.has(spouse.id)) {
              nextGenMembers.push(spouse)
              processedMembers.add(spouse.id)
            }
          }
        })
      })
      
      if (nextGenMembers.length > 0) {
        generations[currentGen + 1] = nextGenMembers
        currentGen++
      } else {
        hasMoreGenerations = false
      }
    }
    
    console.log('Organized generations:', Object.keys(generations).map(gen => 
      `Gen ${gen}: ${generations[gen].map(m => `${m.first_name} ${m.last_name}`).join(', ')}`
    ))
    
    setGenerations(generations)
  }

  const getChildren = (parentId, relationships, members) => {
    return relationships
      .filter(rel => rel.related_to_id === parentId && rel.relationship_type === 'child')
      .map(rel => members.find(member => member.id === rel.person_id))
      .filter(Boolean)
  }

  const getSpouse = (personId, relationships = this.relationships, members = this.familyMembers) => {
    const spouseRel = relationships.find(rel => 
      (rel.person_id === personId || rel.related_to_id === personId) && 
      rel.relationship_type === 'spouse'
    )
    
    if (spouseRel) {
      const spouseId = spouseRel.person_id === personId ? spouseRel.related_to_id : spouseRel.person_id
      return members.find(member => member.id === spouseId)
    }
    return null
  }

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

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.getFullYear()
  }

  const getGenerationLabel = (genNumber) => {
    const labels = {
      0: 'Founding Generation',
      1: 'First Generation',
      2: 'Second Generation', 
      3: 'Third Generation',
      4: 'Fourth Generation',
      5: 'Fifth Generation'
    }
    return labels[genNumber] || `Generation ${genNumber}`
  }

  const isDeceased = (member) => {
    // People born before 1950 are likely deceased, living people should have recent birth years
    if (member.birth_date) {
      const birthYear = new Date(member.birth_date).getFullYear()
      return birthYear < 1950
    }
    // If no birth date and they're historical figures (Harrison Sr., Mary Jones), assume deceased
    const historicalNames = ['Harrison Sr.', 'Mary Jones', 'Bryant-Harrison', 'Welcome-Harrison']
    return historicalNames.some(name => member.last_name?.includes(name.split(' ')[1]))
  }

  // Rest of your component remains the same...
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #4c51bf',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p style={{ color: '#4a5568', fontSize: '16px' }}>Loading family tree...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        background: '#fed7d7',
        color: '#c53030',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        maxWidth: '500px',
        margin: '50px auto'
      }}>
        <h3>Error Loading Family Tree</h3>
        <p>{error}</p>
        <button 
          onClick={loadFamilyData}
          style={{
            background: '#4c51bf',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        .family-tree-container {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .generation-section {
          margin-bottom: 50px;
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border: 2px solid #e2e8f0;
        }
        
        .generation-header {
          font-size: 28px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 30px;
          text-align: center;
          padding: 15px;
          background: linear-gradient(135deg, #4c51bf, #553c9a);
          color: white;
          border-radius: 12px;
        }
        
        .founding-card {
          background: linear-gradient(135deg, #f7fafc, #edf2f7);
          border: 3px solid #4c51bf;
          border-radius: 16px;
          padding: 32px;
          margin: 0 auto;
          max-width: 600px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
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
          position: relative;
        }
        
        .family-card.deceased {
          background: linear-gradient(135deg, #f7fafc, #edf2f7);
          border-color: #a0aec0;
        }
        
        .family-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
        }
        
        .deceased-indicator {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #718096;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
        }
        
        .living-indicator {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #38a169;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
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
          padding-right: 60px;
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
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
          cursor: pointer;
          position: relative;
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
          padding-right: 40px;
        }
        
        .child-details {
          font-size: 12px;
          color: #4a5568;
          line-height: 1.3;
        }
        
        .members-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
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
        
        .empty-state {
          text-align: center;
          padding: 50px;
          color: #4a5568;
        }
        
        @media (max-width: 768px) {
          .children-grid, .members-grid {
            grid-template-columns: 1fr;
          }
          
          .modal-content {
            padding: 20px;
            margin: 10px;
          }
        }
      `}</style>

      <div className="family-tree-container">
        {/* Render each generation */}
        {Object.keys(generations).map(genNumber => {
          const genMembers = generations[genNumber]
          if (!genMembers || genMembers.length === 0) return null
          
          return (
            <div key={genNumber} className="generation-section">
              <h3 className="generation-header">
                {getGenerationLabel(parseInt(genNumber))}
                <div style={{ fontSize: '14px', fontWeight: '400', marginTop: '8px' }}>
                  {genMembers.length} member{genMembers.length !== 1 ? 's' : ''}
                </div>
              </h3>
              
              {/* Special formatting for founding generation */}
              {parseInt(genNumber) === 0 ? (
                <div className="founding-card">
                  <h4 style={{ 
                    fontSize: '22px', 
                    fontWeight: '700', 
                    color: '#4c51bf', 
                    marginBottom: '16px'
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
                    fontWeight: '600',
                    marginBottom: '16px'
                  }}>
                    Children: 3 (Mary, John Jr., Ronia Sr.)
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {genMembers.map(member => (
                      <button
                        key={member.id}
                        onClick={() => showMemberDetails(member)}
                        style={{
                          background: '#e3f2fd',
                          border: '2px solid #4c51bf',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#4c51bf',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#4c51bf'
                          e.target.style.color = 'white'
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = '#e3f2fd'
                          e.target.style.color = '#4c51bf'
                        }}
                      >
                        {member.first_name} {member.last_name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="members-grid">
                  {genMembers.map((member) => {
                    const children = getChildren(member.id, relationships, familyMembers)
                    const spouse = getSpouse(member.id, relationships, familyMembers)
                    const deceased = isDeceased(member)
                    
                    return (
                      <div key={member.id} className={`family-card ${deceased ? 'deceased' : ''}`}>
                        {deceased ? (
                          <div className="deceased-indicator">✝ Deceased</div>
                        ) : (
                          <div className="living-indicator">● Living</div>
                        )}
                        
                        <div className="member-name" onClick={() => toggleMember(member.id)}>
                          <span 
                            className="clickable-name"
                            onClick={(e) => {
                              e.stopPropagation()
                              showMemberDetails(member)
                            }}
                          >
                            {member.first_name} {member.last_name}
                          </span>
                          {children.length > 0 && (
                            <div className={`expand-icon ${expandedMembers[member.id] ? 'expanded' : ''}`}>
                              +
                            </div>
                          )}
                        </div>
                        
                        <div className="member-info">
                          {member.birth_date && (
                            <p>📅 Born: {formatDate(member.birth_date)}</p>
                          )}
                          {spouse && spouse.id !== member.id && (
                            <p>💑 Spouse: {spouse.first_name} {spouse.last_name}</p>
                          )}
                          {children.length > 0 && (
                            <p>👨‍👩‍👧‍👦 Children: {children.length}</p>
                          )}
                          {member.address && (
                            <p>📍 {member.address}</p>
                          )}
                        </div>
                        
                        {children.length > 0 && (
                          <p style={{ 
                            fontSize: '12px', 
                            color: expandedMembers[member.id] ? '#e53e3e' : '#38a169',
                            cursor: 'pointer'
                          }}>
                            {expandedMembers[member.id] ? '▼ Hide children' : '▶ Show children'}
                          </p>
                        )}
                        
                        {expandedMembers[member.id] && children.length > 0 && (
                          <div className="children-container">
                            <h5 style={{ 
                              fontWeight: '700', 
                              color: '#1a202c', 
                              marginBottom: '12px',
                              fontSize: '16px'
                            }}>
                              Children of {member.first_name}:
                            </h5>
                            <div className="children-grid">
                              {children.map((child) => {
                                const childDeceased = isDeceased(child)
                                return (
                                  <div 
                                    key={child.id} 
                                    className="child-card"
                                    onClick={() => showMemberDetails(child)}
                                  >
                                    {childDeceased ? (
                                      <div style={{
                                        position: 'absolute',
                                        top: '6px',
                                        right: '6px',
                                        background: '#718096',
                                        color: 'white',
                                        padding: '2px 6px',
                                        borderRadius: '8px',
                                        fontSize: '8px',
                                        fontWeight: '600'
                                      }}>✝</div>
                                    ) : (
                                      <div style={{
                                        position: 'absolute',
                                        top: '6px',
                                        right: '6px',
                                        background: '#38a169',
                                        color: 'white',
                                        padding: '2px 6px',
                                        borderRadius: '8px',
                                        fontSize: '8px',
                                        fontWeight: '600'
                                      }}>●</div>
                                    )}
                                    <div className="child-name">
                                      {child.first_name} {child.last_name}
                                    </div>
                                    {child.birth_date && (
                                      <div style={{ fontSize: '11px', color: '#718096', marginBottom: '2px' }}>
                                        Born: {formatDate(child.birth_date)}
                                      </div>
                                    )}
                                    <div className="child-details">
                                      {child.notes || 'Click for more details'}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
        
        {Object.keys(generations).length === 0 && (
          <div className="empty-state">
            <h3>No Family Members Found</h3>
            <p>Add family members through your dashboard to build the family tree.</p>
          </div>
        )}

        {/* Instructions */}
        <div style={{ 
          marginTop: '30px', 
          textAlign: 'center' 
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            maxWidth: '800px',
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
              <strong style={{ color: '#1a202c' }}>Multi-Generational Family Tree:</strong> 
              🖱️ Click names for detailed information • ➕ Click + to expand children • 
              ✝ Deceased members • ● Living members • 🏠 Add family members through your dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Member Details Modal - same as before */}
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
                {selectedMember.first_name} {selectedMember.last_name}
              </h2>
              {isDeceased(selectedMember) ? (
                <div style={{
                  background: '#718096',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  display: 'inline-block',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  ✝ Deceased
                </div>
              ) : (
                <div style={{
                  background: '#38a169',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  display: 'inline-block',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  ● Living Family Member
                </div>
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
                  {selectedMember.birth_date && (
                    <p><strong>Born:</strong> {formatDate(selectedMember.birth_date)}</p>
                  )}
                  {selectedMember.email && (
                    <p><strong>Email:</strong> {selectedMember.email}</p>
                  )}
                  {selectedMember.phone && (
                    <p><strong>Phone:</strong> {selectedMember.phone}</p>
                  )}
                  {selectedMember.address && (
                    <p><strong>Address:</strong> {selectedMember.address}</p>
                  )}
                  {selectedMember.relationship && (
                    <p><strong>Relationship:</strong> {selectedMember.relationship}</p>
                  )}
                </div>
              </div>

              {selectedMember.notes && (
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
                    📖 Notes & Biography
                  </h4>
                  <p style={{ 
                    fontSize: '14px', 
                    lineHeight: '1.6',
                    color: '#2d3748',
                    margin: 0
                  }}>
                    {selectedMember.notes}
                  </p>
                </div>
              )}
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
                💡 <strong>Update Information:</strong> Family members can edit their details 
                and add photos through the dashboard.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
