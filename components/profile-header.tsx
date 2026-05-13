"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { UserProfile, isSlugAvailable, saveUserProfile } from "@/lib/firestore-profile";
import { User } from "firebase/auth";
import { Edit3, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  user: User;
  profile: UserProfile | null;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const RESERVED_SLUGS = ["login", "admin", "api", "dashboard"];

export function ProfileHeader({ user, profile, onProfileUpdate }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [username, setUsername] = useState("");
  const [slug, setSlug] = useState("");
  const [bio, setBio] = useState("");

  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugError, setSlugError] = useState("");
  const [slugSuccess, setSlugSuccess] = useState("");

  // 편집 모드 시작 시 초기화
  useEffect(() => {
    if (isEditing && profile) {
      setUsername(profile.username);
      setSlug(profile.slug);
      setBio(profile.bio);
      setSlugError("");
      setSlugSuccess("");
    }
  }, [isEditing, profile]);

  // slug 중복 및 예약어 검사
  useEffect(() => {
    if (!isEditing || !profile) return;
    
    if (!slug.trim()) {
      setSlugError("아이디를 입력해주세요.");
      setSlugSuccess("");
      return;
    }

    if (RESERVED_SLUGS.includes(slug)) {
      setSlugError("시스템 예약어는 사용할 수 없습니다.");
      setSlugSuccess("");
      return;
    }

    if (!/^[a-z0-9_-]+$/.test(slug)) {
      setSlugError("영문 소문자, 숫자, 밑줄(_), 하이픈(-)만 가능합니다.");
      setSlugSuccess("");
      return;
    }

    if (slug === profile.slug) {
      setSlugError("");
      setSlugSuccess("현재 사용 중인 아이디입니다.");
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingSlug(true);
      setSlugError("");
      setSlugSuccess("");
      try {
        const available = await isSlugAvailable(slug, profile.uid);
        if (available) {
          setSlugSuccess("사용 가능한 아이디입니다!");
        } else {
          setSlugError("이미 누군가 사용 중인 아이디입니다.");
        }
      } catch (err) {
        setSlugError("중복 확인 중 오류가 발생했습니다.");
      } finally {
        setIsCheckingSlug(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slug, isEditing, profile]);

  const handleSave = async () => {
    if (!profile || slugError || isCheckingSlug || !username.trim()) return;

    try {
      setIsSaving(true);
      const updatedProfile: UserProfile = {
        ...profile,
        username: username.trim(),
        slug: slug.trim(),
        bio: bio.trim(),
      };
      await saveUserProfile(profile.uid, updatedProfile);
      onProfileUpdate(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error("프로필 저장 실패:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <header className="mb-10 flex w-full flex-col items-center gap-4 text-center bg-white p-6 rounded-[32px] border-4 border-pink-100 shadow-xl relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={handleCancel}
          className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 transition-colors bg-stone-100 rounded-full p-1"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-black text-stone-700">프로필 편집</h2>

        <div className="flex flex-col gap-3 w-full text-left mt-2">
          {/* 이름 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-stone-500">이름 (username)</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-2xl border-2 border-stone-200 focus-visible:ring-0 focus-visible:border-pink-300 h-11 font-medium text-stone-700"
              maxLength={20}
              disabled={isSaving}
            />
          </div>

          {/* 닉네임 (displayname) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-stone-500">아이디 (displayname)</label>
            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-bold text-sm">@</span>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                className="rounded-2xl border-2 border-stone-200 focus-visible:ring-0 focus-visible:border-pink-300 h-11 font-medium text-stone-700"
                maxLength={30}
                disabled={isSaving}
              />
            </div>
            <div className="h-4 mt-0.5">
              {isCheckingSlug ? (
                <p className="flex items-center gap-1 text-[11px] text-stone-400 font-bold">
                  <Loader2 className="h-3 w-3 animate-spin" /> 확인 중...
                </p>
              ) : slugError ? (
                <p className="flex items-center gap-1 text-[11px] text-red-400 font-bold">
                  <AlertCircle className="h-3 w-3" /> {slugError}
                </p>
              ) : slugSuccess ? (
                <p className="flex items-center gap-1 text-[11px] text-green-500 font-bold">
                  <CheckCircle2 className="h-3 w-3" /> {slugSuccess}
                </p>
              ) : null}
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-stone-500">한 줄 소개 (Bio)</label>
            <Input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="rounded-2xl border-2 border-stone-200 focus-visible:ring-0 focus-visible:border-pink-300 h-11 font-medium text-stone-700"
              maxLength={60}
              disabled={isSaving}
            />
          </div>

          {/* 저장 버튼 */}
          <Button
            onClick={handleSave}
            disabled={!!slugError || isCheckingSlug || isSaving || !username.trim()}
            className="w-full mt-2 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 border-0 h-12"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "저장하기"}
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className="mb-10 flex flex-col items-center gap-3 text-center w-full relative">
      <div className="relative mb-1 group cursor-pointer" onClick={() => setIsEditing(true)}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300 via-orange-200 to-blue-200 blur-md opacity-70 scale-110 transition-transform group-hover:scale-125" aria-hidden="true" />
        <div className="relative h-24 w-24 rounded-full border-4 border-white bg-white/80 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-lg">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={`${user.displayName} 프로필 사진`}
              fill
              className="object-cover"
              unoptimized
            />
          ) : null}
          <span
            className={`text-2xl font-bold tracking-tight text-indigo-600 select-none absolute inset-0 items-center justify-center ${user.photoURL ? 'hidden' : 'flex'}`}
            aria-hidden="true"
          >
            {user.displayName?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
        {/* 편집 오버레이 아이콘 */}
        <div className="absolute bottom-0 right-0 bg-white border-2 border-pink-100 rounded-full p-1.5 shadow-md text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 translate-y-2">
          <Edit3 className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 relative w-full h-10 group cursor-pointer" onClick={() => setIsEditing(true)}>
        <h1 className="text-2xl font-black tracking-tight text-stone-800 transition-colors group-hover:text-pink-500">
          {profile?.username || user.displayName || "사용자"}
        </h1>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-300 absolute -right-6">
          <Edit3 className="h-4 w-4" />
        </div>
      </div>

      <p className="text-sm text-stone-500 font-bold tracking-wide -mt-1 cursor-pointer hover:text-pink-400 transition-colors" onClick={() => setIsEditing(true)}>
        @{profile?.slug || user.email?.split('@')[0] || "user"}
      </p>

      <p className="text-sm text-stone-500 leading-relaxed font-medium cursor-pointer hover:text-stone-700 transition-colors" onClick={() => setIsEditing(true)}>
        {profile?.bio || "마이링크에 오신 것을 환영합니다!"}
      </p>
    </header>
  );
}
