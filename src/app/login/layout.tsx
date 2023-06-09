import React from "react";
import { PublicRoute } from '@/app/PublicRoute';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicRoute>
      <>
      <main>{children}</main>
      </>
    </PublicRoute>
  ) ;
}
