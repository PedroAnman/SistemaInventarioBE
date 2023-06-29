import { Db } from 'mongodb';
import { IVariablesData } from './../interfaces/variables-data.interface';
import { IContextData } from './../interfaces/contex-data.interface';
import {
  findElements,
  findOneElement,
  insertOneElement,
  updateOneElement,
  updateManyElements,
  insertManyElements,
  deleteCollection,
  deleteOneElement,
  distinctElements,
  searchElements,
  deleteManyElement,
} from './../lib/db-operation';
import { pagination } from '../lib/pagination';

class ResolversOperationsServices {
  private root: object;
  private variables: IVariablesData;
  private context: IContextData;

  constructor(root: object, variables: IVariablesData, context: IContextData) {
    this.root = root;
    this.variables = variables;
    this.context = context;
  }

  protected getDB(): Db {
    return this.context.db!;
  }

  protected getVariables(): IVariablesData {
    return this.variables;
  }

  protected setVariables(val: Object) {
    this.variables = val;
  }

  protected getContext(): IContextData {
    return this.context;
  }

  //    Listar lnformacion
  protected async list(collection: string, listElement: string, page: number = 1, itemsPage: number = 20, filter: Object = {}, sort: Object = {}) {
    try {
      const paginatioData = await pagination(this.getDB(), collection, page, itemsPage, filter);
      return {
        info: {
          page: paginatioData.page,
          pages: paginatioData.pages,
          itemsPage: paginatioData.itemsPage,
          total: paginatioData.total
        },
        status: true,
        message: `Lista de ${listElement} cargada correctamente`,
        items: await findElements(this.getDB(), collection, filter, paginatioData, sort),
      };
    } catch (error) {
      return {
        info: null,
        status: false,
        message: `Error al cargar la lista de ${listElement}: ${error}`,
        items: null,
      };
    }
  }

  //    Listar lnformacion sin duplicidad de datos
  protected async listDistinct(collection: string, listElement: string, filter: Object = {}) {
      try {
        return {
          status: true,
          message: `Lista de ${listElement} cargada correctamente`,
          items: await distinctElements(this.getDB(), collection, listElement, filter),
        };
      } catch (error) {
        return {
          info: null,
          status: false,
          message: `Error al cargar la lista de ${listElement}: ${error}`,
          items: null,
        };
      }
  }

  //    Obtener detalles Item
  protected async get(collection: string, filter: object) {
    try {
      return await findOneElement(this.getDB(), collection, filter).then((result) => {
        if (result) {
          return {
            status: true,
            message: `Busqueda realizada exitosamente`,
            item: result,
          };
        }

        return {
          status: false,
          message: `Error en la busqueda, no existe ningun documento con ese valor`,
          item: null,
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Error en la busqueda del documento. ${error}`,
        item: null,
      };
    }
  }

  //    Añadir item
  protected async add(collection: string, document: object, item: string) {
    try {
      return await insertOneElement(this.getDB(), collection, document).then(
        (res) => {
          if (res.insertedId) {
            return {
              status: true,
              message: `Se ha insertado el elemento del ${item} correctamente`,
              item: document,
            };
          }
          return {
            status: false,
            message: `No se ha insertado el elemento del ${item}. Intentalo nuevamente`,
            item: null,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error al agregar el elemento del ${item}. ${error}`,
        item: null,
      };
    }
  }

    //    Añadir items
    protected async addMany(collections: string, document: object[], item: string) {
      try {
        return await insertManyElements(
          this.getDB(),
          collections,
          document
        ).then((res) => {
          if (res.insertedCount != 0) {
            return {
              status: true,
              message: `Se han insertado los ${item} correctamente en la coleccion ${collections}`,
              item: res.insertedCount,
            };
          }
          return {
            status: false,
            message: `Error al almacenar los ${item}. Intentalo nuevamente`,
            item: null,
          };
        });
      } catch (error) {
        return {
          status: false,
          message: `Error al almacenar los ${item}. ${error}`,
          item: null,
        };
      }
    }

  //    Modificar item
  protected async update(collection: string, filter: object, objectUpdate: object, item: string, options: object = {}) {
    try {
      return await updateOneElement(
        this.getDB(),
        collection,
        filter,
        objectUpdate,
        options
      ).then((res) => {
        if (res.upsertedId != null) {
          return {
            status: true,
            message: `Se ha registrado el ${item} correctamente`
          };
        }
        if (res.modifiedCount != 0) {
          return {
            status: true,
            message: `Se ha actualizado el ${item} correctamente`,
            item: Object.assign({}, filter, objectUpdate),
          };
        }
        return {
          status: true,
          message: `No se ha actualizado el ${item}, No hay valores que actualizar`,
          item: Object.assign({}, filter, objectUpdate),
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Error al actualizar el ${item}. ${error}`,
        item: null,
      };
    }
  }

  //    Modificar items
  protected async updateMany(collection: string, filter: object, objectUpdate: object, item: string, options: object = {}) {
    try {
      return await updateManyElements(
        this.getDB(),
        collection,
        filter,
        objectUpdate,
        options
      ).then((res) => {
        if (res.upsertedId != null) {
          return {
            status: true,
            message: `Se han registrado los ${item} correctamente`
          };
        }
        if (res.modifiedCount != 0) {
          return {
            status: true,
            message: `Se han actualizado los ${item} correctamente`,
            item: Object.assign({}, filter, objectUpdate),
          };
        }
        return {
          status: true,
          message: `No se ha actualizado el ${item}, No hay valores que actualizar`,
          item: Object.assign({}, filter, objectUpdate),
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Error al actualizar los ${item}. ${error}`,
        item: null,
      };
    }
  }

  //    Eliminar item
  protected async del(collection: string, filter: object, item: string){
    try {
      return await deleteOneElement(this.getDB(), collection, filter).then(
        res => {
          if(res.deletedCount === 1){
            return {
              status: true,
              message: `Elemento del ${item} eliminado correctamente`,
            };
          }
          return {
            status: false,
            message: `Error al eliminar ${item}, comprueba el filtro`,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error al almacenar los ${item}. ${error}`,
        item: null,
      };
    }
  }

  //    Eliminar items
  protected async delMany(collection: string, filter: object, item: string){
    try {
      return await deleteManyElement(this.getDB(), collection, filter).then(
        res => {
          if(res.acknowledged){
            return {
              status: true,
              message: `Elementos del ${item} eliminado correctamente`,
            };
          }
          return {
            status: false,
            message: `Error al eliminar los ${item}, comprueba el filtro`,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error al almacenar los ${item}. ${error}`,
        item: null,
      };
    }
  }

  //    Delete collection
  protected async deleteCollect(collections: string) {
    try {
      return await deleteCollection(this.getDB(), collections).then(
        res => {
            if(res){
                return {
                    status: true,
                    message: `Se elimino la colleccion ${collections} correctamente`,
                    item: 1,
                };
            }
          return {
            status: false,
            message: `Error al eliminar la colleccion ${collections}`,
            item: 0,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error al eliminar la colleccion ${collections}. ${error}`,
        item: 0,
      };
    }
  }

  //    Search
  protected async searchText(collection: string, aggregation: Object[]) {
    try {
      return (await searchElements(this.getDB(), collection, aggregation)).toArray().then(
        res => {
            if(res){
                return {
                    status: true,
                    message: `Lista de ${collection} cargada correctamente`,
                    items: res,
                };
            }
          return {
            status: false,
            message: `No existen productos con la busqueda ingresada`,
            items: null,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error al consultar la lista de ${collection}. ${error}`,
        items: null,
      };
    }
  }

}

export default ResolversOperationsServices;
