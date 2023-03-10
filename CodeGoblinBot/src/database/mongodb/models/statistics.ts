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
import { getModelForClass, ModelOptions, prop, ReturnModelType } from '@typegoose/typegoose';
import { container } from '@sapphire/framework';
import { configValues } from '../../../config';

@ModelOptions({
	schemaOptions: {
		collection: 'global-statistics',
		timestamps: true,
		autoIndex: true
	}
})
class Statistics {
	@prop({ type: String })
	find_id?: string;

	@prop({ type: Number })
	guilds_joined?: number;

	@prop({ type: Number })
	guilds_left?: number;

	@prop({ type: Number })
	commands_executed?: number;

	@prop({ type: Number })
	commands_failed?: number;

	public static async GetGlobalStats(this: ReturnModelType<typeof Statistics>): Promise<Statistics | null> {
		container.logger.debug('[Statistics] Getting global statistics.');
		return this.findOne({ find_id: 'global' });
	}

	public static async UpdateGuildsJoined(this: ReturnModelType<typeof Statistics>) {
		if (configValues.IsInDevelopmentMode) return;
		await this.updateOne(
			{ find_id: 'global' },
			{ $inc: { guilds_joined: 1 } },
			{
				upsert: true,
				new: true
			}
		).then((res) => {
			container.logger.debug(`[Statistics] Updated guilds joined!`, res);
		});
	}

	public static async UpdateGuildsLeft(this: ReturnModelType<typeof Statistics>) {
		if (configValues.IsInDevelopmentMode) return;
		await this.updateOne(
			{ find_id: 'global' },
			{ $inc: { guilds_left: 1 } },
			{
				upsert: true,
				new: true
			}
		).then((res) => {
			container.logger.debug(`[Statistics] Updated guilds left!`, res);
		});
	}

	public static async UpdateCommandsExecuted(this: ReturnModelType<typeof Statistics>) {
		if (configValues.IsInDevelopmentMode) return;
		await this.updateOne(
			{ find_id: 'global' },
			{ $inc: { commands_executed: 1 } },
			{
				upsert: true,
				new: true
			}
		).then((res) => {
			container.logger.debug(`[Statistics] Updated Commands executed!`, res);
		});
	}

	public static async UpdateCommandsFailed(this: ReturnModelType<typeof Statistics>) {
		if (configValues.IsInDevelopmentMode) return;
		await this.updateOne(
			{ find_id: 'global' },
			{ $inc: { commands_failed: 1 } },
			{
				upsert: true,
				new: true
			}
		).then((res) => {
			container.logger.debug(`[Statistics] Updated Commands failed!`, res);
		});
	}
}

export const GlobalStatsModel = getModelForClass(Statistics);
