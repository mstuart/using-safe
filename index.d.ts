export type DisposableResource = {
	[Symbol.dispose]?: () => void;
	[Symbol.asyncDispose]?: () => void | Promise<void>;
	close?: () => void | Promise<void>;
	destroy?: () => void | Promise<void>;
};

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
	function_: (resource: T) => R | Promise<R>,
): Promise<R>;

/**
Safely use a sync resource and dispose it when done.

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
	resource: T & DisposableResource,
	function_: (resource: T) => R,
): R;
