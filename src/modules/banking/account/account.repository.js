import { sql } from "../../../infrastructure/db";

export async function createAccountInRepository({ userId, amount = 0 }) {
  const rows = await sql`
    INSERT INTO accounts (userId, amount)
    VALUES (${userId}, ${amount})
    RETURNING *;
  `;
  return rows[0];
}

export async function getAccountsFromRepository(userId) {
  const rows = await sql`
    SELECT * FROM accounts WHERE userId = ${userId};
  `;
  return rows;
}

export async function deleteAccountInRepository(userId, accountId) {
  const rows = await sql`
    DELETE FROM accounts
    WHERE userId = ${userId} AND id = ${accountId}
    RETURNING *;
  `;
  return rows[0]; 
}
