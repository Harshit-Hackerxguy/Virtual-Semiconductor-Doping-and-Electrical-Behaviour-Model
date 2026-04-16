import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const pageStyle = {
  minHeight: "100vh",
  margin: 0,
  color: "#c7d9e7",
  fontFamily: "'Space Grotesk', 'Sora', 'Segoe UI', sans-serif",
  background:
    "radial-gradient(circle at 15% 20%, rgba(19, 85, 131, 0.34) 0%, rgba(9, 30, 49, 0) 45%), radial-gradient(circle at 82% 72%, rgba(171, 117, 53, 0.22) 0%, rgba(9, 30, 49, 0) 42%), linear-gradient(160deg, #071624 0%, #071a2b 40%, #061220 100%)",
  position: "relative",
  overflowX: "hidden",
};

const shellStyle = {
  width: "100%",
  margin: "0 auto",
  paddingBottom: "2rem",
  position: "relative",
  zIndex: 1,
};

const sectionStyle = {
  width: "min(1380px, calc(100% - 2rem))",
  margin: "0 auto",
  padding: "1.15rem 0",
};

const cardStyle = {
  background: "linear-gradient(160deg, rgba(8, 34, 56, 0.76), rgba(4, 25, 42, 0.9))",
  border: "1px solid rgba(74, 138, 181, 0.28)",
  borderRadius: "26px",
  padding: "1.05rem",
  boxShadow: "0 22px 42px rgba(1, 12, 24, 0.38)",
  backdropFilter: "blur(10px)",
};

const buttonStyle = {
  border: 0,
  borderRadius: "999px",
  background: "linear-gradient(135deg, #00a3de, #1472da)",
  color: "#f4fbff",
  fontWeight: 700,
  padding: "0.85rem 1.42rem",
  cursor: "pointer",
  letterSpacing: "0.01em",
  boxShadow: "0 8px 24px rgba(8, 112, 170, 0.45)",
};

const inputStyle = {
  width: "100%",
  padding: "0.7rem 0.8rem",
  borderRadius: "12px",
  border: "1px solid rgba(89, 146, 186, 0.35)",
  font: "inherit",
  background: "rgba(7, 35, 56, 0.85)",
  color: "#e5f2fb",
  outline: "none",
};

const navStyle = {
  position: "sticky",
  top: 0,
  zIndex: 20,
  borderBottom: "1px solid rgba(99, 152, 188, 0.22)",
  background: "rgba(5, 20, 34, 0.8)",
  backdropFilter: "blur(9px)",
};

const navInnerStyle = {
  width: "min(1380px, calc(100% - 2rem))",
  margin: "0 auto",
  padding: "0.92rem 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
};

const metricGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "0.75rem",
  marginTop: "0.88rem",
};

const metricStyle = {
  border: "1px solid rgba(90, 149, 183, 0.26)",
  borderRadius: "12px",
  background: "rgba(7, 34, 52, 0.85)",
  padding: "0.62rem",
};

function toFiniteNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9eE+\-.]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatScientific(value, digits = 2) {
  const numeric = toFiniteNumber(value);
  if (numeric === 0) return "0";
  return numeric.toExponential(digits);
}

function GlobalAnimationStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');

      :root {
        --text-soft: #9db7cb;
        --text-strong: #d7e8f6;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: #081625;
      }

      h1,
      h2,
      h3,
      h4 {
        color: var(--text-strong);
      }

      h1 {
        font-family: 'Fraunces', Georgia, serif;
        letter-spacing: -0.02em;
      }

      p,
      small,
      li,
      label,
      span,
      a,
      input,
      select,
      button {
        font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
      }

      select,
      input {
        appearance: none;
      }

      input::placeholder {
        color: #7aa1ba;
      }

      .fade-in {
        animation: section-in 0.38s ease both;
      }

      .eyebrow {
        margin: 0;
        color: #6eb8e1;
        text-transform: uppercase;
        letter-spacing: 0.17em;
        font-size: 0.86rem;
        font-weight: 700;
      }

      .helper-text {
        color: var(--text-soft);
      }

      .headline-hero {
        margin: 0.5rem 0 0.85rem;
        font-size: clamp(2.2rem, 5.5vw, 5rem);
        line-height: 0.96;
      }

      .hero-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1.25fr 1fr;
      }

      .pill-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
        margin-top: 1rem;
      }

      .pill {
        border: 1px solid rgba(80, 162, 211, 0.45);
        color: #c4e4f7;
        border-radius: 999px;
        padding: 0.4rem 0.8rem;
        background: rgba(15, 61, 92, 0.45);
        font-weight: 500;
      }

      .toggle-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.8rem;
      }

      .toggle-label {
        display: inline-flex;
        align-items: center;
        gap: 0.7rem;
        font-weight: 700;
        color: #d7e8f6;
        cursor: pointer;
        position: relative;
      }

      .toggle-label input {
        position: absolute;
        opacity: 0;
        width: 1px;
        height: 1px;
      }

      .toggle-ui {
        width: 64px;
        height: 34px;
        border-radius: 999px;
        border: 1px solid rgba(97, 143, 174, 0.55);
        background: rgba(69, 92, 109, 0.5);
        position: relative;
        transition: all 0.28s ease;
      }

      .toggle-ui::after {
        content: '';
        position: absolute;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: #f8fafc;
        top: 3px;
        left: 3px;
        transition: transform 0.28s ease;
      }

      .toggle-label input:checked + .toggle-ui {
        background: linear-gradient(135deg, #168bc6, #0f5ec4);
      }

      .toggle-label input:checked + .toggle-ui::after {
        transform: translateX(30px);
      }

      .chart-wrap .recharts-legend-item-text,
      .chart-wrap .recharts-text {
        fill: #a8c4d7;
      }

      @keyframes atom-drift {
        from { transform: translate3d(0, 0, 0); }
        50% { transform: translate3d(12px, -28px, 0); }
        to { transform: translate3d(0, -56px, 0); }
      }

      @keyframes carrier-pulse {
        0% { transform: translateY(0px); opacity: 0.35; }
        50% { transform: translateY(-8px); opacity: 0.95; }
        100% { transform: translateY(0px); opacity: 0.35; }
      }

      @keyframes section-in {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0px); }
      }

      @media (max-width: 980px) {
        .hero-grid {
          grid-template-columns: 1fr;
        }

        .two-column-grid {
          grid-template-columns: 1fr !important;
        }
      }

      @media (max-width: 640px) {
        .headline-hero {
          font-size: clamp(1.95rem, 10vw, 2.7rem);
        }
      }
    `}</style>
  );
}

function AtomBackground() {
  const atoms = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 10 + Math.random() * 20,
        duration: 8 + Math.random() * 16,
        delay: Math.random() * 8,
      })),
    []
  );

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {atoms.map((atom) => (
        <div
          key={atom.id}
          style={{
            position: "absolute",
            left: atom.left,
            top: atom.top,
            width: atom.size,
            height: atom.size,
            borderRadius: "50%",
            border: "1px solid rgba(58, 162, 232, 0.24)",
            animation: `atom-drift ${atom.duration}s linear infinite`,
            animationDelay: `${atom.delay}s`,
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: "30%",
              borderRadius: "50%",
              background:
                atom.id % 4 === 0
                  ? "radial-gradient(circle, rgba(255, 181, 92, 0.78), rgba(255, 181, 92, 0.12))"
                  : "radial-gradient(circle, rgba(35, 167, 230, 0.64), rgba(35, 167, 230, 0.12))",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function CrystalSvg({ sample, intrinsic = false }) {
  const cols = 12;
  const rows = 7;
  const spacing = 44;
  const width = cols * spacing + 30;
  const height = rows * spacing + 30;

  const concentration = Number(sample?.concentration || 1e15);
  const logN = Math.log10(concentration);
  const dopantCount = intrinsic ? 0 : Math.max(1, Math.min(18, Math.round((logN - 12) * 2.2)));

  const lattice = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      lattice.push({
        x: 20 + c * spacing,
        y: 20 + r * spacing,
        index: r * cols + c,
      });
    }
  }

  const dopedIndices = new Set();
  if (!intrinsic) {
    for (let i = 0; i < dopantCount; i += 1) {
      dopedIndices.add((i * 11 + 7) % lattice.length);
    }
  }

  const hostColor =
    sample?.material === "Germanium"
      ? "#8ca2b7"
      : sample?.material === "Gallium Arsenide"
        ? "#8b9de1"
        : "#75a3cc";
  const dopantColor = sample?.impurity_type === "Acceptor" ? "#e17b93" : "#3da2f2";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" role="img">
      <rect x="0" y="0" width={width} height={height} fill="#071f31" rx="12" />

      {lattice.map((node) => {
        const right = lattice.find((candidate) => candidate.y === node.y && candidate.x === node.x + spacing);
        const down = lattice.find((candidate) => candidate.x === node.x && candidate.y === node.y + spacing);
        return (
          <g key={`bond-${node.index}`}>
            {right ? <line x1={node.x} y1={node.y} x2={right.x} y2={right.y} stroke="#35536b" strokeWidth="1.2" /> : null}
            {down ? <line x1={node.x} y1={node.y} x2={down.x} y2={down.y} stroke="#35536b" strokeWidth="1.2" /> : null}
          </g>
        );
      })}

      {lattice.map((node) => {
        const isDopant = dopedIndices.has(node.index);
        return (
          <g key={node.index}>
            <circle cx={node.x} cy={node.y} r={isDopant ? 7.5 : 6} fill={isDopant ? dopantColor : hostColor} />
            {!intrinsic && isDopant ? (
              <circle
                cx={node.x + 8}
                cy={node.y - 8}
                r="2.8"
                fill={sample?.impurity_type === "Acceptor" ? "#f08aa1" : "#6bc4ff"}
                style={{ animation: `carrier-pulse ${1.1 + (node.index % 5) * 0.3}s ease-in-out infinite` }}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function MaterialStructureSection({ sampleA, sampleB }) {
  if (!sampleA && !sampleB) {
    return null;
  }

  const panels = [sampleA, sampleB].filter(Boolean);

  return (
    <section id="structure" style={sectionStyle} className="fade-in">
      <h2 style={{ margin: 0 }}>Material Structure View</h2>
      <p style={{ marginTop: "0.4rem" }} className="helper-text">
        Structural view appears after Run Simulation. Left is intrinsic lattice, right is doped lattice with impurity atoms.
      </p>

      <div
        className={panels.length > 1 ? "two-column-grid" : undefined}
        style={{ display: "grid", gap: "1rem", gridTemplateColumns: panels.length > 1 ? "repeat(2, minmax(0, 1fr))" : "1fr" }}
      >
        {panels.map((sample) => (
          <div key={sample.label} style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>{sample.label}: {sample.material}</h3>
            <p style={{ marginTop: "0.2rem" }} className="helper-text">
              Dopant: {sample.impurity_name} ({sample.impurity_type}), concentration {sample.majority_density_display}
            </p>

            <div className="two-column-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
              <div>
                <h4 style={{ margin: "0 0 0.5rem" }}>Intrinsic</h4>
                <div
                  style={{
                    border: "1px solid rgba(75, 140, 180, 0.35)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: 250,
                  }}
                >
                  <CrystalSvg sample={sample} intrinsic />
                </div>
              </div>
              <div>
                <h4 style={{ margin: "0 0 0.5rem" }}>After Doping</h4>
                <div
                  style={{
                    border: "1px solid rgba(75, 140, 180, 0.35)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: 250,
                  }}
                >
                  <CrystalSvg sample={sample} intrinsic={false} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SampleForm({ title, sample, setSample, materials, impurities }) {
  return (
    <div style={cardStyle} className="fade-in">
      <p className="eyebrow">Input</p>
      <h3 style={{ margin: "0.2rem 0 0.75rem" }}>{title}</h3>

      <div style={{ display: "grid", gap: "0.7rem" }}>
        <label>
          <div style={{ marginBottom: "0.3rem", fontWeight: 600, color: "#cfe4f2" }}>Material</div>
          <select
            style={inputStyle}
            value={sample.material}
            onChange={(event) => setSample((prev) => ({ ...prev, material: event.target.value }))}
          >
            {materials.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
        </label>

        <label>
          <div style={{ marginBottom: "0.3rem", fontWeight: 600, color: "#cfe4f2" }}>Common impurity</div>
          <select
            style={inputStyle}
            value={sample.selected_impurity}
            onChange={(event) => setSample((prev) => ({ ...prev, selected_impurity: event.target.value }))}
          >
            <option value="">Choose a dopant</option>
            {impurities.map((impurity) => (
              <option key={impurity} value={impurity}>
                {impurity}
              </option>
            ))}
          </select>
        </label>

        <label>
          <div style={{ marginBottom: "0.3rem", fontWeight: 600, color: "#cfe4f2" }}>Custom impurity (optional)</div>
          <input
            style={inputStyle}
            type="text"
            value={sample.custom_impurity}
            onChange={(event) => setSample((prev) => ({ ...prev, custom_impurity: event.target.value }))}
            placeholder="Example: Boron"
          />
        </label>

        <label>
          <div style={{ marginBottom: "0.3rem", fontWeight: 600, color: "#cfe4f2" }}>Doping concentration (cm^-3)</div>
          <input
            style={inputStyle}
            type="text"
            value={sample.concentration}
            onChange={(event) => setSample((prev) => ({ ...prev, concentration: event.target.value }))}
            placeholder="Example: 1e16"
          />
        </label>
      </div>
    </div>
  );
}

function SampleResult({ sample }) {
  if (!sample) return null;

  return (
    <div style={cardStyle} className="fade-in">
      <p className="eyebrow">{sample.label}</p>
      <h3 style={{ margin: "0.2rem 0 0.3rem" }}>
        {sample.impurity_name} in {sample.material}
      </h3>
      <p style={{ margin: 0 }} className="helper-text">
        {sample.impurity_type} doped, {sample.semiconductor_type}
      </p>

      <div style={metricGridStyle}>
        <div style={metricStyle}>
          <small className="helper-text">Conductivity</small>
          <div style={{ fontWeight: 700, color: "#e4f5ff" }}>{sample.conductivity_display}</div>
        </div>
        <div style={metricStyle}>
          <small className="helper-text">Resistivity</small>
          <div style={{ fontWeight: 700, color: "#e4f5ff" }}>{sample.resistivity_display}</div>
        </div>
        <div style={metricStyle}>
          <small className="helper-text">Breakdown Voltage</small>
          <div style={{ fontWeight: 700, color: "#e4f5ff" }}>{sample.breakdown_voltage_display}</div>
        </div>
        <div style={metricStyle}>
          <small className="helper-text">Depletion Width</small>
          <div style={{ fontWeight: 700, color: "#e4f5ff" }}>{sample.depletion_width_display}</div>
        </div>
        <div style={metricStyle}>
          <small className="helper-text">Majority Carrier</small>
          <div style={{ fontWeight: 700, color: "#e4f5ff" }}>{sample.majority_carrier}</div>
        </div>
        <div style={metricStyle}>
          <small className="helper-text">Minority Carrier</small>
          <div style={{ fontWeight: 700, color: "#e4f5ff" }}>{sample.minority_carrier}</div>
        </div>
      </div>

      <p style={{ marginTop: "0.75rem", lineHeight: 1.5 }} className="helper-text">
        {sample.explanation}
      </p>
    </div>
  );
}

function VisualizationSection({ sampleA, sampleB }) {
  const selected = sampleA || sampleB;
  if (!selected) return null;

  const ivDataA = sampleA?.graphics?.iv_curve || [];
  const ivDataB = sampleB?.graphics?.iv_curve || [];
  const breakdownSweep = selected.graphics?.breakdown_sweep || [];

  const mergedByVoltage = new Map();
  ivDataA.forEach((point) => {
    const voltage = toFiniteNumber(point?.voltage);
    const currentDensity = toFiniteNumber(point?.current_density);
    mergedByVoltage.set(voltage, {
      ...(mergedByVoltage.get(voltage) || { voltage, sampleA: null, sampleB: null }),
      sampleA: currentDensity,
    });
  });
  ivDataB.forEach((point) => {
    const voltage = toFiniteNumber(point?.voltage);
    const currentDensity = toFiniteNumber(point?.current_density);
    mergedByVoltage.set(voltage, {
      ...(mergedByVoltage.get(voltage) || { voltage, sampleA: null, sampleB: null }),
      sampleB: currentDensity,
    });
  });

  const mergedIvData = Array.from(mergedByVoltage.values()).sort((a, b) => a.voltage - b.voltage);

  const carrierData = [
    {
      name: "Majority",
      sampleA: toFiniteNumber(sampleA?.majority_density),
      sampleB: sampleB ? toFiniteNumber(sampleB?.majority_density) : null,
    },
    {
      name: "Minority",
      sampleA: toFiniteNumber(sampleA?.minority_density),
      sampleB: sampleB ? toFiniteNumber(sampleB?.minority_density) : null,
    },
  ];

  const tooltipStyle = {
    backgroundColor: "#0a2436",
    border: "1px solid #2e5f80",
    borderRadius: 10,
    color: "#d6ebfa",
  };

  return (
    <section id="graphics" style={sectionStyle} className="fade-in">
      <h2 style={{ margin: 0 }}>Simulation Graphics</h2>
      <p className="helper-text" style={{ marginTop: "0.4rem" }}>
        Real-time plots generated from the backend after Run Simulation.
      </p>

      <div style={{ display: "grid", gap: "1rem" }}>
        <div style={cardStyle} className="chart-wrap">
          <h3 style={{ marginTop: 0 }}>I-V Current Density Curve</h3>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={mergedIvData} margin={{ top: 10, right: 18, left: 8, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(90, 140, 170, 0.2)" />
                <XAxis dataKey="voltage" stroke="#9ebed3" tickFormatter={(value) => toFiniteNumber(value).toFixed(1)} />
                <YAxis yAxisId="left" stroke="#9ebed3" tickFormatter={(value) => formatScientific(value, 1)} />
                {sampleB ? <YAxis yAxisId="right" orientation="right" stroke="#e2ad83" tickFormatter={(value) => formatScientific(value, 1)} /> : null}
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatScientific(value, 2)} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="sampleA" stroke="#2377d8" strokeWidth={2} name="Sample A J (A/cm^2)" dot={false} connectNulls />
                {sampleB ? (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sampleB"
                    stroke="#df6a20"
                    strokeWidth={2}
                    name="Sample B J (A/cm^2)"
                    strokeDasharray="5 4"
                    dot={false}
                    connectNulls
                  />
                ) : null}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={cardStyle} className="chart-wrap">
          <h3 style={{ marginTop: 0 }}>Breakdown Voltage vs Doping Sweep</h3>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={breakdownSweep}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(90, 140, 170, 0.2)" />
                <XAxis dataKey="doping" stroke="#9ebed3" tickFormatter={(value) => Number(value).toExponential(0)} />
                <YAxis stroke="#9ebed3" />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => Number(value).toFixed(3)} />
                <Legend />
                <Line type="monotone" dataKey="breakdown_voltage" stroke="#14a97d" strokeWidth={2} name="Breakdown Voltage (V)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={cardStyle} className="chart-wrap">
          <h3 style={{ marginTop: 0 }}>Carrier Concentration Comparison</h3>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={carrierData} barCategoryGap="22%" barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(90, 140, 170, 0.2)" />
                <XAxis dataKey="name" stroke="#9ebed3" />
                <YAxis stroke="#9ebed3" tickFormatter={(value) => formatScientific(value, 1)} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatScientific(value, 2)} />
                <Legend />
                <Bar dataKey="sampleA" fill="#2377d8" name="Sample A Density (cm^-3)" />
                {sampleB ? <Bar dataKey="sampleB" fill="#df6a20" name="Sample B Density (cm^-3)" /> : null}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [materials, setMaterials] = useState(["Silicon"]);
  const [impurities, setImpurities] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [sampleA, setSampleA] = useState({ material: "Silicon", selected_impurity: "", custom_impurity: "", concentration: "" });
  const [sampleB, setSampleB] = useState({ material: "Silicon", selected_impurity: "", custom_impurity: "", concentration: "" });
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadOptions() {
      const response = await fetch("https://virtual-semiconductor-doping-and.onrender.com/api/options");
      const data = await response.json();
      setMaterials(data.materials || ["Silicon"]);
      setImpurities(data.impurities || []);
    }

    loadOptions().catch(() => setErrors(["Could not load API options. Please start backend server."]));
  }, []);

  async function runSimulation(event) {
    event.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const response = await fetch("https://virtual-semiconductor-doping-and.onrender.com/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ compare_mode: compareMode, sample_a: sampleA, sample_b: sampleB }),
      });

      const data = await response.json();
      if (!response.ok) {
        setResult(null);
        setErrors(data.errors || ["Simulation failed."]);
        return;
      }

      setResult(data);
      const resultSection = document.getElementById("results");
      if (resultSection) resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      setResult(null);
      setErrors(["Cannot reach simulation API. Ensure backend is running."]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={pageStyle}>
      <GlobalAnimationStyles />
      <AtomBackground />

      <div style={shellStyle}>
        <header style={navStyle}>
          <div style={navInnerStyle}>
            <strong style={{ fontSize: "1.08rem", color: "#e4f2fd" }}>Atomica Semiconductor Studio</strong>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a href="#simulator" style={{ textDecoration: "none", color: "#8fbad7", fontWeight: 600 }}>
                Simulator
              </a>
              <a href="#results" style={{ textDecoration: "none", color: "#8fbad7", fontWeight: 600 }}>
                Results
              </a>
              <a href="#structure" style={{ textDecoration: "none", color: "#8fbad7", fontWeight: 600 }}>
                Structure
              </a>
              <a href="#graphics" style={{ textDecoration: "none", color: "#8fbad7", fontWeight: 600 }}>
                Graphics
              </a>
            </div>
          </div>
        </header>

        <section style={sectionStyle} className="fade-in">
          <div className="hero-grid">
            <div style={{ ...cardStyle, padding: "1.9rem" }}>
              <p className="eyebrow">Physics-Backed Simulator</p>
              <h1 className="headline-hero">Atomica Semiconductor Lab</h1>
              <p style={{ margin: 0, lineHeight: 1.5, maxWidth: "64ch" }} className="helper-text">
                A refreshed React experience for exploring donor and acceptor doping with a backend model that estimates carrier
                concentration, conductivity, resistivity, depletion width, and breakdown behavior.
              </p>
              <div className="pill-row">
                <span className="pill">React UI</span>
                <span className="pill">Live Flask API</span>
                <span className="pill">Atom animation field</span>
              </div>
            </div>

            <div style={{ ...cardStyle, padding: "1.6rem" }}>
              <p className="eyebrow">What Is Simulated</p>
              <h2 style={{ margin: "0.5rem 0 0.4rem" }}>Core electrical trends</h2>
              <ul style={{ margin: "0.2rem 0 0", lineHeight: 1.65, color: "#a4c3d7", paddingLeft: "1.2rem" }}>
                <li>Majority and minority carrier densities</li>
                <li>Conductivity and resistivity from mobility</li>
                <li>Breakdown voltage trend and mechanism</li>
                <li>Comparison for two doping profiles</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="simulator" style={sectionStyle}>
          <div style={{ ...cardStyle, padding: "1.4rem 1.35rem" }}>
            <p className="eyebrow">Input</p>
            <h2 style={{ margin: "0.3rem 0" }}>Configure one sample or compare two</h2>
            <p className="helper-text" style={{ marginTop: "0.15rem" }}>
              Concentration input accepts scientific notation like 1e16.
            </p>

            <form onSubmit={runSimulation} style={{ display: "grid", gap: "1rem" }}>
              <div
                style={{
                  border: "1px solid rgba(87, 154, 188, 0.35)",
                  borderRadius: "20px",
                  padding: "0.95rem 1rem",
                  background: "rgba(5, 35, 54, 0.7)",
                }}
                className="toggle-row"
              >
                <label className="toggle-label">
                  <input type="checkbox" checked={compareMode} onChange={(event) => setCompareMode(event.target.checked)} />
                  <span className="toggle-ui" aria-hidden="true" />
                  Compare Sample A and Sample B
                </label>
                <span className="helper-text" style={{ fontWeight: 600 }}>
                  {compareMode ? "Dual-sample mode" : "Single-sample mode"}
                </span>
              </div>

              <div
                className={compareMode ? "two-column-grid" : undefined}
                style={{ display: "grid", gap: "1rem", gridTemplateColumns: compareMode ? "repeat(2, minmax(0, 1fr))" : "1fr" }}
              >
                <SampleForm title="Sample A" sample={sampleA} setSample={setSampleA} materials={materials} impurities={impurities} />
                {compareMode ? (
                  <SampleForm title="Sample B" sample={sampleB} setSample={setSampleB} materials={materials} impurities={impurities} />
                ) : null}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <button type="submit" style={buttonStyle} disabled={loading}>
                  {loading ? "Running simulation..." : "Run Simulation"}
                </button>
              </div>
            </form>
          </div>

          {errors.length > 0 ? (
            <div
              style={{
                ...cardStyle,
                marginTop: "1rem",
                borderColor: "rgba(213, 95, 123, 0.5)",
                background: "linear-gradient(160deg, rgba(63, 21, 33, 0.78), rgba(52, 17, 30, 0.9))",
              }}
            >
              <strong style={{ color: "#f6b2c0" }}>Input issues</strong>
              <ul style={{ marginBottom: 0 }}>
                {errors.map((error) => (
                  <li key={error} style={{ color: "#f2c8d1" }}>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section id="results" style={sectionStyle}>
          <h2 style={{ margin: 0 }}>Results</h2>
          <p className="helper-text" style={{ marginTop: "0.4rem" }}>
            Core electrical metrics from the latest simulation run.
          </p>

          {result?.sample_a ? (
            <div
              className={result.sample_b ? "two-column-grid" : undefined}
              style={{ display: "grid", gap: "1rem", gridTemplateColumns: result.sample_b ? "repeat(2, minmax(0, 1fr))" : "1fr" }}
            >
              <SampleResult sample={result.sample_a} />
              {result.sample_b ? <SampleResult sample={result.sample_b} /> : null}
            </div>
          ) : (
            <div style={cardStyle}>
              <h3 style={{ margin: "0 0 0.35rem" }}>No simulation yet</h3>
              <p style={{ margin: 0 }} className="helper-text">
                Click Run Simulation to generate structure and graphs.
              </p>
            </div>
          )}

          {result?.comparison ? (
            <div style={{ ...cardStyle, marginTop: "1rem" }}>
              <h3 style={{ marginTop: 0 }}>Comparison Summary</h3>
              <p style={{ margin: "0.2rem 0" }} className="helper-text">
                {result.comparison.summary}
              </p>
            </div>
          ) : null}
        </section>

        <MaterialStructureSection sampleA={result?.sample_a} sampleB={result?.sample_b} />
        <VisualizationSection sampleA={result?.sample_a} sampleB={result?.sample_b} />
      </div>
    </div>
  );
}
