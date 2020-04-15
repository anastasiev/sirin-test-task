import {GithubReposRepository} from "./github-repos.repository";
import axios from 'axios';
import {Service} from "typedi";
import {GITHUB_API_URL} from "../constants";
import {GithubRepo} from "./github.repo";
import {HttpError} from "routing-controllers";
import {CurrentUser} from "../middlewares/current-user.model";

@Service()
export class GithubReposService {
    constructor(private readonly githubReposRepository: GithubReposRepository) {}

    public async fetchGithubRepo(username: string, repoName: string): Promise<GithubRepo> {
        try {
            const {data} = await axios.get(`${GITHUB_API_URL}${encodeURIComponent(username)}/${encodeURIComponent(repoName)}`);
            return {
                id: '',
                name: data.name,
                owner: data.owner.login,
                url: data.html_url,
                stars: data.stargazers_count,
                forks: data.forks_count,
                issues: data.open_issues_count,
                created: new Date(data.created_at)
            }
        } catch {
            throw new HttpError(409, 'Repository not found')
        }
    }

    public async createRepo(user: CurrentUser, repo: GithubRepo): Promise<GithubRepo> {
        return this.githubReposRepository.createRepo(user, repo);
    }

    public async updateRepo(repo: GithubRepo): Promise<GithubRepo> {
        return this.githubReposRepository.updateRepo(repo);
    }

    public async deleteRepo(user: CurrentUser, repo: GithubRepo): Promise<GithubRepo> {
        return this.githubReposRepository.deleteRepo(user, repo);
    }

    public async getRepos(user: CurrentUser): Promise<GithubRepo[]> {
        return this.githubReposRepository.getRepos(user);
    }

    public async getRepo(id: string): Promise<GithubRepo> {
        return this.githubReposRepository.getRepo(id);
    }
}