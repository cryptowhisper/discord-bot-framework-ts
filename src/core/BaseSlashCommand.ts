import { Interaction } from 'discord.js';
import { ISlashCommand } from '../interfaces/ISlashCommand';

export abstract class BaseSlashCommand implements ISlashCommand {
    public name: string;
    public description: string;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

    abstract execute(interaction: Interaction): Promise<void>;
}