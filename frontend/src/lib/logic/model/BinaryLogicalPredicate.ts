import { LogicBoolean } from "./LogicValues";
import { NAryFunction, NAryFunctionOptions } from "./NAryFunction";
import { error, ResultValue, value } from "./ResultValue";
import { booleanFunction } from "./util";

export enum BinaryLogicalOperator {
  AND,
  OR,
  IFF,
  IMPLIES,
}

class BinaryLogicalPredicate implements NAryFunction<boolean> {
  left: NAryFunction<boolean>;
  right: NAryFunction<boolean>;
  op: BinaryLogicalOperator;

  constructor(
    left: NAryFunction<boolean>,
    right: NAryFunction<boolean>,
    operator: BinaryLogicalOperator
  ) {
    this.left = left;
    this.right = right;
    this.op = operator;
  }

  async eval(options?: NAryFunctionOptions): Promise<ResultValue<boolean>> {
    const lEval = await this.left.eval(options);
    const rEval = await this.right.eval(options);
    if (lEval.isError || rEval.isError) {
      return error(
        "Error evaluating Boolean Expression: " +
          lEval.errorMessage +
          " " +
          rEval.errorMessage
      );
    }

    const lVal = lEval.value;
    const rVal = rEval.value;

    let val;
    switch (this.op) {
      case BinaryLogicalOperator.AND:
        val = lVal && rVal;
        break;
      case BinaryLogicalOperator.OR:
        val = lVal || rVal;
        break;
      case BinaryLogicalOperator.IFF:
        val = lVal === rVal;
        break;
      case BinaryLogicalOperator.IMPLIES:
        val = !lVal || rVal;
        break;
    }
    if (val === undefined) {
      return error(
        "Error evaluating Boolean Expression: Invalid Operator " + this.op
      );
    }
    return value(val);
  }

  equals(other: NAryFunction<any>): boolean {
    if (other instanceof BinaryLogicalPredicate) {
      return (
        this.left.equals(other.left) &&
        this.right.equals(other.right) &&
        this.op === other.op
      );
    }
    return false;
  }
}

export function and(
  left: LogicBoolean,
  right: LogicBoolean
): BinaryLogicalPredicate {
  return booleanFunction(
    left,
    right,
    (l, r) => new BinaryLogicalPredicate(l, r, BinaryLogicalOperator.AND)
  );
}

export function or(
  left:LogicBoolean,
  right: LogicBoolean
): BinaryLogicalPredicate {
  return booleanFunction(
    left,
    right,
    (l, r) => new BinaryLogicalPredicate(l, r, BinaryLogicalOperator.OR)
  );
}

export function implies(
  left: LogicBoolean,
  right: LogicBoolean
): BinaryLogicalPredicate {
  return booleanFunction(
    left,
    right,
    (l, r) =>
      new BinaryLogicalPredicate(l, r, BinaryLogicalOperator.IMPLIES)
  );
}

export function iff(
  left: LogicBoolean,
  right: LogicBoolean
): BinaryLogicalPredicate {
  return booleanFunction(
    left,
    right,
    (l, r) => new BinaryLogicalPredicate(l, r, BinaryLogicalOperator.IFF)
  );
}
