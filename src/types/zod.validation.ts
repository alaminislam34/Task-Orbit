import { z } from "zod";
import { AccountType } from "./state.types";

export const sellerSignUpSchema = z
    .object({
        name: z.string().min(2, "Full name is required"),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Please confirm your password"),
        accountType: z.nativeEnum(AccountType),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const clientSignUpSchema = z
    .object({
        name: z.string().min(2, "Full name is required"),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Please confirm your password"),
        accountType: z.nativeEnum(AccountType),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const SignInSchema = z
    .object({
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    }); 