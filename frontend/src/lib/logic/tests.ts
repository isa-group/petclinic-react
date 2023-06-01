import { div, minus, mod, mul, plus, pow } from "./model/ArithmeticFunction";
import { and, iff, or } from "./model/BinaryLogicalPredicate";
import { eq, gt, gte, lt, lte, neq } from "./model/BinaryRelationalPredicate";
import constant from "./model/Constant";

// Test suite for BinaryLogicalPredicate
describe("BinaryLogicalPredicate", () => {
    describe("AND", () => {
        it("should return true if both arguments are true", () => {
            const a = constant(true);
            const b = constant(true);
            const c = and(a, b);
            expect(c.eval()).resolves.toEqual(true);
        });

        it("should return false if one argument is false", () => {
            const a = constant(true);
            const b = constant(false);
            const c = and(a, b);
            expect(c.eval()).resolves.toEqual(false);
        });

        it("should return false if both arguments are false", () => {
            const a = constant(false);
            const b = constant(false);
            const c = and(a, b);
            expect(c.eval()).resolves.toEqual(false);
        });
    });
    describe("OR", () => {
        it("should return true if one argument is true", () => {
            const a = constant(true);
            const b = constant(false);
            const c = or(a, b);
            expect(c.eval()).resolves.toEqual(true);
        });
    });

    describe("IFF", () => {
        it("should return true if both arguments are true", () => {
            const a = constant(true);
            const b = constant(true);
            const c = iff(a, b);
            expect(c.eval()).resolves.toEqual(true);
        });
    });

    describe("IMPLIES", () => {
        it("should return true if left argument is false", () => {
            const a = constant(false);
            const b = constant(true);
            const c = iff(a, b);
            expect(c.eval()).resolves.toEqual(true);
        });
    });
});

