/**
 * 이미지 업로드 유틸리티
 *
 * 목적: 편지 이미지 업로드 및 처리 기능
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface ImageUploadResult {
  url: string;
  file: File;
}

/**
 * 이미지 파일을 Base64로 변환
 *
 * @param file 이미지 파일
 * @returns Base64 문자열 Promise
 */
export function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 이미지 파일 검증
 *
 * @param file 이미지 파일
 * @returns 검증 결과 및 에러 메시지
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // 파일 크기 검증
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `이미지 크기는 ${MAX_FILE_SIZE / 1024 / 1024}MB 이하여야 합니다.`,
    };
  }

  // 파일 형식 검증
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "JPG, PNG, WebP 형식만 지원됩니다.",
    };
  }

  return { valid: true };
}

/**
 * 이미지 파일 업로드 (데모 모드: Base64, 로그인 사용자: 서버 업로드)
 *
 * @param file 이미지 파일
 * @param isDemoMode 데모 모드 여부
 * @returns 이미지 URL Promise
 */
export async function uploadImage(
  file: File,
  isDemoMode: boolean = false
): Promise<string> {
  // 파일 검증
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  if (isDemoMode) {
    // 데모 모드: Base64로 변환하여 반환
    return await convertImageToBase64(file);
  } else {
    // 로그인 사용자: 서버에 업로드 (현재는 Base64로 처리, 향후 서버 업로드로 변경)
    // TODO: 실제 서버 업로드 API 호출
    return await convertImageToBase64(file);
  }
}

/**
 * 기본 이미지 URL 반환
 *
 * @returns 기본 이미지 URL
 */
export function getDefaultLetterImage(): string {
  // 기본 이미지: 그라데이션 배경을 가진 SVG 데이터 URL
  return "data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FFE11D;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%232ADFFF;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='200' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%23000' text-anchor='middle' dominant-baseline='middle'%3EFAN:STAGE%3C/text%3E%3C/svg%3E";
}

