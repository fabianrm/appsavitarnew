import { ReqCustomer, Type } from "./ResponseCustomer";

export class CCustomer {
    static customerJSon(obj: ReqCustomer) {
        return new CCustomer(
            obj.id,
            obj.type,
            obj.document_number,
            obj.client_code,
            obj.name,
            obj.address,
            obj.phone_number,
            obj.email,
            obj.status,
            obj.updated_at

        );
    }

    constructor(
        public id: number,
        public type: Type,
        public document_number: string,
        public client_code: string,
        public name: string,
        public address: string,
        public phone_number: string,
        public email: string,
        public status: number,
        public updated_at: Date,

    ) {
        
    }
}