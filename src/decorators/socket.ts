import 'reflect-metadata';
import { BaseEntity } from 'src/entities/BaseEntity';

export default function socket(): (
    target: any,
    propertyKey?: string | undefined,
) => void {
    return (target: any, propertyKey?: string | undefined): void => {
        const sockets: any = Reflect.getMetadata('sockets', BaseEntity) || [];
        sockets.push({ entityName: target.prototype.constructor.name });
        Reflect.defineMetadata('sockets', sockets, BaseEntity);
    };
}
