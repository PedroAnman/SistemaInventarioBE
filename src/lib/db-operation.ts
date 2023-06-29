import { COLLECTIONS } from './../config/constants';
import { IPaginationOptions } from './../interfaces/pagination-options.interface';
import { Db } from 'mongodb';

/**
 * Obtener el ID que vamos a utilizar en el nuevo Documento
 * @param database Base de datos con la que estamos trabajando
 * @param collection Coleccion donde queremos buscar el ultimo elemento
 * @param Sort Como queremos ordenar { <propiedad>: -1}
 * */
export const asigDocumentId = async (
  database: Db,
  collection: string,
  sort: { registerDate: -1 }
) => {
  const lastElement = await database
    .collection(collection)
    .find()
    .limit(1)
    .sort(sort)
    .toArray();

  if (lastElement.length === 0 || lastElement[0] === undefined) {
    return '1';
  }
  return String(+lastElement[0].id + 1);
};

/**
 * Filtrar un docuemnto
 * @param database Base de datos con la que estamos trabajando
 * @param collection Coleccion donde queremos buscar el ultimo elemento
 * @param filter Como queremos filtrar { <propiedad> }
 * */
export const findOneElement = async (
  database: Db,
  collection: string,
  filter: object
) => {
  return await database.collection(collection).findOne(filter);
};

/**
 * Consultar documentos
 * @param database Base de datos con la que estamos trabajando
 * @param collection Coleccion donde queremos buscar el ultimo elemento
 * @param filter Como queremos filtrar { <propiedad> }
 * */
export const findElements = async (
  database: Db,
  collection: string,
  filter: object = {},
  paginationOptios: IPaginationOptions = {
    page: 1,
    pages: 1,
    itemsPage: -1,
    skip: 0,
    total: -1,
  },
  sort: {}
) => {
  if(paginationOptios.itemsPage === -1){
    return await database.collection(collection).find(filter).sort(sort).toArray();
  }
  return await database.collection(collection).find(filter)
                        .limit(paginationOptios.itemsPage)
                        .skip(paginationOptios.skip).sort(sort).toArray();
};

/**
 * Eliminar un docuemnto
 * @param database Base de datos con la que estamos trabajando
 * @param collection Coleccion donde queremos buscar el ultimo elemento
 * @param filter Como queremos filtrar { <propiedad> }
 * */
export const deleteOneElement = async (
  database: Db,
  collection: string,
  filter: object
) => {
  return await database.collection(collection).deleteOne(filter);
};

/**
 * Eliminar varios documentos
 * @param database Base de datos con la que estamos trabajando
 * @param collection Coleccion donde queremos buscar el ultimo elemento
 * @param filter Como queremos filtrar { <propiedad> }
 * */
 export const deleteManyElement = async (
  database: Db,
  collection: string,
  filter: object
) => {
  return await database.collection(collection).deleteMany(filter);
};

/**
 * Insertar un docuemnto
 * @param database Base de datos con la que estamos trabajando
 * @param collection Coleccion donde queremos buscar el ultimo elemento
 * @param document Objeto que se va a insertar
 * */
export const insertOneElement = async (
  database: Db,
  collection: string,
  document: object
) => {
  return await database.collection(collection).insertOne(document);
};

/**
 * Insertar varios documentos
 * @param database Base de datos con la que estamos trabajando
 * @param collection Coleccion donde queremos buscar el ultimo elemento
 * @param documents Array de los objetos que se van a insertar
 * */
export const insertManyElements = async (
  database: Db,
  collection: string,
  documents: Array<object>
) => {
  return await database.collection(collection).insertMany(documents);
};

/**
 * Actualizar un docuemnto
 * @param database Base de datos con la que estamos trabajando
 * @param collection Coleccion donde queremos buscar el ultimo elemento
 * @param filter ID del docuemnto que se va a actualizar
 * @param updateObject Objeto con los nuevos valores
 * */
export const updateOneElement = async (
  database: Db,
  collection: string,
  filter: object,
  updateObject: object,
  options: object = {}
) => {
  return await database
    .collection(collection)
    .updateOne(filter, { $set: updateObject }, options);
};

/**
 * Actualizar varios docuemntos
 * @param database Base de datos con la que estamos trabajando
 * @param collection Coleccion donde queremos buscar el ultimo elemento
 * @param filter ID del docuemnto que se va a actualizar
 * @param updateObject Objeto con los nuevos valores
 * */
export const updateManyElements = async (
  database: Db,
  collection: string,
  filter: object,
  updateObject: object,
  options: object = {}
) => {
  return database
    .collection(collection)
    .updateMany(filter, updateObject, options);
};

/**
 * Contar docuemntos de coleccion
 * @param database Base de datos con la que estamos trabajando
 * @param collection Coleccion donde queremos contar los documentos
 * */
export const countElements = async (
  database: Db,
  collection: string,
  filter: Object = {}
) => {
  return await database
    .collection(collection)
    .countDocuments(
      filter
    )
};

/**
 * Renombrar coleccion
 * @param database Base de datos con la que estamos trabajando
 * @param collection Coleccion a renombrar
 * */
export const renameCollection = async (
  database: Db,
  collection: string,
  newName: string
) => {
  return await database
    .collection(collection)
    .rename(newName);
};

/**
 * Eliminar coleccion
 * @param database Base de datos con la que estamos trabajando
 * @param collection Coleccion a eliminar
 * */
export const deleteCollection = async (
  database: Db,
  collection: string
) => {
  return await database
    .collection(collection).drop();
};

/**
 * listar docuemntos sin duplicidad de datos
 * @param database Base de datos con la que estamos trabajando
 * @param collection Coleccion donde queremos contar los documentos
 * */
export const distinctElements = async (
  database: Db,
  collection: string,
  key: string,
  filter: Object = {}
) => {
  return await database
    .collection(collection)
    .distinct(key, filter);
};

/**
 * Buscar texto en una coleccion
 * @param database Base de datos con la que estamos trabajando
 * @param collection Coleccion donde queremos contar los documentos
 * @param text Texto que se buscara
 * */
export const searchElements = async (
  database: Db,
  collection: string,
  aggregation: Object[]
) => {  
  return await database
    .collection(collection)
    .aggregate(aggregation);
};


