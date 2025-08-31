'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    relationship_to_family: '',
    bio: ''
  })
  
  // Family Management State
  const [familyMembers, setFamilyMembers] = useState([])
  const [familyStats, setFamilyStats] = useState({
    totalMembers: 0,
    livingMembers: 0,
    deceasedMembers: 0,
    recentAdditions: 0
  })
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, living, deceased
  const [newMember, setNewMember] = useState({
    full_name: '',
    birth_date: '',
    death_date: '',
    birth_location: '',
    death_location: '',
    biography: '',
    is_deceased: false,
    parent1_id: '',
    parent2_id: '',
    spouse_id: '',
    generation: 1
  })

  useEffect(() => {
    checkUser()
    testDatabaseConnection() // Add this temporarily
    fetchFamilyStats()
    fetchFamilyMembers()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }
      
      setUser(session.user)
      await fetchUserProfile(session.user.id)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user?.email || '',
          phone: data.phone || '',
          relationship_to_family: data.relationship_to_family || '',
          bio: data.bio || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchFamilyMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .order('first_name');

      if (data) {
        // Add full_name for display if it doesn't exist
        const membersWithFullName = data.map(member => ({
          ...member,
          full_name: member.full_name || `${member.first_name} ${member.last_name}`
        }));
        
        setFamilyMembers(membersWithFullName);
      }
    } catch (error) {
      console.error('Error fetching family members:', error);
    }
  };

  const fetchFamilyStats = async () => {
    console.log('🔍 fetchFamilyStats called');
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*');

      console.log('📊 Family members raw data:', data);
      console.log('❌ Family members error:', error);
      console.log('📈 Data length:', data ? data.length : 'null');

      if (error) {
        console.error('Error fetching family stats:', error);
        return;
      }

      if (data) {
        // Use is_deceased field instead of death_date
        const living = data.filter(member => !member.is_deceased).length;
        const deceased = data.filter(member => member.is_deceased).length;
        
        // Get recent additions count (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentCount = data.filter(member => {
          const createdDate = new Date(member.created_at);
          return createdDate >= thirtyDaysAgo;
        }).length;
        
        console.log('📊 Stats calculated:', {
          total: data.length,
          living: living,
          deceased: deceased,
          recent: recentCount
        });

        setFamilyStats({
          totalMembers: data.length,
          livingMembers: living,
          deceasedMembers: deceased,
          recentAdditions: recentCount
        });
      }
    } catch (error) {
      console.error('Catch error in fetchFamilyStats:', error);
    }
  };

  const testDatabaseConnection = async () => {
    console.log('🧪 Testing database connection...');
    
    // Test 1: Basic connection
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('count', { count: 'exact' });
      
      console.log('🧪 Count test:', { data, error });
    } catch (e) {
      console.error('🧪 Count test error:', e);
    }

    // Test 2: Simple select
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('id, first_name, last_name')
        .limit(5);
      
      console.log('🧪 Simple select test:', { data, error });
    } catch (e) {
      console.error('🧪 Simple select error:', e);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          relationship_to_family: profile.relationship_to_family,
          bio: profile.bio,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile: ' + error.message)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    
    try {
      // First, add the family member
      const { data: memberData, error: memberError } = await supabase
        .from('family_members')
        .insert([{
          full_name: newMember.full_name,
          birth_date: newMember.birth_date || null,
          death_date: newMember.death_date || null,
          birth_location: newMember.birth_location || null,
          death_location: newMember.death_location || null,
          biography: newMember.biography || null,
          is_deceased: newMember.is_deceased,
          generation: newMember.generation
        }])
        .select()
        .single()

      if (memberError) throw memberError

      const memberId = memberData.id

      // Add parent relationships if specified
      if (newMember.parent1_id) {
        await supabase
          .from('family_relationships')
          .insert([{
            parent_id: newMember.parent1_id,
            child_id: memberId,
            relationship_type: 'parent-child'
          }])
      }

      if (newMember.parent2_id) {
        await supabase
          .from('family_relationships')
          .insert([{
            parent_id: newMember.parent2_id,
            child_id: memberId,
            relationship_type: 'parent-child'
          }])
      }

      // Add spouse relationship if specified
      if (newMember.spouse_id) {
        await supabase
          .from('family_relationships')
          .insert([{
            person1_id: memberId,
            person2_id: newMember.spouse_id,
            relationship_type: 'spouse'
          }])
      }

      // Reset form and refresh data
      setNewMember({
        full_name: '',
        birth_date: '',
        death_date: '',
        birth_location: '',
        death_location: '',
        biography: '',
        is_deceased: false,
        parent1_id: '',
        parent2_id: '',
        spouse_id: '',
        generation: 1
      })
      
      setShowAddMemberForm(false)
      fetchFamilyMembers()
      fetchFamilyStats()
      
      alert('Family member added successfully!')
    } catch (error) {
      console.error('Error adding family member:', error)
      alert('Error adding family member: ' + error.message)
    }
  }

  const deleteFamilyMember = async (memberId) => {
    if (!confirm('Are you sure you want to delete this family member? This action cannot be undone.')) {
      return
    }

    try {
      // Delete relationships first
      await supabase
        .from('family_relationships')
        .delete()
        .or(`parent_id.eq.${memberId},child_id.eq.${memberId},person1_id.eq.${memberId},person2_id.eq.${memberId}`)

      // Delete the family member
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', memberId)

      if (error) throw error

      fetchFamilyMembers()
      fetchFamilyStats()
      alert('Family member deleted successfully!')
    } catch (error) {
      console.error('Error deleting family member:', error)
      alert('Error deleting family member: ' + error.message)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const filteredMembers = familyMembers.filter(member => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'living' && !member.is_deceased) ||
                         (filterStatus === 'deceased' && member.is_deceased)
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(148, 163, 184, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#fbbf24',
                marginBottom: '10px'
              }}>
                Harrison Family Dashboard
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                Welcome back, {profile.full_name || user?.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          borderRadius: '16px',
          padding: '10px',
          marginBottom: '30px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(148, 163, 184, 0.2)'
        }}>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'profile', label: 'My Profile', icon: '👤' },
              { id: 'family-tree', label: 'Family Tree', icon: '🌳' },
              { id: 'photos', label: 'Photos', icon: '📷' },
              { id: 'family-updates', label: 'Family Updates', icon: '📢' },
              { id: 'family-management', label: 'Family Management', icon: '👥' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id 
                    ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                    : 'transparent',
                  color: activeTab === tab.id ? '#1f2937' : '#e2e8f0',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = 'rgba(148, 163, 184, 0.2)'
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = 'transparent'
                  }
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '16px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '20px'
            }}>
              Family Overview
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white'
              }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Total Members</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{familyStats.totalMembers}</p>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white'
              }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Living Members</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{familyStats.livingMembers}</p>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white'
              }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>In Memory</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{familyStats.deceasedMembers}</p>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white'
              }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Recent Additions</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{familyStats.recentAdditions}</p>
              </div>
            </div>
            
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#60a5fa',
                marginBottom: '15px'
              }}>
                🏡 Harrison Family Heritage
              </h3>
              <p style={{
                color: '#cbd5e1',
                lineHeight: '1.6',
                marginBottom: '15px'
              }}>
                Welcome to the Harrison family heritage dashboard. Here you can manage your profile, 
                explore our family tree, share photos, and stay connected with family updates.
              </p>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.9rem'
              }}>
                Our family story begins with John Rufus Harrison Sr. and Mary Jones, 
                whose legacy continues through generations of Harrisons around the world.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '16px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '20px'
            }}>
              My Profile
            </h2>
            
            <form onSubmit={handleProfileUpdate} style={{ maxWidth: '600px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#e2e8f0'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #475569',
                    background: 'rgba(51, 65, 85, 0.8)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter your full name"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#e2e8f0'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #475569',
                    background: 'rgba(51, 65, 85, 0.8)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter your email"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#e2e8f0'
                }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #475569',
                    background: 'rgba(51, 65, 85, 0.8)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter your phone number"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#e2e8f0'
                }}>
                  Relationship to Family
                </label>
                <select
                  value={profile.relationship_to_family}
                  onChange={(e) => setProfile({...profile, relationship_to_family: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #475569',
                    background: 'rgba(51, 65, 85, 0.8)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select your relationship</option>
                  <option value="direct_descendant">Direct Descendant</option>
                  <option value="spouse">Spouse/Partner</option>
                  <option value="friend">Family Friend</option>
                  <option value="researcher">Family Researcher</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#e2e8f0'
                }}>
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #475569',
                    background: 'rgba(51, 65, 85, 0.8)',
                    color: 'white',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                  placeholder="Tell us about yourself and your connection to the Harrison family..."
                />
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 30px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Update Profile
              </button>
            </form>
          </div>
        )}

        {activeTab === 'family-tree' && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '16px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '20px'
            }}>
              Family Tree
            </h2>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '12px',
              padding: '30px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                color: '#60a5fa',
                marginBottom: '15px'
              }}>
                🌳 Interactive Family Tree Coming Soon
              </h3>
              <p style={{
                color: '#cbd5e1',
                lineHeight: '1.6'
              }}>
                The interactive family tree component will be displayed here, 
                showing the complete Harrison family lineage with clickable nodes 
                for detailed biographical information.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '16px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '20px'
            }}>
              Family Photos
            </h2>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '12px',
              padding: '30px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                color: '#34d399',
                marginBottom: '15px'
              }}>
                📷 Family Photo Gallery
              </h3>
              <p style={{
                color: '#cbd5e1',
                lineHeight: '1.6'
              }}>
                Upload and share precious family memories. The photo gallery 
                will allow family members to contribute images and create a 
                shared visual history of the Harrison family.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'family-updates' && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '16px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '20px'
            }}>
              Family Updates
            </h2>
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '12px',
              padding: '30px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                color: '#a78bfa',
                marginBottom: '15px'
              }}>
                📢 Family News & Updates
              </h3>
              <p style={{
                color: '#cbd5e1',
                lineHeight: '1.6'
              }}>
                Stay connected with the latest family news, announcements, 
                and updates. Share milestones, celebrations, and important 
                family information with all members.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'family-management' && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '16px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#fbbf24',
                margin: 0
              }}>
                👥 Family Management
              </h2>
              <button
                onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                {showAddMemberForm ? '✕ Cancel' : '+ Add Family Member'}
              </button>
            </div>

            {/* Family Statistics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>
                  {familyStats.totalMembers}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Members</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>
                  {familyStats.livingMembers}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Living</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>
                  {familyStats.deceasedMembers}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Deceased</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>
                  {familyStats.recentAdditions}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Recent (30d)</div>
              </div>
            </div>

            {/* Enhanced Add Member Form */}
            {showAddMemberForm && (
              <div style={{
                background: 'rgba(51, 65, 85, 0.8)',
                borderRadius: '12px',
                padding: '30px',
                marginBottom: '30px',
                border: '1px solid rgba(148, 163, 184, 0.3)'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#fbbf24',
                  marginBottom: '20px'
                }}>
                  Add New Family Member
                </h3>
                
                <form onSubmit={handleAddMember}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#e2e8f0'
                      }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={newMember.full_name}
                        onChange={(e) => setNewMember({...newMember, full_name: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #475569',
                          background: 'rgba(30, 41, 59, 0.8)',
                          color: 'white',
                          fontSize: '1rem'
                        }}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#e2e8f0'
                      }}>
                        Birth Date
                      </label>
                      <input
                        type="date"
                        value={newMember.birth_date}
                        onChange={(e) => setNewMember({...newMember, birth_date: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #475569',
                          background: 'rgba(30, 41, 59, 0.8)',
                          color: 'white',
                          fontSize: '1rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#e2e8f0'
                      }}>
                        Birth Location
                      </label>
                      <input
                        type="text"
                        value={newMember.birth_location}
                        onChange={(e) => setNewMember({...newMember, birth_location: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #475569',
                          background: 'rgba(30, 41, 59, 0.8)',
                          color: 'white',
                          fontSize: '1rem'
                        }}
                        placeholder="Birth location"
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#e2e8f0'
                      }}>
                        Generation
                      </label>
                      <select
                        value={newMember.generation}
                        onChange={(e) => setNewMember({...newMember, generation: parseInt(e.target.value)})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #475569',
                          background: 'rgba(30, 41, 59, 0.8)',
                          color: 'white',
                          fontSize: '1rem'
                        }}
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(gen => (
                          <option key={gen} value={gen}>Generation {gen}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Living/Deceased Status - Enhanced */}
                  <div style={{ 
                    marginBottom: '20px', 
                    padding: '15px',
                    background: 'rgba(30, 41, 59, 0.5)',
                    borderRadius: '8px',
                    border: '1px solid rgba(148, 163, 184, 0.2)'
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#e2e8f0',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}>
                      <input
                        type="checkbox"
                        checked={newMember.is_deceased}
                        onChange={(e) => setNewMember({
                          ...newMember, 
                          is_deceased: e.target.checked,
                          // Clear death fields if unchecked
                          death_date: e.target.checked ? newMember.death_date : '',
                          death_location: e.target.checked ? newMember.death_location : ''
                        })}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                      <span>This person is deceased</span>
                    </label>
                  </div>

                  {/* Death Information - Only show if deceased */}
                  {newMember.is_deceased && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '20px',
                      marginBottom: '20px',
                      padding: '20px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontWeight: '600',
                          color: '#e2e8f0'
                        }}>
                          Death Date
                        </label>
                        <input
                          type="date"
                          value={newMember.death_date}
                          onChange={(e) => setNewMember({...newMember, death_date: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #475569',
                            background: 'rgba(30, 41, 59, 0.8)',
                            color: 'white',
                            fontSize: '1rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontWeight: '600',
                          color: '#e2e8f0'
                        }}>
                          Death Location
                        </label>
                        <input
                          type="text"
                          value={newMember.death_location}
                          onChange={(e) => setNewMember({...newMember, death_location: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #475569',
                            background: 'rgba(30, 41, 59, 0.8)',
                            color: 'white',
                            fontSize: '1rem'
                          }}
                          placeholder="Death location"
                        />
                      </div>
                    </div>
                  )}

                  {/* Relationship Selection */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#e2e8f0'
                      }}>
                        Parent 1
                      </label>
                      <select
                        value={newMember.parent1_id}
                        onChange={(e) => setNewMember({...newMember, parent1_id: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #475569',
                          background: 'rgba(30, 41, 59, 0.8)',
                          color: 'white',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="">Select Parent 1</option>
                        {familyMembers.map(member => (
                          <option key={member.id} value={member.id}>
                            {member.full_name || `${member.first_name} ${member.last_name}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#e2e8f0'
                      }}>
                        Parent 2
                      </label>
                      <select
                        value={newMember.parent2_id}
                        onChange={(e) => setNewMember({...newMember, parent2_id: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #475569',
                          background: 'rgba(30, 41, 59, 0.8)',
                          color: 'white',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="">Select Parent 2</option>
                        {familyMembers.filter(member => member.id !== newMember.parent1_id).map(member => (
                          <option key={member.id} value={member.id}>
                            {member.full_name || `${member.first_name} ${member.last_name}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#e2e8f0'
                      }}>
                        Spouse
                      </label>
                      <select
                        value={newMember.spouse_id}
                        onChange={(e) => setNewMember({...newMember, spouse_id: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #475569',
                          background: 'rgba(30, 41, 59, 0.8)',
                          color: 'white',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="">Select Spouse</option>
                        {familyMembers.map(member => (
                          <option key={member.id} value={member.id}>
                            {member.full_name || `${member.first_name} ${member.last_name}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Biography */}
                  <div style={{ marginBottom: '30px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#e2e8f0'
                    }}>
                      Biography
                    </label>
                    <textarea
                      value={newMember.biography}
                      onChange={(e) => setNewMember({...newMember, biography: e.target.value})}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #475569',
                        background: 'rgba(30, 41, 59, 0.8)',
                        color: 'white',
                        fontSize: '1rem',
                        resize: 'vertical'
                      }}
                      placeholder="Share biographical information, stories, achievements..."
                    />
                  </div>

                  {/* Form Buttons */}
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                      type="submit"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        transition: 'transform 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      Add Family Member
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowAddMemberForm(false)}
                      style={{
                        background: 'transparent',
                        color: '#94a3b8',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'rgba(148, 163, 184, 0.1)'
                        e.target.style.color = '#e2e8f0'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent'
                        e.target.style.color = '#94a3b8'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Search and Filter Controls */}
            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search family members..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #475569',
                    background: 'rgba(51, 65, 85, 0.8)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  background: 'rgba(51, 65, 85, 0.8)',
                  color: 'white',
                  fontSize: '1rem',
                  minWidth: '150px'
                }}
              >
                <option value="all">All Members</option>
                <option value="living">Living Only</option>
                <option value="deceased">Deceased Only</option>
              </select>
            </div>

            {/* Family Members Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {filteredMembers.map(member => (
                <div
                  key={member.id}
                  style={{
                    background: 'rgba(51, 65, 85, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '15px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        color: '#fbbf24',
                        marginBottom: '5px'
                      }}>
                        {member.full_name}
                      </h3>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        background: member.is_deceased 
                          ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white'
                      }}>
                        {member.is_deceased ? '⚰️ Deceased' : '💚 Living'}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteFamilyMember(member.id)}
                      style={{
                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        transition: 'transform 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      title="Delete family member"
                    >
                      🗑️
                    </button>
                  </div>

                  <div style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '10px' }}>
                    <div><strong>Generation:</strong> {member.generation}</div>
                    {member.birth_date && (
                      <div><strong>Born:</strong> {new Date(member.birth_date).toLocaleDateString()}</div>
                    )}
                    {member.death_date && (
                      <div><strong>Died:</strong> {new Date(member.death_date).toLocaleDateString()}</div>
                    )}
                    {member.birth_location && (
                      <div><strong>Birth Location:</strong> {member.birth_location}</div>
                    )}
                    {member.death_location && (
                      <div><strong>Death Location:</strong> {member.death_location}</div>
                    )}
                  </div>

                  {member.biography && (
                    <div style={{
                      background: 'rgba(30, 41, 59, 0.5)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginTop: '15px',
                      color: '#e2e8f0',
                      fontSize: '0.9rem',
                      lineHeight: '1.4'
                    }}>
                      {member.biography.length > 150 
                        ? member.biography.substring(0, 150) + '...'
                        : member.biography
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredMembers.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#94a3b8'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '10px'
                }}>
                  No family members found
                </h3>
                <p>
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Start by adding the first family members to build your tree.'
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
