import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [updateStatus, setUpdateStatus] = useState<string>("(sem status)");

  const handleRun = async () => {
    console.log("Chamando Puppeteer...");
    console.log("URL enviada:", url);
    const result = await window.api.runPuppeteer(url);
    console.log("Resultado:", result);
  };

  useEffect(() => {
    if (window.api?.onUpdateStatus) {
      window.api.onUpdateStatus((msg: string) => {
        console.log("Update status:", msg);
        setUpdateStatus(msg);
      });
    }
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Gerar pdf site</h1>

      <div style={{ marginBottom: 20 }}>
        <strong>Status de update:</strong> {updateStatus}
      </div>

      <button
        onClick={handleRun}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#4CAF50",
          marginRight: "10px",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Rodar Puppeteer
      </button>

      <input
        placeholder="digite a url"
        type="text"
        onChange={(e) => setUrl(e.target.value)}
      />
    </div>
  );
}

export default App;
