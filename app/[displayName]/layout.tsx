import type { Metadata } from "next";
import { getProfileBySlugServer } from "@/lib/firestore-server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ displayName: string }>;
}): Promise<Metadata> {
  const { displayName } = await params;
  const profile = await getProfileBySlugServer(displayName);

  if (!profile) {
    return {
      title: "프로필을 찾을 수 없습니다",
      description: "요청하신 프로필 페이지를 찾을 수 없습니다.",
    };
  }

  const title = `${profile.username} (@${profile.slug})`;
  const description =
    profile.bio || `${profile.username}님의 MyLink 프로필 페이지`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `/${profile.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function DisplayNameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
