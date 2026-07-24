/**
 * Convert Mongoose lean docs (ObjectId/Date) into plain JSON-safe objects so
 * they can be passed from server components to client components.
 */
export function serialize(value) {
  return JSON.parse(JSON.stringify(value));
}

export default serialize;
