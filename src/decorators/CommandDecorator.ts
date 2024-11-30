import 'reflect-metadata';

export function Command(options: { name: string; description: string }) {
    return function (target: any) {
        Reflect.defineMetadata('commandOptions', options, target);
    };
}