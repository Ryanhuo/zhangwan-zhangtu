import { createRoot } from "react-dom/client";
import "@/styles/app.css";

function App() {
  return (
    <div style={{ padding: "48px 40px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>首页原型</h1>
      <p style={{ color: "#6b7683", lineHeight: 1.7 }}>
        这是示例页面。在 <code>src/pages/</code> 下新建目录即可添加更多页面。
      </p>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
