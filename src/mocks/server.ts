/**
 * MSW Node 설정 (테스트용)
 * 
 * 목적: 테스트 환경에서 MSW를 사용하기 위한 설정
 */
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Node 환경에서 네트워크 요청을 가로챕니다
export const server = setupServer(...handlers)

