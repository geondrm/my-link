"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/data/links";
import { Plus, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

/** 링크 이름 최대 글자 수 */
const TITLE_MAX_LENGTH = 50;

interface FieldErrors {
  title?: string;
  url?: string;
}

interface AddLinkDialogProps {
  /** Firestore 저장을 포함한 비동기 추가 핸들러 */
  onAdd: (draft: Omit<Link, "id">) => Promise<void>;
}

/** URL에서 http/https 없는 경우 https를 앞에 붙여 반환 */
function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/** URL 유효성 검사 — 결과를 에러 문자열 또는 undefined로 반환 */
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

  // 도메인에 점(.)이 없으면 유효하지 않은 도메인으로 간주
  const hostname = parsed.hostname;
  if (!hostname.includes(".") || hostname.startsWith(".") || hostname.endsWith(".")) {
    return "올바른 도메인을 포함한 URL을 입력해주세요. (예: https://example.com)";
  }

  return undefined;
}

/** 링크 이름 유효성 검사 */
function validateTitle(value: string): string | undefined {
  if (!value.trim()) return "링크 이름을 입력해주세요.";
  if (value.trim().length > TITLE_MAX_LENGTH)
    return `링크 이름은 ${TITLE_MAX_LENGTH}자 이하로 입력해주세요.`;
  return undefined;
}

