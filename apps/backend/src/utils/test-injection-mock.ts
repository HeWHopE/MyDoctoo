import { InjectionToken } from '@nestjs/common';
import config from '../config/config';
import mail from '../config/mail';
import auth from '../config/auth';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

type MockFunction = (mm: ModuleMocker) => (token: InjectionToken) => any;

export const mockUndefined: MockFunction = moduleMocker => token => {
  if (typeof token === 'function') {
    const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
    const Mock = moduleMocker.generateFromMetadata(mockMetadata);
    return new Mock();
  }
};

export const mockConfigs: MockFunction = () => token => {
  if (typeof token === 'string' && [config.KEY, mail.KEY, auth.KEY].includes(token)) {
    return jest.fn().mockReturnValue({});
  }
};

export const pipe = (...fns: MockFunction[]) => {
  const moduleMocker = new ModuleMocker(global);
  return (token: InjectionToken) =>
    fns
      .map(fn => fn(moduleMocker)(token))
      .filter(Boolean)
      .at(0);
};
