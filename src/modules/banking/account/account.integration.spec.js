import { describe, it, expect, afterEach, afterAll } from "vitest";
import { sql } from "../../../infrastructure/db.js";
import { createUser } from "../../authentication/user/user.service.js";
import { createAccount, getAccounts, deleteAccount } from "./account.service.js";

afterEach(async () => {
  await sql`DELETE FROM accounts;`;
  await sql`DELETE FROM users;`;
});

afterAll(async () => {
  if (sql.end) {
    await sql.end();
  }
});

describe("Account service integration", () => {
  it("should create, read and delete an account", async () => {
    const user = await createUser({ name: "Bob", birthday: new Date(1990, 5, 1) });

    const acc = await createAccount({ userId: user.id, amount: 100 });
    const normalized = {
    ...acc,
    userId: acc.userId ?? acc.userid,  
    };
    expect(normalized).toBeDefined();
    expect(normalized.userId).toBe(user.id);
    expect(normalized.amount).toBe(100);

    const list = await getAccounts(user.id);
    const normalizedList = list.map(a => ({
    ...a,
    userId: a.userId ?? a.userid,
    }));
    expect(Array.isArray(normalizedList)).toBe(true);
    expect(normalizedList.length).toBe(1);
    expect(normalizedList[0].id).toBe(normalized.id);

    await deleteAccount(user.id, normalized.id);

    const rows = await sql`SELECT * FROM accounts WHERE id = ${normalized.id};`;
    expect(rows.length).toBe(0);
  });
});
