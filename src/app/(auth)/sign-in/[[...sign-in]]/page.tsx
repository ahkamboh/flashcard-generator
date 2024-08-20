import { SignIn } from "@clerk/nextjs";
import Spline from "@splinetool/react-spline";
import React from "react";

const SignInPage: React.FC = () => {
  return (
    <main className="flex items-center justify-center min-h-screen relative">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/Cd695Ckh0GnuY2jh/scene.splinecode"
          className="w-full h-full"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <SignIn />
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
