import { Schema } from 'joi';
import {HttpError} from "routing-controllers";
export const validatePayload = (obj: object, schema: Schema) => {
    const result = schema.validate(obj);
    if(result.error) {
        throw new HttpError(400, result.error.message)
    }
};