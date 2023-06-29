import { IResolvers } from '@graphql-tools/utils';
import query from './query';
import mutation from './mutation';

const resolversQuery: IResolvers = {
    ...query,
    ...mutation
};

export default resolversQuery;