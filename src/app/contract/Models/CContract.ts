import {  ResContract } from "./ContractResponse"

export class CContract {
    static contractJSon(obj: ResContract) {
        return new CContract(
            obj.id,
            obj.customer_name,
            obj.router_ip,
            obj.plan_name,
            obj.box_name,
            obj.port_number,
            obj.registration_date,
            obj.billing_date,
            obj.recurrent,
            obj.due_date,
            obj.address_instalation,
            obj.city,
            obj.latitude,
            obj.longitude,
            obj.is_active,
            obj.status
        );
    }

    constructor(

        public id: string,
        public router_ip: string,
        public customer_name: string,
        public plan_name: string,
        public box_name: string,
        public port_number: string,
        public registration_date: Date,
        public billing_date: string,
        public recurrent: number,
        public due_date: string,
        public address_instalation: string,
        public city: string,
        public latitude: string,
        public longitude: string,
        public is_active: string,
        public status: number

    ) {
    }
}