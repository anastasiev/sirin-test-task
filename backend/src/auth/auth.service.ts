import {Service} from "typedi";
import {User} from "../users/user.model";
import jwt from 'jsonwebtoken';

import { sha256 } from 'js-sha256';
import {SECRET} from "../constants";


@Service()
export class AuthService {
    public verify(user: User, receivedPassword: string): string {
        const { passwordHash } = user;
        const receivedHash = sha256(receivedPassword);
        if (passwordHash === receivedHash) {
            return this.getToken(user);
        }
        throw Error('Invalid password')
    }

    public getToken(user: User): string {
        const { id, email } = user;
        return jwt.sign({
            data: {id, email}
        }, SECRET, { expiresIn: '24h' });
    }
}