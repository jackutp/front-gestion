"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Section = "perfil" | "solicitudes" | "cambios" | "incidencias";

// AÑADIR NUEVA GESTIÓN AQUÍ - Agrega nuevas secciones al tipo Section

interface NavigationContextType {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<Section>("perfil");

  return (
    <NavigationContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation debe usarse dentro de NavigationProvider");
  return ctx;
}
