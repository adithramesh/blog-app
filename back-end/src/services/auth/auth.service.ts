import { inject, injectable } from "inversify";
import { IAuthService } from "./auth.service.interface";
import mongoose from "mongoose";
import { IPasswordService } from "./password.service";
import jwt from "jsonwebtoken";
import { AuthRequestDTO, AuthResponseDTO } from "../../dto/auth.dto";
import { IAuthRepository } from "../../repositories/auth/auth.repository.interface";
import { TYPES } from "../../types/types";
import { HttpStatus } from "../../utils/http-status.enum";
import { config } from "../../config/env.config";


@injectable()
export class AuthService implements IAuthService{
    constructor(
        @inject(TYPES.IAuthRepository) private _authRepository: IAuthRepository,
        @inject(TYPES.IPasswordService) private _passwordService: IPasswordService
    ){ }


     async signup(signUpData: AuthRequestDTO): Promise<AuthResponseDTO> {
        const { username, phoneNumber, password } = signUpData;
     
        const existingPhone = await this._authRepository.findUserByPhone(phoneNumber);
        if (existingPhone) {
            return { success: false, message: "Phone number already exists", status: HttpStatus.BAD_REQUEST };
        }
        const hashedPassword = await this._passwordService.hash(password);
        const userModel: AuthRequestDTO = {
            username,
            phoneNumber,
            password: hashedPassword, 
        };
        const userId = await this._authRepository.createUser(userModel);
        console.log("user from repo", userId);
        
        
        return {
            success: true,
            message: "User created",
            context: "signup",
            status: HttpStatus.SUCCESS,
        };
    }


     async login(loginData: AuthRequestDTO): Promise<AuthResponseDTO> {
        const { phoneNumber, password } = loginData;
        const user = await this._authRepository.findUserByPhone(phoneNumber);
        if (!user) {
            return { success: false, message: "Phone number not found", status: HttpStatus.NOT_FOUND };
        }
 
        const storedPassword = user.password;
        console.log("storedPassword", storedPassword);
        
        const isPasswordVerified = await this._passwordService.verifyPassword(password, storedPassword);
        console.log("isPasswordVerified", isPasswordVerified);
        
        if (!isPasswordVerified) {
            return { success: false, message: "Invalid password", status: HttpStatus.UNAUTHORIZED };
        }
        const userId = (user._id as mongoose.Types.ObjectId).toString();
        const username =user.username
        const accessToken = jwt.sign({ id: userId, username}, config.JWT_SECRET, { expiresIn: "1h" });
        console.log("access_token",accessToken);
        
        return {
            success: true,
            message: "Login Successful",
            access_token: accessToken,
            data: { id: userId, username: user.username, phoneNumber: user.phoneNumber },
            status: HttpStatus.SUCCESS
        };
    }

}