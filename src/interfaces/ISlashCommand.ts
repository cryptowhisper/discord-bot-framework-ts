import { Interaction } from "discord.js";

export interface ISlashCommand {
    name: string;
    description: string;
    execute: (interaction: Interaction) => Promise<void>;
}