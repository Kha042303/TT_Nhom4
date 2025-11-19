import { Router } from "express";
import * as controller from "../../controller/client/chat.controller.js";

const router = Router();

router.get("/", controller.index);

export const Chatroute = router;
