import {expectType} from 'tsd';
import usingSafe, {usingSafeSync} from './index.js';

// Async version returns Promise
expectType<Promise<string>>(
	usingSafe({[Symbol.dispose]() { /* noop */ }}, () => 'hello'),
);

expectType<Promise<number>>(
	usingSafe({close() { /* noop */ }}, async () => 42),
);

// Sync version returns direct value
expectType<string>(
	usingSafeSync({[Symbol.dispose]() { /* noop */ }}, () => 'hello'),
);

expectType<number>(
	usingSafeSync({destroy() { /* noop */ }}, () => 42),
);

// Resource is passed to function
void usingSafe({[Symbol.dispose]() { /* noop */ }, value: 123}, resource => {
	expectType<number>(resource.value);
	return resource.value;
});
