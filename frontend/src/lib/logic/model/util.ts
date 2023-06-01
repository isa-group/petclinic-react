import FeatureRetriever, {
  AttributeValue,
} from "../../components/feature/FeatureRetriever";
import { attribute } from "./Attribute";
import { feature } from "./Feature";
import { NAryFunction } from "./NAryFunction";
import constant from "./Constant";

export function makeFeatureAttributeRetrievers(
  featureRetriever: FeatureRetriever
) {
  return {
    feature: (featureId: string) => feature(featureId, featureRetriever),
    attribute: (attributeId: string) =>
      attribute(attributeId, featureRetriever),
  };
}

export function numberFunction<T>(
  left: NAryFunction<number> | number,
  right: NAryFunction<number> | number,
  factory: (left: NAryFunction<number>, right: NAryFunction<number>) => T
) {
  // parse the number if number and put it to constant
  const l = typeof left === "number" ? constant(left) : left;
  const r = typeof right === "number" ? constant(right) : right;
  return factory(l, r);
}

export function booleanFunction<T>(
  left: NAryFunction<boolean> | boolean,
  right: NAryFunction<boolean> | boolean,
  factory: (left: NAryFunction<boolean>, right: NAryFunction<boolean>) => T
) {
  const l = typeof left === "boolean" ? constant(left) : left;
  const r = typeof right === "boolean" ? constant(right) : right;
  return factory(l, r);
}

export function attrValueFunction<T>(
  left: NAryFunction<AttributeValue> | AttributeValue,
  right: NAryFunction<AttributeValue> | AttributeValue,
  factory: (
    left: NAryFunction<AttributeValue>,
    right: NAryFunction<AttributeValue>
  ) => T
) {
  const l =
    typeof left === "string" || typeof left === "number"
      ? constant(left)
      : left;
  const r =
    typeof right === "string" || typeof right === "number"
      ? constant(right)
      : right;
  return factory(l, r);
}
