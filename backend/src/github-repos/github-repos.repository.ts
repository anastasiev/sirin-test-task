import {DBProvider} from "../db/db-provider";

import {Service} from "typedi";
import {GithubRepo} from "./github.repo";
import {CurrentUser} from "../middlewares/current-user.model";
@Service()
export class GithubReposRepository {
    constructor(private readonly db: DBProvider) {}

    public async createRepo(user: CurrentUser, repo: GithubRepo): Promise<GithubRepo> {
        const knex = await this.db.createDbConnection();
        await knex.transaction(async trx => {
            const insertRepoSql = `insert into sirin.repos values(?,?,?,?,?,?,?,?)`;
            await trx.raw(insertRepoSql, [
                repo.id,
                repo.name,
                repo.owner,
                repo.url,
                repo.stars,
                repo.forks,
                repo.issues,
                repo.created
            ]);
            const insertRepoUserSql = `insert into sirin.users_repos values(?,?)`;
            await trx.raw(insertRepoUserSql, [
                repo.id,
                user.id
            ]);
        });
        return repo;
    }

    public async updateRepo(repo: GithubRepo): Promise<GithubRepo> {
        const knex = await this.db.createDbConnection();
        const insertRepoSql = `update sirin.repos 
                               set repo_name = ?, repo_owner = ?, repo_url = ?, stars = ?, forks = ?, issues = ?
                               where repo_id = ?`;
        await knex.raw(insertRepoSql, [
            repo.name,
            repo.owner,
            repo.url,
            repo.stars,
            repo.forks,
            repo.issues,
            repo.id
        ]);
        return repo;
    }
    public async deleteRepo(user: CurrentUser, repo: GithubRepo): Promise<GithubRepo> {
        const knex = await this.db.createDbConnection();
        await knex.transaction(async trx => {
            const deleteRepoSql = `delete from sirin.repos where repo_id=?`;
            await knex.raw(deleteRepoSql, [repo.id]);
            const deleteUsersRepoSql = `delete from sirin.users_repos where repo_id=? and user_id=?`;
            await trx.raw(deleteUsersRepoSql, [
                repo.id,
                user.id
            ]);
        });
        return repo;
    }

    public async getRepos(user: CurrentUser): Promise<GithubRepo[]> {
        const knex = await this.db.createDbConnection();
        const selectSql = `select * from sirin.repos repos inner join sirin.users_repos us_rep 
                           on repos.repo_id = us_rep.repo_id
                           where us_rep.user_id=?`;
        const { rows } = await knex.raw(selectSql, [user.id]);
        return rows.map((r: any) => ({
            id: r.repo_id,
            name: r.repo_name,
            owner: r.repo_owner,
            url: r.repo_url,
            stars: r.stars,
            forks: r.forks,
            issues: r.issues,
            created: r.created
        }))
    }

    public async getRepo(id: string): Promise<GithubRepo | null> {
        const knex = await this.db.createDbConnection();
        const selectSql = `select * from sirin.repos
                           where repo_id=?`;
        const { rows } = await knex.raw(selectSql, [id]);
        if (rows.length === 0) {
            return null;
        }
        const [r] = rows;
        return {
            id: r.repo_id,
            name: r.repo_name,
            owner: r.repo_owner,
            url: r.repo_url,
            stars: r.stars,
            forks: r.forks,
            issues: r.issues,
            created: r.created
        };
    }
}