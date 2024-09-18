import { Role } from "../../../auth/role/Models/RoleResponse";

export interface EmployeeResponse {
    data: Employee[];
    total: number;
}

export interface EmployeeSingleResponse {
    data: Employee;
    total: number;
}

export interface Employee {
    id: number;
    dni: string;
    name: string;
    address: string;
    phone: string;
    position: string;
    role: Role[];
    status: number;
}
