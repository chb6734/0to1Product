/**
 * MSW 초기화 (브라우저)
 * 
 * 목적: 개발 환경에서 MSW를 초기화하고 활성화
 */
import { worker } from './browser'

let isInitialized = false

async function enableMocking() {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 MSW를 사용하지 않음
    return
  }

  if (isInitialized) {
    return
  }

  // MSW 활성화
  await worker.start({
    onUnhandledRequest: 'bypass', // 핸들러가 없는 요청은 그대로 통과
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })

  isInitialized = true
  console.log('✅ MSW Mock Service Worker 활성화됨')
}

// 개발 환경에서만 MSW 활성화
if (process.env.NODE_ENV === 'development') {
  enableMocking().catch((error) => {
    console.error('MSW 초기화 실패:', error)
  })
}

export { enableMocking }

