import { logger } from '../config/logger';
const { MongoClient } = require('mongodb');


class Database{
    async init(){
        try {
            const MONGO_DB = process.env.DATABASE;
            const client = await MongoClient.connect(
                MONGO_DB,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }
            );

            const db = client.db('ShopDB');

            logger(__filename, true,'=================DATABASE=================');
            logger(__filename, true,`STATUS: ONLINE`);
            logger(__filename, true,`DATABASE: ${db.databaseName}`);
 
            return db;
            
        } catch (error) {
            logger(__filename, false,'=================DATABASE=================');
            logger(__filename, false,`STATUS: 'OFFLINE'`);
            logger(__filename, false,`STATUS: ${error}`);
        }
        
    }
    
}

export default Database;