export function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.auth) {
            return res.status(401).json({
                success: false,
                code: "UNAUTHORIZED",
                message: "Você precisa estar logado para acessar este recurso.",
            });
        }
        if (!allowedRoles.includes(req.auth.role)) {
            return res.status(403).json({
                success: false,
                code: "FORBIDDEN",
                message: "Você não tem permissão para realizar esta ação.",
            });
        }
        return next();
    };
}
