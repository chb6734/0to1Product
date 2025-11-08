/**
 * MSW 초기화 진입점
 * 
 * 목적: 브라우저에서 MSW를 초기화하기 위한 진입점
 * 주의: server.ts는 브라우저 번들에서 제외되어야 함
 */
export { enableMocking } from './init'
export { handlers } from './handlers'
export { worker } from './browser'
export * from './types'
export * from './data'

// server.ts는 테스트 환경에서만 사용되므로 여기서 export하지 않음
// 테스트에서는 직접 import하여 사용: import { server } from '@/mocks/server'

