import { test, expect, request } from "@playwright/test";

test.describe("Users API (JSON Server)", () => {
  test("CRUD: create -> list -> get -> update -> delete", async () => {
    const api = await request.newContext({ baseURL: "http://localhost:3001" });

    const uniq = Date.now();
    const payload = { username: `carol-${uniq}`, email: `carol${uniq}@example.com` };

    const createRes = await api.post("/users", { data: payload });
    expect(createRes.ok()).toBeTruthy();
    const created = await createRes.json();
    expect(created.id).toBeTruthy();
    expect(created.username).toBe(payload.username);

    const id = created.id;

    const listRes = await api.get("/users");
    expect(listRes.ok()).toBeTruthy();
    const list = await listRes.json();
    expect(list.some((u: any) => u.id === id)).toBe(true);

    const getRes = await api.get(`/users/${id}`);
    expect(getRes.ok()).toBeTruthy();
    const got = await getRes.json();
    expect(got.email).toBe(payload.email);

    const newEmail = `carol${uniq}+updated@example.com`;
    const patchRes = await api.patch(`/users/${id}`, { data: { email: newEmail } });
    expect(patchRes.ok()).toBeTruthy();
    const patched = await patchRes.json();
    expect(patched.email).toBe(newEmail);

    const delRes = await api.delete(`/users/${id}`);
    expect(delRes.ok()).toBeTruthy();

    const afterRes = await api.get(`/users/${id}`);
    expect(afterRes.status()).toBe(404);
  });
});
