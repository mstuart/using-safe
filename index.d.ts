export interface DisposableResource {
  close?: () => void | Promise<void>;
  destroy?: () => void | Promise<void>;
  [Symbol.dispose]?: () => void;
  [Symbol.asyncDispose]?: () => void | Promise<void>;
}

export type SyncDisposableResource =
  | { [Symbol.dispose]: () => void }
  | { close: () => void }
  | { destroy: () => void };

type Synchronous<T> =
  Extract<T, PromiseLike<unknown>> extends never ? unknown : never;

type SynchronousDisposal<T> = T extends {
  [Symbol.dispose]: (...args: never[]) => infer R;
}
  ? Synchronous<R>
  : T extends { close: (...args: never[]) => infer R }
    ? Synchronous<R>
    : T extends { destroy: (...args: never[]) => infer R }
      ? Synchronous<R>
      : never;

/**
Safely use an async resource and dispose it when done.

Disposal order: `Symbol.asyncDispose` -> `Symbol.dispose` -> `.close()` -> `.destroy()`

@param resource - The resource to use.
@param function_ - The function to run with the resource.
@returns The result of `function_`.

@example
```
import usingSafe from 'using-safe';

const result = await usingSafe(resource, async (r) => {
	return await r.doWork();
});
// Resource is automatically disposed
```
*/
export default function usingSafe<T, R>(
  resource: T & DisposableResource,
  function_: (resource: T) => R | Promise<R>
): Promise<R>;

/**
Safely use a sync resource and dispose it when done.

The callback and selected disposal method must be synchronous.

Disposal order: `Symbol.dispose` -> `.close()` -> `.destroy()`

@param resource - The resource to use.
@param function_ - The function to run with the resource.
@returns The result of `function_`.

@example
```
import {usingSafeSync} from 'using-safe';

const result = usingSafeSync(resource, (r) => {
	return r.doWork();
});
// Resource is automatically disposed
```
*/
export function usingSafeSync<T, R>(
  resource: T & SyncDisposableResource & SynchronousDisposal<T>,
  function_: (resource: T) => R & Synchronous<R>
): R;
