let counter = 0;

// Seed data uses short sequential ids per prefix (e.g. "task_1".."task_18"),
// so a plain incrementing counter here can collide with a hardcoded seed id
// (it did — a freshly created task came out as "task_3", duplicating a real
// one). Stamping in the current time keeps generated ids clearly out of that
// low numeric range no matter how the seed data grows.
export function makeId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now()}_${counter}`;
}
