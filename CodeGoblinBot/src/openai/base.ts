import { container } from '@sapphire/framework';
import { OpenAIApi, Configuration } from 'openai';

/**
 * The OpenAI Wrapper class
 * @class
 * @see https://beta.openai.com/docs/api-reference/images
 */
export class OpenAIWrapper {
	public api: OpenAIApi;
	public constructor(configuration: Configuration) {
		this.api = new OpenAIApi(configuration);
		container.logger.info('OpenAI API Wrapper initialized');
	}
}
