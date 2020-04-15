import {
    Body,
    Controller,
    Delete,
    Get,
    HttpError,
    Param,
    Post,
    Put,
    Req,
    UseBefore
} from "routing-controllers";
import {RepoRequest} from "../middlewares/repo-request.model";
import { jwtVerificationMiddleware } from "../middlewares/jwt.middlware";
import {GithubReposService} from "./github-repos.service";
import { v4 as uuidv4 } from 'uuid';
import {GithubRepo} from "./github.repo";
import {validatePayload} from "../utils/validation";
import * as Joi from "joi";

@Controller('/repos')
@UseBefore(jwtVerificationMiddleware)
export class GithubReposRouter {

    constructor(private readonly githubReposService: GithubReposService) {}

    @Post()
    public async createRepo(
        @Req() req: RepoRequest,
        @Body() body: {userName: string, repoName: string}
    ): Promise<GithubRepo>{
        validatePayload(
            body,
            Joi.object().keys({
                userName: Joi.string().required(),
                repoName: Joi.string().required(),
            })
        );
        const { userName,  repoName} = body;
        const fetchedRepo = await this.githubReposService.fetchGithubRepo(userName, repoName);
        const createdRepo = await this.githubReposService.createRepo(
            req.currentUser,
            {...fetchedRepo, id: uuidv4()}
        );
        return createdRepo;
    }

    @Get()
    public async getRepos(
        @Req() req: RepoRequest,
    ): Promise<GithubRepo[]>{
        const repos = await this.githubReposService.getRepos(
            req.currentUser
        );
        return repos;
    }

    @Put('/:id')
    public async updateRepo(
        @Param("id") id: string
    ): Promise<GithubRepo>{
        validatePayload(
            {id},
            Joi.object().keys({
                id: Joi.string().uuid({ version: 'uuidv4' })
            })
        );
        const repo = await this.githubReposService.getRepo(id);
        if (repo === null) {
            throw new HttpError(409, 'Repository not found');
        }
        const fetchedRepo = await this.githubReposService.fetchGithubRepo(repo.owner, repo.name);
        const updatedRepo = await this.githubReposService.updateRepo({...fetchedRepo, id});
        return updatedRepo;
    }

    @Delete('/:id')
    public async deleteRepo(
        @Req() req: RepoRequest,
        @Param("id") id: string
    ): Promise<GithubRepo>{
        validatePayload(
            {id},
            Joi.object().keys({
                id: Joi.string().uuid({ version: 'uuidv4' })
            })
        );
        const repo = await this.githubReposService.getRepo(id);
        if (repo === null) {
            throw new HttpError(409, 'Repository not found');
        }
        return await this.githubReposService.deleteRepo(req.currentUser, repo);
    }
}