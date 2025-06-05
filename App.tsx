import React, { useState, useEffect } from "react";

function LineChart({ data }: { data: number[] }) {
  const width = 400;
  const height = 120;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const points = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * width},${height - ((v - min) / (max - min || 1)) * height}`
    )
    .join(" ");
  return (
    <svg width={width} height={height}>
      <polyline
        fill="none"
        stroke="#44fbe6"
        strokeWidth="3"
        points={points}
      />
      <rect width={width} height={height} fill="none" stroke="#555" />
    </svg>
  );
}

function getRandom(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

function App() {
  const [power, setPower] = useState(120 + getRandom(-3, 3));
  const [carbon, setCarbon] = useState(15 + getRandom(-1, 1));
  const [esg, setEsg] = useState(85 + getRandom(-3, 3));
  const [history, setHistory] = useState<number[]>([120]);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const p = 120 + getRandom(-5, 8);
      setPower(p);
      setCarbon(15 + getRandom(-2, 2));
      setEsg(85 + getRandom(-5, 5));
      setHistory((h) => [...h.slice(-29), p]);
      if (p > 130) setAlert("⚠️ 발전량 임계치 초과! 설비 상태 점검 필요!");
      else if (p < 110) setAlert("⚠️ 발전량 급감! 이상상황 감지!");
      else setAlert(null);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // PDF 샘플: 진짜 PDF 바이너리 헤더 포함
  function downloadPDF() {
    const pdfHeader = "%PDF-1.1\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R /Resources << >> >>\nendobj\n4 0 obj\n<< /Length 51 >>\nstream\nBT /F1 24 Tf 72 120 Td (ESGenius Sample PDF) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000079 00000 n \n0000000178 00000 n \n0000000331 00000 n \ntrailer\n<< /Root 1 0 R /Size 5 >>\nstartxref\n440\n%%EOF";
    const blob = new Blob([pdfHeader], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ESGenius_Sample_Report.pdf";
    link.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#171e2b", color: "#fff", padding: "3rem" }}>
      <h1 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "2.5rem" }}>
        ESGenius 실시간 대시보드 (SaaS 데모)
      </h1>
      {alert && (
        <div style={{
          background: "#ff1744",
          color: "#fff",
          borderRadius: "1rem",
          padding: "1rem 2rem",
          textAlign: "center",
          fontWeight: 700,
          marginBottom: "1.5rem",
          fontSize: "1.15rem",
          letterSpacing: "0.01em"
        }}>
          {alert}
        </div>
      )}
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "2rem" }}>
        <div style={{ background: "#232f44", borderRadius: "1.3rem", padding: "2.5rem 3.5rem", minWidth: "170px" }}>
          <div style={{ fontSize: "1.1rem", opacity: 0.9, marginBottom: 10 }}>발전량</div>
          <div style={{ fontSize: "2.2rem", fontWeight: 700, color: "#44fbe6" }}>{power} MWh</div>
        </div>
        <div style={{ background: "#232f44", borderRadius: "1.3rem", padding: "2.5rem 3.5rem", minWidth: "170px" }}>
          <div style={{ fontSize: "1.1rem", opacity: 0.9, marginBottom: 10 }}>탄소저감량</div>
          <div style={{ fontSize: "2.2rem", fontWeight: 700, color: "#ffad57" }}>{carbon} tCO₂</div>
        </div>
        <div style={{ background: "#232f44", borderRadius: "1.3rem", padding: "2.5rem 3.5rem", minWidth: "170px" }}>
          <div style={{ fontSize: "1.1rem", opacity: 0.9, marginBottom: 10 }}>ESG 점수</div>
          <div style={{ fontSize: "2.2rem", fontWeight: 700, color: "#9da6ff" }}>{esg} / 100</div>
        </div>
      </div>
      <div style={{ textAlign: "center", margin: "2rem 0 2rem" }}>
        <b>실시간 발전량 변화 그래프</b>
        <div style={{ background: "#10151e", borderRadius: "1.3rem", margin: "1.5rem auto", width: 420, boxShadow: "0 2px 16px #44fbe645" }}>
          <LineChart data={history} />
        </div>
      </div>
      <div style={{ textAlign: "center", margin: "2rem 0" }}>
        <button
          style={{
            fontSize: "1rem",
            padding: "0.75rem 2rem",
            borderRadius: "2rem",
            background: "#445dfb",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 20px #22308855"
          }}
          onClick={downloadPDF}
        >
          PDF 보고서 샘플 다운로드
        </button>
      </div>
    </div>
  );
}

export default App;
