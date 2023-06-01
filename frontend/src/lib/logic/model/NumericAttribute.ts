import FeatureRetriever, {
  AttributeValue,
} from "../../components/feature/FeatureRetriever";
import { NAryFunction, NAryFunctionOptions } from "./NAryFunction";
import { error, ResultValue, value } from "./ResultValue";

export class NumericAttribute implements NAryFunction<number> {
  attributeId: string;
  featureRetriever?: FeatureRetriever;

  constructor(featureId: string, featureRetriever?: FeatureRetriever) {
    this.attributeId = featureId;
    this.featureRetriever = featureRetriever;
  }

  async eval(options?: NAryFunctionOptions): Promise<ResultValue<number>> {
    const retriever = this.featureRetriever ?? options?.featureRetriever;
    if (!retriever) {
      return error(
        "Error evaluating Attribute " +
          this.attributeId +
          ". No FeatureRetriever provided"
      );
    }
    try {
      const attribute = await retriever.getAttribute(this.attributeId);
      if (typeof attribute !== "number") {
        return error(
          "Error evaluating Attribute " +
            this.attributeId +
            ". Got a " +
            typeof attribute +
            ", expected number. Recv value: " +
            attribute
        );
      } else {
        return value(attribute);
      }
    } catch {
      return error(
        "Error evaluating Attribute: " + this.attributeId + " Retrieval error"
      );
    }
  }

  equals(other: NAryFunction<any>): boolean {
    if (other instanceof NumericAttribute) {
      return this.attributeId === other.attributeId;
    }
    return false;
  }
}

/**
 * NAryFunction that returns an attribute value, which resolves to a number.
 * @param attributeId Id of the attribute
 * @param featureRetriever FeatureRetriever instance. Recommended to just call featureRetriever.getLogicAttribute()
 * @returns
 */
export function numericAttribute(
  attributeId: string,
  featureRetriever?: FeatureRetriever
): NAryFunction<number> {
  return new NumericAttribute(attributeId, featureRetriever);
}
