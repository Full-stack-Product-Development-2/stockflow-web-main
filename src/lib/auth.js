import { mockUsers } from "@/data/mock/auth";

export async function signInWithPassword({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = mockUsers.find(
    (user) => user.email === normalizedEmail && user.password === password,
  );

  if (!account) return null;

  return {
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    role: account.role,
  };
}
