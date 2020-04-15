import {Service} from "typedi";
import {User} from "./user.model";
import {UsersRepository} from "./users.repository";

@Service()
export class UsersService {
    constructor(private readonly userRepository: UsersRepository) {}

    public async getUser(email: string): Promise<User | null> {
        return this.userRepository.getUser(email)
    }

    public async createUser(email: string, password: string): Promise<User> {
       return this.userRepository.createUser(email, password);
    }
}
