/**
 * Supabase 클라이언트 설정
 * 
 * 목적: Supabase 클라이언트 생성 및 관리
 */
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

