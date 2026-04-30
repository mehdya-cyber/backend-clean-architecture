import express from "express";
import { createUserRouter } from "./user.routes";
import { createItemRouter } from "./item.routes";
import { createAuthRouter } from "./auth.routes";

export const router = express.Router();

router.use("/auth", createAuthRouter());
router.use("/users", createUserRouter());
router.use("/items", createItemRouter());
