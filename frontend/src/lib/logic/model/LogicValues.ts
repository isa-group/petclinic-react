import { AttributeValue } from "../../components/feature/FeatureRetriever";
import { NAryFunction } from "./NAryFunction";

export type LogicNumber = NAryFunction<number> | number;
export type LogicBoolean = NAryFunction<boolean> | boolean;
export type LogicAttributeValue = NAryFunction<AttributeValue> | AttributeValue;
