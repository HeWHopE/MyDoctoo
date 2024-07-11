import { registerDecorator, ValidationOptions } from 'class-validator';

export function PurePath(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'PurePath',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return !value.startsWith('/') && !value.endsWith('/');
        },
        defaultMessage() {
          return `${propertyName} should not start or end with a slash.`;
        },
      },
    });
  };
}
