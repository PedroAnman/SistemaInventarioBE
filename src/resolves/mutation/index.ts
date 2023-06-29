import resolversProductMutation from './product';

const GMR = require('@wiicamp/graphql-merge-resolvers');
 
const mutationResolvers = GMR.merge([
    resolversProductMutation,
]);

export default mutationResolvers;