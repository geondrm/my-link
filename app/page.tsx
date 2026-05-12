"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link, getFaviconUrl } from "@/data/links";
import { fetchLinks, addLink } from "@/lib/firestore-links";
import { Card, CardContent } from "@/components/ui/card";
import { AddLinkDialog } from "@/components/add-link-dialog";
import { ExternalLink, Loader2 } from "lucide-react";

export default function Page() {
  const [links, setLinks] = useState<Link[]>([]);
  /** Firestore에서 초기 링크를 불러오는 중인지 여부 */
  const [isLoading, setIsLoading] = useState(true);
  /** 새 링크를 Firestore에 저장하는 중인지 여부 */
  const [isAdding, setIsAdding] = useState(false);

  // ── 마운트 시 Firestore에서 링크 목록 로드 ──────────────────────
  useEffect(() => {
    fetchLinks()
      .then((fetched) => setLinks(fetched))
      .catch((err) => console.error("링크 불러오기 실패:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // ── 링크 추가: Firestore 저장 후 로컬 상태 반영 ─────────────────
  const handleAddLink = useCallback(async (draft: Omit<Link, "id">) => {
    setIsAdding(true);
    try {
      const saved = await addLink(draft);
      // 최신순(desc) 정렬과 일관성을 유지하기 위해 새 링크를 맨 앞에 추가
      setLinks((prev) => [saved, ...prev]);
    } finally {
      setIsAdding(false);
    }
  }, []);

  return (
    <main className="profile-bg relative flex min-h-svh flex-col items-center justify-start overflow-hidden px-4 py-16">
      {/* 배경 글로우 오브 */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* 콘텐츠 래퍼 */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">

        {/* ── 프로필 헤더 ── */}
        <header className="mb-10 flex flex-col items-center gap-3 text-center">

          {/* 원형 아바타 */}
          <div className="relative mb-1">
            {/* 바깥 글로우 링 */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 via-pink-400 to-indigo-400 blur-md opacity-50 scale-110" aria-hidden="true" />
            <div className="relative h-24 w-24 rounded-full border-2 border-violet-200 bg-white/80 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-xl">
              {/* 프로필 사진 — public/avatar.jpg 파일을 넣으면 자동으로 표시됩니다 */}
              <Image
                src="/avatar.jpg"
                alt="Geonhak Lee 프로필 사진"
                fill
                className="object-cover"
                onError={(e) => {
                  /* 이미지 로드 실패 시 이니셜 폴백 표시 */
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = "flex";
                }}
                unoptimized
              />
              {/* 이니셜 폴백 — 이미지가 없을 때 표시 */}
              <span
                className="text-2xl font-bold tracking-tight text-indigo-600 select-none absolute inset-0 items-center justify-center hidden"
                aria-hidden="true"
              >
                GL
              </span>
            </div>
          </div>

          {/* 이름 */}
          <h1 className="text-2xl font-bold tracking-tight text-stone-800">
            Geonhak Lee
          </h1>

          {/* 핸들 */}
          <p className="text-sm text-amber-700/80 font-semibold tracking-wide">
            @geondrm
          </p>

          {/* 소개 */}
          <p className="text-sm text-stone-400 leading-relaxed">
            Hanyang University&nbsp;·&nbsp;Information Systems
          </p>
        </header>

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
            {/* 추가 중 인디케이터 */}
            {isAdding && (
              <div
                className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-amber-700"
                role="status"
                aria-live="polite"
              >
                <Loader2 className="h-3.5 w-3.5 animate-spin flex-shrink-0" aria-hidden="true" />
                <span className="text-xs font-medium">링크를 저장하는 중...</span>
              </div>
            )}
            <ul className="flex w-full flex-col gap-3" aria-label="링크 목록">
            {links.map((link, index) => (
              <li
                key={link.id}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/70"
                  aria-label={`${link.title} 링크 열기`}
                >
                  {/* shadcn Card + 커스텀 글래스모피즘 오버라이드 */}
                  <Card className="link-card group rounded-2xl border-0 bg-transparent shadow-none">
                    <CardContent className="flex items-center gap-4 px-5 py-4">
                      {/* Favicon */}
                      <div className="favicon-wrap relative h-10 w-10 flex-shrink-0 overflow-hidden">
                        <Image
                          src={getFaviconUrl(link.url, 64)}
                          alt={`${link.title} 아이콘`}
                          fill
                          className="object-contain p-1.5"
                          unoptimized
                        />
                      </div>

                      {/* 링크 제목 */}
                      <span className="flex-1 text-sm font-semibold text-stone-700 group-hover:text-stone-900 transition-colors">
                        {link.title}
                      </span>

                      {/* 외부 링크 아이콘 */}
                      <ExternalLink
                        className="h-4 w-4 flex-shrink-0 text-stone-300 transition-colors group-hover:text-amber-600"
                        aria-hidden="true"
                      />
                    </CardContent>
                  </Card>
                </a>
              </li>
            ))}
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
    </main>
  );
}
