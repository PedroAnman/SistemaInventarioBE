import { IResolvers } from '@graphql-tools/utils';
import ProductServices from '../../services/products.service';

const resolversProductsQuery: IResolvers = {
  Query: {
    async searchproducts(_, {text, itemsPage}, { db }) {
      return new ProductServices(_, {
        text, 
        pagination: {
          itemsPage
        }
      }, { db }).searchitems();
    },
    async products(
      _,
      {
        codigoBarras, 
        descripcion,
        categoria, 
        page, 
        itemsPage
      },
      context
    ) {
      return new ProductServices(
        _,
        {
          product: {
            codigoBarras, 
            descripcion,
            categoria,
          },
          pagination: {
            page,
            itemsPage,
          },
        },
        context
      ).items();
    },
    async product(_, { codigoBarras }, { db }) {
      return new ProductServices(_, { product: { codigoBarras } }, { db }).details();
    },
  },
};

export default resolversProductsQuery;
