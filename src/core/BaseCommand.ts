import { Message } from 'discord.js';
import { ICommand } from '../interfaces/ICommand';

export abstract class BaseCommand implements ICommand {
    public name: string;
    public description: string;

    constructor() {
        const options = Reflect.getMetadata('commandOptions', this.constructor);
        this.name = options?.name || this.constructor.name;
        this.description = options?.description || '';
    }

    abstract execute(message: Message, args: string[]): Promise<void>;
}