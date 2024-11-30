import { Collection } from "discord.js";
import { IEvent } from "../interfaces/IEvent";

export class EventRegistry {
    private events: Collection<string, IEvent>;

    constructor() {
        this.events = new Collection();
    }

    registerEvent(event: IEvent): void {
        this.events.set(event.name, event);
    }

    getEvent(name: string): IEvent | undefined {
        return this.events.get(name);
    }
}