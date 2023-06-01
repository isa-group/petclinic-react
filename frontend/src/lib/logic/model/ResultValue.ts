// export interface ResultValue<T> {
//     value?: T;
//     isError: boolean;
//     errorMessage?: string;
// }

export type ResultValue<T> = {
    value: T;
    isError: false;
    errorMessage?: undefined;
} | {
    value?: undefined;
    isError: true;
    errorMessage: string;
};

export function error(message: string): ResultValue<never> {
    return {
        isError: true,
        errorMessage: message
    };
}

export function value<T>(value: T): ResultValue<T> {
    return {
        value: value,
        isError: false
    };
}