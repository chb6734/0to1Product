/**
 * MSW 브라우저 설정
 * 
 * 목적: 개발 환경에서 브라우저에서 MSW를 사용하기 위한 설정
 */
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Service Worker를 사용하여 네트워크 요청을 가로챕니다
export const worker = setupWorker(...handlers)

