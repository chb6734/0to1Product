'use client'

/**
 * 온보딩 페이지
 * 
 * 목적: 신규 사용자의 닉네임 및 프로필 이미지 설정
 * 시나리오: TC-AUTH-001, TC-AUTH-002, TC-AUTH-003
 */
import { useState } from 'react'
import { useAuth } from '@/domains/auth/hooks/useAuth'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function OnboardingPage() {
  const { user, updateProfile, isLoading, error, isAuthenticated } = useAuth()
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
      return
    }
    // 이미 닉네임이 있으면 메인 페이지로 리다이렉트
    if (user?.nickname) {
      router.replace('/')
      return
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    // 닉네임 검증
    if (!nickname.trim()) {
      setValidationError('닉네임을 입력해주세요')
      return
    }

    if (nickname.length > 20) {
      setValidationError('닉네임은 최대 20자까지 입력 가능합니다')
      return
    }

    setIsSubmitting(true)
    try {
      await updateProfile({
        nickname: nickname.trim(),
        profileImage: profileImage.trim() || undefined,
      })
      // 프로필 업데이트 성공 시 메인 페이지로 리다이렉트
      router.replace('/')
    } catch (error) {
      // 에러는 useAuth의 error state로 처리됨
      console.error('프로필 업데이트 실패:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated || user?.nickname) {
    return null // 리다이렉트 중
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-pink-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">FAN:STAGE</h1>
          <p className="text-gray-600">프로필을 설정해주세요</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">프로필 설정</h2>

          {(error || validationError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {validationError || error?.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="닉네임"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요 (최대 20자)"
                maxLength={20}
                required
                autoFocus
              />
              <p className="mt-1 text-xs text-gray-500">
                {nickname.length}/20
              </p>
            </div>

            <div>
              <Input
                label="프로필 이미지 URL (선택)"
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-1 text-xs text-gray-500">
                프로필 이미지 URL을 입력하거나 나중에 설정할 수 있습니다
              </p>
            </div>

            {profileImage && (
              <div className="flex justify-center">
                <img
                  src={profileImage}
                  alt="프로필 미리보기"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting || isLoading}
              disabled={isSubmitting || isLoading}
            >
              완료
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

