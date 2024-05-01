import { ReqBox } from "./ResponseBox"

export class CBox {
    static boxJSon(obj: ReqBox) {
        return new CBox(
            obj.id,
            obj.name,
            obj.city,
            obj.address,
            obj.reference,
            obj.total_ports,
            obj.available_ports,
            obj.status
        );
    }

    constructor(public id: number,
        public city: string,
        public name: string,
        public address: string,
        public reference: string,
        public total_ports: number,
        public available_ports: number,
        public status: number) {
    }
}