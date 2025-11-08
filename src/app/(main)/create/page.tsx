'use client'

import { useLetter } from '@/domains/letter/hooks/useLetter'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Card } from '@/shared/components/ui/Card'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateLetterPage() {
  const { letter, addTrack, removeTrack, setMessage, createLetter, isCreating, error, resetLetter } = useLetter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/music/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setSearchResults(data.tracks || [])
    } catch (error) {
      console.error('검색 실패:', error)
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery])

  const handleTrackAdd = useCallback((track: any) => {
    addTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      albumCover: track.albumCover,
    })
    setSearchQuery('')
    setSearchResults([])
  }, [addTrack])

  const handleSubmit = useCallback(async () => {
    try {
      const letterId = await createLetter()
      router.push(`/letters/${letterId}`)
    } catch (error) {
      console.error('편지 생성 실패:', error)
    }
  }, [createLetter, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">편지 만들기</h1>
          <p className="text-gray-600">음악과 메시지로 마음을 전해보세요</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 곡 검색 및 추가 */}
          <div className="space-y-4">
            <Card>
              <h2 className="text-xl font-semibold mb-4">곡 검색</h2>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="곡 제목 또는 아티스트명 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} isLoading={isSearching}>
                  검색
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleTrackAdd(track)}
                    >
                      <img
                        src={track.albumCover}
                        alt={track.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{track.title}</p>
                        <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        추가
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* 추가된 곡 목록 */}
            {letter.tracks.length > 0 && (
              <Card>
                <h2 className="text-xl font-semibold mb-4">추가된 곡 ({letter.tracks.length})</h2>
                <div className="space-y-2">
                  {letter.tracks.map((track, index) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <span className="text-gray-400 text-sm">{index + 1}</span>
                      <img
                        src={track.albumCover}
                        alt={track.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{track.title}</p>
                        <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeTrack(track.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* 오른쪽: 메시지 작성 및 미리보기 */}
          <div className="space-y-4">
            <Card>
              <h2 className="text-xl font-semibold mb-4">메시지 작성</h2>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={6}
                placeholder="메시지를 입력하세요 (최대 500자)"
                value={letter.message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
              />
              <p className="mt-2 text-sm text-gray-500 text-right">
                {letter.message.length}/500
              </p>
            </Card>

            {/* 미리보기 */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">미리보기</h2>
              {letter.tracks.length === 0 ? (
                <p className="text-gray-400 text-center py-8">곡을 추가해주세요</p>
              ) : (
                <div className="space-y-4">
                  {letter.message && (
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{letter.message}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    {letter.tracks.map((track, index) => (
                      <div key={track.id} className="flex items-center gap-3 p-2 border rounded">
                        <span className="text-gray-400 text-xs">{index + 1}</span>
                        <img
                          src={track.albumCover}
                          alt={track.title}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{track.title}</p>
                          <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* 액션 버튼 */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={resetLetter}
                disabled={isCreating}
              >
                초기화
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSubmit}
                isLoading={isCreating}
                disabled={isCreating || letter.tracks.length === 0}
              >
                편지 완성
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

