
export interface LoginResponse {
    token: string;
    refreshToken: string;
    userId: string;
    name: string;
    roles: string[];
    accessTokenExpiry: string;

}
