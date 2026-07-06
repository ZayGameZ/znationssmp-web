const encoder = new TextEncoder();
const iterations = 120000;

export async function hashPassword(password: string) {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const hash = await pbkdf2(password, salt);
  return `pbkdf2$${iterations}$${toBase64(salt)}$${toBase64(new Uint8Array(hash))}`;
}

export async function verifyPassword(password: string, storedHash: string | null | undefined) {
  if (!storedHash) return false;
  const [scheme, iterationText, saltText, hashText] = storedHash.split("$");
  if (scheme !== "pbkdf2" || !iterationText || !saltText || !hashText) return false;
  const salt = fromBase64(saltText);
  const expected = fromBase64(hashText);
  const actual = new Uint8Array(await pbkdf2(password, salt, Number(iterationText)));
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let index = 0; index < actual.length; index += 1) diff |= actual[index] ^ expected[index];
  return diff === 0;
}

async function pbkdf2(password: string, salt: Uint8Array, rounds = iterations) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const saltBuffer = salt.buffer.slice(salt.byteOffset, salt.byteOffset + salt.byteLength) as ArrayBuffer;
  return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: saltBuffer, iterations: rounds }, key, 256);
}

function toBase64(value: Uint8Array) {
  return Buffer.from(value).toString("base64");
}

function fromBase64(value: string) {
  return new Uint8Array(Buffer.from(value, "base64"));
}
