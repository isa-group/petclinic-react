import { NAryFunction } from "../../logic/model/NAryFunction";
import React, { useContext, useEffect, useState } from "react";
import { FeatureContext } from "./FeatureContext";

export interface GenericFeatureHookOptions {
  /**
   * If you're changing the `on` object, you should update this key so the hook updates with the new values.
   */
  key?: string;
  on: { expression: NAryFunction<boolean>; on: React.ReactNode }[];
  default?: React.ReactNode;
  loading?: React.ReactNode;
  error?: React.ReactNode;
}

export type FeatureResponse = JSX.Element;

export default function useGenericFeature(
  options: GenericFeatureHookOptions
): FeatureResponse {
  const { featureRetriever } = useContext(FeatureContext);
  const [errored, setErrored] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Index of the feature that was evaluated to true
  const [value, setValue] = useState<number | undefined>();

  if (!options.on) {
    throw new Error("On Expression list must be provided");
  }

  useEffect(() => {
    if (options.on) {
      setIsLoading(true);
      // Get the feature value for each provided expression
      const expressionPromises = options.on.map((on) =>
        on.expression.eval({ featureRetriever })
      );

      if (expressionPromises.length === 0) {
        setIsLoading(false);
        setValue(undefined);
        return;
      }

      // Wait for all the promises to resolve
      Promise.all(expressionPromises).then((values) => {
        // Log any of them that might be in error
        values.forEach((value) => {
          if (value.isError) {
            console.warn("Error evaluating feature", value.errorMessage);
          }
        });
        const isErrored = values.some((value) => value.isError);
        if (isErrored) {
          setErrored(true);
          setIsLoading(false);
          return;
        }

        // Find the first expression that's true, and set the value to its index
        const index = values.findIndex((value) => value.value === true);
        if (index !== -1) {
          setValue(index);
        } else {
          // Since none of them are true, set the value to undefined since we'll be in the default value
          setValue(undefined);
        }
        setIsLoading(false);
      });
    } else {
      setErrored(true);
      setIsLoading(false);
    }
  }, [options.key]);

  // const returnedComponent = useMemo(() => {
  //   let returnedComponent: React.ReactNode;
  //   if (errored) {
  //     returnedComponent = options.error ?? <></>;
  //   } else if (isLoading) {
  //     returnedComponent = options.loading ?? <></>;
  //   } else {
  //     // If we have a value, return the on expression at that index
  //     if (value !== undefined) {
  //       returnedComponent = options.on[value].on ?? <></>;
  //     } else {
  //       // Otherwise, return the default value
  //       returnedComponent = options.default ?? <></>;
  //     }
  //   }

  //   // debugger;
  //   return <>{returnedComponent}</>;
  // }, [options.on, options.default, options.error, options.loading, value]);

  let returnedComponent: React.ReactNode;
  if (errored) {
    returnedComponent = options.error ?? <></>;
  } else if (isLoading) {
    returnedComponent = options.loading ?? <></>;
  } else {
    // If we have a value, return the on expression at that index
    if (value !== undefined) {
      returnedComponent = options.on[value].on ?? <></>;
    } else {
      // Otherwise, return the default value
      returnedComponent = options.default ?? <></>;
    }
  }

  // debugger;
  return <>{returnedComponent}</>;

  // return returnedComponent;
}
