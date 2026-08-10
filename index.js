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

  try {
    return await function_(resource);
  } finally {
    await asyncDispose(resource);
  }
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

  try {
    return function_(resource);
  } finally {
    dispose(resource);
  }
}
