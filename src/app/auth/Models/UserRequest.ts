export interface UserRequest {
    id: number;
    dni: string;
    name: string;
    email: string;
    password: string;
    address: string;
    phone: string;
    position: string;
    status: number;
}


export interface ChangePass {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}