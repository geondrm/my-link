"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/data/links";
import { fetchLinks, addLink, updateLink, deleteLink } from "@/lib/firestore-links";
import { AddLinkDialog } from "@/components/add-link-dialog";
import { LinkItem } from "@/components/link-item";
import { ProfileHeader } from "@/components/profile-header";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { getUserProfile, saveUserProfile, UserProfile } from "@/lib/firestore-profile";

export default function Page() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ── Auth State 변화 감지 ─────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ── 로그인 된 경우 마운트 시 Firestore에서 사용자 프로필 및 링크 목록 로드 ──────────────────────
  useEffect(() => {
    if (!user) {
      setLinks([]);
      setProfile(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    // 프로필 정보 로드
    getUserProfile(user.uid)
      .then(async (fetchedProfile) => {
        if (fetchedProfile) {
          setProfile(fetchedProfile);
        } else {
          // 최초 로그인 시 기본 프로필 생성
          const defaultProfile: UserProfile = {
            uid: user.uid,
            username: user.displayName || "사용자",
            slug: user.email?.split('@')[0] || `user_${user.uid.substring(0,6)}`,
            bio: "마이링크에 오신 것을 환영합니다!",
            photoURL: user.photoURL || undefined
          };
          await saveUserProfile(user.uid, defaultProfile);
          setProfile(defaultProfile);
        }
      })
      .then(() => fetchLinks(user.uid))
      .then((fetched) => setLinks(fetched))
      .catch((err) => console.error("데이터 불러오기 실패:", err))
      .finally(() => setIsLoading(false));
  }, [user]);

  // ── 링크 추가: Firestore 저장 후 로컬 상태 반영 ─────────────────
  const handleAddLink = useCallback(async (draft: Omit<Link, "id">) => {
    if (!user) return;
    const saved = await addLink(user.uid, draft);
    setLinks((prev) => [saved, ...prev]);
  }, [user]);

  // ── 링크 수정: Firestore 업데이트 후 로컬 상태 반영 ───────────────
  const handleUpdateLink = useCallback(async (id: string, updates: Partial<Omit<Link, "id">>) => {
    if (!user) return;
    const updatedAt = await updateLink(user.uid, id, updates);
    setLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, ...updates, updatedAt } : link))
    );
  }, [user]);

  // ── 링크 삭제: Firestore 삭제 후 로컬 상태 반영 ─────────────────
  const handleDeleteLink = useCallback(async (id: string) => {
    if (!user) return;
    await deleteLink(user.uid, id);
    setLinks((prev) => prev.filter((link) => link.id !== id));
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <main className="profile-bg relative flex min-h-svh flex-col items-center justify-start overflow-hidden px-4 py-16">
      {/* 배경 글로우 오브 */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* 글로벌 헤더 (로그인/로그아웃) */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 max-w-lg mx-auto">
        <div className="text-2xl font-black tracking-tight text-stone-700 drop-shadow-sm flex items-center gap-1.5">
          <span className="text-3xl hover:rotate-12 transition-transform cursor-pointer">🔗</span> MyLink
        </div>
        {!authLoading && user && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-stone-800 bg-white/50 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm border border-white/40 hidden sm:block">
              {user.displayName}
            </span>
            <button 
              onClick={() => signOut(auth)} 
              className="text-sm px-4 py-1.5 bg-white/80 hover:bg-white text-stone-800 rounded-full font-semibold transition-all shadow-sm border border-stone-200 hover:shadow-md active:scale-95"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>

      {authLoading ? (
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center min-h-[70vh] text-stone-500">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>인증 정보를 확인하는 중...</p>
        </div>
      ) : !user ? (
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="mb-8 w-20 h-20 bg-white/40 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-xl border border-white/50 animate-bounce" style={{animationDuration: "3s"}}>
            <span className="text-4xl">🔗</span>
          </div>
          <h1 className="text-4xl font-black text-stone-800 mb-4 tracking-tight">마이링크 시작하기</h1>
          <p className="text-stone-600 mb-10 leading-relaxed font-medium">
            나만의 멋진 프로필 링크를 만들어보세요.<br/>
            로그인 이후에 모든 기능을 사용할 수 있습니다.
          </p>
          <button 
            onClick={handleGoogleLogin}
            className="flex items-center gap-3 bg-white hover:bg-stone-50 text-stone-800 px-6 py-4 rounded-2xl font-bold shadow-lg transition-all border border-stone-100 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 w-full justify-center text-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
              <path fill="#FBBC05" d="M5.84 15.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V8.06H2.18C1.43 9.55 1 11.22 1 13s.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 4.8c1.61 0 3.06.56 4.2 1.64l3.15-3.15C17.45 1.46 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            Google 계정으로 계속하기
          </button>
        </div>
      ) : (
        /* 콘텐츠 래퍼 */
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center">

          {/* ── 프로필 헤더 (인라인 편집 지원) ── */}
          <ProfileHeader user={user} profile={profile} onProfileUpdate={setProfile} />

          {/* 구분선 */}
          <div className="divider-gradient mb-6 w-full" aria-hidden="true" />

          {/* ── 링크 추가 버튼 ── */}
          <div className="mb-6 w-full">
            <AddLinkDialog onAdd={handleAddLink} />
          </div>

          {/* ── 링크 목록 ── */}
          {isLoading ? (
            /* 초기 로딩 스피너 */
            <div className="flex items-center gap-2 py-10 text-stone-400" aria-live="polite">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              <span className="text-sm">링크를 불러오는 중...</span>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-3">
              <ul className="flex w-full flex-col gap-3" aria-label="링크 목록">
              {links.length > 0 ? (
                links.map((link, index) => (
                  <LinkItem
                    key={link.id}
                    link={link}
                    index={index}
                    onUpdate={handleUpdateLink}
                    onDelete={handleDeleteLink}
                  />
                ))
              ) : (
                <div className="py-12 text-center flex flex-col items-center bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-white shadow-sm mt-2">
                  <div className="w-14 h-14 bg-white/60 rounded-full flex items-center justify-center mb-4 shadow-sm border border-white/50 text-indigo-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <p className="text-stone-600 font-semibold mb-1">아직 추가된 링크가 없습니다</p>
                  <p className="text-stone-500 text-sm">새 링크를 추가하여 프로필을 채워보세요!</p>
                </div>
              )}
              </ul>
            </div>
          )}

          {/* ── 푸터 ── */}
          <footer className="mt-12">
            <div className="footer-badge px-4 py-2 text-xs text-stone-400">
              Powered by{" "}
              <span className="gradient-text font-semibold">MyLink</span>
            </div>
          </footer>
        </div>
      )}
    </main>
  );
}
