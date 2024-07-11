import axiosInstance from "../libs/axiosInstance";

interface LoginData {
    email: string;
    password: string;
    otp?: string;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    wallet_address: string;
}

export const register = async (data: RegisterData) => {
    try {
        const response = await axiosInstance.post("/auth/register", data);
        return response.data;
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to register. Please try again.' };
    }
}

export const login = async (data: LoginData) => {
    try {
        const response = await axiosInstance.post("/auth/login", data);
        return response.data;
    } catch (error) {
        return  { status: 'ERROR', message: 'Failed to login. Please check your credentials.' };
    }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const me = async (token: any) => {
    try {
        const response = await axiosInstance.get("/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to fetch user data.' };
    }
}

export const sendOtp = async (email: string) => {
    try {
        const response = await axiosInstance.post("/auth/send-otp", { email });
        return response.data;
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to send OTP. Please try again.' };
    }
}

export const verifyOtp = async (email: string, otp: string) => {
    try {
        const response = await axiosInstance.post("auth/verify-otp", { email, otp });
        return response.data;
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to verify OTP. Please try again.' };
    }
}

export const forgotPassword = async (email: string) => {
    try {
        const response = await axiosInstance.post("/auth/forgot-password", { email });
        return response.data;
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to send password reset email. Please try again.' };
    }
}

export const resetPassword = async (email: string, password: string, otp: string) => {
    try {
        const response = await axiosInstance.post("/auth/reset-password", { email, password, otp });
        return response.data;
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to reset password. Please try again.' };
    }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const generateTwoFactorAuth = async (token: any) => {
    try {
        const response = await axiosInstance.post("/twofa/generate", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to generate 2FA secret. Please try again.' };
    }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const validateTwoFactorAuth = async (tfaToken: string, token: any) => {
    try {
        const response = await axiosInstance.post("/twofa/validate", tfaToken, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        } );
        return response.data;
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to validate 2FA token. Please try again.' };
    }
}