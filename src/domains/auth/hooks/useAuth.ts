/**
 * useAuth 훅
 * 
 * 목적: 사용자 인증 및 프로필 관리
 * 기능:
 * - 소셜 로그인 (Google/Kakao/Apple)
 * - 로그아웃
 * - 프로필 조회 및 수정
 */
import { useState, useCallback } from 'react'
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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClient()

  /**
   * Google 소셜 로그인
   */
  const loginWithGoogle = useCallback(async () => {
    try {
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
      throw new Error(AUTH_ERROR_MESSAGES.CONNECTION_FAILED)
    }
  }, [supabase])

  /**
   * Kakao 소셜 로그인
   */
  const loginWithKakao = useCallback(async () => {
    try {
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
      throw new Error(AUTH_ERROR_MESSAGES.CONNECTION_FAILED)
    }
  }, [supabase])

  /**
   * Apple 소셜 로그인
   */
  const loginWithApple = useCallback(async () => {
    try {
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
      throw new Error(AUTH_ERROR_MESSAGES.CONNECTION_FAILED)
    }
  }, [supabase])

  /**
   * 로그아웃
   */
  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      throw new Error(AUTH_ERROR_MESSAGES.LOGOUT_FAILED)
    }
  }, [supabase])

  /**
   * 프로필 수정
   */
  const updateProfile = useCallback(async (data: ProfileData) => {
    if (!user) {
      throw new Error(AUTH_ERROR_MESSAGES.LOGIN_REQUIRED)
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
        throw new Error(AUTH_ERROR_MESSAGES.DUPLICATE_NICKNAME)
      }
    }

    try {
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
      if (error instanceof Error && error.message === AUTH_ERROR_MESSAGES.DUPLICATE_NICKNAME) {
        throw error
      }
      throw new Error(AUTH_ERROR_MESSAGES.PROFILE_UPDATE_FAILED)
    }
  }, [user, supabase])

  return {
    user,
    isAuthenticated,
    loginWithGoogle,
    loginWithKakao,
    loginWithApple,
    logout,
    updateProfile,
  }
}

