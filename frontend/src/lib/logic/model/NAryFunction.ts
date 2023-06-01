import FeatureRetriever from "../../components/feature/FeatureRetriever";
import { ResultValue } from "./ResultValue";

export interface NAryFunctionOptions {
    featureRetriever?: FeatureRetriever;
}

export interface NAryFunction<T>
{
    eval: (options?: NAryFunctionOptions) => Promise<ResultValue<T>>;
    equals: (other: NAryFunction<any>) => boolean;
}