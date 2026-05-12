"use client";

import { useState } from "react";
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
import { Plus } from "lucide-react";

interface AddLinkDialogProps {
  onAdd: (link: Link) => void;
}

export function AddLinkDialog({ onAdd }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  function isValidUrl(value: string) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("링크 이름을 입력해주세요.");
      return;
    }

    const rawUrl = url.trim();
    // http/https 없으면 자동 추가
    const finalUrl =
      rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
        ? rawUrl
        : `https://${rawUrl}`;

    if (!isValidUrl(finalUrl)) {
      setError("올바른 URL을 입력해주세요. (예: https://example.com)");
      return;
    }

    const newLink: Link = {
      id: crypto.randomUUID(),
      title: title.trim(),
      url: finalUrl,
      clickCount: 0,
    };

    onAdd(newLink);
    setTitle("");
    setUrl("");
    setOpen(false);
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setTitle("");
      setUrl("");
      setError(null);
    }
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          id="add-link-btn"
          className="add-link-btn group mt-2 w-full gap-2 rounded-2xl border border-purple-500/30 bg-purple-500/10 py-5 text-sm font-semibold text-purple-300 transition-all hover:border-purple-400/60 hover:bg-purple-500/20 hover:text-white"
          variant="ghost"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          링크 추가하기
        </Button>
      </DialogTrigger>

      <DialogContent
        id="add-link-dialog"
        className="add-link-dialog mx-auto max-w-sm rounded-2xl border border-white/10 bg-[#13131f] text-white shadow-2xl"
      >
        <DialogHeader>
          <DialogTitle className="gradient-text text-lg font-bold">
            새 링크 추가
          </DialogTitle>
          <DialogDescription className="text-white/40">
            프로필에 표시할 링크를 입력하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-1 flex flex-col gap-5">
          {/* 링크 이름 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="link-title" className="text-sm text-white/70">
              링크 이름
            </Label>
            <Input
              id="link-title"
              placeholder="예: 인스타그램"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="dialog-input rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-purple-500/60 focus-visible:ring-0"
              autoFocus
            />
          </div>

          {/* URL */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="link-url" className="text-sm text-white/70">
              URL
            </Label>
            <Input
              id="link-url"
              placeholder="예: https://instagram.com/yourhandle"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="dialog-input rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-purple-500/60 focus-visible:ring-0"
              type="url"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="text-xs font-medium text-red-400" role="alert">
              {error}
            </p>
          )}

          <DialogFooter className="mt-1 flex gap-2">
            <Button
              id="cancel-link-btn"
              type="button"
              variant="ghost"
              className="flex-1 rounded-xl border border-white/10 text-white/50 hover:bg-white/5 hover:text-white/80"
              onClick={() => handleOpenChange(false)}
            >
              취소
            </Button>
            <Button
              id="submit-link-btn"
              type="submit"
              className="flex-1 rounded-xl bg-purple-600 font-semibold text-white hover:bg-purple-500"
            >
              추가
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
