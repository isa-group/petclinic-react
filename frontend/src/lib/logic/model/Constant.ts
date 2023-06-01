import { NAryFunction } from "./NAryFunction";
import { ResultValue, value } from "./ResultValue";

export class Constant<T> implements NAryFunction<T> {
    value: T;

    constructor(value: T) {
        this.value = value;
    }

    async eval(): Promise<ResultValue<T>> {
        return value(this.value);
    }

    equals(other: NAryFunction<any>): boolean {
        return other instanceof Constant && this.value === other.value;
    }
}


export default function constant<T>(value: T): NAryFunction<T> {
    return new Constant(value);
}