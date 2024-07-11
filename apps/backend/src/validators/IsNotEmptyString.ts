import { ValidationArguments, ValidationOptions, isNotEmpty, isString, registerDecorator } from 'class-validator';

export function IsNotEmptyString(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsNotEmptyString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => isString(value) && isNotEmpty(value.trim()),
        defaultMessage: (validationArguments?: ValidationArguments): string => {
          const property = validationArguments?.property ?? 'Property';

          return `${property} should not be an empty string.`;
        },
      },
    });
  };
}
