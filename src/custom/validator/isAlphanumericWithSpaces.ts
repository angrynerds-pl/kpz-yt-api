import {registerDecorator, Validator, ValidationOptions} from "class-validator"

export function IsAlphanumericWithSpaces() {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isAlphanumericWithSpaces",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [], 
            options: { message: propertyName + " can only contains letters, numbers and no more than one space in a row" } as ValidationOptions,
            validator: {
                validate(value: any) : boolean {
                    const localValidator = new Validator();
                    return typeof value === "string" &&
                            value.split(' ').every((str) => localValidator.isAlphanumeric(str));
                }
            }
        })
    }
}