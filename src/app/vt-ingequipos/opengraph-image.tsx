import { ImageResponse } from "next/og";

export const alt =
  "VT Ingequipos S.A.S. — Alquiler, Venta y Mantenimiento de Equipos de Construcción";
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
          borderTop: "12px solid #e30613",
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
            <span style={{ fontSize: "30px", fontWeight: 800, color: "#e30613" }}>
              VT INGEQUIPOS S.A.S.
            </span>
            <span style={{ fontSize: "15px", color: "#52525b" }}>
              MÁS DE 20 AÑOS · BOGOTÁ, SOACHA Y SIBATÉ
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
            Alquiler, Venta y Mantenimiento de Maquinaria y Formaleta para Obra
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#52525b",
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            Encofrados Steel-Ply · Accesorios Torres Grúa · Andamios Colgantes ·
            Bombas Estacionarias · Alquiler de Mixer
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
            <span style={{ fontSize: "26px", fontWeight: 800 }}>+20 años</span>
            <span style={{ fontSize: "15px", color: "#52525b" }}>
              Fundada en Bogotá
            </span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "26px", fontWeight: 800 }}>6 líneas</span>
            <span style={{ fontSize: "15px", color: "#52525b" }}>
              64 referencias en catálogo
            </span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "26px", fontWeight: 800 }}>Steel-Ply</span>
            <span style={{ fontSize: "15px", color: "#52525b" }}>
              Hasta 200 usos en formaleta
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
