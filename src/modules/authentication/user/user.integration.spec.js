import { describe, it, expect, afterEach, afterAll } from "vitest";
import { createUser } from "./user.service.js";
import { sql } from "../../../infrastructure/db.js";


afterEach(async () => {
  await sql`DELETE FROM accounts;`;
  await sql`DELETE FROM users;`;
});

afterAll(async () => {
  if (sql.end) {
    await sql.end();
  }
});

describe("User service integration", () => {
  it("should create a user and persist in Postgres", async () => {
    const input = { name: "Alice", birthday: new Date(1990, 0, 1) };

    const created = await createUser(input);

    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.name).toBe("Alice");

    const rows = await sql`SELECT * FROM users WHERE id = ${created.id};`;
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe("Alice");
  });

  it("should reject too young users", async () => {
    const input = { name: "Baby", birthday: new Date() }; 

    await expect(createUser(input)).rejects.toThrow("User is too young.");
  });
});
