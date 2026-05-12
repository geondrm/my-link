"use client";

import { useState } from "react";
import Image from "next/image";
import { links as initialLinks, Link, getFaviconUrl } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import { AddLinkDialog } from "@/components/add-link-dialog";
import { ExternalLink, Link2 } from "lucide-react";

export default function Page() {
  const [links, setLinks] = useState<Link[]>(initialLinks);

  function handleAddLink(newLink: Link) {
    setLinks((prev) => [...prev, newLink]);
  }

  return (
    <main className="profile-bg relative flex min-h-svh flex-col items-center justify-start overflow-hidden px-4 py-16">
      {/* 배경 글로우 오브 */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* 콘텐츠 래퍼 */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">

        {/* ── 프로필 헤더 ── */}
        <header className="mb-10 flex flex-col items-center gap-4 text-center">

          {/* 아바타 */}
          <div className="avatar-ring">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0a0a0f] text-2xl font-bold text-white">
              ML
            </div>
          </div>

          {/* 이름 + shimmer 뱃지 */}
          <div className="flex flex-col items-center gap-2">
            <h1 className="gradient-text text-2xl font-bold tracking-tight">
              My Links
            </h1>
            <span className="shimmer-badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-purple-300">
              <Link2 className="h-3 w-3" />
              @mylinks
            </span>
          </div>

          {/* 소개 */}
          <p className="max-w-[260px] text-sm leading-relaxed text-white/50">
            크리에이터의 모든 링크를 한 곳에 모아보세요 ✨
          </p>
        </header>

        {/* 구분선 */}
        <div className="divider-gradient mb-8 w-full" aria-hidden="true" />

        {/* ── 링크 목록 ── */}
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
                    <span className="flex-1 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                      {link.title}
                    </span>

                    {/* 외부 링크 아이콘 */}
                    <ExternalLink
                      className="h-4 w-4 flex-shrink-0 text-white/30 transition-colors group-hover:text-purple-400"
                      aria-hidden="true"
                    />
                  </CardContent>
                </Card>
              </a>
            </li>
          ))}
        </ul>

        {/* ── 링크 추가 버튼 ── */}
        <div className="mt-4 w-full">
          <AddLinkDialog onAdd={handleAddLink} />
        </div>

        {/* ── 푸터 ── */}
        <footer className="mt-12">
          <div className="footer-badge px-4 py-2 text-xs text-white/30">
            Powered by{" "}
            <span className="gradient-text font-semibold">MyLink</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
