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
    code: string;
    name: string;
    address: string;
    phone: string;
    position: string;
    department: string;
    status: number;
}