// Test suite for BinaryRelationalPredicate
describe("BinaryRelationalPredicate", () => {

    describe("LT", () => {
        it("should return true if left argument is less than right argument", () => {
            const a = constant(1);
            const b = constant(2);
            const c = lt(a, b);
            expect(c.eval()).resolves.toEqual(true);
        });
        it("should return false if left argument is greater than right argument", () => {
            const a = constant(2);
            const b = constant(1);
            const c = lt(a, b);
            expect(c.eval()).resolves.toEqual(false);
        });
        it("should return false if left argument is equal to right argument", () => {
            const a = constant(1);
            const b = constant(1);
            const c = lt(a, b);
            expect(c.eval()).resolves.toEqual(false);
        });
    });

    describe("LTE", () => {
        it("should return true if left argument is less than or equal to right argument", () => {
            const a = constant(1);
            const b = constant(2);
            const c = lte(a, b);
            expect(c.eval()).resolves.toEqual(true);
        });
        it("should return true if left argument is equal to right argument", () => {
            const a = constant(2);
            const b = constant(2);
            const c = lte(a, b);
            expect(c.eval()).resolves.toEqual(true);
        });
        it("should return false if left argument is greater than right argument", () => {
            const a = constant(2);
            const b = constant(1);
            const c = lte(a, b);
            expect(c.eval()).resolves.toEqual(false);
        });
    });

    describe("GT", () => {
        it("should return true if left argument is greater than right argument", () => {
            const a = constant(2);
            const b = constant(1);
            const c = gt(a, b);
            expect(c.eval()).resolves.toEqual(true);
        });
        it("should return false if left argument is less than or equal to right argument", () => {
            const a = constant(1);
            const b = constant(2);
            const c = gt(a, b);
            expect(c.eval()).resolves.toEqual(false);
        });
        it("should return false if left argument is equal to right argument", () => {
            const a = constant(2);
            const b = constant(2);
            const c = gt(a, b);
            expect(c.eval()).resolves.toEqual(false);
        });
    });

    describe("GTE", () => {
        it("should return true if left argument is greater than or equal to right argument", () => {
            const a = constant(2);
            const b = constant(1);
            const c = gte(a, b);
            expect(c.eval()).resolves.toEqual(true);
        });
        it("should return true if left argument is equal to right argument", () => {
            const a = constant(2);
            const b = constant(2);
            const c = gte(a, b);
            expect(c.eval()).resolves.toEqual(true);
        });
        it("should return false if left argument is less than right argument", () => {
            const a = constant(1);
            const b = constant(2);
            const c = gte(a, b);
            expect(c.eval()).resolves.toEqual(false);
        });
    });

    describe("EQ", () => {
        it("NUMBER COMPARISON. should return true if left argument is equal to right argument", () => {
            const a = constant(1);
            const b = constant(1);
            const c = eq(a, b);
            expect(c.eval()).resolves.toEqual(true);
        });
        it("NUMBER COMPARISON. should return false if left argument is not equal to right argument", () => {
            const a = constant(1);
            const b = constant(2);
            const c = eq(a, b);
            expect(c.eval()).resolves.toEqual(false);
        });

        // With strings
        it("STRING COMPARISON. should return true if left argument is equal to right argument", () => {
            const a = constant("a");
            const b = constant("a");
            const c = eq(a, b);
            expect(c.eval()).resolves.toEqual(true);
        });

        it("STRING COMPARISON. should return false if left argument is not equal to right argument", () => {
            const a = constant("a");
            const b = constant("b");
            const c = eq(a, b);
            expect(c.eval()).resolves.toEqual(false);
        });
    });

    describe("NOTEQ", () => {
        it("NUMBER COMPARISON. should return true if left argument is not equal to right argument", () => {
            const a = constant(1);
            const b = constant(2);
            const c = neq(a, b);
            expect(c.eval()).resolves.toEqual(true);
        });
        it("NUMBER COMPARISON. should return false if left argument is equal to right argument", () => {
            const a = constant(1);
            const b = constant(1);
            const c = neq(a, b);
            expect(c.eval()).resolves.toEqual(false);
        });

        // With strings
        it("STRING COMPARISON. should return true if left argument is not equal to right argument", () => {
            const a = constant("a");
            const b = constant("b");
            const c = neq(a, b);
            expect(c.eval()).resolves.toEqual(true);
        });

        it("STRING COMPARISON. should return false if left argument is equal to right argument", () => {
            const a = constant("a");
            const b = constant("a");
            const c = neq(a, b);
            expect(c.eval()).resolves.toEqual(false);
        });
    });    
});

describe("ArithmeticFunction", () => {
    describe("PLUS", () => {
        it("should return the sum of left and right argument", () => {
            const a = constant(1);
            const b = constant(2);
            const c = plus(a, b);
            expect(c.eval()).resolves.toEqual(3);
        });
    });

    describe("MINUS", () => {
        it("should return the difference of left and right argument", () => {
            const a = constant(2);
            const b = constant(1);
            const c = minus(a, b);
            expect(c.eval()).resolves.toEqual(1);
        });
    });

    describe("MULTIPLY", () => {
        it("should return the product of left and right argument", () => {
            const a = constant(2);
            const b = constant(3);
            const c = mul(a, b);
            expect(c.eval()).resolves.toEqual(6);
        });
    });

    describe("DIVIDE", () => {
        it("should return the quotient of left and right argument", () => {
            const a = constant(6);
            const b = constant(3);
            const c = div(a, b);
            expect(c.eval()).resolves.toEqual(2);
        });
    });

    describe("MODULO", () => {
        it("should return the remainder of left and right argument", () => {
            const a = constant(7);
            const b = constant(3);
            const c = mod(a, b);
            expect(c.eval()).resolves.toEqual(1);
        });
    });

    describe("POWER", () => {
        it("should return the power of left and right argument", () => {
            const a = constant(2);
            const b = constant(3);
            const c = pow(a, b);
            expect(c.eval()).resolves.toEqual(8);
        });
    });
});

