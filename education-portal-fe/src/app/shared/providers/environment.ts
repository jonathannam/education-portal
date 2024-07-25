import { createInjectionToken } from '../utils';

export interface EnvironmentConfig {
  apiUrl: string;
}

export const [injectEnvironment, provideEnvironment] =
  createInjectionToken<EnvironmentConfig>('Environment Config');
