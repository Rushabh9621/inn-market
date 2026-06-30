import express from "express";
import {
  createRoom,
  getRooms,
  updateRoom,
} from "../controllers/roomController.js";

const router = express.Router();

router.get("/rooms", getRooms);
router.post("/rooms", createRoom);
router.put("/rooms/:id", updateRoom);

export default router;