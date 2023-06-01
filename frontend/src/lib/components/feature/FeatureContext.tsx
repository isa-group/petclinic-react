import React from "react";
import FeatureRetriever from "./FeatureRetriever";

interface AppContext {
  featureRetriever: FeatureRetriever;
}

export const FeatureContext = React.createContext<AppContext>({
  featureRetriever: new FeatureRetriever({
    baseUrl: "http://localhost:4000",
  }),
});
