


export interface AuthRequestDTO {
    username?: string;
    phoneNumber: string; 
    password: string;
}


export interface AuthResponseDTO {
    success: boolean;
    data?: {
        id: string; 
        username:string;
        phoneNumber:string;
    };
    message: string;
    access_token?: string;
    context?:"signup" | "login";
    status: number;
}