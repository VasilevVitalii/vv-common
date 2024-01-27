/* eslint-disable @typescript-eslint/naming-convention */
type TPrependNextNum<A extends Array<unknown>> = A['length'] extends infer T ? ((t: T, ...a: A) => void) extends ((...x: infer X) => void) ? X : never : never;
type TEnumerateInternal<A extends Array<unknown>, N extends number> = { 0: A, 1: TEnumerateInternal<TPrependNextNum<A>, N> }[N extends A['length'] ? 0 : 1];
type TEnumerate<N extends number> = TEnumerateInternal<[], N> extends (infer E)[] ? E : never;
/** example: type TMyType = TRange<0,5> */
export type TRange<FROM extends number, TO extends number> = Exclude<TEnumerate<TO>, TEnumerate<FROM>>;
