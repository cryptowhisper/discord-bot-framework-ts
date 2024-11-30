import { Client, Message, Interaction, GatewayIntentBits, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { BaseCommand } from './BaseCommand';
import { BaseSlashCommand } from './BaseSlashCommand';
import { BaseEvent } from './BaseEvent';

export class Bot {
    private client: Client;
    private commands: Collection<string, BaseCommand>;
    private slashCommands: Collection<string, BaseSlashCommand>;
    private prefix: string;
    private token: string;

    constructor(options: { token: string; prefix: string }) {
        this.token = options.token;
        this.prefix = options.prefix;
        this.commands = new Collection();
        this.slashCommands = new Collection();

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ],
        });

        this.setupHandlers();
    }

    private setupHandlers(): void {
        this.client.on('messageCreate', async (message: Message) => {
            if (message.author.bot || !message.content.startsWith(this.prefix)) return;

            const args = message.content.slice(this.prefix.length).trim().split(/ +/);
            const commandName = args.shift()?.toLowerCase();

            if (!commandName) return;

            try {
                const command = this.commands.get(commandName);
                if (command) {
                    await command.execute(message, args);
                }
            } catch (error) {
                console.error('Erro ao executar comando:', error);
                await message.reply('Ocorreu um erro ao executar este comando.');
            }
        });

        this.client.on('interactionCreate', async (interaction: Interaction) => {
            if (!interaction.isChatInputCommand()) return;

            try {
                const command = this.slashCommands.get(interaction.commandName);
                if (!command) return;

                await command.execute(interaction);
            } catch (error) {
                console.error('Erro ao executar slash command:', error);
                
                const reply = {
                    content: 'Ocorreu um erro ao executar este comando.',
                    ephemeral: true
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.editReply(reply);
                } else {
                    await interaction.reply(reply);
                }
            }
        });

        this.client.once('ready', () => {
            console.log(`Bot está online como ${this.client.user?.tag}`);
        });
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
                    this.commands.set(command.name, command);
                    console.log(`Comando carregado: ${command.name}`);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar comandos:', error);
        }
    }

    public getClient(): Client {
        return this.client;
    }

    public async start(): Promise<void> {
        try {
            await this.client.login(this.token);
        } catch (error) {
            console.error('Erro ao iniciar o bot:', error);
            throw error;
        }
    }
}