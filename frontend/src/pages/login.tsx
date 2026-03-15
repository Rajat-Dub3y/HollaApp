import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import FirebaseAuth from "@/components/firebase-auth";
import { useEffect } from "react";

export default function Login() {
  const [, navigate] = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Redirect to home if already logged in
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (currentUser) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <FirebaseAuth onSuccess={() => navigate("/")} />
      </div>
    </div>
  );
}