import { Router } from "express";
import { CreateUserController } from "../controllers/createUserController.js";
import { validate } from "../middlewares/validate.js";
import { createPublicUserSchema } from "../schemas/user.schema.js";

const router = Router();
const controller = new CreateUserController();

router.post("/", validate(createPublicUserSchema), (req, res, next) =>
  controller.create(req, res).catch(next),
);

export default router;