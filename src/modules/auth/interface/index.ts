export interface IAuthUseCase {
    Login(email: string, password: string): Promise<any>;
    // Logout(): Promise<any>
    Register(name: string, password: string, email: string): Promise<any>;
}