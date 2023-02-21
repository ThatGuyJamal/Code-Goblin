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
		container.logger.debug('OpenAI API Wrapper initialized');
	}
}
