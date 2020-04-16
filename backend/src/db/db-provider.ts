import Knex from 'knex';
import {Service} from "typedi";
import * as path from 'path';
import * as fs from 'fs';


@Service()
export class DBProvider {
    private readonly database: string;
    private readonly connectionString: string;
    private readonly migrationsFolder: string;
    constructor() {
        this.database = 'sirin';
        const username = process.env.DB_USERNAME || 'postgr';
        const password = process.env.DB_PASSWORD || 'postgr';
        this.connectionString = `postgres://${username}:${password}@db:5432`;
        this.migrationsFolder = path.resolve(__dirname, './migrations');
    }

    public async createDbConnection(): Promise<Knex> {
        return Knex({
            client: 'postgres',
            connection: `${this.connectionString}/${this.database}`,
            migrations: {
                directory: this.migrationsFolder,
                extension: 'ts'
            },
        });
    }

    private async tablesAlreadyInitialized(
        trxFinal: Knex
    ): Promise<boolean> {
        const rawQuery = `SELECT EXISTS (
      SELECT 1 as inited
      FROM   pg_catalog.pg_tables
      WHERE  schemaname = 'sirin'
      AND    tablename = 'users'
      )`;
        return (await trxFinal.raw(rawQuery)).rows[0].exists;
    }

    private async runInitialSchemaMigration(
        trxFinal: Knex | Knex.Transaction
    ): Promise<void> {
        const schemaFiles: string[] = fs
            .readdirSync(this.migrationsFolder)
            .filter(filename => filename.includes('.sql'));
        for (const filename of schemaFiles) {
            const filePath = path.join(this.migrationsFolder, filename);
            const fileContents = fs.readFileSync(filePath);
            await trxFinal.raw(fileContents.toString());
        }
    }

    public async createInitialSchema(): Promise<void> {
        const trxFinal = await this.createDbConnection();
        try {
            const tablesAlreadyInitialized = await this.tablesAlreadyInitialized(trxFinal);
            if (!tablesAlreadyInitialized) {
                await this.runInitialSchemaMigration(trxFinal);
            }
        } catch (err) {
            throw new Error(
                `Failed to create initial schema with error: ${err}`,
            );
        }
    }
}