import { type Middleware } from '@reduxjs/toolkit';

export const logger: Middleware = api => next => action => {
  if (__DEV__)
    console.log('[Action]', (action as any).type, (action as any).payload);
  const result = next(action);
  if (__DEV__) console.log('[Auth next]', (api.getState() as any)?.auth);
  return result;
}; 

