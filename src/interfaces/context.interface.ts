export interface Icontext{
    req: IRequest;
    connection: IConnection;
}

interface IRequest{
    headers: {
        authorization: String;
    };
}

interface IConnection{
    authorization: String;
}