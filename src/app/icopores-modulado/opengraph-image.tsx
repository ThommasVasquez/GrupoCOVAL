import { ImageResponse } from "next/og";

export const alt =
  "Icopores Modulado — Casetón Modulado, Casetón Perdido, Muro Panel y Juntas de Dilatación en EPS";
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
          borderTop: "12px solid #d1ac69",
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
            <span style={{ fontSize: "30px", fontWeight: 800, color: "#8a631b" }}>
              IMT · ICOPORES MODULADOR TEQUENDAMA
            </span>
            <span style={{ fontSize: "15px", color: "#52525b" }}>
              KILÓMETRO 14 VÍA BOGOTÁ–GIRARDOT · +10 AÑOS EN CONSTRUCCIÓN
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
              fontSize: "50px",
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: "980px",
            }}
          >
            Soluciones en Icopor (EPS) para Proyectos Inmobiliarios
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#52525b",
              maxWidth: "920px",
              lineHeight: 1.4,
            }}
          >
            Casetón Modulado · Casetón Perdido · Muro Panel · Juntas de Dilatación
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
            <span style={{ fontSize: "28px", fontWeight: 800 }}>+10 años</span>
            <span style={{ fontSize: "15px", color: "#52525b" }}>
              Trayectoria en obra civil
            </span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "28px", fontWeight: 800 }}>98% aire</span>
            <span style={{ fontSize: "15px", color: "#52525b" }}>
              Poliestireno expandido EPS
            </span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "28px", fontWeight: 800 }}>100% EPS</span>
            <span style={{ fontSize: "15px", color: "#52525b" }}>
              Monomaterial reciclable
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
