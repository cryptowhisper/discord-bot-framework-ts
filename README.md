# Discord Bot Framework TypeScript

Um framework robusto e tipado para criar bots do Discord em TypeScript de forma simples e organizada.

## Features

- Totalmente tipado com TypeScript
- Decorators para comandos
- Suporte a comandos tradicionais e Slash Commands
- Sistema de eventos modular
- Tratamento de erros embutido
- Estrutura organizada e escalável

## Instalação

```bash
npm install discord-bot-framework-ts
```

## Uso Básico

### Configuração Inicial

```typescript
// src/index.ts
import { Bot } from 'discord-bot-framework-ts';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Bot({
    token: process.env.DISCORD_TOKEN!,
    prefix: '!'
});

async function main() {
    await bot.loadCommands(join(__dirname, 'commands'));
    await bot.loadEvents(join(__dirname, 'events'));
    await bot.start();
}

main();
```

### Criando um Comando

```typescript
// src/commands/PingCommand.ts
import { Message } from 'discord.js';
import { BaseCommand, Command } from 'discord-bot-framework-ts';

@Command({
    name: 'ping',
    description: 'Responde com Pong!'
})
export default class PingCommand extends BaseCommand {
    async execute(message: Message, args: string[]): Promise<void> {
        await message.reply('Pong!');
    }
}
```

### Criando um Slash Command

```typescript
// src/commands/SlashPingCommand.ts
import { BaseSlashCommand, Command } from 'discord-bot-framework-ts';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

@Command({
    name: 'ping',
    description: 'Mostra a latência do bot'
})
export default class SlashPingCommand extends BaseSlashCommand {
    getData() {
        return new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Mostra a latência do bot');
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply('Pong!');
    }
}
```

### Criando um Evento

```typescript
// src/events/ReadyEvent.ts
import { BaseEvent } from 'discord-bot-framework-ts';
import { Client } from 'discord.js';

export default class ReadyEvent extends BaseEvent {
    constructor() {
        super('ready', true);
    }

    async execute(client: Client): Promise<void> {
        console.log(`Bot está online como ${client.user?.tag}`);
    }
}
```

## Estrutura de Pastas Recomendada

```
seu-bot/
├── src/
│   ├── commands/         # Comandos tradicionais e Slash Commands
│   ├── events/          # Eventos do bot
│   └── index.ts         # Arquivo principal
├── .env                 # Variáveis de ambiente
├── package.json
└── tsconfig.json
```

## Configuração Completa

1. Instale as dependências necessárias:
```bash
npm init -y
npm install discord-bot-framework-ts discord.js dotenv
npm install -D typescript @types/node ts-node
```

2. Configure o `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true
  }
}
```

3. Configure o `.env`:
```env
DISCORD_TOKEN=seu_token_aqui
CLIENT_ID=id_do_seu_bot
```

## Contribuindo

Contribuições são sempre bem-vindas. Por favor, siga os passos abaixo:

1. Faça o fork do projeto
2. Crie sua feature branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: alguma funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Suporte

Se você tiver alguma dúvida sobre o framework, sinta-se à vontade para abrir uma issue no GitHub.
