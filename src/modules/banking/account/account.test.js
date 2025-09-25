import { describe, it, expect, vi, afterEach, assert } from "vitest";

vi.mock("./account.repository", async (importOriginal) => ({
  ...(await importOriginal()),
  createAccountInRepository: vi.fn((data) => ({
    id: 10,
    userId: data.userId,
    amount: data.amount ?? 0,
  })),
  getAccountsFromRepository: vi.fn((userId) => ([
    { id: 10, userId, amount: 100 },
    { id: 11, userId, amount: 500 },
  ])),
  deleteAccountInRepository: vi.fn((userId, accountId) => ({ deleted: true })),
}));

import { createAccount, getAccounts, deleteAccount } from "./account.service.js";
import {
  createAccountInRepository,
  getAccountsFromRepository,
  deleteAccountInRepository,
} from "./account.repository.js";

describe("Account Service", () => {
  afterEach(() => vi.clearAllMocks());

  it("should create an account", async () => {
    const input = { userId: 4, amount: 0 };
    const acc = await createAccount(input);

    expect(acc).toBeDefined();
    expect(acc.id).toBeTypeOf("number");
    expect(acc.userId).toBe(4);
    expect(acc).toHaveProperty("amount", 0);
    expect(createAccountInRepository).toHaveBeenCalledWith(input);
  });

  it("should validate required fields on create", async () => {
    try {
      await createAccount({ amount: 100 }); 
      assert.fail("createAccount should have thrown for missing userId");
    } catch (e) {
      expect(e.name).toBe("HttpBadRequest");
      expect(e.statusCode).toBe(400);
    }
  });

  it("should get accounts by user id", async () => {
    const list = await getAccounts(4);
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(getAccountsFromRepository).toHaveBeenCalledWith(4);
    for (const a of list) expect(a.userId).toBe(4);
  });

  it("should delete an account by user and account id", async () => {
    const res = await deleteAccount(4, 10);
    expect(res).toBeDefined();
    expect(deleteAccountInRepository).toHaveBeenCalledWith(4, 10);
  });

  it("should validate ids on delete", async () => {
    try {
      await deleteAccount(undefined, 10);
      assert.fail("deleteAccount should have thrown for invalid userId");
    } catch (e) {
      expect(e.name).toBe("HttpBadRequest");
      expect(e.statusCode).toBe(400);
    }
  });
});
