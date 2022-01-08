import { Channel, ChannelType, Message } from "@fosscord/util";
import { Router, Request, Response } from "express";
import { route } from "@fosscord/api";
const router = Router();

/*
POST request with payload:

{
	name: "this is a test thread",
	type: 11 || 12,	//12 is private
	auto_archive_duration: 1440,
	location: "Message" || "Plus Button"
}

gives output:

{
	"id": "891762881639612458",
	"guild_id": "230222182763069440",
	"parent_id": "230222182763069440",
	"owner_id": "226230010132824066",
	"type": 11,
	"name": "this is a test thread",
	"last_message_id": "925694654115086367",
	"thread_metadata": {
		"archived": false,
		"archive_timestamp": "2021-12-29T10:20:04.088513+00:00",
		"auto_archive_duration": 1440,
		"locked": false
	},
	"message_count": 0,
	"member_count": 1,
	"rate_limit_per_user": 0,
	"member_ids_preview": ["226230010132824066"]
}
*/

export interface ThreadCreationSchema {
	name?: string,
	type?: ChannelType,
	auto_archive_duration?: number,
	location?: "Message" | "Plus Button",
}

router.post("/", route({ body: "ThreadCreationSchema", permission: ["USE_PUBLIC_THREADS"] }), async (req: Request, res: Response) => {
	const { message_id, channel_id } = req.params;
	const body = req.body as ThreadCreationSchema;

	const parent = await Channel.findOneOrFail({ id: channel_id });
	const message = await Message.findOneOrFail({ id: message_id }, { relations: ["author"] });

	const channel = await Channel.createThread(
		{	//channel
			...body,
			parent_id: channel_id,
			owner_id: req.user_id,
			guild_id: parent.guild_id,
			id: message_id,
		},
		message,
		{	//opts
			keepId: true,
		}
	);

	res.status(201).json(channel);
});

export default router;
