import { EmbedBuilder } from '@oceanicjs/builders';
import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'oceanic.js';
import { CreateCommand } from '../cmd/command.js';
import { isCanary } from '../config/config.js';

export default CreateCommand({
	trigger: 'embed-generate',
	description: `Manage embed plugin`,
	type: ApplicationCommandTypes.CHAT_INPUT,
	requiredBotPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
	requiredUserPermissions: ['SEND_MESSAGES'],
	options: (opt) => {
        opt.setName('embed-generate')
			.setDescription('Generate an embed')

			.addOption('title', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('title').setDescription('The title of the embed');
			})
			.addOption('description', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('description').setDescription('The description of the embed');
			})
			.addOption('color', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('color').setDescription('The color of the embed');
			})
			.addOption('footer', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('footer').setDescription('The footer of the embed');
			})
			.addOption('thumbnail', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('thumbnail').setDescription('The thumbnail of the embed');
			})
			.addOption('image', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('image').setDescription('The image of the embed');
			})
			.addOption('author', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('author').setDescription('The author of the embed');
			})
			.addOption('url', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('url').setDescription('The url of the embed');
			})
			.addOption('timestamp', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('timestamp').setDescription('The timestamp of the embed. Type "true" to enable')
			})
			.addOption('field-1-name', ApplicationCommandOptionTypes.STRING, (option) => {
				option.setName('name').setDescription('The field 1 name of the embed');
			})
			.addOption('field-1-value', ApplicationCommandOptionTypes.STRING, (option) => {
                option.setName('value').setDescription('The field 1 value of the embed');
            })
            .addOption('field-2-name', ApplicationCommandOptionTypes.STRING, (option) => {
                option.setName('name').setDescription('The field 2 name of the embed');
            })
            .addOption('field-2-value', ApplicationCommandOptionTypes.STRING, (option) => {
                option.setName('value').setDescription('The field 2 value of the embed');
            })
    },
	register: isCanary ? 'guild' : 'global',
	run: async (_instance, interaction) => {
        const title = interaction.data.options.getString('title');
        const description = interaction.data.options.getString('description');
        const color = interaction.data.options.getString('color');
        const footer = interaction.data.options.getString('footer');
        const thumbnail = interaction.data.options.getString('thumbnail');
        const image = interaction.data.options.getString('image');
        const author = interaction.data.options.getString('author');
        const url = interaction.data.options.getString('url');
        const timestamp = interaction.data.options.getString('timestamp');
        const field1name = interaction.data.options.getString('field-1-name');
        const field1value = interaction.data.options.getString('field-1-value');
        const field2name = interaction.data.options.getString('field-2-name');
        const field2value = interaction.data.options.getString('field-2-value');

        const embed = new EmbedBuilder()

        if (title) embed.setTitle(title);
        if (description) embed.setDescription(description);
        if (color) embed.setColor(Number(color));
        if (footer) embed.setFooter(footer);
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (image) embed.setImage(image);
        if (author) embed.setAuthor(author);
        if (url) embed.setURL(url);
        if (timestamp) embed.setTimestamp(Date.now().toString());
        if (field1name && field1value) embed.addField(field1name, field1value);
        if (field2name && field2value) embed.addField(field2name, field2value);

        await interaction.createMessage({ embeds: [embed.toJSON()] });
    }
});
