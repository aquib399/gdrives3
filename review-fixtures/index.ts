import { applyDiscount } from "./fixture-04";
import { average } from "./fixture-06";
import { findById } from "./fixture-08";
import { groupByStatus } from "./fixture-09";
import { hasPermission } from "./fixture-01";
import { isExpired } from "./fixture-07";
import { mergeSettings } from "./fixture-05";
import { paginate } from "./fixture-02";
import { uniqueTags } from "./fixture-03";

export function runReviewFixtures() {
  return {
    permission: hasPermission("viewer", "admin"),
    page: paginate([1, 2, 3], 1, 2),
    tags: uniqueTags(["a", "a", "b"]),
    price: applyDiscount(100, 10),
    settings: mergeSettings({ theme: "light" }, { theme: "dark" }),
    mean: average([2, 4]),
    expired: isExpired(new Date(0)),
    item: findById([{ id: "one" }], "missing"),
    groups: groupByStatus([{ status: "ready" }])
  };
}
