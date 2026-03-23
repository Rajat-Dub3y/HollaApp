import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isSignInWithEmailLink, signInWithEmailLink, UserCredential } from "firebase/auth";
import { auth } from "../lib/firebase";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogin = async () => {
      try {
        const email = localStorage.getItem("emailForSignIn");

        if (!email) {
          console.error("No email found in localStorage");
          return;
        }

        if (isSignInWithEmailLink(auth, window.location.href)) {
          const result: UserCredential = await signInWithEmailLink(
            auth,
            email,
            window.location.href
          );

          console.log("✅ Firebase login success");

          const idToken: string = await result.user.getIdToken();

          // 🔥 Send token to backend
          await fetch("http://localhost:5000/api/auth/firebase-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // IMPORTANT for session
            body: JSON.stringify({ idToken }),
          });

          console.log("✅ Session created");

          navigate("/dashboard");
        }
      } catch (error) {
        console.error("❌ Login failed", error);
      }
    };

    handleLogin();
  }, [navigate]);

  return <h2>Logging you in...</h2>;
};

export default AuthCallback;