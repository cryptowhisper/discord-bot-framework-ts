export interface IEvent {
    name: string;
    once?: boolean;
    execute: (...args: any[]) => Promise<void>;
}