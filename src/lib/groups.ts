/**
 * Groups, and what this project actually has of them.
 *
 * The phase brief asked for a groups directory seeded with three named communities
 * ("BMW M Owners SA", "Cape Town Track Days", "JDM Cape Town") carrying member
 * counts of 2 840, 1 420 and 980, post counts, "Active now" avatar stacks, a member
 * directory of named people with admin and moderator roles, and a creation flow
 * that answers with "Group ID: #GRP-88291".
 *
 * None of that machinery exists, and the repo already records why for each part:
 *
 *  - There is no groups service and no server. A group seeded into the code is a
 *    community that nobody created and nobody belongs to, and a member count on it
 *    is a number with nothing behind it. The three groups in the brief were invented,
 *    as were their counts.
 *  - There are no member accounts (src/lib/profile.ts, NO_FOLLOW_GRAPH), so a member
 *    directory would be a list of fabricated people, and the admin and moderator
 *    roles would be fabricated authority over a community that does not exist.
 *  - There is no post store (src/lib/social.ts, NO_POST_STORE), so a group feed has
 *    no posts to filter, and a post count is invented for the same reason.
 *  - A "Group ID" implies an identifier issued by a registry. Nothing issues one.
 *
 * What can be real is a group the reader creates, kept on their own device, exactly
 * as the digital garage keeps their own vehicles. So that is what this module
 * models: a local store of groups the reader made, with themselves as the only
 * member and the only admin. There is no join flow, because there is no one else's
 * group to join, and the UI says so rather than offering a button that cannot work.
 */

export const GROUPS_KEY = "truewheels_groups_v1";

export const GROUP_PRIVACY = ["public", "private", "secret"] as const;
export type GroupPrivacy = (typeof GROUP_PRIVACY)[number];

export const PRIVACY_LABELS: Record<GroupPrivacy, string> = {
  public: "Public",
  private: "Private",
  secret: "Secret",
};

export const PRIVACY_DESCRIPTIONS: Record<GroupPrivacy, string> = {
  public: "Anyone could see this group if there were a directory to list it in.",
  private: "Listed, with posts visible to members only.",
  secret: "Not listed anywhere, reachable by direct link only.",
};

/**
 * The accent is a fixed choice rather than a stored Tailwind class name.
 *
 * The brief passed `iconColor: "blue"` and interpolated it into `bg-${iconColor}`.
 * Tailwind scans source for complete class names, so a class assembled at runtime is
 * never generated and the element renders with no background at all. Each accent
 * here maps to literal class strings that the scanner can see.
 */
export const GROUP_ACCENTS = ["brand", "blue", "purple", "green", "amber", "pink"] as const;
export type GroupAccent = (typeof GROUP_ACCENTS)[number];

export const ACCENT_CLASSES: Record<GroupAccent, { solid: string; soft: string; text: string }> = {
  brand: { solid: "bg-brand", soft: "bg-brand/10", text: "text-brand" },
  blue: { solid: "bg-aurora-blue", soft: "bg-aurora-blue/10", text: "text-aurora-blue" },
  purple: { solid: "bg-aurora-purple", soft: "bg-aurora-purple/10", text: "text-aurora-purple" },
  green: { solid: "bg-semantic-success", soft: "bg-semantic-success/10", text: "text-semantic-success" },
  amber: { solid: "bg-semantic-warning", soft: "bg-semantic-warning/10", text: "text-semantic-warning" },
  pink: { solid: "bg-aurora-pink", soft: "bg-aurora-pink/10", text: "text-aurora-pink" },
};

export interface GroupRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  privacy: GroupPrivacy;
  accent: GroupAccent;
  /** ISO date the group was created on this device. */
  createdAt: string;
}

export const EMPTY_GROUPS: GroupRecord[] = [];

/** Turns a group name into a URL segment. Falls back so a name of only symbols still routes. */
export function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "group";
}

/** A slug that does not collide with one already in the store. */
export function uniqueSlug(name: string, existing: GroupRecord[], ignoreId?: string): string {
  const base = slugify(name);
  const taken = new Set(existing.filter((g) => g.id !== ignoreId).map((g) => g.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

function isPrivacy(value: unknown): value is GroupPrivacy {
  return typeof value === "string" && (GROUP_PRIVACY as readonly string[]).includes(value);
}

function isAccent(value: unknown): value is GroupAccent {
  return typeof value === "string" && (GROUP_ACCENTS as readonly string[]).includes(value);
}

/**
 * Reads a stored value defensively. A hand-edited or half-written entry must not
 * throw during hydration, so each field is checked and anything invalid is dropped
 * rather than trusted.
 */
export function parseGroups(raw: unknown): GroupRecord[] {
  if (!Array.isArray(raw)) return [];
  const out: GroupRecord[] = [];
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) continue;
    const record = entry as Record<string, unknown>;
    const { id, slug, name, description, privacy, accent, createdAt } = record;
    if (typeof id !== "string" || !id) continue;
    if (typeof slug !== "string" || !slug) continue;
    if (typeof name !== "string" || !name) continue;
    if (!isPrivacy(privacy)) continue;
    if (!isAccent(accent)) continue;
    out.push({
      id,
      slug,
      name,
      description: typeof description === "string" ? description : "",
      privacy,
      accent,
      createdAt: typeof createdAt === "string" ? createdAt : new Date(0).toISOString(),
    });
  }
  return out;
}

export const GROUPS_DISCLOSURE =
  "TrueWheels has no groups service. There is no directory of communities to browse and no server to host one, so nothing is listed here until you create a group on this device. A group you create is stored only in this browser and nobody else can see it, join it or post in it.";

export const NO_JOINABLE_GROUPS =
  "There are no other groups to join. A directory would need a server and member accounts, and this project has neither, so every group here is one you made yourself.";

export const NO_GROUP_MEMBERS =
  "This group has one member: you. There are no accounts in this project, so there is nobody else to list, and the admin role is simply whoever created the group on this device.";

export const NO_GROUP_POSTS =
  "There is no post store, so nothing can be published to this group and there is no group feed to show. The community feed's posts are labelled examples; none of them belongs to a group.";

export const NO_GROUP_EVENTS =
  "There is no events diary. Meets and track days are announced by their organisers on their own channels, and it is worth confirming with the venue before travelling.";

export const GROUP_LOCAL_ONLY =
  "Kept in this browser only. Clearing site data removes it, and it is not shared with anyone.";
