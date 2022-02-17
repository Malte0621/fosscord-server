import { Request, Response, Router } from "express";
import { route } from "@fosscord/api";

const router: Router = Router();

router.get("/", route({}), async (req: Request, res: Response) => {
	//TODO
	res.send([]).status(200);
});

export default router;
