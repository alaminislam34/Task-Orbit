export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
  meta?: PaginatedMeta;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    token: {
      accesssToken: string;
      refreshToken: string;
      sessionToken: string;
      expiresAt: string;
    };
    user: {
      name: string;
      email: string;
      emailVerified: boolean;
      image: string | null;
      createdAt: string;
      updatedAt: string;
      needPasswordChange: boolean;
      role: string;
      accountType: string;
      isDeleted: boolean;
      status: string;
      deletedAt: string | null;
      rememberMe: boolean;
      id: string;
    };
  };
}

/*
{
    "success": false,
    "statusCode": 401,
    "message": "Invalid email or password.",
    "requestId": "8c160ba6-5910-44b6-b1ef-0df83caa7f13",
    "errorSource": [
        {
            "path": "",
            "message": "Invalid email or password."
        }
    ],
    "stack": "Error: Invalid email or password.\n    at mapBetterAuthError (C:\\Users\\alami\\MD Al Amin Islam\\task-orbit-backend\\src\\app\\module\\auth\\auth.service.ts:225:10)\n    at Object.loginUser (C:\\Users\\alami\\MD Al Amin Islam\\task-orbit-backend\\src\\app\\module\\auth\\auth.service.ts:311:11)\n    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)\n    at async <anonymous> (C:\\Users\\alami\\MD Al Amin Islam\\task-orbit-backend\\src\\app\\module\\auth\\auth.controller.ts:31:18)"
}
**/

// this is my login error response 

export interface LoginErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  requestId: string;
  errorSource: {
    path: string;
    message: string;
  }[];
}

type USER_ROLE = "USER" | "ADMIN" | "SUPER_ADMIN";
type USER_ACCOUNT_TYPE = "SELLER" | "CLIENT" | "RECRUITER" | "JOB_SEEKER";

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    needPasswordChange: boolean;
    role: USER_ROLE;
    accountType: USER_ACCOUNT_TYPE;
    isDeleted: boolean;
    status: string;
    deletedAt: string | null;
    rememberMe: boolean;
    createdAt: string;
    updatedAt: string;
    jobSeeker: JobSeekerProfileResponse | null;
    admin: AdminProfileResponse | null;
  };
}

export interface JobSeekerProfileResponse {
  id: string;
  userId: string;
  resumeUrl: string;
  portfolioUrl: string;
  bio: string;
  skills: string[];
  experience: string[];
  education: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfileResponse {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
