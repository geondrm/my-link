"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Link, getFaviconUrl } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import { Edit2, Trash2, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TITLE_MAX_LENGTH = 50;

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function validateUrl(raw: string): string | undefined {
  if (!raw.trim()) return "URL을 입력해주세요.";

  const normalized = normalizeUrl(raw);

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return "올바른 URL 형식이 아닙니다. (예: https://example.com)";
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return "http 또는 https URL만 허용됩니다.";
  }

  const hostname = parsed.hostname;
  if (!hostname.includes(".") || hostname.startsWith(".") || hostname.endsWith(".")) {
    return "올바른 도메인을 포함한 URL을 입력해주세요. (예: https://example.com)";
  }

  return undefined;
}

function validateTitle(value: string): string | undefined {
  if (!value.trim()) return "링크 이름을 입력해주세요.";
  if (value.trim().length > TITLE_MAX_LENGTH)
    return `링크 이름은 ${TITLE_MAX_LENGTH}자 이하로 입력해주세요.`;
  return undefined;
}

interface LinkItemProps {
  link: Link;
  index: number;
  onUpdate?: (id: string, updates: Partial<Omit<Link, "id">>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  isPublic?: boolean;
}

export function LinkItem({ link, index, onUpdate, onDelete, isPublic }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Edit state
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [touched, setTouched] = useState<{ title?: boolean; url?: boolean }>({});

  const titleError = touched.title ? validateTitle(title) : undefined;
  const urlError = touched.url ? validateUrl(url) : undefined;
  const isFormValid =
    !validateTitle(title) && !validateUrl(url) && title.trim() !== "" && url.trim() !== "";

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= TITLE_MAX_LENGTH + 1) {
      setTitle(e.target.value);
    }
  }, []);

  const handleTitleBlur = useCallback(() => {
    setTouched((prev) => ({ ...prev, title: true }));
  }, []);

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }, []);

  const handleUrlBlur = useCallback(() => {
    setTouched((prev) => ({ ...prev, url: true }));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ title: true, url: true });
    
    if (validateTitle(title) || validateUrl(url)) return;

    try {
      setIsSaving(true);
      if (onUpdate) {
        await onUpdate(link.id, {
          title: title.trim(),
          url: normalizeUrl(url),
        });
      }
      setIsEditing(false);
    } catch (err) {
      console.error("링크 수정 실패:", err);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    try {
      setIsDeleteLoading(true);
      if (onDelete) {
        await onDelete(link.id);
      }
      setIsDeleting(false);
    } catch (err) {
      console.error("링크 삭제 실패:", err);
    } finally {
      setIsDeleteLoading(false);
    }
  }

  function handleCancelEdit() {
    setTitle(link.title);
    setUrl(link.url);
    setTouched({});
    setIsEditing(false);
  }

  function FieldFeedback({
    error,
    isTouched,
    value,
  }: {
    error?: string;
    isTouched?: boolean;
    value: string;
  }) {
    if (!isTouched) return null;

    if (error) {
      return (
        <p className="flex items-center gap-1 text-xs text-red-400 mt-1" role="alert">
          <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      );
    }

    return null;
  }

  function inputClass(field: "title" | "url") {
    const isTouched = touched[field];
    const hasError = field === "title" ? !!titleError : !!urlError;
    const value = field === "title" ? title : url;

    const base =
      "dialog-input rounded-xl bg-white/5 text-white placeholder:text-white/20 transition-all duration-150 focus-visible:ring-0";

    if (!isTouched) return `${base} border-white/10 focus-visible:border-purple-500/60`;
    if (hasError) return `${base} border-red-500/60 focus-visible:border-red-500/80`;
    if (value.trim()) return `${base} border-emerald-500/50 focus-visible:border-emerald-400/70`;
    return `${base} border-white/10 focus-visible:border-purple-500/60`;
  }

  // 1) 인라인 편집 모드
  if (isEditing) {
    return (
      <li style={{ animationDelay: `${index * 80}ms` }}>
        <Card className="link-card rounded-[28px] border-4 border-pink-100 bg-white shadow-lg overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-stone-700">링크 수정</h3>
              <button 
                onClick={handleCancelEdit}
                className="text-stone-400 hover:text-stone-600 transition-colors bg-stone-100 rounded-full p-1"
                aria-label="취소"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSave} noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`edit-title-${link.id}`} className="text-xs font-bold text-stone-500">
                    링크 이름
                  </Label>
                  <span className={`text-[10px] tabular-nums transition-colors font-semibold ${
                    title.length > TITLE_MAX_LENGTH ? "text-red-400" : "text-stone-400"
                  }`}>
                    {title.length} / {TITLE_MAX_LENGTH}
                  </span>
                </div>
                <Input
                  id={`edit-title-${link.id}`}
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  className={inputClass("title")}
                  maxLength={TITLE_MAX_LENGTH + 1}
                  disabled={isSaving}
                  autoFocus
                />
                <FieldFeedback error={titleError} isTouched={touched.title} value={title} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`edit-url-${link.id}`} className="text-xs font-bold text-stone-500">
                  URL
                </Label>
                <Input
                  id={`edit-url-${link.id}`}
                  value={url}
                  onChange={handleUrlChange}
                  onBlur={handleUrlBlur}
                  className={inputClass("url")}
                  inputMode="url"
                  disabled={isSaving}
                />
                <FieldFeedback error={urlError} isTouched={touched.url} value={url} />
              </div>

              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex-1 rounded-2xl border-2 border-stone-200 text-stone-600 hover:bg-stone-100 font-bold"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={(touched.title && touched.url && !isFormValid) || isSaving}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 font-bold text-white hover:opacity-90 disabled:opacity-50 border-0"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "저장"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </li>
    );
  }

  // 2) 일반 모드
  return (
    <li style={{ animationDelay: `${index * 80}ms` }}>
      <div className="group relative block">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-[28px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300/50"
          aria-label={`${link.title} 링크 열기`}
        >
          <Card className="link-card border-0 shadow-none transition-all duration-300">
            <CardContent className="flex items-center gap-4 px-5 py-4 pr-20">
              <div className="favicon-wrap relative h-10 w-10 flex-shrink-0 overflow-hidden">
                <Image
                  src={getFaviconUrl(link.url, 64)}
                  alt={`${link.title} 아이콘`}
                  fill
                  className="object-contain p-1.5"
                  unoptimized
                />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <span className="text-base font-black text-stone-700 group-hover:text-stone-900 transition-colors">
                  {link.title}
                </span>
                {link.updatedAt && (
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    수정됨: {new Date(link.updatedAt).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </a>

        {/* 액션 버튼들 (항상 표시되도록 right-4에 고정, isPublic 아닐 때만) */}
        {!isPublic && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsEditing(true);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white border-2 border-stone-100 text-stone-400 shadow-sm transition-transform hover:scale-110 hover:border-pink-200 hover:text-pink-500 hover:bg-pink-50"
              aria-label="수정"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsDeleting(true);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white border-2 border-stone-100 text-stone-400 shadow-sm transition-transform hover:scale-110 hover:border-red-200 hover:text-red-500 hover:bg-red-50"
              aria-label="삭제"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="mx-auto max-w-sm rounded-[32px] border-4 border-white bg-white p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-stone-800">
              정말 삭제하시겠습니까?
            </DialogTitle>
            <DialogDescription className="mt-3 text-sm text-stone-600">
              <span className="font-bold text-stone-900 bg-stone-100 px-3 py-1.5 rounded-xl inline-block mb-2">
                {link.title}
              </span>
              <br />
              <span className="font-medium text-red-500 mt-1 inline-block">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleting(false)}
              disabled={isDeleteLoading}
              className="flex-1 rounded-2xl border-2 border-stone-200 text-stone-600 hover:bg-stone-100 font-bold h-11"
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleteLoading}
              className="flex-1 rounded-2xl font-bold h-11 bg-red-500 hover:bg-red-600 text-white border-0"
            >
              {isDeleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "삭제하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
}
