export function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        if (!result.success) {
            return res.status(400).json({
                success: false,
                code: "VALIDATION_ERROR",
                message: "Os dados enviados são inválidos.",
                errors: result.error.flatten(),
            });
        }
        req.body = result.data.body;
        req.params = result.data.params;
        req.query = result.data.query;
        return next();
    };
}
