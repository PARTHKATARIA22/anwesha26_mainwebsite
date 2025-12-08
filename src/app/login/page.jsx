"use client";

import { Suspense } from "react";
import Signin from "./signin";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <Signin />
    </Suspense>
  );
}
