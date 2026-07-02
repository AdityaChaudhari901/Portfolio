import { ImageResponse } from "next/og";

// Route segment config
export const alt = "Aditya Chaudhari - Full-Stack Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Generates a real PNG at build time (satori-backed) so X, LinkedIn, and
// Slack all render a proper share preview — SVG og:images are not reliably
// supported by those platforms.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #111827 0%, #0b1120 100%)",
          padding: "80px",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            width: "96px",
            height: "96px",
            borderRadius: "18px",
            background: "#0f1a2e",
            border: "1px solid rgba(255,255,255,0.12)",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "46px",
            fontWeight: 700,
            color: "#fbc451",
            marginBottom: "56px"
          }}
        >
          AC
        </div>
        <div style={{ display: "flex", width: "120px", height: "6px", borderRadius: "3px", background: "#fbc451", marginBottom: "28px" }} />
        <div style={{ fontSize: "86px", fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.02em" }}>
          Aditya Chaudhari
        </div>
        <div style={{ fontSize: "38px", fontWeight: 500, color: "#cbd5e1", marginTop: "16px" }}>
          Full-Stack Software Engineer
        </div>
        <div style={{ fontSize: "27px", color: "#94a3b8", marginTop: "24px" }}>
          AI agents · React Native chat SDKs · RAG systems · production web apps
        </div>
      </div>
    ),
    { ...size }
  );
}
