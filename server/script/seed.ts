import { seedTenants } from "./seed/tenant.js";

seedTenants().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
