export interface Link {
  id: string;
  title: string;
  url: string;
  clickCount?: number; // 향후 클릭 조회수 기능을 위한 필드 (PRD 3. 향후 추가 예정 기능)
  updatedAt?: number; // 수정된 시각 (밀리초)
}

/**
 * URL에서 도메인을 추출하여 Google Favicon API URL을 반환합니다.
 * PRD: "구글 파비콘 API를 사용하여 사용자가 등록한 URL 도메인의 파비콘을 자동 표시"
 */
export function getFaviconUrl(url: string, size: number = 64): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  } catch {
    return "";
  }
}

export const links: Link[] = [
  {
    id: "1",
    title: "인스타그램",
    url: "https://www.instagram.com/yourhandle",
    clickCount: 0,
  },
  {
    id: "2",
    title: "유튜브",
    url: "https://www.youtube.com/@yourchannel",
    clickCount: 0,
  },
  {
    id: "3",
    title: "블로그",
    url: "https://velog.io/@yourblog",
    clickCount: 0,
  },
  {
    id: "4",
    title: "GitHub",
    url: "https://github.com/yourusername",
    clickCount: 0,
  },
  {
    id: "5",
    title: "포트폴리오",
    url: "https://yourportfolio.com",
    clickCount: 0,
  },
];
