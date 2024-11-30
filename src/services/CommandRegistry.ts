import { Collection } from 'discord.js';
import { ICommand } from '../interfaces/ICommand';
import { ISlashCommand } from '../interfaces/ISlashCommand';

export class CommandRegistry {
    private commands: Collection<string, ICommand>;
    private slashCommands: Collection<string, ISlashCommand>;

    constructor() {
        this.commands = new Collection();
        this.slashCommands = new Collection();
    }

    registerCommand(command: ICommand): void {
        this.commands.set(command.name, command);
    }

    registerSlashCommand(command: ISlashCommand): void {
        this.slashCommands.set(command.name, command);
    }

    getCommand(name: string): ICommand | undefined {
        return this.commands.get(name);
    }

    getSlashCommand(name: string): ISlashCommand | undefined {
        return this.slashCommands.get(name);
    }
}
