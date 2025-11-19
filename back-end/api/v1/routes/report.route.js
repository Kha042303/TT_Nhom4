import { Router } from "express";
import * as controller from "../../controller/client/report.controller.js";

const router = Router();

router.get("/", controller.index);

export const Reportroute = router;
