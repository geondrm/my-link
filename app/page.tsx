import Image from "next/image";
import { links, getFaviconUrl } from "@/data/links";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-start bg-background px-4 py-12">
      {/* 프로필 헤더 */}
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold shadow-md">
          ML
        </div>
        <h1 className="text-xl font-semibold tracking-tight">My Links</h1>
        <p className="text-sm text-muted-foreground">나의 모든 링크를 한 곳에</p>
      </div>

      {/* 링크 카드 목록 */}
      <ul className="flex w-full max-w-md flex-col gap-3">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            >
              <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm">
                <CardContent className="flex items-center gap-4 px-5 py-4">
                  {/* Favicon */}
                  <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={getFaviconUrl(link.url, 64)}
                      alt={`${link.title} 아이콘`}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>

                  {/* 링크 제목 */}
                  <span className="flex-1 font-medium text-foreground">
                    {link.title}
                  </span>

                  {/* 외부 링크 아이콘 */}
                  <ExternalLink
                    className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                    aria-hidden="true"
                  />
                </CardContent>
              </Card>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

