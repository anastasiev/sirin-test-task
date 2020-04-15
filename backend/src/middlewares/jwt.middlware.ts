import {Service} from "typedi";
import jwt from 'jsonwebtoken';
import {HEADER_TOKEN, SECRET} from "../constants";
import {CurrentUser} from "./current-user.model";

export const jwtVerificationMiddleware = (req: any, res: any, next: any) => {
    const token = req.headers[HEADER_TOKEN];
    if (!token) {
        return res.status(403).send({auth: false, message: 'No token provided.'});
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.currentUser = (decoded as any).data;
        return next();
    }catch (e) {
        return res.status(403).send({auth: false, message: 'Invalid token'});
    }
};
