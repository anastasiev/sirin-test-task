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
let connectionCount = 5;

(async () => {
  try {
    // try to connect to db 5 times, wait till db up and run in docker
    while (connectionCount) {
      try{
        await Container.get(DBProvider).createInitialSchema();
        break
      } catch (e) {
        console.log( `Cannot connect to db, ${connectionCount} attempts left` );
        await new Promise(resolve => setTimeout(resolve, 5000));
        connectionCount--;
      }
    }
    if(connectionCount === 0) {
      console.log(`Db server are not running...`);
      process.exit(1)
    }

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
    console.log(`Failed to start server: ${e}\n`);
    process.exit(1)
  }
})();
