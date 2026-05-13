import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "MyLink — 모든 링크를 하나로 연결하세요";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#faf7f5",
        }}
      >
        {/* 배경 그라디언트 오브 */}
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(255, 183, 178, 0.5)",
            filter: "blur(100px)",
            top: "-120px",
            left: "-80px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "rgba(200, 231, 255, 0.5)",
            filter: "blur(100px)",
            bottom: "-100px",
            right: "-60px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "rgba(226, 240, 203, 0.5)",
            filter: "blur(100px)",
            top: "40%",
            right: "15%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(192, 132, 252, 0.2)",
            filter: "blur(80px)",
            bottom: "10%",
            left: "20%",
          }}
        />

        {/* 메인 콘텐츠 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* 로고 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                fontSize: "56px",
                display: "flex",
              }}
            >
              🔗
            </div>
            <span
              style={{
                fontSize: "52px",
                fontWeight: 900,
                color: "#292524",
                letterSpacing: "-0.03em",
              }}
            >
              MyLink
            </span>
          </div>

          {/* 타이틀 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span
              style={{
                fontSize: "48px",
                fontWeight: 900,
                color: "#292524",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              모든 링크를
            </span>
            <span
              style={{
                fontSize: "52px",
                fontWeight: 900,
                background: "linear-gradient(135deg, #ff7eb3, #ff758c, #c084fc)",
                backgroundClip: "text",
                color: "transparent",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              하나로 연결하세요
            </span>
          </div>

          {/* 서브타이틀 */}
          <span
            style={{
              fontSize: "22px",
              color: "#78716c",
              fontWeight: 500,
              maxWidth: "600px",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            SNS, 포트폴리오, 블로그, 쇼핑몰까지 — 흩어진 링크를 깔끔한 한
            페이지로 정리하세요.
          </span>

          {/* 하단 뱃지 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "16px",
              background: "rgba(255, 255, 255, 0.7)",
              border: "2px solid rgba(255, 126, 179, 0.3)",
              borderRadius: "9999px",
              padding: "10px 24px",
            }}
          >
            <span style={{ fontSize: "16px" }}>✨</span>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#ff758c",
              }}
            >
              나만의 프로필 링크, 30초면 완성
            </span>
          </div>
        </div>

        {/* 하단 도메인 표시 */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              color: "#a8a29e",
              fontWeight: 500,
            }}
          >
            mylink.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
