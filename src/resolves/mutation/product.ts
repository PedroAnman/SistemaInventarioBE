import { IResolvers } from '@graphql-tools/utils';
import ProductServices from '../../services/products.service';

const resolversProductMutation: IResolvers = {
  Mutation: {
    async addProducto(_, { product }, context) {
      return new ProductServices(_, { product }, context).register();
    },
    async modifyProducto(_, { product }, context) {
      return new ProductServices(_, { product }, context).modify();
    },
  },
};

export default resolversProductMutation;