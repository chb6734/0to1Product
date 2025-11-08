/**
 * useAuth 훅
 * 
 * 목적: 사용자 인증 및 프로필 관리
 * 기능:
 * - 소셜 로그인 (Google/Kakao/Apple)
 * - 로그아웃
 * - 프로필 조회 및 수정
 */
import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/shared/lib/supabase'
import { AUTH_ERROR_MESSAGES } from '@/shared/constants/errorMessages'

interface User {
  id: string
  email: string
  nickname?: string
  profileImage?: string
}

interface ProfileData {
  nickname?: string
  profileImage?: string
}

const MAX_NICKNAME_LENGTH = 20

// localStorage 키
const AUTH_STORAGE_KEY = 'fanstage_auth_user'

export function useAuth() {
  // localStorage에서 초기 상태 복원
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log('[useAuth] localStorage에서 사용자 정보 복원:', parsed)
        return parsed
      }
    } catch (error) {
      console.error('[useAuth] localStorage 복원 실패:', error)
    }
    return null
  })
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      return !!stored
    } catch {
      return false
    }
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  // user 상태 변경 시 localStorage에 저장
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (user) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
        console.log('[useAuth] localStorage에 사용자 정보 저장:', user)
      } catch (error) {
        console.error('[useAuth] localStorage 저장 실패:', error)
      }
    } else {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        console.log('[useAuth] localStorage에서 사용자 정보 제거')
      } catch (error) {
        console.error('[useAuth] localStorage 제거 실패:', error)
      }
    }
  }, [user])
  
  // Supabase 클라이언트는 실제 Supabase 환경에서만 필요하므로 lazy하게 생성
  const getSupabaseClient = useCallback(() => {
    try {
      return createClient()
    } catch {
      // 개발 환경에서 환경 변수가 없으면 null 반환 (MSW 사용)
      return null
    }
  }, [])

  /**
   * Google 소셜 로그인
   */
  const loginWithGoogle = useCallback(async () => {
    console.log('[useAuth] loginWithGoogle 시작')
    setError(null)
    setIsLoading(true)
    try {
      // MSW Mock 환경에서는 API 호출로 처리
      if (process.env.NODE_ENV === 'development') {
        console.log('[useAuth] MSW Mock 환경에서 로그인 시도')
        const response = await fetch('/api/auth/login/google', {
          method: 'POST',
        })
        console.log('[useAuth] API 응답 상태:', response.status, response.ok)
        if (!response.ok) {
          throw new Error(AUTH_ERROR_MESSAGES.LOGIN_FAILED)
        }
        const data = await response.json()
        console.log('[useAuth] API 응답 데이터:', data)
        const userData: User = {
          id: data.user.id,
          email: data.user.email,
          nickname: data.user.nickname,
          profileImage: data.user.profileImage,
        }
        console.log('[useAuth] 사용자 데이터 설정:', userData)
        console.log('[useAuth] 닉네임 존재 여부:', !!userData.nickname, 'nickname 값:', userData.nickname)
        setUser(userData)
        setIsAuthenticated(true)
        console.log('[useAuth] 로그인 완료, isAuthenticated:', true, 'user:', userData)
        return userData
      }

      // 실제 Supabase 환경
      const supabase = getSupabaseClient()
      if (!supabase) {
        throw new Error('Supabase client not available')
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      // 로그인 성공 시 사용자 정보 가져오기
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        const userData: User = {
          id: authUser.id,
          email: authUser.email || '',
          nickname: authUser.user_metadata?.nickname,
          profileImage: authUser.user_metadata?.profile_image,
        }
        setUser(userData)
        setIsAuthenticated(true)
        return userData
      }

      throw new Error(AUTH_ERROR_MESSAGES.LOGIN_FAILED)
    } catch (error) {
      const authError = error instanceof Error 
        ? error 
        : new Error(AUTH_ERROR_MESSAGES.CONNECTION_FAILED)
      setError(authError)
      throw authError
    } finally {
      setIsLoading(false)
    }
  }, [getSupabaseClient])

  /**
   * Kakao 소셜 로그인
   */
  const loginWithKakao = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      // MSW Mock 환경에서는 API 호출로 처리
      if (process.env.NODE_ENV === 'development') {
        const response = await fetch('/api/auth/login/kakao', {
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(AUTH_ERROR_MESSAGES.LOGIN_FAILED)
        }
        const data = await response.json()
        const userData: User = {
          id: data.user.id,
          email: data.user.email,
          nickname: data.user.nickname,
          profileImage: data.user.profileImage,
        }
        setUser(userData)
        setIsAuthenticated(true)
        return userData
      }

      // 실제 Supabase 환경
      const supabase = getSupabaseClient()
      if (!supabase) {
        throw new Error('Supabase client not available')
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        const userData: User = {
          id: authUser.id,
          email: authUser.email || '',
          nickname: authUser.user_metadata?.nickname,
          profileImage: authUser.user_metadata?.profile_image,
        }
        setUser(userData)
        setIsAuthenticated(true)
        return userData
      }

      throw new Error(AUTH_ERROR_MESSAGES.LOGIN_FAILED)
    } catch (error) {
      const authError = error instanceof Error 
        ? error 
        : new Error(AUTH_ERROR_MESSAGES.CONNECTION_FAILED)
      setError(authError)
      throw authError
    } finally {
      setIsLoading(false)
    }
  }, [getSupabaseClient])

  /**
   * Apple 소셜 로그인
   */
  const loginWithApple = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      // MSW Mock 환경에서는 API 호출로 처리
      if (process.env.NODE_ENV === 'development') {
        const response = await fetch('/api/auth/login/apple', {
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error(AUTH_ERROR_MESSAGES.LOGIN_FAILED)
        }
        const data = await response.json()
        const userData: User = {
          id: data.user.id,
          email: data.user.email,
          nickname: data.user.nickname,
          profileImage: data.user.profileImage,
        }
        setUser(userData)
        setIsAuthenticated(true)
        return userData
      }

      // 실제 Supabase 환경
      const supabase = getSupabaseClient()
      if (!supabase) {
        throw new Error('Supabase client not available')
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        const userData: User = {
          id: authUser.id,
          email: authUser.email || '',
          nickname: authUser.user_metadata?.nickname,
          profileImage: authUser.user_metadata?.profile_image,
        }
        setUser(userData)
        setIsAuthenticated(true)
        return userData
      }

      throw new Error(AUTH_ERROR_MESSAGES.LOGIN_FAILED)
    } catch (error) {
      const authError = error instanceof Error 
        ? error 
        : new Error(AUTH_ERROR_MESSAGES.CONNECTION_FAILED)
      setError(authError)
      throw authError
    } finally {
      setIsLoading(false)
    }
  }, [getSupabaseClient])

  /**
   * 로그아웃
   */
  const logout = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      // MSW Mock 환경에서는 API 호출로 처리
      if (process.env.NODE_ENV === 'development') {
        await fetch('/api/auth/logout', {
          method: 'POST',
        })
        setUser(null)
        setIsAuthenticated(false)
        // localStorage는 useEffect에서 자동 제거됨
        console.log('[useAuth] 로그아웃 완료, localStorage에서 사용자 정보 제거됨')
        return
      }

      // 실제 Supabase 환경
      const supabase = getSupabaseClient()
      if (!supabase) {
        // 개발 환경에서 Supabase가 없으면 로그아웃만 처리
        setUser(null)
        setIsAuthenticated(false)
        return
      }
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      const authError = error instanceof Error 
        ? error 
        : new Error(AUTH_ERROR_MESSAGES.LOGOUT_FAILED)
      setError(authError)
      throw authError
    } finally {
      setIsLoading(false)
    }
  }, [getSupabaseClient])

  /**
   * 프로필 수정
   */
  const updateProfile = useCallback(async (data: ProfileData) => {
    if (!user) {
      const error = new Error(AUTH_ERROR_MESSAGES.LOGIN_REQUIRED)
      setError(error)
      throw error
    }

    setError(null)
    setIsLoading(true)
    try {
      // MSW Mock 환경에서는 API 호출로 처리
      if (process.env.NODE_ENV === 'development') {
        const response = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || AUTH_ERROR_MESSAGES.PROFILE_UPDATE_FAILED)
        }
        const responseData = await response.json()
        const updatedUserData: User = {
          id: responseData.user.id,
          email: responseData.user.email,
          nickname: responseData.user.nickname,
          profileImage: responseData.user.profileImage,
        }
        setUser(updatedUserData)
        return updatedUserData
      }

      // 실제 Supabase 환경
      const supabase = getSupabaseClient()
      if (!supabase) {
        throw new Error('Supabase client not available')
      }
      
      // 중복 닉네임 체크
      if (data.nickname) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('nickname', data.nickname)
          .neq('id', user.id)
          .single()

        if (existingUser) {
          const error = new Error(AUTH_ERROR_MESSAGES.DUPLICATE_NICKNAME)
          setError(error)
          throw error
        }
      }

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          nickname: data.nickname,
          profile_image: data.profileImage,
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      const updatedUserData: User = {
        id: updatedUser.id,
        email: updatedUser.email,
        nickname: updatedUser.nickname,
        profileImage: updatedUser.profile_image,
      }

      setUser(updatedUserData)
      return updatedUserData
    } catch (error) {
      const authError = error instanceof Error 
        ? error 
        : new Error(AUTH_ERROR_MESSAGES.PROFILE_UPDATE_FAILED)
      setError(authError)
      throw authError
    } finally {
      setIsLoading(false)
    }
  }, [user, getSupabaseClient])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginWithGoogle,
    loginWithKakao,
    loginWithApple,
    logout,
    updateProfile,
  }
}

