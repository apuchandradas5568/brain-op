import { Router } from "express";
import { getPosts } from "../controllers/posts.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = Router();


router.get("/", verifyToken, getPosts )


export default router

