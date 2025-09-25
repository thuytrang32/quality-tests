import {
  createAccountInRepository,
  getAccountsFromRepository,
  deleteAccountInRepository,
} from "./account.repository.js";
import { HttpBadRequest } from "@httpx/exception";

export async function createAccount(data) {
  if (!data || typeof data.userId !== "number") {
    throw new HttpBadRequest("Missing required fields");
  }
  return createAccountInRepository(data);
}

export async function getAccounts(userId) {
  if (typeof userId !== "number") {
    throw new HttpBadRequest("Invalid userId");
  }
  return getAccountsFromRepository(userId);
}

export async function deleteAccount(userId, accountId) {
  if (typeof userId !== "number" || typeof accountId !== "number") {
    throw new HttpBadRequest("Invalid ids");
  }
  return deleteAccountInRepository(userId, accountId);
}
