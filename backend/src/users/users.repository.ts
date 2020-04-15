import {Service} from "typedi";
import {DBProvider} from "../db/db-provider";
import {User} from "./user.model";
import { v4 as uuidv4 } from 'uuid';
import { sha256 } from 'js-sha256';

@Service()
export class UsersRepository {
    constructor(private readonly db: DBProvider) {}

    public async getUser(email: string): Promise<User | null> {
        const knex = await this.db.createDbConnection();
        const rawQuery = `select * from sirin.users where email=?`;
        const { rows } = await knex.raw(rawQuery, [email]);
        if (rows.length === 0) {
            return null;
        }
        const [user] = rows;
        return {
            id: user.user_id,
            email: user.email,
            passwordHash: user.password_hash
        }
    }

    public async createUser(email: string, password: string): Promise<User> {
        const knex = await this.db.createDbConnection();
        const rawQuery = `insert into sirin.users values(?,?,?)`;
        const userId = uuidv4();
        const passwordHash = sha256(password);
        await knex.raw(rawQuery, [userId, email, passwordHash]);
        return {
            id: userId,
            email,
            passwordHash
        }
    }
}

