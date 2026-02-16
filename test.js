import test from 'ava';
import usingSafe, {usingSafeSync} from './index.js';

// UsingSafe (async) tests

test('usingSafe disposes resource after use via Symbol.asyncDispose', async t => {
	let disposed = false;
	const resource = {
		async [Symbol.asyncDispose]() {
			disposed = true;
		},
	};
	await usingSafe(resource, () => {});
	t.true(disposed);
});

test('usingSafe disposes resource via Symbol.dispose', async t => {
	let disposed = false;
	const resource = {
		[Symbol.dispose]() {
			disposed = true;
		},
	};
	await usingSafe(resource, () => {});
	t.true(disposed);
});

test('usingSafe falls back to .close()', async t => {
	let closed = false;
	const resource = {
		close() {
			closed = true;
		},
	};
	await usingSafe(resource, () => {});
	t.true(closed);
});

test('usingSafe falls back to .destroy()', async t => {
	let destroyed = false;
	const resource = {
		destroy() {
			destroyed = true;
		},
	};
	await usingSafe(resource, () => {});
	t.true(destroyed);
});

test('usingSafe prefers Symbol.asyncDispose over Symbol.dispose', async t => {
	const calls = [];
	const resource = {
		async [Symbol.asyncDispose]() {
			calls.push('asyncDispose');
		},
		[Symbol.dispose]() {
			calls.push('dispose');
		},
	};
	await usingSafe(resource, () => {});
	t.deepEqual(calls, ['asyncDispose']);
});

test('usingSafe prefers Symbol.dispose over .close()', async t => {
	const calls = [];
	const resource = {
		[Symbol.dispose]() {
			calls.push('dispose');
		},
		close() {
			calls.push('close');
		},
	};
	await usingSafe(resource, () => {});
	t.deepEqual(calls, ['dispose']);
});

test('usingSafe prefers .close() over .destroy()', async t => {
	const calls = [];
	const resource = {
		close() {
			calls.push('close');
		},
		destroy() {
			calls.push('destroy');
		},
	};
	await usingSafe(resource, () => {});
	t.deepEqual(calls, ['close']);
});

test('usingSafe returns the result of function_', async t => {
	const resource = {[Symbol.dispose]() {}};
	const result = await usingSafe(resource, () => 42);
	t.is(result, 42);
});

test('usingSafe returns async result', async t => {
	const resource = {[Symbol.dispose]() {}};
	const result = await usingSafe(resource, async () => 'hello');
	t.is(result, 'hello');
});

test('usingSafe propagates errors and still disposes', async t => {
	let disposed = false;
	const resource = {
		[Symbol.dispose]() {
			disposed = true;
		},
	};
	await t.throwsAsync(
		() => usingSafe(resource, () => {
			throw new Error('test error');
		}),
		{message: 'test error'},
	);
	t.true(disposed);
});

test('usingSafe throws TypeError for null resource', async t => {
	await t.throwsAsync(
		() => usingSafe(null, () => {}),
		{instanceOf: TypeError},
	);
});

test('usingSafe throws TypeError for undefined resource', async t => {
	await t.throwsAsync(
		() => usingSafe(undefined, () => {}),
		{instanceOf: TypeError},
	);
});

test('usingSafe passes resource to function_', async t => {
	const resource = {
		value: 'test',
		[Symbol.dispose]() {},
	};
	const result = await usingSafe(resource, r => r.value);
	t.is(result, 'test');
});

// UsingSafeSync tests

test('usingSafeSync disposes resource via Symbol.dispose', t => {
	let disposed = false;
	const resource = {
		[Symbol.dispose]() {
			disposed = true;
		},
	};
	usingSafeSync(resource, () => {});
	t.true(disposed);
});

test('usingSafeSync falls back to .close()', t => {
	let closed = false;
	const resource = {
		close() {
			closed = true;
		},
	};
	usingSafeSync(resource, () => {});
	t.true(closed);
});

test('usingSafeSync falls back to .destroy()', t => {
	let destroyed = false;
	const resource = {
		destroy() {
			destroyed = true;
		},
	};
	usingSafeSync(resource, () => {});
	t.true(destroyed);
});

test('usingSafeSync returns the result of function_', t => {
	const resource = {[Symbol.dispose]() {}};
	const result = usingSafeSync(resource, () => 'result');
	t.is(result, 'result');
});

test('usingSafeSync propagates errors and still disposes', t => {
	let disposed = false;
	const resource = {
		[Symbol.dispose]() {
			disposed = true;
		},
	};
	t.throws(
		() => usingSafeSync(resource, () => {
			throw new Error('sync error');
		}),
		{message: 'sync error'},
	);
	t.true(disposed);
});

test('usingSafeSync throws TypeError for null resource', t => {
	t.throws(
		() => usingSafeSync(null, () => {}),
		{instanceOf: TypeError},
	);
});

test('usingSafeSync throws TypeError for undefined resource', t => {
	t.throws(
		() => usingSafeSync(undefined, () => {}),
		{instanceOf: TypeError},
	);
});

test('usingSafeSync passes resource to function_', t => {
	const resource = {
		data: 123,
		[Symbol.dispose]() {},
	};
	const result = usingSafeSync(resource, r => r.data);
	t.is(result, 123);
});

test('usingSafeSync prefers Symbol.dispose over .close()', t => {
	const calls = [];
	const resource = {
		[Symbol.dispose]() {
			calls.push('dispose');
		},
		close() {
			calls.push('close');
		},
	};
	usingSafeSync(resource, () => {});
	t.deepEqual(calls, ['dispose']);
});
