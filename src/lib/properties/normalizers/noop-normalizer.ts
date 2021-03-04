import { Normalizer, NormalizerOptions } from "./normalizer";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NoopNormalizerOptions extends NormalizerOptions {}

export class NoopNormalizer<
  T = any,
  O extends NoopNormalizerOptions = NoopNormalizerOptions
> extends Normalizer<T, O> {
  protected _normalize(value: T): T {
    return value;
  }
}
