import { Request } from 'express';
import {CurrentUser} from "./current-user.model";

/**
 * We add request context to the req object. Use this AepRequest instead of Request
 * in router components, so that strict type checking works.
 */
export interface RepoRequest extends Request {
    currentUser: CurrentUser;
}
