import { Router } from "express";
import * as controller from "../../controller/client/posts.controller.js";

const router = Router();

router.get("/", controller.index);

export const Postroute = router;
