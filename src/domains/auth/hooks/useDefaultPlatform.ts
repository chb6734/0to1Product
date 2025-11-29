/**
 * 기본 플랫폼 설정 훅
 * 
 * 목적: 사용자 기본 플랫폼 설정 및 조회
 * 기능:
 * - 기본 플랫폼 설정
 * - 기본 플랫폼 조회
 * - 기본 플랫폼 변경
 */

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

export type Platform = 'spotify' | 'apple' | 'youtube' | 'melon' | null

export function useDefaultPlatform() {
  const { user } = useAuth()
  const [defaultPlatform, setDefaultPlatformState] = useState<Platform>(null)

  useEffect(() => {
    // localStorage에서 직접 확인 (useAuth가 업데이트되지 않을 수 있음)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('fanstage_auth_user')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.defaultPlatform !== undefined) {
            setDefaultPlatformState(parsed.defaultPlatform as Platform)
            return
          }
        }
      } catch (error) {
        console.error('[useDefaultPlatform] localStorage 읽기 실패:', error)
      }
    }
    
    // useAuth의 user에서 확인
    if (user?.defaultPlatform !== undefined) {
      setDefaultPlatformState(user.defaultPlatform as Platform)
    } else {
      setDefaultPlatformState(null)
    }
  }, [user])

  const setDefaultPlatform = async (platform: Platform): Promise<void> => {
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ defaultPlatform: platform }),
    })

    if (!response.ok) {
      throw new Error('기본 플랫폼 설정에 실패했습니다')
    }

    const { user: updatedUser } = await response.json()
    const platformValue = updatedUser.defaultPlatform as Platform
    setDefaultPlatformState(platformValue)
    
    // useAuth의 user 상태도 업데이트 (localStorage 동기화)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('fanstage_auth_user')
        if (stored) {
          const parsed = JSON.parse(stored)
          const updated = { ...parsed, defaultPlatform: platformValue }
          localStorage.setItem('fanstage_auth_user', JSON.stringify(updated))
          // useAuth가 localStorage를 감시하도록 커스텀 이벤트 발생
          window.dispatchEvent(new Event('localStorageChange'))
        }
      } catch (error) {
        console.error('[useDefaultPlatform] localStorage 업데이트 실패:', error)
      }
    }
  }

  return {
    defaultPlatform,
    setDefaultPlatform,
  }
}

