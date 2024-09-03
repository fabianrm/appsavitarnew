export interface UserResponse {
    data: User[];
    total: number;
}

export interface UserSingleResponse {
    data: User;
    total: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
}
