import { ErrorHandler, Injectable } from "@angular/core";


/**
 * This class use for handle error globally.
 * We can receive all error here and log it into server via API
 */
@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  handleError(error: any): void {
    //TODO: post it to server via API
    console.error('Error:', error);
  }
}
