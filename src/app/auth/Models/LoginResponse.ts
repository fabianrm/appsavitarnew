// export interface LoginResponse {
//     message: string;
//     token: string;
//     user: any;
// }


export interface LoginResponse {
    message: string;
    token: string;
    user: User;
    errors: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role[];
}

export interface Role {
    id: number;
    name: string;
}
