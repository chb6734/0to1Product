/**
 * 편지 이미지 업로드 기능 테스트
 *
 * 목적: 편지 생성 시 이미지 업로드 및 표시 기능 검증
 * 시나리오:
 * - 이미지 파일 선택 및 업로드
 * - 이미지 미리보기 표시
 * - 이미지 삭제
 * - 이미지 없을 때 기본 이미지 표시
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLetter } from "../hooks/useLetter";
import * as imageUploadUtils from "@/shared/utils/imageUpload";

// imageUpload 유틸리티 모킹
vi.mock("@/shared/utils/imageUpload", () => ({
  uploadImage: vi.fn(),
  validateImageFile: vi.fn(),
  getDefaultLetterImage: vi.fn(() => "data:image/svg+xml;base64,default"),
}));

describe("useLetter - 이미지 업로드 기능", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * 테스트: 이미지 설정 기능
   * 시나리오: 사용자가 이미지 파일을 선택함
   * Given: 유효한 이미지 파일이 있음
   * When: setImage 함수를 호출함
   * Then: letter.imageUrl이 설정됨
   */
  it("should set image URL when valid image file is provided", async () => {
    // Arrange: 테스트 준비
    const { result } = renderHook(() => useLetter());
    const mockFile = new File(["test"], "test.png", { type: "image/png" });
    const mockImageUrl = "data:image/png;base64,test123";

    vi.mocked(imageUploadUtils.uploadImage).mockResolvedValue(mockImageUrl);

    // Act: 액션 수행
    await act(async () => {
      await result.current.setImage(mockFile, false);
    });

    // Assert: 결과 검증
    expect(result.current.letter.imageUrl).toBe(mockImageUrl);
    expect(imageUploadUtils.uploadImage).toHaveBeenCalledWith(mockFile, false);
  });

  /**
   * 테스트: 데모 모드에서 이미지 설정
   * 시나리오: 사용자가 데모 모드에서 이미지를 선택함
   * Given: 데모 모드가 활성화되어 있음
   * When: setImage 함수를 호출함
   * Then: letter.imageUrl이 Base64로 설정됨
   */
  it("should set image URL in demo mode", async () => {
    // Arrange: 테스트 준비
    const { result } = renderHook(() => useLetter());
    const mockFile = new File(["test"], "test.png", { type: "image/png" });
    const mockImageUrl = "data:image/png;base64,demo123";

    vi.mocked(imageUploadUtils.uploadImage).mockResolvedValue(mockImageUrl);

    // Act: 액션 수행
    await act(async () => {
      await result.current.setImage(mockFile, true);
    });

    // Assert: 결과 검증
    expect(result.current.letter.imageUrl).toBe(mockImageUrl);
    expect(imageUploadUtils.uploadImage).toHaveBeenCalledWith(mockFile, true);
  });

  /**
   * 테스트: 이미지 삭제 기능
   * 시나리오: 사용자가 이미지를 삭제함
   * Given: 편지에 이미지가 설정되어 있음
   * When: removeImage 함수를 호출함
   * Then: letter.imageUrl이 undefined가 됨
   */
  it("should remove image when removeImage is called", async () => {
    // Arrange: 테스트 준비
    const { result } = renderHook(() => useLetter());
    const mockFile = new File(["test"], "test.png", { type: "image/png" });
    const mockImageUrl = "data:image/png;base64,test123";

    // 먼저 이미지 설정
    vi.mocked(imageUploadUtils.uploadImage).mockResolvedValue(mockImageUrl);
    await act(async () => {
      await result.current.setImage(mockFile, false);
    });

    expect(result.current.letter.imageUrl).toBe(mockImageUrl);

    // Act: 이미지 삭제
    act(() => {
      result.current.removeImage();
    });

    // Assert: 결과 검증
    expect(result.current.letter.imageUrl).toBeUndefined();
  });

  /**
   * 테스트: 잘못된 이미지 파일 처리
   * 시나리오: 사용자가 잘못된 형식의 이미지 파일을 선택함
   * Given: 유효하지 않은 이미지 파일이 있음
   * When: setImage 함수를 호출함
   * Then: 에러가 발생함
   */
  it("should throw error when invalid image file is provided", async () => {
    // Arrange: 테스트 준비
    const { result } = renderHook(() => useLetter());
    const mockFile = new File(["test"], "test.txt", { type: "text/plain" });
    const errorMessage = "JPG, PNG, WebP 형식만 지원됩니다.";

    vi.mocked(imageUploadUtils.uploadImage).mockRejectedValue(
      new Error(errorMessage)
    );

    // Act & Assert: 액션 수행 및 에러 검증
    await expect(
      act(async () => {
        await result.current.setImage(mockFile, false);
      })
    ).rejects.toThrow(errorMessage);
  });

  /**
   * 테스트: 이미지 파일 크기 초과 처리
   * 시나리오: 사용자가 너무 큰 이미지 파일을 선택함
   * Given: 5MB를 초과하는 이미지 파일이 있음
   * When: setImage 함수를 호출함
   * Then: 에러가 발생함
   */
  it("should throw error when image file size exceeds limit", async () => {
    // Arrange: 테스트 준비
    const { result } = renderHook(() => useLetter());
    const mockFile = new File(["test"], "large.png", { type: "image/png" });
    const errorMessage = "이미지 크기는 5MB 이하여야 합니다.";

    vi.mocked(imageUploadUtils.uploadImage).mockRejectedValue(
      new Error(errorMessage)
    );

    // Act & Assert: 액션 수행 및 에러 검증
    await expect(
      act(async () => {
        await result.current.setImage(mockFile, false);
      })
    ).rejects.toThrow(errorMessage);
  });
});
