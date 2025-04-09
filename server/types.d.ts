declare module 'connect-mongodb-session' {
  import { Store } from 'express-session';
  
  function connectMongoDBSession(session: any): {
    new (options: {
      uri: string;
      collection?: string;
      expires?: number;
      idField?: string;
      [key: string]: any;
    }): Store;
  };
  
  export = connectMongoDBSession;
}