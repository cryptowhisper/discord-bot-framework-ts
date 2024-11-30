import { IEvent } from "../interfaces/IEvent";

export abstract class BaseEvent implements IEvent {
    public name: string;
    public once: boolean;

    constructor(name: string, once = false) {
        this.name = name;
        this.once = once;
    }

    abstract execute(...args: any[]): Promise<void>;
}
