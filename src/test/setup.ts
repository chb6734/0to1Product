import { expect, afterEach, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { server } from '../mocks/server'

// MSW 서버 시작 (테스트 전)
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

// 각 테스트 후 cleanup 및 MSW 핸들러 리셋
afterEach(() => {
  cleanup()
  server.resetHandlers()
})

// 모든 테스트 후 MSW 서버 종료
afterAll(() => {
  server.close()
})

