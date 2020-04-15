import express from 'express';
import 'reflect-metadata';
import { useExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import bodyParser from 'body-parser';

import {PORT} from "./constants";
import {DBProvider} from "./db/db-provider";
import {AuthRouter} from "./auth/auth.router";
import {GithubReposRouter} from "./github-repos/github-repos.router";
import {ErrorHandler} from "./middlewares/error-handler";
import cors from 'cors';

(async () => {
  try {
    await Container.get(DBProvider).createInitialSchema();
    const app = express();
    const router = express.Router();
    app.use(cors());
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());
    app.use('/', router);
    useContainer(Container);
    useExpressServer(app, {
      defaultErrorHandler: false,
      routePrefix: "/api",
      controllers: [AuthRouter, GithubReposRouter],
      middlewares: [ErrorHandler]
    });
    app.listen( PORT, () => {
      console.log( `server started at http://localhost:${ PORT }` );
    } );
  }catch (e) {
    process.stdout.write(`Failed to start server: ${e}\n`);
    process.exit(1)
  }
})();
