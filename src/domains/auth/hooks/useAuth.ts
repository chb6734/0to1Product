/**
 * useAuth 훅
 *
 * 목적: 사용자 인증 및 프로필 관리
 * 기능:
 * - 소셜 로그인 (Google/Kakao/Apple)
 * - 로그아웃
 * - 프로필 조회 및 수정
 */
import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/shared/lib/supabase";
import { AUTH_ERROR_MESSAGES } from "@/shared/constants/errorMessages";

interface User {
  id: string;
  email: string;
  nickname?: string;
  profileImage?: string;
  defaultPlatform?: 'spotify' | 'apple' | 'youtube' | 'melon' | null;
}

interface ProfileData {
  nickname?: string;
  profileImage?: string;
}

const MAX_NICKNAME_LENGTH = 20;

// localStorage 키
const AUTH_STORAGE_KEY = "fanstage_auth_user";

export function useAuth() {
  // localStorage에서 초기 상태 복원
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("[useAuth] localStorage에서 사용자 정보 복원:", parsed);
        return parsed;
      }
    } catch (error) {
      console.error("[useAuth] localStorage 복원 실패:", error);
    }
    return null;
  });

  // localStorage 변경 감지 (다른 탭이나 컴포넌트에서 발생한 변경만 감지)
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // 현재 user 상태와 비교하여 다를 때만 업데이트 (무한 루프 방지)
          setUser((currentUser) => {
            if (JSON.stringify(currentUser) === JSON.stringify(parsed)) {
              return currentUser; // 동일하면 업데이트하지 않음
            }
            return parsed;
          });
        } else {
          // localStorage가 비어있으면 user도 null로 설정
          setUser((currentUser) => {
            if (currentUser === null) {
              return currentUser; // 이미 null이면 업데이트하지 않음
            }
            return null;
          });
        }
      } catch (error) {
        console.error("[useAuth] storage 이벤트 처리 실패:", error);
      }
    };

    // 'storage' 이벤트는 다른 탭에서 발생한 변경만 감지 (같은 탭에서는 발생하지 않음)
    window.addEventListener('storage', handleStorageChange);
    
    // 커스텀 이벤트는 다른 컴포넌트에서 발생한 변경 감지용
    // 하지만 같은 컴포넌트에서 발생한 이벤트는 무시하기 위해 플래그 사용
    let isInternalUpdate = false;
    const handleLocalStorageChange = () => {
      if (isInternalUpdate) {
        isInternalUpdate = false;
        return; // 내부 업데이트는 무시
      }
      handleStorageChange();
    };

    window.addEventListener('localStorageChange', handleLocalStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleLocalStorageChange);
    };
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return !!stored;
    } catch {
      return false;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // user 상태 변경 시 localStorage에 저장 (무한 루프 방지)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 현재 localStorage의 값과 비교하여 다를 때만 저장
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      const storedUser = stored ? JSON.parse(stored) : null;
      
      // 현재 user와 localStorage의 값이 같으면 저장하지 않음 (무한 루프 방지)
      if (JSON.stringify(user) === JSON.stringify(storedUser)) {
        return;
      }

      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        console.log("[useAuth] localStorage에 사용자 정보 저장:", user);
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        console.log("[useAuth] localStorage에서 사용자 정보 제거");
      }
      
      // 다른 컴포넌트에 변경사항 알림 (같은 컴포넌트의 이벤트 리스너는 무시됨)
      window.dispatchEvent(new Event('localStorageChange'));
    } catch (error) {
      console.error("[useAuth] localStorage 저장 실패:", error);
    }
  }, [user]);

  // Supabase 클라이언트는 실제 Supabase 환경에서만 필요하므로 lazy하게 생성
  const getSupabaseClient = useCallback(() => {
    try {
      return createClient();
    } catch (error) {
      console.error("[useAuth] Supabase 클라이언트 생성 실패:", error);
      throw error;
    }
  }, []);

  // 페이지 로드 시 현재 세션 확인
  useEffect(() => {
    const checkSession = async () => {
      setIsInitializing(true);
      try {
        const supabase = getSupabaseClient();
        if (!supabase) {
          // Supabase 클라이언트가 없으면 localStorage만 확인
          setIsInitializing(false);
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const {
            data: { user: authUser },
          } = await supabase.auth.getUser();

          if (authUser) {
            // users 테이블에서 프로필 정보 가져오기
            const { data: profile } = await supabase
              .from("users")
              .select("id, email, nickname, profile_image")
              .eq("id", authUser.id)
              .single();

            const userData: User = {
              id: authUser.id,
              email: authUser.email || "",
              nickname: profile?.nickname || authUser.user_metadata?.nickname,
              profileImage:
                profile?.profile_image || authUser.user_metadata?.profile_image,
            };

            setUser(userData);
            setIsAuthenticated(true);
            console.log("[useAuth] 세션 복원 완료:", userData);
          }
        } else {
          // 세션이 없으면 localStorage 확인
          const stored = localStorage.getItem(AUTH_STORAGE_KEY);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              setUser(parsed);
              setIsAuthenticated(true);
              console.log(
                "[useAuth] localStorage에서 사용자 정보 복원:",
                parsed
              );
            } catch (error) {
              console.error("[useAuth] localStorage 파싱 실패:", error);
            }
          }
        }
      } catch (error) {
        console.error("[useAuth] 세션 확인 실패:", error);
        // 에러 발생 시 localStorage 확인
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            setIsAuthenticated(true);
          } catch (parseError) {
            console.error("[useAuth] localStorage 파싱 실패:", parseError);
          }
        }
      } finally {
        setIsInitializing(false);
      }
    };

    checkSession();
  }, [getSupabaseClient]);

  /**
   * Google 소셜 로그인
   */
  const loginWithGoogle = useCallback(async () => {
    console.log("[useAuth] loginWithGoogle 시작");
    setError(null);
    setIsLoading(true);
    try {
      // E2E 테스트 환경에서는 API 라우트를 통해 호출
      const response = await fetch("/api/auth/login/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(AUTH_ERROR_MESSAGES.CONNECTION_FAILED);
      }

      const data = await response.json();
      
      // 사용자 정보 저장
      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || "",
          nickname: data.user.nickname,
          profileImage: data.user.profileImage,
          defaultPlatform: data.user.defaultPlatform,
        };
        setUser(userData);
        setIsAuthenticated(true);
        
        // 온보딩 필요 여부 확인 후 리다이렉트
        if (!userData.nickname) {
          window.location.href = "/onboarding";
        } else {
          window.location.href = "/inbox";
        }
      }
    } catch (error) {
      const authError =
        error instanceof Error
          ? error
          : new Error(AUTH_ERROR_MESSAGES.CONNECTION_FAILED);
      setError(authError);
      setIsLoading(false);
      throw authError;
    }
  }, []);

  /**
   * Kakao 소셜 로그인
   */
  const loginWithKakao = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login/kakao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(AUTH_ERROR_MESSAGES.CONNECTION_FAILED);
      }

      const data = await response.json();
      
      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || "",
          nickname: data.user.nickname,
          profileImage: data.user.profileImage,
          defaultPlatform: data.user.defaultPlatform,
        };
        
        // 상태 업데이트 (useEffect에서 localStorage에 자동 저장됨)
        setUser(userData);
        setIsAuthenticated(true);
        
        // 명시적으로 localStorage 저장 (프로필 정보가 로그아웃까지 유지되도록)
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
            console.log("[useAuth] 로그인 성공: localStorage에 사용자 정보 저장:", userData);
            // 다른 컴포넌트에 변경사항 알림
            window.dispatchEvent(new Event('localStorageChange'));
          } catch (error) {
            console.error("[useAuth] 로그인 후 localStorage 저장 실패:", error);
          }
        }
        
        if (!userData.nickname) {
          window.location.href = "/onboarding";
        } else {
          window.location.href = "/inbox";
        }
      }
    } catch (error) {
      const authError =
        error instanceof Error
          ? error
          : new Error(AUTH_ERROR_MESSAGES.CONNECTION_FAILED);
      setError(authError);
      setIsLoading(false);
      throw authError;
    }
  }, []);

  /**
   * Apple 소셜 로그인
   */
  const loginWithApple = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login/apple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(AUTH_ERROR_MESSAGES.CONNECTION_FAILED);
      }

      const data = await response.json();
      
      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || "",
          nickname: data.user.nickname,
          profileImage: data.user.profileImage,
          defaultPlatform: data.user.defaultPlatform,
        };
        
        // 상태 업데이트 (useEffect에서 localStorage에 자동 저장됨)
        setUser(userData);
        setIsAuthenticated(true);
        
        // 명시적으로 localStorage 저장 (프로필 정보가 로그아웃까지 유지되도록)
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
            console.log("[useAuth] 로그인 성공: localStorage에 사용자 정보 저장:", userData);
            // 다른 컴포넌트에 변경사항 알림
            window.dispatchEvent(new Event('localStorageChange'));
          } catch (error) {
            console.error("[useAuth] 로그인 후 localStorage 저장 실패:", error);
          }
        }
        
        if (!userData.nickname) {
          window.location.href = "/onboarding";
        } else {
          window.location.href = "/inbox";
        }
      }
    } catch (error) {
      const authError =
        error instanceof Error
          ? error
          : new Error(AUTH_ERROR_MESSAGES.CONNECTION_FAILED);
      setError(authError);
      setIsLoading(false);
      throw authError;
    }
  }, []);

  /**
   * 로그아웃
   */
  const logout = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }

      // 로컬 상태 초기화
      setUser(null);
      setIsAuthenticated(false);
      
      // localStorage에서 모든 사용자 관련 정보 삭제 (프로필 정보가 로그아웃까지 유지되다가 삭제됨)
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          console.log("[useAuth] 로그아웃: localStorage에서 사용자 정보 삭제");
          // 다른 컴포넌트에 변경사항 알림
          window.dispatchEvent(new Event('localStorageChange'));
        } catch (error) {
          console.error("[useAuth] 로그아웃: localStorage 삭제 실패:", error);
        }
      }
    } catch (error) {
      const authError =
        error instanceof Error
          ? error
          : new Error(AUTH_ERROR_MESSAGES.LOGOUT_FAILED);
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }, [getSupabaseClient]);

  /**
   * 프로필 수정
   */
  const updateProfile = useCallback(
    async (data: ProfileData) => {
      if (!user) {
        const error = new Error(AUTH_ERROR_MESSAGES.LOGIN_REQUIRED);
        setError(error);
        throw error;
      }

      setError(null);
      setIsLoading(true);
      try {
        // API 라우트를 통해 프로필 업데이트
        const response = await fetch("/api/auth/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nickname: data.nickname,
            profileImage: data.profileImage,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 409) {
            const error = new Error(
              errorData.error || AUTH_ERROR_MESSAGES.DUPLICATE_NICKNAME
            );
            setError(error);
            throw error;
          }
          throw new Error(
            errorData.error || AUTH_ERROR_MESSAGES.PROFILE_UPDATE_FAILED
          );
        }

        const { user: updatedUser } = await response.json();

        const updatedUserData: User = {
          id: updatedUser.id,
          email: updatedUser.email,
          nickname: updatedUser.nickname,
          profileImage: updatedUser.profileImage || updatedUser.profile_image,
          defaultPlatform: updatedUser.defaultPlatform,
        };

        // 상태 업데이트 (useEffect에서 localStorage에 자동 저장됨)
        setUser(updatedUserData);
        
        // 명시적으로 localStorage 업데이트 (프로필 정보가 로그아웃까지 유지되도록)
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUserData));
            console.log("[useAuth] 프로필 업데이트 후 localStorage 저장:", updatedUserData);
            // 다른 컴포넌트에 변경사항 알림
            window.dispatchEvent(new Event('localStorageChange'));
          } catch (error) {
            console.error("[useAuth] 프로필 업데이트 후 localStorage 저장 실패:", error);
          }
        }
        
        return updatedUserData;
      } catch (error) {
        const authError =
          error instanceof Error
            ? error
            : new Error(AUTH_ERROR_MESSAGES.PROFILE_UPDATE_FAILED);
        setError(authError);
        throw authError;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitializing,
    error,
    loginWithGoogle,
    loginWithKakao,
    loginWithApple,
    logout,
    updateProfile,
  };
}
