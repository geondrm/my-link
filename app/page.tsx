"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Link } from "@/data/links";
import { fetchLinks, addLink, updateLink, deleteLink } from "@/lib/firestore-links";
import { AddLinkDialog } from "@/components/add-link-dialog";
import { LinkItem } from "@/components/link-item";
import { ProfileHeader } from "@/components/profile-header";
import {
  Loader2,
  User as UserIcon,
  LogOut,
  Link as LinkIcon,
  Sparkles,
  Palette,
  Share2,
  BarChart3,
  MousePointerClick,
  Zap,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { getUserProfile, saveUserProfile, UserProfile } from "@/lib/firestore-profile";
import NextLink from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ── 스크롤 감지 훅 ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── 카운트업 애니메이션 훅 ── */
function useCountUp(target: number, trigger: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [trigger, target, duration]);
  return val;
}

export default function Page() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 스크롤 감지
  const hero = useInView(0.1);
  const features = useInView(0.1);
  const howItWorks = useInView(0.1);
  const stats = useInView(0.15);
  const cta = useInView(0.15);

  // 카운트업 수치
  const userCount = useCountUp(12000, stats.visible);
  const linkCount = useCountUp(58000, stats.visible);
  const clickCount = useCountUp(3200000, stats.visible);

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

  /* ================================================================
     로그인 안 된 상태 → 풀 랜딩 페이지
     ================================================================ */
  if (!authLoading && !user) {
    return (
      <div className="landing-root">
        {/* ── 네비게이션 바 ── */}
        <nav className="landing-nav">
          <div className="landing-nav-inner">
            <div className="landing-logo">
              <span className="landing-logo-icon">🔗</span> MyLink
            </div>
            <button onClick={handleGoogleLogin} className="nav-login-btn" id="nav-login-btn">
              시작하기
            </button>
          </div>
        </nav>

        {/* ── 히어로 섹션 ── */}
        <section className={`landing-hero ${hero.visible ? "in-view" : ""}`} ref={hero.ref} id="hero-section">
          <div className="hero-orb hero-orb-1" aria-hidden="true" />
          <div className="hero-orb hero-orb-2" aria-hidden="true" />
          <div className="hero-orb hero-orb-3" aria-hidden="true" />

          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles className="w-4 h-4" />
              <span>나만의 프로필 링크, 30초면 완성</span>
            </div>

            <h1 className="hero-title">
              모든 링크를<br />
              <span className="hero-title-gradient">하나로 연결하세요</span>
            </h1>

            <p className="hero-subtitle">
              SNS, 포트폴리오, 블로그, 쇼핑몰까지—<br className="hidden-mobile" />
              흩어진 링크를 깔끔한 한 페이지로 정리하세요.
            </p>

            <div className="hero-actions">
              <button onClick={handleGoogleLogin} className="hero-cta-primary" id="hero-cta-primary">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
                  <path fill="#FBBC05" d="M5.84 15.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V8.06H2.18C1.43 9.55 1 11.22 1 13s.43 3.45 1.18 4.94l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 4.8c1.61 0 3.06.56 4.2 1.64l3.15-3.15C17.45 1.46 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google로 무료 시작
              </button>
            </div>

            {/* 미니 모크업 카드 */}
            <div className="hero-mockup">
              <div className="mockup-card">
                <div className="mockup-avatar-wrap">
                  <div className="mockup-avatar">🐶</div>
                </div>
                <div className="mockup-name">홍길동</div>
                <div className="mockup-handle">@gildong</div>
                <div className="mockup-links">
                  <div className="mockup-link"><span>📸</span> Instagram</div>
                  <div className="mockup-link"><span>📝</span> Blog</div>
                  <div className="mockup-link"><span>💼</span> Portfolio</div>
                </div>
              </div>
            </div>

            <button className="hero-scroll-hint" onClick={() => document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" })} aria-label="아래로 스크롤">
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>
        </section>

        {/* ── 기능 소개 섹션 ── */}
        <section className={`landing-section landing-features ${features.visible ? "in-view" : ""}`} ref={features.ref} id="features-section">
          <div className="section-orb section-orb-a" aria-hidden="true" />
          <div className="section-orb section-orb-b" aria-hidden="true" />

          <div className="section-inner">
            <h2 className="section-title">왜 <span className="hero-title-gradient">MyLink</span>인가요?</h2>
            <p className="section-desc">심플하지만 강력한 기능으로, 나만의 링크 허브를 만들어보세요.</p>

            <div className="features-grid">
              {[
                { icon: <Palette className="w-7 h-7" />, title: "귀여운 디자인", desc: "파스텔 톤의 감성적인 프로필 페이지가 자동으로 생성됩니다." },
                { icon: <Share2 className="w-7 h-7" />, title: "한 줄 공유", desc: "mylink.com/@닉네임 하나로 모든 링크를 한 번에 공유하세요." },
                { icon: <MousePointerClick className="w-7 h-7" />, title: "쉬운 편집", desc: "드래그 & 클릭으로 링크를 추가, 수정, 삭제할 수 있습니다." },
                { icon: <BarChart3 className="w-7 h-7" />, title: "실시간 동기화", desc: "Firebase 기반으로 어디서든 실시간으로 반영됩니다." },
                { icon: <Zap className="w-7 h-7" />, title: "빠른 시작", desc: "Google 로그인 한 번이면 30초 만에 페이지가 완성됩니다." },
                { icon: <Sparkles className="w-7 h-7" />, title: "무료 사용", desc: "모든 핵심 기능을 무료로 제한 없이 사용할 수 있습니다." },
              ].map((f, i) => (
                <div className="feature-card" key={i} style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="feature-icon">{f.icon}</div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 사용 방법 섹션 ── */}
        <section className={`landing-section landing-how ${howItWorks.visible ? "in-view" : ""}`} ref={howItWorks.ref} id="how-section">
          <div className="section-orb section-orb-c" aria-hidden="true" />
          <div className="section-orb section-orb-d" aria-hidden="true" />

          <div className="section-inner">
            <h2 className="section-title">3단계로 <span className="hero-title-gradient">시작</span>하세요</h2>
            <p className="section-desc">복잡한 설정 없이, 지금 바로 만들 수 있어요.</p>

            <div className="steps-track">
              {[
                { num: "1", emoji: "🔐", title: "Google 로그인", desc: "구글 계정 하나로 간편하게 가입하세요." },
                { num: "2", emoji: "✏️", title: "프로필 & 링크 추가", desc: "이름, 소개, 그리고 공유할 링크를 입력하세요." },
                { num: "3", emoji: "🚀", title: "공유하기", desc: "나만의 URL을 복사해 어디든 공유하세요!" },
              ].map((s, i) => (
                <div className="step-card" key={i} style={{ transitionDelay: `${i * 120}ms` }}>
                  <div className="step-num">{s.num}</div>
                  <div className="step-emoji">{s.emoji}</div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                  {i < 2 && <ArrowRight className="step-arrow" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 숫자 섹션 ── */}
        <section className={`landing-section landing-stats ${stats.visible ? "in-view" : ""}`} ref={stats.ref} id="stats-section">
          <div className="section-orb section-orb-e" aria-hidden="true" />

          <div className="section-inner">
            <div className="stats-grid">
              {[
                { value: userCount.toLocaleString() + "+", label: "가입 사용자" },
                { value: linkCount.toLocaleString() + "+", label: "등록된 링크" },
                { value: (clickCount / 1000000).toFixed(1) + "M+", label: "총 클릭 수" },
              ].map((s, i) => (
                <div className="stat-item" key={i}>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 최종 CTA ── */}
        <section className={`landing-section landing-cta ${cta.visible ? "in-view" : ""}`} ref={cta.ref} id="cta-section">
          <div className="section-orb section-orb-f" aria-hidden="true" />
          <div className="section-orb section-orb-g" aria-hidden="true" />

          <div className="section-inner">
            <div className="cta-card">
              <h2 className="cta-title">지금 바로<br /><span className="hero-title-gradient">나만의 링크 페이지</span>를 만들어보세요</h2>
              <p className="cta-desc">무료로 시작하고, 30초 안에 완성하세요.</p>
              <button onClick={handleGoogleLogin} className="hero-cta-primary cta-btn" id="cta-login-btn">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
                  <path fill="#FBBC05" d="M5.84 15.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V8.06H2.18C1.43 9.55 1 11.22 1 13s.43 3.45 1.18 4.94l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 4.8c1.61 0 3.06.56 4.2 1.64l3.15-3.15C17.45 1.46 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google로 무료 시작하기
              </button>
            </div>
          </div>
        </section>

        {/* ── 푸터 ── */}
        <footer className="landing-footer">
          <div className="landing-footer-inner">
            <div className="landing-logo" style={{ fontSize: "1.1rem" }}>
              <span className="landing-logo-icon">🔗</span> MyLink
            </div>
            <p className="landing-footer-copy">© 2026 MyLink. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  /* ================================================================
     로그인 상태 / 로딩 → 기존 대시보드 UI
     ================================================================ */
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-medium text-stone-800 bg-white/70 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm border border-white hover:bg-white hover:shadow-md transition-all">
                  <Image
                    src="/avatar.jpg"
                    alt="프로필"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <span className="hidden sm:block font-bold">{user.displayName}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-2xl border-stone-100 shadow-xl bg-white/95 backdrop-blur-md p-2">
                {profile && (
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer hover:bg-pink-50 hover:text-pink-600 focus:bg-pink-50 focus:text-pink-600 transition-colors p-3 font-medium">
                    <NextLink href={`/${profile.slug}`} className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      내 페이지 보기
                    </NextLink>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => signOut(auth)}
                  className="rounded-xl cursor-pointer hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 transition-colors p-3 font-medium text-red-500 mt-1"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {authLoading ? (
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center min-h-[70vh] text-stone-500">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>인증 정보를 확인하는 중...</p>
        </div>
      ) : (
        /* 콘텐츠 래퍼 */
        <div className="relative z-10 flex w-full max-w-sm flex-col items-center">

          {/* ── 프로필 헤더 (인라인 편집 지원) ── */}
          <ProfileHeader user={user!} profile={profile} onProfileUpdate={setProfile} />

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
