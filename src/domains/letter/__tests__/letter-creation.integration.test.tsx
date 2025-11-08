/**
 * 편지 생성 플로우 통합 테스트
 * 
 * 목적: 사용자가 편지를 생성하고 전송하는 전체 플로우 검증
 * 시나리오: 사용자가 곡을 검색하고 추가한 후 메시지를 작성하여 편지를 전송함
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LetterCreatePage } from '@/app/(main)/create/page'
import { server } from '@/shared/lib/msw'
import { http, HttpResponse } from 'msw'

// MSW 핸들러 설정
beforeEach(() => {
  server.use(
    http.get('/api/search/tracks', async ({ request }) => {
      const url = new URL(request.url)
      const query = url.searchParams.get('q')
      
      if (query === 'Happy Birthday') {
        return HttpResponse.json([
          { id: '1', title: 'Happy Birthday', artist: 'The Beatles', albumCover: 'cover1.jpg' },
        ])
      }
      
      return HttpResponse.json([])
    }),
    
    http.post('/api/letters', async ({ request }) => {
      const body = await request.json()
      
      if (!body.tracks || body.tracks.length === 0) {
        return HttpResponse.json({ error: '최소 1곡 이상 추가해주세요' }, { status: 400 })
      }
      
      return HttpResponse.json({ id: 'letter-123' })
    })
  )
})

describe('Letter Creation Flow', () => {
  /**
   * 테스트: 편지 생성 및 전송
   * 시나리오: 사용자가 곡을 검색하고 추가한 후 메시지를 작성하여 편지를 전송함
   * Given: 사용자가 로그인되어 있고 편지 생성 페이지에 있음
   * When: 곡을 검색하고 추가함
   * And: 메시지를 입력함
   * And: 전송 버튼을 클릭함
   * Then: 편지가 생성되고 전송됨
   * And: 성공 메시지가 표시됨
   */
  it('should create letter with tracks and message', async () => {
    const user = userEvent.setup()
    
    render(<LetterCreatePage />)
    
    // 검색
    const searchInput = screen.getByPlaceholderText('곡 검색')
    await user.type(searchInput, 'Happy Birthday')
    
    // 검색 결과 대기
    await waitFor(() => {
      expect(screen.getByText('Happy Birthday')).toBeInTheDocument()
    })
    
    // 곡 추가
    const addButton = screen.getByText('추가')
    await user.click(addButton)
    
    // 메시지 입력
    const messageInput = screen.getByPlaceholderText('메시지 입력')
    await user.type(messageInput, 'Happy Birthday!')
    
    // 전송
    const submitButton = screen.getByText('전송하기')
    await user.click(submitButton)
    
    // 검증
    await waitFor(() => {
      expect(screen.getByText('편지가 전송되었습니다')).toBeInTheDocument()
    })
  })

  /**
   * 테스트: 곡 없이 편지 생성 시도
   * 시나리오: 사용자가 곡을 추가하지 않고 편지 생성을 시도함
   * Given: 사용자가 편지 생성 페이지에 있음
   * When: 곡을 추가하지 않고 전송 버튼을 클릭함
   * Then: 에러 메시지가 표시되고 편지가 생성되지 않음
   */
  it('should show error when creating letter without tracks', async () => {
    const user = userEvent.setup()
    
    render(<LetterCreatePage />)
    
    // 메시지만 입력
    const messageInput = screen.getByPlaceholderText('메시지 입력')
    await user.type(messageInput, 'Happy Birthday!')
    
    // 전송 시도
    const submitButton = screen.getByText('전송하기')
    await user.click(submitButton)
    
    // 검증
    await waitFor(() => {
      expect(screen.getByText('최소 1곡 이상 추가해주세요')).toBeInTheDocument()
    })
  })
})

