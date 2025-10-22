// MongoDB helper removed — project now uses file-backed storage for small features.
// This shim preserves the module path so any remaining imports fail with a clear error.

const err = new Error(
  "MongoDB support has been removed. If you need DB-backed features, restore lib/mongodb.ts or switch to file-backed APIs."
);

export default Promise.reject(err);
