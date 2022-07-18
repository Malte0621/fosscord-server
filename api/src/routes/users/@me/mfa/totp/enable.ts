import { Router, Request, Response } from "express";
import { Guild, Member, User, generateToken } from "@fosscord/util";
import { route } from "@fosscord/api";
import bcrypt from "bcrypt";
import { HTTPError } from "lambert-server";
import { verifyToken } from 'node-2fa'

const router = Router();

router.post("/", route({}), async (req: Request, res: Response) => {
	const user = await User.findOneOrFail({ where: { id: req.user_id }, select: ["data"] }); //User object
	let correctpass = true;

	if (user.data.hash) {
		// guest accounts can delete accounts without password
		correctpass = await bcrypt.compare(req.body.password, user.data.hash);
		if (!correctpass) {
			throw new HTTPError(req.t("auth:login.INVALID_PASSWORD"));
		}
	}

	if (correctpass) {
		if(!req.body.secret)
			throw new HTTPError(req.t("auth:login.INVALID_TOTP_SECRET"), 60005);
		else if(!req.body.code) 
			throw new HTTPError(req.t("auth:login.INVALID_TOTP_CODE"), 60008);
		else if (verifyToken(req.body.secret, req.body.code)?.delta != 0)
			throw new HTTPError(req.t("auth:login.INVALID_TOTP_CODE"), 60008);
		else {
			user.mfa_enabled = true;
			user.totp_secret = req.body.secret;
			let backup_tokens: string[] = ["fuck","this","shit","i","hate","all","of","it"];
			/*for (let i = 0; i < 10; i++) {
				for (let i = 0; i < 10; i++) {
				
				}
			}*/
			res.send({
				token: generateToken(user.id),
				backup_codes: backup_tokens
			})
		}
		
	} else {
		res.sendStatus(401);
	}
});

export default router;
