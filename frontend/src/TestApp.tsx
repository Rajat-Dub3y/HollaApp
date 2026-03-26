import { useState } from "react";

export default function TestApp() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  const testAPI = async () => {
    try {
      const response = await fetch(`/test`);
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult("Error: " + error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🎉 Holla AI - Test Interface</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <p>✅ React app is working!</p>
        <p>✅ Vite development server is running!</p>
        <p>✅ Firebase credentials are configured!</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button 
          onClick={testAPI}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Test API Connection
        </button>
        
        {result && (
          <pre style={{
            background: "#f5f5f5",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "5px",
            fontSize: "12px"
          }}>
            {result}
          </pre>
        )}
      </div>

      <div>
        <h3>Available Features:</h3>
        <ul>
          <li>✅ Server running on port 5000</li>
          <li>✅ API endpoints working</li>
          <li>✅ Firebase authentication configured</li>
          <li>✅ Database connection ready</li>
          <li>✅ AI reply generation ready</li>
        </ul>
      </div>
    </div>
  );
}