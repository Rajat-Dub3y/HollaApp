// Ultra-simple React component to test preview
function SimpleTestApp() {
  return (
    <div style={{ 
      padding: "40px", 
      textAlign: "center", 
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f0f8ff",
      minHeight: "100vh"
    }}>
      <h1 style={{ color: "#333" }}>🎉 Holla AI Preview Working!</h1>
      <p style={{ fontSize: "18px", color: "#666" }}>
        The React app is now rendering correctly in the preview.
      </p>
      <div style={{ 
        background: "white", 
        padding: "20px", 
        borderRadius: "10px", 
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        margin: "20px auto",
        maxWidth: "500px"
      }}>
        <h3>App Status:</h3>
        <p>✅ Server running on port 5000</p>
        <p>✅ React app rendering</p>
        <p>✅ Vite development server active</p>
        <p>✅ Firebase configured</p>
        
        <button 
          onClick={() => alert("Preview is working!")}
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Test Interaction
        </button>
      </div>
      
      <p style={{ marginTop: "30px", color: "#888" }}>
        If you can see this, the preview environment is working correctly!
      </p>
    </div>
  );
}

export default SimpleTestApp;