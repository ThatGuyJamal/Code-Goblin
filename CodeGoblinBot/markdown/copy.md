## Commands

```ts
/**
 *  Code Goblin - A discord bot for programmers.

 Copyright (C) 2022, ThatGuyJamal and contributors
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Affero General Public License for more details.
 */

import {ChatInputCommand, Command, RegisterBehavior} from '@sapphire/framework';
import {Time} from '@sapphire/duration';
import {ExtendedCommand, ExtendedCommandOptions} from '../command';
import {ApplyOptions} from '@sapphire/decorators';
import {getGuildIds} from '../utils/utils';

@ApplyOptions<ExtendedCommandOptions>({
    name: '',
    description: '',
    cooldownDelay: Time.Second * 5,
    enabled: true
})
export class NewCommand extends ExtendedCommand {
    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        return await interaction.reply({content: 'Not implemented!', ephemeral: true});
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

## Events

```ts
/**
 *  Code Goblin - A discord bot for programmers.

 Copyright (C) 2022, ThatGuyJamal and contributors
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Affero General Public License for more details.
 */
import {ApplyOptions} from '@sapphire/decorators';
import {Events, Listener, ListenerOptions} from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
    event: Events,
})
export class UserEvent extends Listener {
    public run() {
    }
}
```
