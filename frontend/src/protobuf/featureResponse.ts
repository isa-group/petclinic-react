/* eslint-disable */
import Long from "long";
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "";

export interface FeatureResponse {
  featureMap: { [key: string]: FeatureResponse_Feature };
}

export interface FeatureResponse_Feature {
  valueType: FeatureResponse_Feature_ValueType;
  booleanValue: boolean | undefined;
  stringValue: string | undefined;
  numericValue: number | undefined;
}

export enum FeatureResponse_Feature_ValueType {
  BOOLEAN = 0,
  STRING = 1,
  NUMERIC = 2,
  UNRECOGNIZED = -1,
}

export function featureResponse_Feature_ValueTypeFromJSON(
  object: any
): FeatureResponse_Feature_ValueType {
  switch (object) {
    case 0:
    case "BOOLEAN":
      return FeatureResponse_Feature_ValueType.BOOLEAN;
    case 1:
    case "STRING":
      return FeatureResponse_Feature_ValueType.STRING;
    case 2:
    case "NUMERIC":
      return FeatureResponse_Feature_ValueType.NUMERIC;
    case -1:
    case "UNRECOGNIZED":
    default:
      return FeatureResponse_Feature_ValueType.UNRECOGNIZED;
  }
}

export function featureResponse_Feature_ValueTypeToJSON(
  object: FeatureResponse_Feature_ValueType
): string {
  switch (object) {
    case FeatureResponse_Feature_ValueType.BOOLEAN:
      return "BOOLEAN";
    case FeatureResponse_Feature_ValueType.STRING:
      return "STRING";
    case FeatureResponse_Feature_ValueType.NUMERIC:
      return "NUMERIC";
    case FeatureResponse_Feature_ValueType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface FeatureResponse_FeatureMapEntry {
  key: string;
  value: FeatureResponse_Feature | undefined;
}

function createBaseFeatureResponse(): FeatureResponse {
  return { featureMap: {} };
}

export const FeatureResponse = {
  encode(
    message: FeatureResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    Object.entries(message.featureMap).forEach(([key, value]) => {
      FeatureResponse_FeatureMapEntry.encode(
        { key: key as any, value },
        writer.uint32(10).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeatureResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeatureResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 = FeatureResponse_FeatureMapEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry1.value !== undefined) {
            message.featureMap[entry1.key] = entry1.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FeatureResponse {
    return {
      featureMap: isObject(object.featureMap)
        ? Object.entries(object.featureMap).reduce<{
            [key: string]: FeatureResponse_Feature;
          }>((acc, [key, value]) => {
            acc[key] = FeatureResponse_Feature.fromJSON(value);
            return acc;
          }, {})
        : {},
    };
  },

  toJSON(message: FeatureResponse): unknown {
    const obj: any = {};
    obj.featureMap = {};
    if (message.featureMap) {
      Object.entries(message.featureMap).forEach(([k, v]) => {
        obj.featureMap[k] = FeatureResponse_Feature.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FeatureResponse>, I>>(
    object: I
  ): FeatureResponse {
    const message = createBaseFeatureResponse();
    message.featureMap = Object.entries(object.featureMap ?? {}).reduce<{
      [key: string]: FeatureResponse_Feature;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = FeatureResponse_Feature.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseFeatureResponse_Feature(): FeatureResponse_Feature {
  return {
    valueType: 0,
    booleanValue: undefined,
    stringValue: undefined,
    numericValue: undefined,
  };
}

export const FeatureResponse_Feature = {
  encode(
    message: FeatureResponse_Feature,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.valueType !== 0) {
      writer.uint32(8).int32(message.valueType);
    }
    if (message.booleanValue !== undefined) {
      writer.uint32(16).bool(message.booleanValue);
    }
    if (message.stringValue !== undefined) {
      writer.uint32(26).string(message.stringValue);
    }
    if (message.numericValue !== undefined) {
      writer.uint32(32).int32(message.numericValue);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): FeatureResponse_Feature {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeatureResponse_Feature();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.valueType = reader.int32() as any;
          break;
        case 2:
          message.booleanValue = reader.bool();
          break;
        case 3:
          message.stringValue = reader.string();
          break;
        case 4:
          message.numericValue = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FeatureResponse_Feature {
    return {
      valueType: isSet(object.valueType)
        ? featureResponse_Feature_ValueTypeFromJSON(object.valueType)
        : 0,
      booleanValue: isSet(object.booleanValue)
        ? Boolean(object.booleanValue)
        : undefined,
      stringValue: isSet(object.stringValue)
        ? String(object.stringValue)
        : undefined,
      numericValue: isSet(object.numericValue)
        ? Number(object.numericValue)
        : undefined,
    };
  },

  toJSON(message: FeatureResponse_Feature): unknown {
    const obj: any = {};
    message.valueType !== undefined &&
      (obj.valueType = featureResponse_Feature_ValueTypeToJSON(
        message.valueType
      ));
    message.booleanValue !== undefined &&
      (obj.booleanValue = message.booleanValue);
    message.stringValue !== undefined &&
      (obj.stringValue = message.stringValue);
    message.numericValue !== undefined &&
      (obj.numericValue = Math.round(message.numericValue));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FeatureResponse_Feature>, I>>(
    object: I
  ): FeatureResponse_Feature {
    const message = createBaseFeatureResponse_Feature();
    message.valueType = object.valueType ?? 0;
    message.booleanValue = object.booleanValue ?? undefined;
    message.stringValue = object.stringValue ?? undefined;
    message.numericValue = object.numericValue ?? undefined;
    return message;
  },
};

function createBaseFeatureResponse_FeatureMapEntry(): FeatureResponse_FeatureMapEntry {
  return { key: "", value: undefined };
}

export const FeatureResponse_FeatureMapEntry = {
  encode(
    message: FeatureResponse_FeatureMapEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      FeatureResponse_Feature.encode(
        message.value,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): FeatureResponse_FeatureMapEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeatureResponse_FeatureMapEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = FeatureResponse_Feature.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FeatureResponse_FeatureMapEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value)
        ? FeatureResponse_Feature.fromJSON(object.value)
        : undefined,
    };
  },

  toJSON(message: FeatureResponse_FeatureMapEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value
        ? FeatureResponse_Feature.toJSON(message.value)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FeatureResponse_FeatureMapEntry>, I>>(
    object: I
  ): FeatureResponse_FeatureMapEntry {
    const message = createBaseFeatureResponse_FeatureMapEntry();
    message.key = object.key ?? "";
    message.value =
      object.value !== undefined && object.value !== null
        ? FeatureResponse_Feature.fromPartial(object.value)
        : undefined;
    return message;
  },
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
