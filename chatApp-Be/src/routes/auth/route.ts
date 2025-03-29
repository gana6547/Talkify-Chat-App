import express from "express";

import { checkAuth, login, logout, signup, updateProfile } from "../../controllers/auth/controlllers";
import { protectRoute } from "../../middleware/auth";

const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.put("/update-profile",protectRoute,updateProfile)
router.get("/check",protectRoute,checkAuth)

export default router;