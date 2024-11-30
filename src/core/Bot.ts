import { Client, GatewayIntentBits, Interaction, Message } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { CommandRegistry } from '../services/CommandRegistry';
import { EventRegistry } from '../services/EventRegistry';
import { BaseCommand } from './BaseCommand';
import { BaseEvent } from './BaseEvent';

export class Bot {
    private client: Client;
    private commandRegistry: CommandRegistry;
    private eventRegistry: EventRegistry;
    private prefix: string;
    private token: string;

    constructor(options: { token: string; prefix: string }) {
        this.token = options.token;
        this.prefix = options.prefix;
        this.commandRegistry = new CommandRegistry();
        this.eventRegistry = new EventRegistry();

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ],
        });

        this.setupBaseEvents();
    }

    private setupBaseEvents(): void {
        this.client.on('messageCreate', this.handleMessage.bind(this));
        this.client.on('interactionCreate', this.handleInteraction.bind(this));
    }

    private async handleMessage(message: Message): Promise<void> {
        if (message.author.bot || !message.content.startsWith(this.prefix)) return;

        const args = message.content.slice(this.prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;

        const command = this.commandRegistry.getCommand(commandName);
        if (command) {
            try {
                await command.execute(message, args);
            } catch (error) {
                console.error(`Error executing command ${commandName}:`, error);
            }
        }
    }

    private async handleInteraction(interaction: Interaction): Promise<void> {
        if (!interaction.isCommand()) return;

        const command = this.commandRegistry.getSlashCommand(interaction.commandName);
        if (command) {
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing slash command ${interaction.commandName}:`, error);
            }
        }
    }

    public async loadCommands(commandsPath: string): Promise<void> {
        try {
            const files = readdirSync(commandsPath).filter(file => 
                file.endsWith('.ts') || file.endsWith('.js')
            );

            for (const file of files) {
                const commandModule = await import(join(commandsPath, file));
                const command = new commandModule.default();
                
                if (command instanceof BaseCommand) {
                    this.commandRegistry.registerCommand(command);
                    console.log(`Registered command: ${command.name}`);
                }
            }
        } catch (error) {
            console.error('Error loading commands:', error);
        }
    }

    
    public async loadEvents(eventsPath: string): Promise<void> {
        try {
            const files = readdirSync(eventsPath).filter(file => 
                file.endsWith('.ts') || file.endsWith('.js')
            );

            for (const file of files) {
                const eventModule = await import(join(eventsPath, file));
                const event = new eventModule.default();
                
                if (event instanceof BaseEvent) {
                    this.eventRegistry.registerEvent(event);
                    if (event.once) {
                        this.client.once(event.name, (...args) => event.execute(...args));
                    } else {
                        this.client.on(event.name, (...args) => event.execute(...args));
                    }
                    console.log(`Registered event: ${event.name}`);
                }
            }
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }

    public async start(): Promise<void> {
        try {
            await this.client.login(this.token);
            console.log('Bot is ready!');
        } catch (error) {
            console.error('Error starting bot:', error);
        }
    }
}