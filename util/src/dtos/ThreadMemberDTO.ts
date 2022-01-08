import { Recipient } from "../entities";

export class ThreadMemberDTO {
	id: string;
	user_id: string;
	join_timestamp: string;
	flags: number;

	static from(recipient: Recipient) {
		const obj = new ThreadMemberDTO();

		obj.id = recipient.channel_id;
		obj.user_id = recipient.id;
		obj.join_timestamp = recipient.join_timestamp;
		obj.flags = 1;	// TODO, 1 seems to be default?

		return obj;
	}
}
