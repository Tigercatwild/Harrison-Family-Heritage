import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

// For client-side components
export const createSupabaseClient = () => {
  return createClientComponentClient()
}

// For server-side or direct client usage (fallback)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Auth helper functions
export const getCurrentUser = async () => {
  const supabase = createSupabaseClient()
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Error getting current user:', error)
      return null
    }
    return user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

export const signOut = async () => {
  const supabase = createSupabaseClient()
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
    return { success: true }
  } catch (error) {
    console.error('Error in signOut:', error)
    throw error
  }
}

export const signIn = async (email, password) => {
  const supabase = createSupabaseClient()
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

export const signUp = async (email, password, userData = {}) => {
  const supabase = createSupabaseClient()
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error signing up:', error)
    throw error
  }
}

// Helper functions for family data
export const getFamilyMembers = async () => {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching family members:', error)
    return []
  }
  
  return data || []
}

export const addFamilyMember = async (memberData) => {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('family_members')
    .insert([memberData])
    .select()
  
  if (error) {
    console.error('Error adding family member:', error)
    throw error
  }
  
  return data
}

export const getFamilyPhotos = async () => {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('family_photos')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching family photos:', error)
    return []
  }
  
  return data || []
}

export const uploadFamilyPhoto = async (photoData) => {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('family_photos')
    .insert([photoData])
    .select()
  
  if (error) {
    console.error('Error uploading family photo:', error)
    throw error
  }
  
  return data
}
