import { Router } from "express";
// import type { Request, Response } from "express";
import { signoutController } from "../controllers/signout.controller.js";

const router = Router();

router.post("/api/users/signout", signoutController);

export { router as signOutRouter };

// router.post("/api/users/signout", (req: Request, res: Response) => {
//   // If you were using cookies, you'd clear them here.
//   // Since you're using JWTs sent to the client,
//   // signout is handled client-side by deleting the token.

//   res.status(200).send({
//     message: "Sign out successful",
//     token: null
//   });

// });

