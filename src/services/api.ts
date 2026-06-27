import type { User, Solicitud, Cambio, Incidencia, Prioridad, Departamento, Estado } from "@/src/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Mock data ---
const MOCK_USER: User = {
  id: 1,
  nombre: "Carlos López",
  rol: "Administrador",
  email: "carlos@lebongout.com",
};

let solicitudes: Solicitud[] = [
  { id: 1, titulo: "Comprar insumos de cocina", descripcion: "Se necesitan nuevos utensilios", prioridad: "Alta" as Prioridad, departamento: "Cocina" as Departamento, fechaRequerida: "2026-07-10", estado: "Pendiente" as Estado, createdAt: "2026-06-25T10:00:00Z" },
  { id: 2, titulo: "Reparar horno", descripcion: "El horno principal no enciende", prioridad: "Alta" as Prioridad, departamento: "Cocina" as Departamento, fechaRequerida: "2026-07-01", estado: "En Proceso" as Estado, createdAt: "2026-06-24T08:00:00Z" },
];

let cambios: Cambio[] = [
  { id: 1, tipo: "Horario", descripcion: "Cambiar turno de meseros", razon: "Conflictos de horario", fechaPropuesta: "2026-07-05", estado: "Pendiente", createdAt: "2026-06-25T09:00:00Z" },
];

let incidencias: Incidencia[] = [
  { id: 1, tipo: "Técnica", descripcion: "La cafetera express está fallando", urgencia: "Urgente", ubicacion: "Cocina principal", estado: "Pendiente", createdAt: "2026-06-25T11:00:00Z" },
];

let nextId = 10;

// --- Auth ---
export async function loginUser(credentials: { usuario: string; password: string }): Promise<{ success: boolean; user?: User }> {
  await delay(500);
  if (credentials.usuario && credentials.password) {
    return { success: true, user: MOCK_USER };
  }
  return { success: false };
}

export async function logoutUser(): Promise<void> {
  await delay(200);
}

// --- Solicitudes ---
export async function getSolicitudes(): Promise<Solicitud[]> {
  await delay(500);
  return [...solicitudes];
}

export async function postSolicitud(data: Omit<Solicitud, "id" | "estado" | "createdAt">): Promise<Solicitud> {
  await delay(500);
  const nueva: Solicitud = { ...data, id: nextId++, estado: "Pendiente", createdAt: new Date().toISOString() };
  solicitudes = [nueva, ...solicitudes];
  return nueva;
}

// --- Cambios ---
export async function getCambios(): Promise<Cambio[]> {
  await delay(500);
  return [...cambios];
}

export async function postCambio(data: Omit<Cambio, "id" | "estado" | "createdAt">): Promise<Cambio> {
  await delay(500);
  const nuevo: Cambio = { ...data, id: nextId++, estado: "Pendiente", createdAt: new Date().toISOString() };
  cambios = [nuevo, ...cambios];
  return nuevo;
}

// --- Incidencias ---
export async function getIncidencias(): Promise<Incidencia[]> {
  await delay(500);
  return [...incidencias];
}

export async function postIncidencia(data: Omit<Incidencia, "id" | "estado" | "createdAt">): Promise<Incidencia> {
  await delay(500);
  const nueva: Incidencia = { ...data, id: nextId++, estado: "Pendiente", createdAt: new Date().toISOString() };
  incidencias = [nueva, ...incidencias];
  return nueva;
}

// AÑADIR NUEVA GESTIÓN AQUÍ - Agrega nuevas funciones mock para futuras gestiones
