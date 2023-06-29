import { COLLECTIONS } from './../config/constants';
import { IContextData } from './../interfaces/contex-data.interface';
import ResolversOperationsServices from './resolvers-operations.service';
import { logger } from '../config/logger';

class ProductServices extends ResolversOperationsServices {
  collection = COLLECTIONS.PRODUCTS;
  
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  // Registrar Producto
  async register() {
    //Comprobar que el producto no existe
    let product = this.getVariables().product;

    if (product == null) {
        return {
          status: false,
          message: 'Parametros de entrada incorrectos',
          product: null,
        };
    }

    const filter = { codigoBarras: product?.codigoBarras };
    const productCheck = await this.get(this.collection, filter);
    if (productCheck.status) {
      return {
        status: false,
        message: `El producto ${product?.codigoBarras} ya se encuentra registrado, ingresar uno nuevo`,
        product: null,
      };
    }

    logger(__filename, true, `INICIO :: register() => ${JSON.stringify(filter)}`);

    //Guardar el documento(registro) en la coleccion
    const result = await this.add(this.collection, product || {}, 'producto');
    logger(__filename, result.status, result.message);
    return {
        status: result.status,
        message: result.message,
        user: result.item,
      };
  }

  // Actualizar o agregar Producto
  async modify() {
    let product = this.getVariables().product;
    const filter = { codigoBarras: product?.codigoBarras };
    
    logger(__filename, true, `INICIO :: modify() => ${JSON.stringify(product)}`);
    
    const result = await this.update(this.collection, filter, product || {}, 'producto');
    logger(__filename, result.status, result.message);

    return {
        status: result.status,
        message: result.message,
        product: result.item
    };
  }

  // Buscador productos
  async searchitems() {
    let text = this.getVariables().text;
    let itemsPage = this.getVariables().pagination?.itemsPage;
    
    logger(__filename, true, `INICIO :: searchitems() => ${text}`);

    if(!text){
      return {
        status: false,
        message: 'Texto para buscar vacio',
        products: [],
      };
    }
    
    var aggregation;
    var x = text.trim().split(' ');
    var regex = '^(?=.*' + x.join(')(?=.*') + ')';
    var options = {
      '$regex': regex,
      '$options': 'is'
    };
    
    aggregation = [
      {
        $match: {
            $or: [
                { 'codigoBarras': options },
                { 'descripcion': options },
                { 'departamento': options },
                { 'linea': options },
                { 'categoria': options },
            ],
        }
      },
      {
        $sort : { descripcion: 1 } 
      },
      {
        $limit: itemsPage
      }
    ];
    
    let result = await this.searchText(this.collection, aggregation);
    logger(__filename, result.status, result.message);

    return {
      info: {
        page: 1,
        total: result.items?.length,
        itemsPage: result.items?.length,
        pages: 1
      },
      status: result.status,
      message: result.message,
      products: result.items,
    };
  }

  // Lista de productos
  async items() {
    const page = this.getVariables().pagination?.page;
    var itemsPage = this.getVariables().pagination?.itemsPage;
    const codigoBarras = this.getVariables().product?.codigoBarras;
    const descripcion = this.getVariables().product?.descripcion;
    const categoria = this.getVariables().product?.categoria;
    const filter: any = {};

    if(codigoBarras){
      filter.codigoBarras = codigoBarras;
    }
    if(descripcion){
      filter.descripcion = descripcion;
    }
    if(categoria){
      filter.categoria = categoria;
    }

    logger(__filename, true, `INICIO :: items() => ${JSON.stringify(filter)}`);

    const result = await this.list(this.collection, 'productos', page, itemsPage, filter);

    logger(__filename, result.status, result.message);

    return {
      info: result.info,
      status: result.status,
      message: result.message,
      products: result.items,
    };
  }

  // Detalle de un producto
  async details() {    
    const filter = { codigoBarras: this.getVariables().product?.codigoBarras };
    logger(__filename, true, `INICIO :: details() => ${JSON.stringify(filter)}`);
    const result = await this.get(this.collection, filter);
    
    logger(__filename, result.status, result.message);
    
    return {
      status: result.status,
      message: result.message,
      product: result.item,
    };
  }
  
  
}
export default ProductServices; 
