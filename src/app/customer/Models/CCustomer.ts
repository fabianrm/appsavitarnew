import { ReqCustomer, Type } from "./ResponseCustomer";

export class CCustomer {
    static customerJSon(obj: ReqCustomer) {
        return new CCustomer(
            obj.id,
            obj.type,
            obj.document_number,
            obj.name,
            obj.address,
            obj.phone_number,
            obj.email,
            obj.status
        );
    }

    constructor(
        public id: number,
        public type: Type,
        public document_number: string,
        public name: string,
        public address: string,
        public phone_number: string,
        public email: string,
        public status: number,
    ) {
        
    }
}