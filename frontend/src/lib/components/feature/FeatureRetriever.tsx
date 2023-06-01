import axios, { AxiosInstance } from "axios";
import { attribute } from "../../logic/model/Attribute";
import { feature } from "../../logic/model/Feature";
import { NAryFunction } from "../../logic/model/NAryFunction";
import {
  FeatureResponse,
  FeatureResponse_Feature,
  FeatureResponse_Feature_ValueType,
} from "../../../protobuf/featureResponse";
import { Buffer } from "buffer";
import { FeatureRequest as ProtoFeatureRequest } from "../../../protobuf/featureRequest";

export type AttributeValue = number | string;
export type FeatureValue = boolean | AttributeValue;

type OnCompleteCallback = (result: FeatureValue) => void;
type OnErrorCallback = () => void;

interface FeatureRequest {
  onComplete: OnCompleteCallback;
  onError: OnErrorCallback;
}

interface FeatureRetrieverConfig {
  windowDelay: number;
  requestTimeout: number;
  /**
   * With a trailing slash
   */
  baseUrl: string;
}

type FeatureRetrieverConstructorConfig = Partial<FeatureRetrieverConfig> & {
  baseUrl: string;
};

export default class FeatureRetriever {
  // request window delay in ms
  DEFAULT_WINDOW_DELAY = 1000;
  DEFAULT_REQUEST_TIMEOUT = 5000;

  config: FeatureRetrieverConfig;
  axiosInstance: AxiosInstance;

  queueMain: Record<string, FeatureRequest[]> = {};
  queueRequest: Record<string, FeatureRequest[]> = {};

  featureMap: Record<string, FeatureValue> = {};

  tickTimeout?: NodeJS.Timeout;