export function AddLinkDialog({ onAdd }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false);
  /** Firestore 저장 진행 중 여부 (중복 제출 방지) */
  const [isSaving, setIsSaving] = useState(false);

  // 입력값 상태
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // 필드별 에러 (blur 이후 or 제출 시 표시)
  const [errors, setErrors] = useState<FieldErrors>({});
  // 한 번이라도 blur된 필드 추적 (touched)
  const [touched, setTouched] = useState<{ title?: boolean; url?: boolean }>({});

  // ── 파생 상태 ──────────────────────────────
  const titleError = touched.title ? validateTitle(title) : undefined;
  const urlError = touched.url ? validateUrl(url) : undefined;
  const isFormValid =
    !validateTitle(title) && !validateUrl(url) && title.trim() !== "" && url.trim() !== "";

  // ── 핸들러 ────────────────────────────────
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // 최대 글자 수 초과 입력 차단
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 제출 시 모든 필드를 touched 처리
    setTouched({ title: true, url: true });

    const titleErr = validateTitle(title);
    const urlErr = validateUrl(url);
    setErrors({ title: titleErr, url: urlErr });

    if (titleErr || urlErr) return;

    // Firestore에 저장할 draft (id는 Firestore가 생성)
    const draft: Omit<Link, "id"> = {
      title: title.trim(),
      url: normalizeUrl(url),
      clickCount: 0,
    };

    try {
      setIsSaving(true);
      await onAdd(draft);
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error("링크 저장 실패:", err);
    } finally {
      setIsSaving(false);
    }
  }

  function resetForm() {
    setTitle("");
    setUrl("");
    setErrors({});
    setTouched({});
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm();
    setOpen(next);
  }

  // ── 렌더 헬퍼 ─────────────────────────────

  /** 필드 하단에 표시되는 에러/성공 메시지 */
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
        <p className="flex items-center gap-1 text-xs text-red-400" role="alert">
          <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      );
    }

    return null;
  }

  /** 입력 필드 스타일 — 에러/성공 상태에 따라 테두리 색 변경 */
  function inputClass(field: "title" | "url") {
    const isTouched = touched[field];
    const hasError = field === "title" ? !!titleError : !!urlError;
    const value = field === "title" ? title : url;

    const base =
      "dialog-input focus-visible:ring-0 w-full";

    if (!isTouched) return `${base} border-stone-200`;
    if (hasError) return `${base} border-red-300 focus-visible:border-red-400`;
    if (value.trim()) return `${base} border-green-300 focus-visible:border-green-400`;
    return `${base} border-stone-200`;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          id="add-link-btn"
          type="button"
          className="add-link-btn group relative w-full overflow-hidden rounded-2xl px-6 py-4 font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
          aria-label="새 링크 추가하기"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 45%, #ec4899 100%)",
          }}
        >
          {/* shimmer 레이어 */}
          <span className="add-link-shimmer absolute inset-0 rounded-2xl" aria-hidden="true" />
          {/* 버튼 내용 */}
          <span className="relative flex items-center justify-center gap-2.5 text-base">
            <span className="add-link-icon-wrap flex h-8 w-8 items-center justify-center rounded-full">
              <Plus className="h-5 w-5 text-stone-700 transition-transform duration-300 group-hover:rotate-90" />
            </span>
            <span className="text-stone-800">새 링크 추가하기</span>
          </span>
        </button>
      </DialogTrigger>

      <DialogContent
        id="add-link-dialog"
        className="add-link-dialog mx-auto max-w-sm shadow-2xl"
      >
        <DialogHeader>
          <DialogTitle className="gradient-text text-2xl font-black">새 링크 추가</DialogTitle>
          <DialogDescription className="text-stone-500 font-medium">
            프로필에 표시할 링크를 입력하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="mt-1 flex flex-col gap-5">
          {/* ── 링크 이름 ── */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="link-title" className="text-sm font-bold text-stone-600">
                링크 이름 <span className="text-pink-400" aria-hidden="true">*</span>
              </Label>
              {/* 글자 수 카운터 */}
              <span
                className={`text-xs tabular-nums transition-colors font-bold ${
                  title.length > TITLE_MAX_LENGTH
                    ? "text-red-400"
                    : title.length > TITLE_MAX_LENGTH * 0.8
                    ? "text-orange-400"
                    : "text-stone-400"
                }`}
                aria-live="polite"
                aria-label={`${title.length}자 / 최대 ${TITLE_MAX_LENGTH}자`}
              >
                {title.length} / {TITLE_MAX_LENGTH}
              </span>
            </div>
            <Input
              id="link-title"
              placeholder="예: 인스타그램"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              className={inputClass("title")}
              aria-describedby="link-title-feedback"
              aria-invalid={!!titleError}
              autoFocus
              maxLength={TITLE_MAX_LENGTH + 1}
              disabled={isSaving}
            />
            <div id="link-title-feedback">
              <FieldFeedback error={titleError} isTouched={touched.title} value={title} />
            </div>
          </div>

          {/* ── URL ── */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="link-url" className="text-sm font-bold text-stone-600">
              URL <span className="text-pink-400" aria-hidden="true">*</span>
            </Label>
            <Input
              id="link-url"
              placeholder="예: https://instagram.com/yourhandle"
              value={url}
              onChange={handleUrlChange}
              onBlur={handleUrlBlur}
              className={inputClass("url")}
              aria-describedby="link-url-feedback"
              aria-invalid={!!urlError}
              inputMode="url"
              autoComplete="url"
              disabled={isSaving}
            />
            <div id="link-url-feedback">
              <FieldFeedback error={urlError} isTouched={touched.url} value={url} />
            </div>
            {/* http 없어도 자동 추가 안내 */}
            {!touched.url && (
              <p className="text-[11px] text-stone-400 font-medium">
                https:// 없이 입력해도 자동으로 추가됩니다.
              </p>
            )}
          </div>

          <DialogFooter className="mt-1 flex gap-2">
            <Button
              id="cancel-link-btn"
              type="button"
              variant="ghost"
              className="flex-1 rounded-2xl border-2 border-stone-200 text-stone-600 hover:bg-stone-50 font-bold h-12"
              onClick={() => handleOpenChange(false)}
            >
              취소
            </Button>
            <Button
              id="submit-link-btn"
              type="submit"
              disabled={(touched.title && touched.url && !isFormValid) || isSaving}
              className="flex-1 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 border-0 h-12"
              aria-live="polite"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "추가"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
