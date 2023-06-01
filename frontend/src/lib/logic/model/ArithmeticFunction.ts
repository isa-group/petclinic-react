import { LogicNumber } from "./LogicValues";
import { NAryFunction, NAryFunctionOptions } from "./NAryFunction";
import { error, ResultValue, value } from "./ResultValue";
import { numberFunction } from "./util";

export enum ArithmeticOperator {
  PLUS,
  MINUS,
  MUL,
  DIV,
  MOD,
  POW,
}

class ArithmeticFunction implements NAryFunction<number> {
  left: NAryFunction<number>;
  right: NAryFunction<number>;
  op: ArithmeticOperator;

  constructor(
    left: NAryFunction<number>,
    right: NAryFunction<number>,
    operator: ArithmeticOperator
  ) {
    this.left = left;
    this.right = right;
    this.op = operator;
  }

  async eval(options?: NAryFunctionOptions): Promise<ResultValue<number>> {
    const lEval = await this.left.eval(options);
    const rEval = await this.right.eval(options);
    if (lEval.isError || rEval.isError) {
      return error(
        "Error evaluating Arithmetic Expression: " +
          lEval.errorMessage +
          " " +
          rEval.errorMessage
      );
    }

    const lVal = lEval.value;
    const rVal = rEval.value;

    let val;
    switch (this.op) {
      case ArithmeticOperator.PLUS:
        val = lVal + rVal;
        break;
      case ArithmeticOperator.MINUS:
        val = lVal - rVal;
        break;
      case ArithmeticOperator.MUL:
        val = lVal * rVal;
        break;
      case ArithmeticOperator.DIV:
        val = lVal / rVal;
        break;
      case ArithmeticOperator.MOD:
        val = lVal % rVal;
        break;
      case ArithmeticOperator.POW:
        val = Math.pow(lVal, rVal);
        break;
    }

    if (val === undefined) {
      return error(
        "Error evaluating Arithmetic Expression: Invalid arithmetic operator " +
          this.op
      );
    }
    return value(val);
  }

  equals(other: NAryFunction<any>): boolean {
    if (other instanceof ArithmeticFunction) {
      return (
        this.left.equals(other.left) &&
        this.right.equals(other.right) &&
        this.op === other.op
      );
    }
    return false;
  }
}

export function plus(
  left: LogicNumber,
  right: LogicNumber
): ArithmeticFunction {
  return numberFunction(
    left,
    right,
    (l, r) => new ArithmeticFunction(l, r, ArithmeticOperator.PLUS)
  );
}

export function minus(
  left: LogicNumber,
  right: LogicNumber
): ArithmeticFunction {
    return numberFunction(
        left,
        right,
        (l, r) => new ArithmeticFunction(l, r, ArithmeticOperator.MINUS)
      );
}

export function mul(
  left: LogicNumber,
  right: LogicNumber
): ArithmeticFunction {
    return numberFunction(
        left,
        right,
        (l, r) => new ArithmeticFunction(l, r, ArithmeticOperator.MUL)
      );
}

export function div(
  left: LogicNumber,
  right: LogicNumber
): ArithmeticFunction {
    return numberFunction(
        left,
        right,
        (l, r) => new ArithmeticFunction(l, r, ArithmeticOperator.DIV)
      );
}

export function mod(
  left: LogicNumber,
  right: LogicNumber
): ArithmeticFunction {
    return numberFunction(
        left,
        right,
        (l, r) => new ArithmeticFunction(l, r, ArithmeticOperator.MOD)
      );
}

export function pow(
  left: LogicNumber,
  right: LogicNumber
): ArithmeticFunction {
    return numberFunction(
        left,
        right,
        (l, r) => new ArithmeticFunction(l, r, ArithmeticOperator.POW)
      );
}
