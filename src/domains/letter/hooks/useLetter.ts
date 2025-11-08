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
 */
import { useState, useCallback } from 'react'

interface Track {
  id: string
  title: string
  artist: string
  albumCover: string
  memo?: string
}

interface Letter {
  tracks: Track[]
  message: string
}

const MAX_MESSAGE_LENGTH = 500
const MAX_MEMO_LENGTH = 100
const MIN_TRACKS_COUNT = 1

export function useLetter() {
  const [letter, setLetter] = useState<Letter>({
    tracks: [],
    message: '',
  })

  /**
   * 곡 추가
   */
  const addTrack = useCallback((track: Track) => {
    setLetter((prev) => ({
      ...prev,
      tracks: [...prev.tracks, track],
    }))
  }, [])

  /**
   * 곡 삭제
   */
  const removeTrack = useCallback((trackId: string) => {
    setLetter((prev) => {
      const newTracks = prev.tracks.filter((track) => track.id !== trackId)
      
      // 최소 1곡은 유지해야 함
      if (newTracks.length === 0) {
        return prev
      }

      return {
        ...prev,
        tracks: newTracks,
      }
    })
  }, [])

  /**
   * 곡 순서 변경
   */
  const reorderTracks = useCallback((fromIndex: number, toIndex: number) => {
    setLetter((prev) => {
      const newTracks = [...prev.tracks]
      const [removed] = newTracks.splice(fromIndex, 1)
      newTracks.splice(toIndex, 0, removed)

      return {
        ...prev,
        tracks: newTracks,
      }
    })
  }, [])

  /**
   * 메시지 설정
   */
  const setMessage = useCallback((message: string) => {
    if (message.length > MAX_MESSAGE_LENGTH) {
      throw new Error('최대 500자까지 입력 가능합니다')
    }

    setLetter((prev) => ({
      ...prev,
      message,
    }))
  }, [])

  /**
   * 곡에 메모 추가
   */
  const addTrackMemo = useCallback((trackId: string, memo: string) => {
    if (memo.length > MAX_MEMO_LENGTH) {
      throw new Error('최대 100자까지 입력 가능합니다')
    }

    setLetter((prev) => ({
      ...prev,
      tracks: prev.tracks.map((track) =>
        track.id === trackId ? { ...track, memo } : track
      ),
    }))
  }, [])

  /**
   * 편지 생성
   */
  const createLetter = useCallback(async () => {
    if (letter.tracks.length < MIN_TRACKS_COUNT) {
      throw new Error('최소 1곡 이상 추가해주세요')
    }

    // API 호출 시뮬레이션
    const response = await fetch('/api/letters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tracks: letter.tracks,
        message: letter.message,
      }),
    })

    if (!response.ok) {
      throw new Error('편지 생성에 실패했습니다')
    }

    const data = await response.json()
    return data.id
  }, [letter])

  return {
    letter,
    addTrack,
    removeTrack,
    reorderTracks,
    setMessage,
    addTrackMemo,
    createLetter,
  }
}

