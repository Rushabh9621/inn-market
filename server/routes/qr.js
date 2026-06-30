import express from "express";
import { getRoomQRCode } from "../controllers/qrController.js";

const router = express.Router();

router.get("/qr/room/:roomNumber", getRoomQRCode);

export default router;