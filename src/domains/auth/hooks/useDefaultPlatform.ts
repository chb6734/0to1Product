/**
 * 기본 플랫폼 설정 훅
 * 
 * 목적: 사용자 기본 플랫폼 설정 및 조회
 * 기능:
 * - 기본 플랫폼 설정
 * - 기본 플랫폼 조회
 * - 기본 플랫폼 변경
 */

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

interface User {
  id: string
  email: string
  nickname?: string
  profileImage?: string
  defaultPlatform?: Platform
}

export function useDefaultPlatform() {
  const { user } = useAuth() as { user: User | null }
  const [defaultPlatform, setDefaultPlatformState] = useState<Platform>(null)

  useEffect(() => {
    if (user?.defaultPlatform !== undefined) {
      setDefaultPlatformState(user.defaultPlatform)
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
    setDefaultPlatformState(updatedUser.defaultPlatform as Platform)
  }

  return {
    defaultPlatform,
    setDefaultPlatform,
  }
}

