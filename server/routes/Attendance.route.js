import express from 'express';
import { HandleSaveAttendance, HandleGetAttendanceByDate } from '../controllers/Attendance.controller.js';
import { VerifyhHRToken } from '../middlewares/Auth.middleware.js';

const router = express.Router();

router.post('/', VerifyhHRToken, HandleSaveAttendance);

router.get('/', VerifyhHRToken, HandleGetAttendanceByDate);

export default router;
