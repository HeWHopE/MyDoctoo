import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export const validate = <T extends object>(schema: ClassConstructor<T>) => {
  const validatedConfig = plainToInstance(schema, process.env, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });

  const errors = validateSync(validatedConfig);
  if (errors.length > 0) throw new Error(errors.toString());

  return validatedConfig;
};
