import { IErrorMessage } from './error-message-interface';

export interface IResponse<T = any> {
  success: boolean;
  result: T | IErrorMessage;
}
