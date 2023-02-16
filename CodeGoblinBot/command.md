```ts
import { ChatInputCommand, Command, RegisterBehavior } from '@sapphire/framework';
import { isMessageInstance } from '@sapphire/discord.js-utilities';
import { getGuildIds } from '../utils/utils';
import { Time } from '@sapphire/duration';

export class ICommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: '',
			description: '',
			requiredClientPermissions: ['SendMessages', 'EmbedLinks'],
			preconditions: ['GuildOnly'],
			cooldownLimit: 1,
			cooldownDelay: Time.Second * 5
		});
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
			guildIds: getGuildIds(),
			registerCommandIfMissing: true,
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			idHints: []
		});
	}
}

```