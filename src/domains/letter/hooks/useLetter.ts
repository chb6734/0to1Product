/**
 * useLetter 훅
 *
 * 목적: 편지 생성 및 관리
 * 기능:
 * - 곡 추가/제거
 * - 곡 순서 변경
 * - 메시지 작성
 * - 곡에 메모 추가
 * - 편지 생성
 * - 임시 저장 (P1)
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { LETTER_ERROR_MESSAGES } from "@/shared/constants/errorMessages";
import { letterDraftUtils } from "@/shared/utils/letterDraft";

interface Track {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  memo?: string;
}

interface Letter {
  tracks: Track[];
  message: string;
  imageUrl?: string;
}

const MAX_MESSAGE_LENGTH = 500;
const MAX_MEMO_LENGTH = 100;
const MIN_TRACKS_COUNT = 1;

export function useLetter() {
  const [letter, setLetter] = useState<Letter>({
    tracks: [],
    message: "",
    imageUrl: undefined,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 임시 저장 debounce를 위한 ref
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 임시 저장 (debounce 1초)
   */
  const saveDraft = useCallback((letterData: Letter) => {
    // 이전 타이머 취소
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // 1초 후 저장
    saveTimeoutRef.current = setTimeout(() => {
      letterDraftUtils.saveDraft({
        tracks: letterData.tracks.map((t) => ({
          id: t.id,
          title: t.title,
          artist: t.artist,
        })),
        message: letterData.message,
      });
    }, 1000);
  }, []);

  /**
   * 곡 추가
   */
  const addTrack = useCallback(
    (track: Track) => {
      setLetter((prev) => {
        const newLetter = {
          ...prev,
          tracks: [...prev.tracks, track],
        };
        // 임시 저장
        saveDraft(newLetter);
        return newLetter;
      });
    },
    [saveDraft]
  );

  /**
   * 곡 삭제
   */
  const removeTrack = useCallback(
    (trackId: string) => {
      setLetter((prev) => {
        const newTracks = prev.tracks.filter((track) => track.id !== trackId);

        // 최소 1곡은 유지해야 함
        if (newTracks.length === 0) {
          return prev;
        }

        const newLetter = {
          ...prev,
          tracks: newTracks,
        };
        // 임시 저장
        saveDraft(newLetter);
        return newLetter;
      });
    },
    [saveDraft]
  );

  /**
   * 곡 순서 변경
   */
  const reorderTracks = useCallback((fromIndex: number, toIndex: number) => {
    setLetter((prev) => {
      const newTracks = [...prev.tracks];
      const [removed] = newTracks.splice(fromIndex, 1);
      newTracks.splice(toIndex, 0, removed);

      return {
        ...prev,
        tracks: newTracks,
      };
    });
  }, []);

  /**
   * 메시지 설정
   */
  const setMessage = useCallback(
    (message: string) => {
      if (message.length > MAX_MESSAGE_LENGTH) {
        const error = new Error(LETTER_ERROR_MESSAGES.MESSAGE_TOO_LONG);
        setError(error);
        throw error;
      }

      setError(null);
      setLetter((prev) => {
        const newLetter = {
          ...prev,
          message,
        };
        // 임시 저장
        saveDraft(newLetter);
        return newLetter;
      });
    },
    [saveDraft]
  );

  /**
   * 곡에 메모 추가
   */
  const addTrackMemo = useCallback((trackId: string, memo: string) => {
    if (memo.length > MAX_MEMO_LENGTH) {
      const error = new Error(LETTER_ERROR_MESSAGES.MEMO_TOO_LONG);
      setError(error);
      throw error;
    }

    setError(null);
    setLetter((prev) => ({
      ...prev,
      tracks: prev.tracks.map((track) =>
        track.id === trackId ? { ...track, memo } : track
      ),
    }));
  }, []);

  /**
   * 편지 초기화
   */
  const resetLetter = useCallback(() => {
    setLetter({
      tracks: [],
      message: "",
    });
    setError(null);
    // 임시 저장 데이터도 삭제
    letterDraftUtils.clearDraft();
  }, []);

  /**
   * 임시 저장된 편지 복구
   */
  const loadDraft = useCallback(() => {
    const draft = letterDraftUtils.loadDraft();
    if (draft) {
      setLetter({
        tracks: draft.tracks.map((t) => ({
          id: t.id,
          title: t.title,
          artist: t.artist,
          albumCover: "", // 임시 저장에는 앨범 커버가 없을 수 있음
        })),
        message: draft.message,
        imageUrl: draft.imageUrl,
      });
      return true;
    }
    return false;
  }, []);

  /**
   * 편지 생성
   */
  const createLetter = useCallback(async () => {
    if (isCreating) {
      return; // 중복 생성 방지
    }

    if (letter.tracks.length < MIN_TRACKS_COUNT) {
      const error = new Error(LETTER_ERROR_MESSAGES.NO_TRACKS);
      setError(error);
      throw error;
    }

    setIsCreating(true);
    setError(null);

    try {
      // API 호출 시뮬레이션
      const response = await fetch("/api/letters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tracks: letter.tracks,
          message: letter.message,
        }),
      });

      if (!response.ok) {
        throw new Error(LETTER_ERROR_MESSAGES.CREATION_FAILED);
      }

      const data = await response.json();

      // 편지 생성 성공 시 임시 저장 데이터 삭제
      letterDraftUtils.clearDraft();

      return data.id;
    } catch (error) {
      const letterError =
        error instanceof Error
          ? error
          : new Error(LETTER_ERROR_MESSAGES.CREATION_FAILED);
      setError(letterError);
      // 에러 발생 시에도 편지 데이터는 유지됨
      throw letterError;
    } finally {
      setIsCreating(false);
    }
  }, [letter, isCreating]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    letter,
    isCreating,
    error,
    addTrack,
    removeTrack,
    reorderTracks,
    setMessage,
    addTrackMemo,
    setImage,
    removeImage,
    createLetter,
    resetLetter,
    loadDraft,
  };
}
