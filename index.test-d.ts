import { expectError, expectType } from "tsd";
import usingSafe, { usingSafeSync } from "./index.js";

expectError(
  usingSafeSync(
    {
      close() {
        /* Intentionally empty disposal fixture. */
      },
    },
    async () => 42
  )
);
expectError(
  usingSafeSync(
    {
      async close() {
        /* Intentionally empty disposal fixture. */
      },
    },
    () => 42
  )
);
expectError(
  usingSafeSync(
    {
      async destroy() {
        /* Intentionally empty disposal fixture. */
      },
    },
    () => 42
  )
);
expectError(
  usingSafeSync(
    {
      async [Symbol.asyncDispose]() {
        /* Intentionally empty disposal fixture. */
      },
    },
    () => 42
  )
);

expectType<number>(
  usingSafeSync(
    {
      close() {
        /* Intentionally empty disposal fixture. */
      },
      async doWork() {
        /* Intentionally empty disposal fixture. */
      },
    },
    () => 42
  )
);

expectType<number>(
  usingSafeSync(
    {
      [Symbol.dispose]() {
        /* Intentionally empty disposal fixture. */
      },
      async close() {
        /* Intentionally empty disposal fixture. */
      },
    },
    () => 42
  )
);

// Async version returns Promise
expectType<Promise<string>>(
  usingSafe(
    {
      [Symbol.dispose]() {
        /* noop */
      },
    },
    () => "hello"
  )
);

expectType<Promise<number>>(
  usingSafe(
    {
      close() {
        /* noop */
      },
    },
    async () => 42
  )
);

// Sync version returns direct value
expectType<string>(
  usingSafeSync(
    {
      [Symbol.dispose]() {
        /* noop */
      },
    },
    () => "hello"
  )
);

expectType<number>(
  usingSafeSync(
    {
      destroy() {
        /* noop */
      },
    },
    () => 42
  )
);

// Resource is passed to function
expectType<Promise<number>>(
  usingSafe(
    {
      [Symbol.dispose]() {
        /* noop */
      },
      value: 123,
    },
    (resource) => {
      expectType<number>(resource.value);
      return resource.value;
    }
  )
);
