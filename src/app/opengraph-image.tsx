import { ImageResponse } from "next/og";

export const alt =
  "Coval Concretos — Concreto Premezclado, Bombeo Estacionario y Autobomba | Grupo Coval";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          color: "#000000",
          padding: "54px 64px",
          fontFamily: "sans-serif",
          borderTop: "12px solid #f06399",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "2px solid #000000",
            paddingBottom: "22px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "30px", fontWeight: 800, color: "#f06399" }}>
              COVAL CONCRETOS
            </span>
            <span style={{ fontSize: "15px", color: "#52525b" }}>
              GRUPO COVAL · KILÓMETRO 5 VÍA BOGOTÁ–GIRARDOT
            </span>
          </div>

          <div
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
              padding: "10px 18px",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            +57 316 2948000
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: "980px",
            }}
          >
            Concreto Premezclado, Maquinaria en Alquiler y Casetones EPS para Obra
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#52525b",
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            Tres empresas integradas sobre el corredor Bogotá–Girardot: planta
            automatizada Km 5, +20 años en maquinaria y planta EPS Km 14.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            borderTop: "2px solid #000000",
            paddingTop: "20px",
            gap: "24px",
          }}
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "14px", color: "#f06399", fontWeight: 700 }}>
              01 // COVAL CONCRETOS
            </span>
            <span style={{ fontSize: "18px", fontWeight: 700 }}>
              45 m³/h · 7 Mixers · Bombeo
            </span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "14px", color: "#f06399", fontWeight: 700 }}>
              02 // VT INGEQUIPOS
            </span>
            <span style={{ fontSize: "18px", fontWeight: 700 }}>
              +20 años · Steel-Ply &amp; Maquinaria
            </span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "14px", color: "#f06399", fontWeight: 700 }}>
              03 // ICOPORES MODULADO
            </span>
            <span style={{ fontSize: "18px", fontWeight: 700 }}>
              +10 años · Casetón y Muro Panel EPS
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
