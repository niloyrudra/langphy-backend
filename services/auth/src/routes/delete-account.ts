import { Router } from "express";
import { body } from "express-validator";
import { validateAuth } from "../middlewares/validate-auth.js";
import { deleteController } from "../controllers/delete.controller.js";

const router = Router();

router.post(
  "/api/users/delete",
  [
    body("userId")
      .trim()
      .notEmpty()
      .withMessage("User ID must be supplied")
  ],
  validateAuth,
  deleteController
);

export { router as deleteAccountRouter };