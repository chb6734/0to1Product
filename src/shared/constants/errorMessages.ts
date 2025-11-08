/**
 * 에러 메시지 상수
 * 
 * 목적: 에러 메시지 일관성 유지 및 재사용성 향상
 */
export const AUTH_ERROR_MESSAGES = {
  LOGIN_FAILED: '로그인에 실패했습니다',
  CONNECTION_FAILED: '연결에 실패했습니다',
  LOGOUT_FAILED: '로그아웃에 실패했습니다',
  PROFILE_UPDATE_FAILED: '프로필 수정에 실패했습니다',
  LOGIN_REQUIRED: '로그인이 필요합니다',
  DUPLICATE_NICKNAME: '이미 사용 중인 닉네임입니다',
} as const

export const LETTER_ERROR_MESSAGES = {
  MESSAGE_TOO_LONG: '최대 500자까지 입력 가능합니다',
  MEMO_TOO_LONG: '최대 100자까지 입력 가능합니다',
  NO_TRACKS: '최소 1곡 이상 추가해주세요',
  CREATION_FAILED: '편지 생성에 실패했습니다',
} as const

