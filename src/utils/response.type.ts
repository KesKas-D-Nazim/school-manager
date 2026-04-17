import z, { ZodError } from "zod"
import { $ZodErrorTree } from "zod/v4/core"

interface SuccessResponse<T> {
    success: true,
    message: string,
    data: T
}

enum ErrorTypes {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    HTTP_ERROR = 'HTTP_ERROR',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}

interface ErrorResponse {
    success: false,
}

type ValidationErrorResponse = ErrorResponse & {
    errorType: ErrorTypes.VALIDATION_ERROR,
    issues: string[]
}

type HTTPErrorResponse = ErrorResponse & {
    errorType: ErrorTypes.HTTP_ERROR,
    message: string
}

type InternalServerErrorResponse = ErrorResponse & {
    errorType: ErrorTypes.INTERNAL_SERVER_ERROR,
    message: string
}

interface Pagination {
    totalCount: number,
    totalPages: number
}

interface PaginatedSuccessResponse<T> {
    success: true,
    message: string,
    data: T,
    pagination: Pagination
}

export type APIResponse<T> = SuccessResponse<T> | ValidationErrorResponse | HTTPErrorResponse | InternalServerErrorResponse

export type PaginatedAPIResponse<T> = PaginatedSuccessResponse<T> | ErrorResponse

export function successResponse<T>(data: T, message: string = "Success"): APIResponse<T> {
    return {
        success: true,
        message,
        data
    }
}


export function validationErrorResponse<T>(error: ZodError): APIResponse<T> {
    return {
        success: false,
        errorType: ErrorTypes.VALIDATION_ERROR,
        issues: z.treeifyError(error).errors
    }
}

export function internalServerErrorResponse<T>(): APIResponse<T> {
    return {
        success: false,
        errorType: ErrorTypes.INTERNAL_SERVER_ERROR,
        message: "Something went wrong on the server."
    }
}

export function httpExceptionResponse<T>(message: string): APIResponse<T> {
    return {
        success: false,
        errorType: ErrorTypes.HTTP_ERROR,
        message
    }
}

export function paginatedSuccessResponse<T>(data: T, pagination: Pagination, message: string = "Success"): PaginatedSuccessResponse<T> {
    return {
        success: true,
        message,
        data,
        pagination
    }
}

// export function paginatedErrorResponse<T>(error: string): PaginatedAPIResponse<T> {
//     return {
//         success: false,
//         error
//     }
// }
