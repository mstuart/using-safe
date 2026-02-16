# using-safe

> Safely use and dispose resources, even without the `using` declaration

## Install

```sh
npm install using-safe
```

## Usage

```js
import usingSafe from 'using-safe';

const result = await usingSafe(resource, async (r) => {
	return await r.doWork();
});
// Resource is automatically disposed
```

## API

### usingSafe(resource, function_)

Runs `function_` with `resource`, then disposes `resource` in a `finally` block.

Disposal order: `Symbol.asyncDispose` -> `Symbol.dispose` -> `.close()` -> `.destroy()`

Returns the result of `function_`.

### usingSafeSync(resource, function_)

Synchronous version.

Disposal order: `Symbol.dispose` -> `.close()` -> `.destroy()`

Returns the result of `function_`.

## Related

- [disposable-from](https://github.com/mstuart/disposable-from) - Create Disposable wrappers for timers, event listeners, intervals, and custom cleanup

## License

MIT
