import express from 'express'
import { HandleAllHR, HandleDeleteHR, HandleHR, HandleUpdateHR, HandleMyProfile } from '../controllers/HR.controller.js'
import { VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'

const router = express.Router()

router.get("/me", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleMyProfile);

router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllHR)

router.get("/:HRID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleHR)

router.patch("/update-HR", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleUpdateHR)

router.delete("/delete-HR/:HRID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteHR)


// router.get("/me/test", HandleMyProfile);


export default router