import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

export function validate(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
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
    req.params = result.data.params as Request["params"];
    req.query = result.data.query as Request["query"];

    return next();
  };
}