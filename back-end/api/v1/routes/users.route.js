import { Router } from "express";
import * as controller from "../../controller/client/user.controller.js";

const router = Router();

router.get("/", controller.index);

export const Userroute = router;
