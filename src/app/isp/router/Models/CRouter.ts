import { ReqRouter } from "./ResponseRouter";

export class CRouter {
    constructor(public id: number,
        public ip: string,
        public usuario: string,
        public password: string,
        public port: string,
        public api_connection: string,
        public status: number) { }
    
    static boxJSon(obj: ReqRouter) {
        return new CRouter(
            obj.id,
            obj.ip,
            obj.usuario,
            obj.password,
            obj.port,
            obj.api_connection,
            obj.status
        );
    }
}