export const Roles = {
    ADMIN: "ADMIN",
    STAFF: "STAFF",
    USER: "USER",
};
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
};
export function hasPermission(role, permission) {
    const permissions = rolePermissions[role];
    return permissions.includes("*") || permissions.includes(permission);
}
