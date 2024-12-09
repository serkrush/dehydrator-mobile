import 'reflect-metadata';
import {BaseEntity} from 'src/entities/BaseEntity';

export default function push(
    eventName: string,
): (target: object, propertyKey: string) => void {
    console.log("---")
    return (target: object, methodName: string): void => {
        const pushes: any = Reflect.getMetadata('pushes', BaseEntity) || [];
        pushes.push({
            className: target.constructor.name,
            methodName,
            eventName,
        });
        Reflect.defineMetadata('pushes', pushes, BaseEntity);
    };
}
