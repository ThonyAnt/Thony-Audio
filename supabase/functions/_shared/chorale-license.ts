// ════════════════════════════════════════════════════════════════════════════
//  CHORALE license keyfile generator — TypeScript port of JUCE
//  KeyGeneration::generateKeyFile. Produces .chorale-license content byte-compatible
//  with the plugin's applyKeyFile. Dependency-free (Deno / Node).
//
//  ⚠ KEEP IN SYNC with the canonical copy in the Chorale repo:
//    installer/licensing/keygen-ts/chorale-license.ts
//  (verified there against the plugin's C++ --verify). If you change the plugin's
//  product id or machine sentinel, update both.
// ════════════════════════════════════════════════════════════════════════════

function modPow(base: bigint, exp: bigint, m: bigint): bigint {
  base %= m;
  let result = 1n;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % m;
    exp >>= 1n;
    base = (base * base) % m;
  }
  return result;
}

// JUCE RSAKey::applyToValue — base-`mod` digits, RSA each, reversed order (round-trips for any length).
function applyToValue(value: bigint, exp: bigint, mod: bigint): bigint {
  let result = 0n;
  while (value !== 0n) {
    result *= mod;
    const remainder = value % mod;
    value /= mod;
    result += modPow(remainder, exp, mod);
  }
  return result;
}

function bytesToLittleEndianBigInt(bytes: Uint8Array): bigint {
  let v = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) v = (v << 8n) | BigInt(bytes[i]);
  return v;
}

function parseKey(key: string): { exp: bigint; mod: bigint } {
  const [e, n] = key.split(",");
  if (!e || !n) throw new Error('Invalid RSA key (expected "expHex,modHex")');
  return { exp: BigInt("0x" + e.trim()), mod: BigInt("0x" + n.trim()) };
}

export interface LicenseInfo {
  appName: string;
  email: string;
  userName: string;
  machineNumbers: string;
  privateKey: string;
  dateMs?: number;
}

export function generateKeyFile(info: LicenseInfo): string {
  const user = info.userName.replace(/ /g, "_");
  const dateMs = info.dateMs ?? Date.now();
  const xml =
    `<key user="${user}" email="${info.email}" mach="${info.machineNumbers}" ` +
    `app="${info.appName}" date="${dateMs.toString(16)}"/>`;

  const message = bytesToLittleEndianBigInt(new TextEncoder().encode(xml));
  const { exp, mod } = parseKey(info.privateKey);
  const signed = applyToValue(message, exp, mod);

  const comment = [
    `Keyfile for ${info.appName}`,
    user ? `User: ${user}` : null,
    `Email: ${info.email}`,
    `Machine numbers: ${info.machineNumbers}`,
    `Created: ${new Date(dateMs).toUTCString()}`,
  ].filter(Boolean).join("\r\n");

  const lines: string[] = [comment, ""];
  let asHex = "#" + signed.toString(16);
  while (asHex.length > 0) { lines.push(asHex.slice(0, 70)); asHex = asHex.slice(70); }
  lines.push("");
  return lines.join("\r\n");
}
