import express from 'express';
import cors from 'cors';
import compression from 'compression';
import environments from './config/enviroments';
import schema from './schema';
import expressPlayground from 'graphql-playground-middleware-express';
import Database from './lib/database';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { Icontext } from './interfaces/context.interface';
import { logger } from './config/logger';

//Configuracion de las variables de entorno(Lectura)
if(process.env.NODE_ENV !== 'production'){
    const env = environments;
}

init();

async function init() {
    const app = express();
    app.use(cors());
    app.use(compression());

    const database = new Database();
    const db = await database.init();

    const context = async({ req, connection}: Icontext) => {
        const token = (req) ? req.headers.authorization : connection.authorization;
        return { db, token};
    };

    const server = new ApolloServer({
        schema,
        introspection: true,
        context
    });

    server.start().then(() => {
        server.applyMiddleware({app});

        app.get('/', expressPlayground({
            endpoint: '/graphql'
        }));

        const httpServer = createServer(app);
        const PORT = process.env.PORT || 2087;
        httpServer.listen(
            {
            port: PORT
            },
            () => {
                logger(__filename, true,'=================SERVER API GRAPHQL=================');
                logger(__filename, true,`STATUS ::: ONLINE`);
                logger(__filename, true,`MESSAGE ::: API MEANG - Online Shop Start :::`);
                console.log(`MESSAGE ::: API MEANG - Online Shop Start :::`);
            }
        );
    });
}


