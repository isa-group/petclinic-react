import { NAryFunction } from "../../logic/model/NAryFunction";
import useGenericFeature from "./useGenericFeature";
import React, { useEffect, useMemo, useState } from "react";
import { useWhatChanged } from "@simbathesailor/use-what-changed";

// type FeatureProps =
//   | {
//       flags: string | string[];
//       value?: undefined;
//       expectedValue?: FeatureValue
//     }
//   | {
//       flags?: undefined;
//       value: boolean;
//       expectedValue?: undefined
//     };

// type FeaturePropsWithChildren = FeatureProps & { children: React.ReactNode };

export function On({
  children,
  expression,
}: {
  children: React.ReactNode;
  expression: NAryFunction<boolean>;
}) {
  return <>{children}</>;
}

export function Default({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Loading({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function ErrorFallback({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Feature({ children }: { children: React.ReactNode }) {
  const [key, setKey] = useState(0);
  const [onChildren, setOnChildren] = useState<React.ReactElement[]>([]);
  const [defaultChildren, setDefaultChildren] = useState<React.ReactElement[]>(
    []
  );
  const [loadingChildren, setLoadingChildren] = useState<React.ReactElement[]>(
    []
  );
  const [errorChildren, setErrorChildren] = useState<React.ReactElement[]>([]);

  const onExpressions = useMemo(() => {
    return onChildren.map((child) => {
      return {
        on: child.props.children,
        expression: child.props.expression,
      };
    });
  }, [onChildren]);

  useEffect(() => {
    setKey(key+1);
    // Gets children of Feature.On
    const on = React.Children.toArray(children).filter((child) => {
      const c = child as React.ReactElement;
      return c.type === On;
    }) as React.ReactElement[];
    setOnChildren(on);

    // Gets children of Feature.Off
    const def = React.Children.toArray(children).filter((child) => {
      const c = child as React.ReactElement;
      return c.type === Default;
    }) as React.ReactElement[];
    setDefaultChildren(def);

    // Gets children of Feature.Loading
    const loading = React.Children.toArray(children).filter((child) => {
      const c = child as React.ReactElement;
      return c.type === Loading;
    }) as React.ReactElement[];
    setLoadingChildren(loading);

    // Gets children of Feature.Error
    const err = React.Children.toArray(children).filter((child) => {
      const c = child as React.ReactElement;
      return c.type === ErrorFallback;
    }) as React.ReactElement[];
    setErrorChildren(err);
  }, [children]);

  const feature = useGenericFeature({
    key: key.toString(),
    on: onExpressions,
    default: defaultChildren,
    loading: loadingChildren,
    error: errorChildren,
  });

  return <>{feature}</>;

  // return <Suspense fallback={loading}>{feature.feature}</Suspense>;
}