  constructor(config: FeatureRetrieverConstructorConfig) {
    this.config = {
      windowDelay: config.windowDelay || this.DEFAULT_WINDOW_DELAY,
      requestTimeout: config.requestTimeout || this.DEFAULT_REQUEST_TIMEOUT,
      baseUrl: config.baseUrl,
    };
    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.requestTimeout,
    });
  }

  tickRequestQueue() {
    console.log("Ticking...", this.queueMain);
    if (Object.keys(this.queueMain).length === 0) {
      return;
    }

    // Copy main queue to request queue, and empty queue
    this.queueRequest = { ...this.queueMain };
    this.queueMain = {};

    const ids = Object.keys(this.queueRequest);
    const encodedIds = Buffer.from(ProtoFeatureRequest.encode({
      features: ids,
    }).finish());
    
    this.axiosInstance
      .post(`/feature`, encodedIds, {
        headers: {
          "Content-Type": "application/octet-stream",
        }
      })
      .then((response) => {
        console.log(response);
        const decoded = FeatureResponse.decode(Buffer.from(response.data));
        this.processFeatureResponse(decoded);
        // Once we're done, set a new timeout.
        this.tickTimeout = setTimeout(
          () => this.tickRequestQueue(),
          this.config.windowDelay
        );
      })
      .catch((error) => {
        console.error(error);
        // Clear all the requests
        for (const featureRequest of Object.values(this.queueRequest)) {
          for (const req of featureRequest) {
            req.onError();
          }
        }
        this.queueRequest = {};
        // We stop the queue.
        // clearInterval(this.tickInterval!);
        // delete this.tickInterval;
      });
  }

  isBoolean(value: any): value is boolean {
    return typeof value === "boolean";
  }

  isAttribute(value: any): value is AttributeValue {
    return typeof value === "string" || typeof value === "number";
  }

  /**
   * Gets the value of a boolean feature
   * @param id Id of the feature
   * @returns
   */
  getFeature(id: string): Promise<boolean> {
    console.log("getting feature", id);
    return new Promise((resolve, reject) => {
      if (id in this.featureMap) {
        // Check if boolean
        const value = this.featureMap[id];
        this.tryResolveFeatureValue(value, resolve, false);
      } else {
        this.addFeatureToQueue(
          id,
          (v) => {
            this.tryResolveFeatureValue(v, resolve, false);
          },
          reject
        );
      }
    });
  }

  // If we passed an object we could get better type safety
  private tryResolveFeatureValue(
    value: any,
    resolve: (x: any) => void,
    shouldBeAttribute: boolean
  ) {
    if (shouldBeAttribute) {
      if (this.isAttribute(value)) {
        resolve(value as AttributeValue);
      } else {
        console.error("Feature is not an attribute", value);
      }
    } else {
      if (this.isBoolean(value)) {
        resolve(value as boolean);
      } else {
        console.error("Feature is not boolean", value);
      }
    }
  }

  getAttribute(id: string): Promise<AttributeValue> {
    return new Promise((resolve, reject) => {
      if (id in this.featureMap) {
        // Check if boolean
        const value = this.featureMap[id];
        this.tryResolveFeatureValue(value, resolve, true);
      } else {
        this.addFeatureToQueue(
          id,
          (v) => {
            this.tryResolveFeatureValue(v, resolve, true);
          },
          reject
        );
      }
    });
  }

  /**
   * Gets the value of a feature or features. ATM A feature is considered "ON"
   * if all the features in the list are true
   * @param ids A list of ids
   * @returns A promise that resolves with the feature boolean value
   */
  evalFeatureExpression(ids: string[]): Promise<FeatureValue> {
    return new Promise(async (resolve, reject) => {
      // Iterate through ids, get every individual feature
      Promise.all(
        ids.map((id) => {
          return this.getFeature(id);
        })
      )
        .then((values) => {
          // All features are true
          // TODO: !!! What if it's not a boolean feature???
          // What do we resolve to?
          resolve(values.every((v) => v));
        })
        .catch(() => {
          reject();
        });
    });
  }

  /**
   * Adds a feature request to the relevant queue.
   * @param featureId Id of the feature to retrieve
   * @returns A promise
   * that will be resolved once we know the feature value, that is, as soon as
   * the server returns it (even if we didn't request it explicitly - i.e. it
   * was returned together with a parent feature)
   */
  addFeatureToQueue(
    featureId: string,
    onComplete: OnCompleteCallback,
    onError: OnErrorCallback
  ): void {
    if (!this.tickTimeout) {
      // if the tick interval
      this.tickTimeout = setTimeout(
        () => this.tickRequestQueue(),
        this.config.windowDelay
      );
    }

    if (featureId in this.queueMain) {
      // Add callback to queueMain
      this.queueMain[featureId].push({ onComplete, onError });
    } else if (featureId in this.queueRequest) {
      // Add callback to queueRequest
      this.queueRequest[featureId].push({ onComplete, onError });
    } else {
      // Add to queueMain
      this.queueMain[featureId] = [{ onComplete, onError }];
    }
  }

  /**
   * Processes the map of features that came from the server
   * @param retrievedFeatures Dictionary of retrieved features
   */
  processFeatureResponse(featureResponse: FeatureResponse) {
    const retrievedFeatures = featureResponse.featureMap;
    console.log("received features", retrievedFeatures);
    for (const featureId of Object.keys(retrievedFeatures)) {
      // Call relevant callbacks
      this.setFeature(featureId, retrievedFeatures[featureId]);
      // Delete feature from request queue
      delete this.queueRequest[featureId];
    }
    // If request queue not empty, that means we asked for an invalid feature
    for (const featureId of Object.keys(this.queueRequest)) {
      for (const req of this.queueRequest[featureId]) {
        req.onError();
      }
      console.warn(
        `Feature ${featureId} wasn't returned by the server. Check the feature id?`
      );
      delete this.queueRequest[featureId];
    }
  }

  /**
   * Updates the feature map with the given feature, and resolves
   * relevant pending feature requests.
   * @param id Id of the feature
   * @param feature Value of the feature
   */
  setFeature(id: string, feature: FeatureResponse_Feature) {
    let value: FeatureValue;
    if (feature.valueType === FeatureResponse_Feature_ValueType.BOOLEAN) {
      value = feature.booleanValue!;
    } else if (
      feature.valueType === FeatureResponse_Feature_ValueType.NUMERIC
    ) {
      value = feature.numericValue!;
    } else if (feature.valueType === FeatureResponse_Feature_ValueType.STRING) {
      value = feature.stringValue!;
    } else {
      throw new Error("Bad feature value type");
    }
    this.featureMap[id] = value;
    // Call relevant pending callbacks and remove from queue
    for (const [featureId, featureRequest] of Object.entries(
      this.queueRequest
    )) {
      if (featureId === id) {
        for (const req of featureRequest) {
          req.onComplete(value);
        }
      }
    }
  }

  /**
   * Returns a NAryFunction. Useful to operate on.
   * @param id
   * @returns A NAryFunction that resolves to a boolean feature
   */
  getLogicFeature(id: string): NAryFunction<boolean> {
    return feature(id, this);
  }

  /**
   * Returns a NAryFunction. Useful to operate on.
   * @param id
   * @returns A NAryFunction that resolves to an attribute value.
   */
  getLogicAttribute(id: string): NAryFunction<AttributeValue> {
    return attribute(id, this);
  }
}
