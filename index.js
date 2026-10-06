function combinedError(useError, disposalError) {
  return new AggregateError(
    [useError, disposalError],
    "Resource use and disposal both failed",
    { cause: disposalError }
  );
}

function dispose(resource) {
  if (typeof resource[Symbol.dispose] === "function") {
    resource[Symbol.dispose]();
    return;
  }

  if (typeof resource.close === "function") {
    resource.close();
    return;
  }

  if (typeof resource.destroy === "function") {
    resource.destroy();
  }
}

async function asyncDispose(resource) {
  if (typeof resource[Symbol.asyncDispose] === "function") {
    await resource[Symbol.asyncDispose]();
    return;
  }

  if (typeof resource[Symbol.dispose] === "function") {
    resource[Symbol.dispose]();
    return;
  }

  if (typeof resource.close === "function") {
    await resource.close();
    return;
  }

  if (typeof resource.destroy === "function") {
    await resource.destroy();
  }
}

/**
Safely use an async resource and dispose it when done.

@param {object} resource - The resource to use.
@param {(resource: object) => unknown} function_ - The function to run with the resource.
@returns {Promise<unknown>} The result of function_.
*/
export default async function usingSafe(resource, function_) {
  if (resource === null || resource === undefined) {
    throw new TypeError("Resource must not be null or undefined");
  }

  let useFailed = false;
  let useError;
  let result;
  try {
    result = await function_(resource);
  } catch (error) {
    useFailed = true;
    useError = error;
  }
  try {
    await asyncDispose(resource);
  } catch (error) {
    if (useFailed) {
      throw combinedError(useError, error);
    }
    throw error;
  }
  if (useFailed) {
    throw useError;
  }
  return result;
}

/**
Safely use a sync resource and dispose it when done.

@param {object} resource - The resource to use.
@param {(resource: object) => unknown} function_ - The function to run with the resource.
@returns {unknown} The result of function_.
*/
export function usingSafeSync(resource, function_) {
  if (resource === null || resource === undefined) {
    throw new TypeError("Resource must not be null or undefined");
  }

  if (
    typeof resource[Symbol.dispose] !== "function" &&
    typeof resource.close !== "function" &&
    typeof resource.destroy !== "function"
  ) {
    throw new TypeError("Expected a synchronous disposal method");
  }

  let useFailed = false;
  let useError;
  let result;
  try {
    result = function_(resource);
  } catch (error) {
    useFailed = true;
    useError = error;
  }
  try {
    dispose(resource);
  } catch (error) {
    if (useFailed) {
      throw combinedError(useError, error);
    }
    throw error;
  }
  if (useFailed) {
    throw useError;
  }
  return result;
}
