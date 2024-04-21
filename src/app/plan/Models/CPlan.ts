import { ReqPlan } from "./ResponsePlan"

export class CPlan {
    static planJSon(obj: ReqPlan) {
        return new CPlan(
            obj.id,
            obj.name,
            obj.download,
            obj.upload,
            obj.price,
            obj.guaranteed_speed,
            obj.priority,
            obj.burst_limit,
            obj.burst_threshold,
            obj.burst_time,
            obj.status
        );
    }

    constructor(public id: number,
        public name: string,
        public download: string,
        public upload: string,
        public price: number,
        public guaranteed_speed: string,
        public priority: string,
        public burst_limit: string,
        public burst_threshold: string,
        public burst_time: string,
        public status: number) {
    }
}