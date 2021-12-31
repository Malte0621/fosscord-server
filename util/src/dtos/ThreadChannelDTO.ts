import { Channel } from "../entities"
import { ThreadMetadata } from "../interfaces";

export class ThreadChannelDTO {
	id: string;
	guild_id: string;
	type: number;
	name: string;
	last_message_id: string | null;
	last_pin_timestamp: number | undefined;
	rate_limit_per_user: number;
	owner_id: string;
	parent_id: string;
	message_count: number;
	member_count: number;
	thread_metadata: ThreadMetadata;

	static async from(channel: Channel) {
		const obj = new ThreadChannelDTO();
		obj.id = channel.id;
		obj.guild_id = channel.guild_id as string;
		obj.type = channel.type;
		obj.name = channel.name as string;
		obj.last_message_id = channel.last_message_id;
		obj.last_pin_timestamp = channel.last_pin_timestamp;
		obj.rate_limit_per_user = channel.rate_limit_per_user as number;
		obj.owner_id = channel.owner_id;
		obj.parent_id = channel.parent_id;

		if (!channel.messages) {
			//probably very slow and memory intensive for no reason
			var { messages } = await Channel.findOneOrFail(channel.id, { relations: ["messages"] });
			obj.message_count = Math.min(50, messages?.length || 0);
		}

		if (!channel.recipients) {
			var { recipients } = await Channel.findOneOrFail(channel.id, { relations: ["recipients"] });
			obj.member_count = Math.min(50, recipients?.length || 0);
		}

		return obj;
	}
}
