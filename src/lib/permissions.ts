import type { UserRole } from "../types/auth.js";

export const Roles = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  USER: "USER",
} as const satisfies Record<string, UserRole>;

export const rolePermissions = {
  ADMIN: ["*"],
  STAFF: [
    "produtos:read",
    "produtos:write",
    "categorias:read",
    "categorias:write",
    "turmas:read",
    "turmas:write",
    "inscricoes:read",
    "inscricoes:write",
    "ingressos:read",
    "ingressos:write",
    "estoque:write",
    "dashboard:read",
  ],
  USER: ["perfil:self", "ingressos:self", "inscricoes:self", "checkout:self"],
} as const satisfies Record<UserRole, readonly string[]>;

export function hasPermission(role: UserRole, permission: string) {
  const permissions = rolePermissions[role] as readonly string[];
  return permissions.includes("*") || permissions.includes(permission);
}
