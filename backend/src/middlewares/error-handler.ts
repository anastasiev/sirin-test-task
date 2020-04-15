import {Middleware, ExpressErrorMiddlewareInterface, HttpError} from "routing-controllers";

@Middleware({ type: "after" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next: (err: any) => any) {
        if(error instanceof HttpError) {
            response.status(error.httpCode).send({message: error.message});
        } else {
            response.status(500).send({message: `Internal error: ${error}`});
        }
    }

}