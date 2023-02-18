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

import type { InternationalizationOptions, InternationalizationContext, TOptions } from '@sapphire/plugin-i18next';

export class il8n {
	public get parseInternationalizationOptions(): InternationalizationOptions {
		return {
			defaultName: 'en-US',
			defaultMissingKey: 'default:key_error',
			fetchLanguage: async (context: InternationalizationContext) => {
				if (!context.guild) return 'en-US';
				// todo - fetch language from database
				return 'en-US';
			},
			i18next: (_: string[], languages: string[]) => ({
				supportedLngs: languages,
				preload: languages,
				returnObjects: true,
				returnEmptyString: false,
				returnNull: false,
				load: 'all',
				lng: 'en-US',
				fallbackLng: 'en-US',
				defaultNS: 'globals',
				overloadTranslationOptionHandler: (args: any[]): TOptions => ({
					defaultValue: args[1] ?? 'globals:default'
				}),
				initImmediate: false
			})
		};
	}
}
