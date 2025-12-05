
import './App.css'
import { useState } from 'react';

function App() {
  const [url, setUrl] = useState(''); 

  const handleRun = async () => {
    console.log("Chamando Puppeteer...");
    console.log("URL enviada:", url);
    const result = await window.api.runPuppeteer(url);
    console.log("Resultado:", result);
  };


  return (
    <div style={{ padding: 30 }}>
      <h1>App Vite + Electron + Puppeteer</h1>

      <button
        onClick={handleRun}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
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




export default App
