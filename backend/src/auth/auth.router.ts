import * as Joi from 'joi';
import {AuthService} from "./auth.service";
import {Controller, Get, Post, Req, Body, UnauthorizedError, OnUndefined, HttpError} from 'routing-controllers';
import { Container } from 'typedi';
import {UsersService} from "../users/user.service";
import {validatePayload} from "../utils/validation";

@Controller()
export class AuthRouter {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService
    ) {}

    private validate(body: {email: string, password: string}) {
        validatePayload(
            body,
            Joi.object().keys({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
            })
        );
    }

    @Post('/login')
    public async login(
          @Body() body: {email: string, password: string}
    ){
        this.validate(body);
        const {email, password} = body;
        const user = await this.userService.getUser(email);
        if (user === null) {
            throw new UnauthorizedError('Invalid credentials')
        }
        try{
            const token = this.authService.verify(user, password);
            const {id, email} = user;
            return {user: {id, email}, token};
        } catch {
            throw new UnauthorizedError('Invalid credentials');
        }
    }

    @Post('/signup')
    public async signup(
        @Body() body: {email: string, password: string}
    ){
        this.validate(body);
        const {email, password} = body;
        const user = await this.userService.getUser(email);
        if (user !== null) {
            throw new HttpError(409, 'User has already exist')
        }
        const createdUser = await this.userService.createUser(email, password);
        const token = this.authService.getToken(createdUser);
        return {user: {id: createdUser.id, email}, token};
    }
}