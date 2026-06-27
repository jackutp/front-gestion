"use client";

import { type ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { SolicitudProvider } from "@/context/SolicitudContext";
import { CambioProvider } from "@/context/CambioContext";
import { IncidenteProvider } from "@/context/IncidenteContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CambioProvider>
        <SolicitudProvider>
          <IncidenteProvider>
            {children}
          </IncidenteProvider>
        </SolicitudProvider>
      </CambioProvider>
    </AuthProvider>
  );
}
