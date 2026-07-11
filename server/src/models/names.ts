export const Models = Object.freeze({
  // ── infrastructure ────────────────────────────────────────────
  Admin: Object.freeze({
    ref: "Admin",
    collection: "admins"
  }),
  Token: Object.freeze({
    ref: "Token",
    collection: "tokens"
  }),
  RequestLog: Object.freeze({
    ref: "RequestLog",
    collection: "requestlogs"
  }),
  Credential: Object.freeze({
    ref: "Credential",
    collection: "credentials"
  }),

  // ── core ──────────────────────────────────────────────────────
  Tenant: Object.freeze({
    ref: "Tenant",
    collection: "tenants"
  }),
  Website: Object.freeze({
    ref: "Website",
    collection: "websites"
  }),
  Branch: Object.freeze({
    ref: "Branch",
    collection: "branches"
  }),
  Staff: Object.freeze({
    ref: "Staff",
    collection: "staffs"
  }),
  Role: Object.freeze({
    ref: "Role",
    collection: "roles"
  }),
  MenuItem: Object.freeze({
    ref: "MenuItem",
    collection: "menuitems"
  }),
  CustomFieldDefinition: Object.freeze({
    ref: "CustomFieldDefinition",
    collection: "customfielddefinitions"
  }),
  Form: Object.freeze({
    ref: "Form",
    collection: "forms"
  }),
  AuditLog: Object.freeze({
    ref: "AuditLog",
    collection: "auditlogs"
  }),

  // ── crm ───────────────────────────────────────────────────────
  Customer: Object.freeze({
    ref: "Customer",
    collection: "customers"
  }),
  Lead: Object.freeze({
    ref: "Lead",
    collection: "leads"
  }),
  Engagement: Object.freeze({
    ref: "Engagement",
    collection: "engagements"
  }),
  Reminder: Object.freeze({
    ref: "Reminder",
    collection: "reminders"
  }),

  // ── scheduling ────────────────────────────────────────────────
  Appointment: Object.freeze({
    ref: "Appointment",
    collection: "appointments"
  }),
  RecurringAppointment: Object.freeze({
    ref: "RecurringAppointment",
    collection: "recurringappointments"
  }),
  Resource: Object.freeze({
    ref: "Resource",
    collection: "resources"
  }),
  Availability: Object.freeze({
    ref: "Availability",
    collection: "availabilities"
  }),
  Reservation: Object.freeze({
    ref: "Reservation",
    collection: "reservations"
  }),

  // ── catalog ───────────────────────────────────────────────────
  CatalogItem: Object.freeze({
    ref: "CatalogItem",
    collection: "catalogitems"
  }),
  Category: Object.freeze({
    ref: "Category",
    collection: "categories"
  }),
  Package: Object.freeze({
    ref: "Package",
    collection: "packages"
  }),
  Inventory: Object.freeze({
    ref: "Inventory",
    collection: "inventories"
  }),

  // ── menu ──────────────────────────────────────────────────────
  FoodMenu: Object.freeze({
    ref: "FoodMenu",
    collection: "foodmenus"
  }),
  FoodMenuItem: Object.freeze({
    ref: "FoodMenuItem",
    collection: "foodmenuitems"
  }),

  // ── ordering ──────────────────────────────────────────────────
  Order: Object.freeze({
    ref: "Order",
    collection: "orders"
  }),

  // ── floor ─────────────────────────────────────────────────────
  Floor: Object.freeze({
    ref: "Floor",
    collection: "floors"
  }),
  Table: Object.freeze({
    ref: "Table",
    collection: "tables"
  }),

  // ── billing ───────────────────────────────────────────────────
  Invoice: Object.freeze({
    ref: "Invoice",
    collection: "invoices"
  }),
  Payment: Object.freeze({
    ref: "Payment",
    collection: "payments"
  }),
  Subscription: Object.freeze({
    ref: "Subscription",
    collection: "subscriptions"
  }),

  // ── reputation ────────────────────────────────────────────────
  Review: Object.freeze({
    ref: "Review",
    collection: "reviews"
  }),
  ReviewSource: Object.freeze({
    ref: "ReviewSource",
    collection: "reviewsources"
  }),

  // ── loyalty ───────────────────────────────────────────────────
  LoyaltyAccount: Object.freeze({
    ref: "LoyaltyAccount",
    collection: "loyaltyaccounts"
  }),
  LoyaltyTransaction: Object.freeze({
    ref: "LoyaltyTransaction",
    collection: "loyaltytransactions"
  }),
  Referral: Object.freeze({
    ref: "Referral",
    collection: "referrals"
  }),

  // ── automation ────────────────────────────────────────────────
  Automation: Object.freeze({
    ref: "Automation",
    collection: "automations"
  }),
  AutomationLog: Object.freeze({
    ref: "AutomationLog",
    collection: "automationlogs"
  }),

  // ── analytics ─────────────────────────────────────────────────
  Event: Object.freeze({
    ref: "Event",
    collection: "events"
  }),
  MetricSnapshot: Object.freeze({
    ref: "MetricSnapshot",
    collection: "metricsnapshots"
  }),

  // ── verticals ─────────────────────────────────────────────────
  Patient: Object.freeze({
    ref: "Patient",
    collection: "patients"
  }),
  Prescription: Object.freeze({
    ref: "Prescription",
    collection: "prescriptions"
  }),
  Medicine: Object.freeze({
    ref: "Medicine",
    collection: "medicines"
  }),
  PrescribedMedicine: Object.freeze({
    ref: "PrescribedMedicine",
    collection: "prescribedmedicines"
  }),
  Department: Object.freeze({
    ref: "Department",
    collection: "departments"
  }),
  LabOrder: Object.freeze({
    ref: "LabOrder",
    collection: "laborders"
  }),
  Vital: Object.freeze({
    ref: "Vital",
    collection: "vitals"
  }),
  Visit: Object.freeze({
    ref: "Visit",
    collection: "visits"
  }),
  Media: Object.freeze({
    ref: "Media",
    collection: "media"
  })
} as const);
