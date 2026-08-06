<div align="center">
  <img src="docs/assets/logo.svg" alt="using-safe — Safely use and dispose resources, even without the using declaration" width="720">
</div>

<p align="center"><strong>Safely use and dispose resources, even without the using declaration</strong></p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://www.npmjs.com/package/using-safe"><img src="https://img.shields.io/npm/v/using-safe?label=npm" alt="npm"></a>
  <img src="https://img.shields.io/badge/node-%E2%89%A520-339933.svg" alt="Node 20+">
</p>

---
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
