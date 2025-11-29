/**
 * 날짜 포맷팅 유틸리티
 *
 * 목적: 날짜를 다양한 형식으로 포맷팅
 */

/**
 * 날짜를 년월일 형식으로 포맷팅
 *
 * @param date ISO 날짜 문자열 또는 Date 객체
 * @returns "2024년 1월 10일" 형식의 문자열
 */
export function formatDateToKorean(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return date; // 유효하지 않은 날짜면 원본 반환
  }
  
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 날짜를 상대적 형식으로 포맷팅 (예: "2일 전", "방금")
 *
 * @param date ISO 날짜 문자열 또는 Date 객체
 * @returns 상대적 날짜 문자열
 */
export function formatDateRelative(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return date; // 유효하지 않은 날짜면 원본 반환
  }
  
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
}

