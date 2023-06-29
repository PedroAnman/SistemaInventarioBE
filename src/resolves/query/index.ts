import resolversProductsQuery from './product';

const GMR = require('@wiicamp/graphql-merge-resolvers');
 
const queryResolvers = GMR.merge([
    resolversProductsQuery,
]);

export default queryResolvers;