// Seeds one tenant per in-scope business vertical (clinic, restaurant, salon),
// each with a batch of staff, entirely through the real HTTP API — no direct
// database writes. Safe to re-run: anything that already exists is skipped,
// nothing is ever deleted or overwritten.
//
// Requires the backend to already be running (e.g. `npm run dev`) and
// running outside production, since it relies on the fixed dev OTP code and
// on the invite endpoint returning the invite token directly (both of which
// are disabled in production).
//
// Run with:  npx tsx script/seed/tenant.ts
// or:        npm run seed

const BASE_URL = process.env.SEED_BASE_URL ?? "http://localhost:8082";
const PASSWORD = "1234567890";
const DEV_OTP_CODE = "123456"; // fixed outside production — see src/clients/otp.ts
const STAFF_PER_TENANT = 10;

interface ApiEnvelope<T> {
  error: boolean;
  message: string;
  data: T | null;
}

interface ApiResult<T> {
  status: number;
  envelope: ApiEnvelope<T>;
}

async function apiFetch<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string } = {}
): Promise<ApiResult<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });

  const envelope = (await res.json()) as ApiEnvelope<T>;
  return { status: res.status, envelope };
}

interface VerticalSeed {
  vertical: "clinic" | "restaurant" | "salon";
  businessName: string;
}

// Only the three business types currently in active development.
const VERTICALS: VerticalSeed[] = [
  { vertical: "clinic", businessName: "Clinic One" },
  { vertical: "restaurant", businessName: "Restaurant One" },
  { vertical: "salon", businessName: "Salon One" }
];

// Tenant email pattern: {vertical}1@gmail.com (e.g. clinic1@gmail.com).
// Staff email pattern: {vertical}-staff{n}@gmail.com (e.g. clinic-staff1@gmail.com)
// — prefixed by vertical rather than a bare "staff1@gmail.com" because Staff
// email is globally unique across all tenants, not just within one tenant,
// so a shared bare counter would collide across the three seeded tenants.

async function signUpOrReuseTenant(seed: VerticalSeed): Promise<string | null> {
  const email = `${seed.vertical}1@gmail.com`;

  const otpRes = await apiFetch<{ otpRequestId: string }>(
    "/api/tenant/v1/auth/signup/send-otp",
    { method: "POST", body: { email } }
  );

  if (otpRes.status === 409) {
    console.log(`  Tenant ${email} already exists — will sign in instead.`);
    return email;
  }
  if (otpRes.envelope.error || !otpRes.envelope.data?.otpRequestId) {
    console.error(
      `  Could not start sign-up for ${email}: ${otpRes.envelope.message}`
    );
    return null;
  }

  const signUpRes = await apiFetch("/api/tenant/v1/auth/signup", {
    method: "POST",
    body: {
      details: {
        businessName: seed.businessName,
        email,
        vertical: seed.vertical,
        otpRequestId: otpRes.envelope.data.otpRequestId,
        otpCode: DEV_OTP_CODE
      },
      credentials: { password: PASSWORD, mfaType: "none" }
    }
  });

  if (signUpRes.envelope.error) {
    console.error(
      `  Failed to sign up tenant ${email}: ${signUpRes.envelope.message}`
    );
    return null;
  }

  console.log(`  Created tenant "${seed.businessName}" (${email})`);
  return email;
}

async function signInTenant(email: string): Promise<string | null> {
  const res = await apiFetch<{ accessToken: string }>(
    "/api/tenant/v1/auth/signin",
    { method: "POST", body: { email, password: PASSWORD } }
  );

  if (res.envelope.error || !res.envelope.data?.accessToken) {
    console.error(
      `  Failed to sign in tenant ${email}: ${res.envelope.message}`
    );
    return null;
  }
  return res.envelope.data.accessToken;
}

async function seedStaffMember(
  tenantToken: string,
  vertical: string,
  index: number
): Promise<void> {
  const email = `${vertical}-staff${index}@gmail.com`;
  const firstName = "Staff";
  const lastName = String(index);
  const label = `${firstName} ${lastName} (${email})`;

  const inviteRes = await apiFetch<{
    staff: { _id: string };
    inviteToken?: string;
  }>("/api/tenant/v1/staff/invite", {
    method: "POST",
    token: tenantToken,
    body: { email, firstName, lastName }
  });

  if (inviteRes.status === 409) {
    console.log(`    ${label} already exists — skipping.`);
    return;
  }
  if (
    inviteRes.envelope.error ||
    !inviteRes.envelope.data?.inviteToken ||
    !inviteRes.envelope.data?.staff?._id
  ) {
    console.error(
      `    Failed to invite ${label}: ${inviteRes.envelope.message}`
    );
    return;
  }

  const staffId = inviteRes.envelope.data.staff._id;
  const inviteToken = inviteRes.envelope.data.inviteToken;

  const onboardRes = await apiFetch("/api/staff/v1/auth/onboard", {
    method: "POST",
    body: { token: inviteToken, firstName, lastName, password: PASSWORD }
  });
  if (onboardRes.envelope.error) {
    console.error(
      `    Failed to onboard ${label}: ${onboardRes.envelope.message}`
    );
    return;
  }

  const approveRes = await apiFetch(`/api/tenant/v1/staff/${staffId}/approve`, {
    method: "PATCH",
    token: tenantToken
  });
  if (approveRes.envelope.error) {
    console.error(
      `    Failed to approve ${label}: ${approveRes.envelope.message}`
    );
    return;
  }

  // A staff member needs a linked, active bookable resource to actually be
  // able to sign in (checked at sign-in time) or receive appointments.
  const resourceRes = await apiFetch("/api/tenant/v1/resources", {
    method: "POST",
    token: tenantToken,
    body: {
      name: `${firstName} ${lastName}`,
      resourceType: "staff",
      linkedUserId: staffId
    }
  });
  if (resourceRes.envelope.error) {
    console.error(
      `    Invited/onboarded/approved ${label}, but failed to create their bookable resource: ${resourceRes.envelope.message}`
    );
    return;
  }

  console.log(`    ${label} ready — invited, onboarded, approved, bookable.`);
}

export async function seedTenants(): Promise<void> {
  console.log(
    `Seeding against ${BASE_URL} (password for every account: "${PASSWORD}").`
  );
  console.log(
    "This only creates data — nothing existing is modified or deleted.\n"
  );

  for (const seed of VERTICALS) {
    console.log(`=== ${seed.businessName} (${seed.vertical}) ===`);

    const email = await signUpOrReuseTenant(seed);
    if (!email) {
      console.log("  Skipping this tenant's staff — sign-up/lookup failed.\n");
      continue;
    }

    const token = await signInTenant(email);
    if (!token) {
      console.log("  Skipping this tenant's staff — sign-in failed.\n");
      continue;
    }

    for (let i = 1; i <= STAFF_PER_TENANT; i++) {
      await seedStaffMember(token, seed.vertical, i);
    }

    console.log("");
  }

  console.log("Seeding complete.");
}
