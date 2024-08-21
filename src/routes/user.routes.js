import { Router } from "express";
import {registerUser , loginUser , logoutUser , refreshAccesstoken , changeCurrentUserPassword , getCurrentUser
    , updateAccountDetails} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT ,logoutUser)
router.route("/refresh-token").post(refreshAccesstoken)
router.route("/current-user").get(verifyJWT , getCurrentUser)
router.route("/update-account").patch(verifyJWT , updateAccountDetails)
router.route("/change-password").post(verifyJWT , changeCurrentUserPassword)

export default router;