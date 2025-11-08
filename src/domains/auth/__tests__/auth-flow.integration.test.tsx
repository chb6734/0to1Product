/**
 * 사용자 인증 플로우 통합 테스트
 * 
 * 목적: 사용자가 소셜 로그인을 통해 가입하고 프로필을 설정하는 전체 플로우 검증
 * 시나리오: 사용자가 Google 계정으로 로그인하고 닉네임을 설정함
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignupPage } from '@/app/(auth)/signup/page'
import { server } from '@/shared/lib/msw'
import { http, HttpResponse } from 'msw'

beforeEach(() => {
  server.use(
    http.post('/api/auth/google', async () => {
      return HttpResponse.json({
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      })
    }),
    
    http.post('/api/users/check-nickname', async ({ request }) => {
      const body = await request.json()
      
      if (body.nickname === 'existinguser') {
        return HttpResponse.json({ exists: true }, { status: 409 })
      }
      
      return HttpResponse.json({ exists: false })
    }),
    
    http.post('/api/users/profile', async ({ request }) => {
      const body = await request.json()
      return HttpResponse.json({
        id: 'user-123',
        email: 'test@example.com',
        nickname: body.nickname,
        profile_image: body.profileImage,
      })
    })
  )
})

describe('User Authentication Flow', () => {
  /**
   * 테스트: Google 소셜 로그인 및 가입
   * 시나리오: 사용자가 Google 계정으로 로그인하고 닉네임을 설정함
   * Given: 사용자가 회원가입 페이지에 있음
   * When: Google 로그인 버튼을 클릭함
   * And: Google 인증을 완료함
   * And: 닉네임을 입력함
   * Then: 사용자 계정이 생성되고 메인 화면으로 이동함
   */
  it('should sign up with Google and set nickname', async () => {
    const user = userEvent.setup()
    
    render(<SignupPage />)
    
    // Google 로그인 버튼 클릭
    const googleButton = screen.getByText('Google로 로그인')
    await user.click(googleButton)
    
    // Google 인증 완료 대기
    await waitFor(() => {
      expect(screen.getByPlaceholderText('닉네임을 입력해주세요')).toBeInTheDocument()
    })
    
    // 닉네임 입력
    const nicknameInput = screen.getByPlaceholderText('닉네임을 입력해주세요')
    await user.type(nicknameInput, 'testuser')
    
    // 완료 버튼 클릭
    const submitButton = screen.getByText('완료')
    await user.click(submitButton)
    
    // 검증
    await waitFor(() => {
      expect(screen.getByText('환영합니다!')).toBeInTheDocument()
    })
  })

  /**
   * 테스트: 중복 닉네임 검증
   * 시나리오: 사용자가 이미 사용 중인 닉네임을 입력함
   * Given: 사용자가 닉네임 입력 화면에 있음
   * When: 이미 사용 중인 닉네임을 입력함
   * Then: 에러 메시지가 표시되고 가입이 진행되지 않음
   */
  it('should reject duplicate nickname', async () => {
    const user = userEvent.setup()
    
    render(<SignupPage />)
    
    // Google 로그인 완료 후 닉네임 입력 화면
    const googleButton = screen.getByText('Google로 로그인')
    await user.click(googleButton)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('닉네임을 입력해주세요')).toBeInTheDocument()
    })
    
    // 중복 닉네임 입력
    const nicknameInput = screen.getByPlaceholderText('닉네임을 입력해주세요')
    await user.type(nicknameInput, 'existinguser')
    
    // 완료 버튼 클릭
    const submitButton = screen.getByText('완료')
    await user.click(submitButton)
    
    // 검증
    await waitFor(() => {
      expect(screen.getByText('이미 사용 중인 닉네임입니다')).toBeInTheDocument()
    })
  })
})

