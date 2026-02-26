import * as React from "react";
import { VerifyEmailOTP } from "./_components/VerifyEmailOTP";

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailOTP />;
    </React.Suspense>
  );
}
