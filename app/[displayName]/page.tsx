"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getUserProfileBySlug, UserProfile } from "@/lib/firestore-profile";
import { fetchLinks } from "@/lib/firestore-links";
import { Link } from "@/data/links";
import { LinkItem } from "@/components/link-item";
import { Loader2 } from "lucide-react";

export default function PublicProfilePage({ params }: { params: { displayName: string } }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const fetchedProfile = await getUserProfileBySlug(params.displayName);
        if (!fetchedProfile) {
          setIsNotFound(true);
          return;
        }

        setProfile(fetchedProfile);
        const fetchedLinks = await fetchLinks(fetchedProfile.uid);
        setLinks(fetchedLinks);
      } catch (error) {
        console.error("데이터 로딩 중 오류:", error);
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [params.displayName]);

  if (isNotFound) {
    notFound();
  }

  if (isLoading) {
    return (
      <main className="profile-bg relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
      </main>
    );
  }

  if (!profile) return null;

  return (
    <main className="profile-bg relative flex min-h-svh flex-col items-center justify-start overflow-hidden px-4 py-16">
      {/* 배경 글로우 오브 */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        {/* 프로필 헤더 (읽기 전용) */}
        <header className="mb-10 flex flex-col items-center gap-3 text-center w-full relative">
          <div className="relative mb-1">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300 via-orange-200 to-blue-200 blur-md opacity-70 scale-110" aria-hidden="true" />
            <div className="relative h-24 w-24 rounded-full border-4 border-white bg-white/80 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-lg">
              <Image
                src="/avatar.jpg"
                alt={`${profile.username} 프로필 사진`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 relative w-full h-10">
            <h1 className="text-2xl font-black tracking-tight text-stone-800">
              {profile.username || "사용자"}
            </h1>
          </div>

          <p className="text-sm text-stone-500 font-bold tracking-wide -mt-1">
            @{profile.slug}
          </p>

          <p className="text-sm text-stone-500 leading-relaxed font-medium">
            {profile.bio || "마이링크에 오신 것을 환영합니다!"}
          </p>
        </header>

        {/* 구분선 */}
        <div className="divider-gradient mb-6 w-full" aria-hidden="true" />

        {/* 링크 목록 */}
        <div className="flex w-full flex-col gap-3">
          <ul className="flex w-full flex-col gap-3" aria-label="링크 목록">
            {links.length > 0 ? (
              links.map((link, index) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  index={index}
                  isPublic={true}
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
              </div>
            )}
          </ul>
        </div>

        {/* 푸터 */}
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
