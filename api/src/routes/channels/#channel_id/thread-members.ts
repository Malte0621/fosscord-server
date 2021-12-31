import { Router, Request, Response } from "express";
import { route } from "@fosscord/api";
const router = Router();


router.post("/", route({  }), async (req: Request, res: Response) => {

})

export default router;
