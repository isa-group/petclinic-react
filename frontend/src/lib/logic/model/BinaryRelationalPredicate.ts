import { AttributeValue } from "../../components/feature/FeatureRetriever";
import { LogicAttributeValue, LogicNumber } from "./LogicValues";
import { NAryFunction, NAryFunctionOptions } from "./NAryFunction";
import { error, ResultValue, value } from "./ResultValue";
import { attrValueFunction, numberFunction } from "./util";

export enum BinaryRelationalOperator {
  LESS,
  LESSEQ,
  GREATER,
  GREATEREQ,
  EQUAL,
  NOTEQ,
}

class BinaryRelationalPredicate implements NAryFunction<boolean> {
  left: NAryFunction<AttributeValue>;
  right: NAryFunction<AttributeValue>;
  op: BinaryRelationalOperator;

  constructor(
    left: NAryFunction<AttributeValue>,
    right: NAryFunction<AttributeValue>,
    operator: BinaryRelationalOperator
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
        "Error evaluating Relational Binary Expression: " +
          lEval.errorMessage +
          " " +
          rEval.errorMessage
      );
    }

    const lVal = lEval.value;
    const rVal = rEval.value;

    // Check if both are the same type\
    if (typeof lVal !== typeof rVal) {
      return error(
        "Error evaluating Relational Binary Expression: Left and Right operands are not of the same type. Left type is " +
          typeof lVal +
          " and Right type is " +
          typeof rVal
      );
    }

    // Check that if any are strings, operator can only be EQUAL or NOTEQ
    if (
      typeof lVal === "string" &&
      this.op !== BinaryRelationalOperator.EQUAL &&
      this.op !== BinaryRelationalOperator.NOTEQ
    ) {
      return error(
        "Error evaluating Relational Binary Expression: Left and Right operands are strings. Operator " +
          this.op +
          " is not supported"
      );
    }

    let val;
    switch (this.op) {
      case BinaryRelationalOperator.LESS:
        val = lVal < rVal;
        break;
      case BinaryRelationalOperator.LESSEQ:
        val = lVal <= rVal;
        break;
      case BinaryRelationalOperator.GREATER:
        val = lVal > rVal;
        break;
      case BinaryRelationalOperator.GREATEREQ:
        val = lVal >= rVal;
        break;
      case BinaryRelationalOperator.EQUAL:
        val = lVal === rVal;
        break;
      case BinaryRelationalOperator.NOTEQ:
        val = lVal !== rVal;
        break;
    }
    if (val === undefined) {
      return error(
        "Error evaluating Relational Binary Expression: Invalid binary relational operator " +
          this.op
      );
    }
    return value(val);
  }

  equals(other: NAryFunction<any>): boolean {
    if (other instanceof BinaryRelationalPredicate) {
      return (
        this.left.equals(other.left) &&
        this.right.equals(other.right) &&
        this.op === other.op
      );
    }
    return false;
  }
}

//Añadir sobrecarga para literales numero

export function lt(
  left: LogicNumber,
  right: LogicNumber
): BinaryRelationalPredicate {
  return numberFunction(
    left,
    right,
    (l, r) => new BinaryRelationalPredicate(l, r, BinaryRelationalOperator.LESS)
  );
}

export function lte(
  left: LogicNumber,
  right: LogicNumber
): BinaryRelationalPredicate {
  return numberFunction(
    left,
    right,
    (l, r) =>
      new BinaryRelationalPredicate(l, r, BinaryRelationalOperator.LESSEQ)
  );
}

export function gt(
  left: LogicNumber,
  right: LogicNumber
): BinaryRelationalPredicate {
  return numberFunction(
    left,
    right,
    (l, r) =>
      new BinaryRelationalPredicate(l, r, BinaryRelationalOperator.GREATER)
  );
}

export function gte(
  left: LogicNumber,
  right: LogicNumber
): BinaryRelationalPredicate {
  return numberFunction(
    left,
    right,
    (l, r) =>
      new BinaryRelationalPredicate(l, r, BinaryRelationalOperator.GREATEREQ)
  );
}

export function eq(
  left: LogicAttributeValue,
  right: LogicAttributeValue
): BinaryRelationalPredicate {
  return attrValueFunction(
    left,
    right,
    (l, r) =>
      new BinaryRelationalPredicate(l, r, BinaryRelationalOperator.EQUAL)
  );
}

export function neq(
  left: LogicAttributeValue,
  right: LogicAttributeValue
): BinaryRelationalPredicate {
  return attrValueFunction(
    left,
    right,
    (l, r) =>
      new BinaryRelationalPredicate(l, r, BinaryRelationalOperator.NOTEQ)
  );
}
