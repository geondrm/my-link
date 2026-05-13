import { ImageResponse } from "next/og";
import { getProfileBySlugServer, getLinksServer } from "@/lib/firestore-server";

export const runtime = "edge";

export const alt = "MyLink 프로필";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ displayName: string }>;
}) {
  const { displayName } = await params;
  const profile = await getProfileBySlugServer(displayName);

  // 프로필이 없으면 기본 이미지 반환
  if (!profile) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#faf7f5",
            fontSize: "40px",
            fontWeight: 900,
            color: "#292524",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "48px" }}>🔗</span>
            <span>MyLink</span>
          </div>
        </div>
      ),
      { ...size },
    );
  }

  // 사용자의 링크 목록 가져오기 (최대 4개만 표시)
  const links = await getLinksServer(profile.uid);
  const displayLinks = links.slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#faf7f5",
        }}
      >
        {/* ── 배경 오브 (파스텔 그라디언트) ── */}
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255, 183, 178, 0.45)",
            filter: "blur(90px)",
            top: "-80px",
            left: "-60px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "rgba(200, 231, 255, 0.45)",
            filter: "blur(90px)",
            bottom: "-60px",
            right: "-40px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "rgba(226, 240, 203, 0.45)",
            filter: "blur(80px)",
            top: "50%",
            left: "45%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(192, 132, 252, 0.15)",
            filter: "blur(70px)",
            bottom: "20%",
            left: "10%",
          }}
        />

        {/* ── 왼쪽: 프로필 영역 ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "480px",
            padding: "48px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* 아바타 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #ffd6e0, #c8e7ff, #e2f0cb)",
              padding: "5px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "52px",
                overflow: "hidden",
              }}
            >
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  width="110"
                  height="110"
                  style={{
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                "🐶"
              )}
            </div>
          </div>

          {/* 이름 */}
          <span
            style={{
              fontSize: "36px",
              fontWeight: 900,
              color: "#292524",
              letterSpacing: "-0.02em",
              marginBottom: "4px",
            }}
          >
            {profile.username}
          </span>

          {/* 슬러그 */}
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#a8a29e",
              marginBottom: "12px",
            }}
          >
            @{profile.slug}
          </span>

          {/* 바이오 */}
          {profile.bio && (
            <span
              style={{
                fontSize: "16px",
                color: "#78716c",
                fontWeight: 500,
                textAlign: "center",
                maxWidth: "340px",
                lineHeight: 1.5,
                display: "-webkit-box",
                overflow: "hidden",
              }}
            >
              {profile.bio.length > 60
                ? profile.bio.slice(0, 60) + "..."
                : profile.bio}
            </span>
          )}
        </div>

        {/* ── 중앙 구분선 ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: "3px",
              height: "280px",
              borderRadius: "3px",
              background:
                "linear-gradient(180deg, transparent, #ffd6e0, #c8e7ff, transparent)",
            }}
          />
        </div>

        {/* ── 오른쪽: 링크 목록 ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "48px 48px 48px 40px",
            gap: "14px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* 섹션 라벨 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "20px" }}>🔗</span>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#a8a29e",
                letterSpacing: "0.04em",
                textTransform: "uppercase" as const,
              }}
            >
              Links
            </span>
            {links.length > 4 && (
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#ff758c",
                  marginLeft: "8px",
                }}
              >
                +{links.length - 4} more
              </span>
            )}
          </div>

          {/* 링크 카드들 */}
          {displayLinks.length > 0 ? (
            displayLinks.map((link, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "2px solid rgba(255, 214, 224, 0.5)",
                  borderRadius: "20px",
                  padding: "16px 22px",
                  boxShadow: "0 4px 16px rgba(180, 170, 180, 0.1)",
                }}
              >
                {/* 파비콘 */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: "#f4f0ec",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${(() => { try { return new URL(link.url).hostname; } catch { return "example.com"; } })()}&sz=32`}
                    width="24"
                    height="24"
                    style={{ borderRadius: "4px" }}
                  />
                </div>
                {/* 링크 텍스트 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#292524",
                    }}
                  >
                    {link.title.length > 28
                      ? link.title.slice(0, 28) + "..."
                      : link.title}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#a8a29e",
                      fontWeight: 500,
                    }}
                  >
                    {(() => {
                      try {
                        return new URL(link.url).hostname;
                      } catch {
                        return link.url;
                      }
                    })()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
                color: "#a8a29e",
                fontSize: "18px",
                fontWeight: 500,
              }}
            >
              아직 등록된 링크가 없습니다
            </div>
          )}
        </div>

        {/* ── 하단 브랜딩 ── */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            right: "32px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255, 255, 255, 0.6)",
            border: "1.5px solid rgba(255, 214, 224, 0.4)",
            borderRadius: "9999px",
            padding: "8px 16px",
          }}
        >
          <span style={{ fontSize: "14px" }}>🔗</span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#78716c",
            }}
          >
            Powered by
          </span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 800,
              background: "linear-gradient(90deg, #ff7eb3, #ff758c)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            MyLink
          </span>
        </div>

        {/* ── 좌하단 링크 수 뱃지 ── */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "32px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255, 255, 255, 0.6)",
            border: "1.5px solid rgba(255, 214, 224, 0.4)",
            borderRadius: "9999px",
            padding: "8px 16px",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#ff758c",
            }}
          >
            {links.length}
          </span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#a8a29e",
            }}
          >
            개의 링크
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
