/**
 * The comment thread's content, and what it honestly is.
 *
 * This phase asked for a "trust-weighted" comment system carrying "deep-decoded
 * provenance" — Verified Driver, Certified Mechanic and Verified Dealer badges,
 * each backed by a source line. Those badges are the Phase 41 problem returning
 * under new names, and two of them are worse than the original:
 *
 *  - "Identity verified via CIPC/FICA" names two real South African regulators.
 *    CIPC registers companies and FICA obliges accountable institutions to
 *    identify clients. TrueWheels has done neither, so the line claims a check
 *    by bodies we have no relationship with. A dealer badge is also the one a
 *    buyer leans on hardest, and a fake one could cost someone their deposit.
 *  - "Certified Mechanic" claims we assessed someone's trade qualification.
 *    There is no qualification register here and no assessment of any kind.
 *
 * There is no verification of anyone anywhere in this project, so no badge is
 * shown. The authors below are labelled as examples, and their roles are written
 * as part of the example rather than as a fact about a person.
 *
 * The rest of the brief's data was invented in the same way: comment counts from
 * Math.random(), like counts, "additional comment loaded from pagination" bodies,
 * and avatar images from i.pravatar.cc. The avatars matter most, because the host
 * responds and serves a face. A photo of a person attached to a fabricated
 * handle is the most convincing lie on the page, and it is not ours to use.
 *
 * What is real: the posts below reference actual listings from the demo
 * catalogue, the pagination works over real data, and a reply the reader writes
 * is genuinely stored in their own browser.
 */

export interface CommentAuthor {
  name: string;
  handle: string;
  /**
   * What this example is pretending to be, shown with the disclosure that it is
   * part of the example. Not a claim about a real person.
   */
  roleLabel: string;
}

export interface CommentNode {
  id: string;
  parentId: string | null;
  author: CommentAuthor;
  content: string;
  /** ISO date, so the server and the browser render the same string. */
  postedAt: string;
  children: CommentNode[];
}

const EXAMPLE = "(example)";

/**
 * Seeded threads, keyed by post.
 *
 * Enough top-level comments to make the pagination real rather than a stub: the
 * first post has more than one page, so "show more" genuinely loads more.
 */
export const SEEDED_COMMENTS: Record<string, CommentNode[]> = {
  "p-1": [
    {
      id: "c-1-1",
      parentId: null,
      author: { name: "Demo mechanic", handle: "demo_wrench", roleLabel: `Mechanic ${EXAMPLE}` },
      content:
        "Worth checking the service history for the gearbox oil change. These boxes want it every 60 000 km and it is the interval people skip.",
      postedAt: "2026-11-15T07:10:00Z",
      children: [
        {
          id: "c-1-1-1",
          parentId: "c-1-1",
          author: { name: "Demo member", handle: "demo_gti", roleLabel: `Member ${EXAMPLE}` },
          content:
            "Good point. The listing says full service history, so I would ask for the invoices rather than just the stamp in the book.",
          postedAt: "2026-11-15T07:40:00Z",
          children: [],
        },
        {
          id: "c-1-1-2",
          parentId: "c-1-1",
          author: { name: "Demo member", handle: "demo_kzn", roleLabel: `Member ${EXAMPLE}` },
          content: "Same applies to the timing chain on the earlier engines. Ask when it was last done.",
          postedAt: "2026-11-15T08:05:00Z",
          children: [],
        },
      ],
    },
    {
      id: "c-1-2",
      parentId: null,
      author: { name: "Demo member", handle: "demo_bakkie", roleLabel: `Member ${EXAMPLE}` },
      content: "How is the ride on 18s? I am deciding between 17s and 18s on the same car.",
      postedAt: "2026-11-15T06:20:00Z",
      children: [
        {
          id: "c-1-2-1",
          parentId: "c-1-2",
          author: { name: "Demo member", handle: "demo_gti", roleLabel: `Member ${EXAMPLE}` },
          content:
            "Firmer than the 17s, but not harsh. It depends how bad the roads are where you drive.",
          postedAt: "2026-11-15T06:55:00Z",
          children: [],
        },
      ],
    },
    {
      id: "c-1-3",
      parentId: null,
      author: { name: "Demo seller", handle: "demo_dealer", roleLabel: `Seller ${EXAMPLE}` },
      content:
        "If you are comparing two of these, ask whether the mechatronic unit has been replaced and get the part number off the invoice.",
      postedAt: "2026-11-15T05:30:00Z",
      children: [],
    },
    {
      id: "c-1-4",
      parentId: null,
      author: { name: "Demo member", handle: "demo_cape", roleLabel: `Member ${EXAMPLE}` },
      content: "That colour looks better in person than in the photos. Congratulations.",
      postedAt: "2026-11-14T19:10:00Z",
      children: [],
    },
    {
      id: "c-1-5",
      parentId: null,
      author: { name: "Demo member", handle: "demo_gti", roleLabel: `Member ${EXAMPLE}` },
      content: "Thanks, all. I will pull the invoices together and add them to the listing.",
      postedAt: "2026-11-14T18:00:00Z",
      children: [],
    },
  ],
  "p-2": [
    {
      id: "c-2-1",
      parentId: null,
      author: { name: "Demo member", handle: "demo_kzn", roleLabel: `Member ${EXAMPLE}` },
      content:
        "On a bakkie of this age, check the load bin for rust under the rubber mat. It hides there for years.",
      postedAt: "2026-11-14T09:15:00Z",
      children: [
        {
          id: "c-2-1-1",
          parentId: "c-2-1",
          author: { name: "Demo member", handle: "demo_bakkie", roleLabel: `Member ${EXAMPLE}` },
          content: "Second this. Also check the tow bar mounting points while you are underneath.",
          postedAt: "2026-11-14T09:45:00Z",
          children: [],
        },
      ],
    },
    {
      id: "c-2-2",
      parentId: null,
      author: { name: "Demo mechanic", handle: "demo_wrench", roleLabel: `Mechanic ${EXAMPLE}` },
      content: "Ask when the injectors were last tested. It is an expensive job if they are due.",
      postedAt: "2026-11-14T08:20:00Z",
      children: [],
    },
    {
      id: "c-2-3",
      parentId: null,
      author: { name: "Demo member", handle: "demo_cape", roleLabel: `Member ${EXAMPLE}` },
      content: "What is it like on fuel on a long run? I do mostly open road.",
      postedAt: "2026-11-13T20:05:00Z",
      children: [],
    },
  ],
  "p-3": [
    {
      id: "c-3-1",
      parentId: null,
      author: { name: "Demo member", handle: "demo_gti", roleLabel: `Member ${EXAMPLE}` },
      content: "Check the clutch take-up on the test drive. It tells you a lot about how it was driven.",
      postedAt: "2026-11-13T11:30:00Z",
      children: [],
    },
    {
      id: "c-3-2",
      parentId: null,
      author: { name: "Demo member", handle: "demo_kzn", roleLabel: `Member ${EXAMPLE}` },
      content: "Nice honest listing. The interior photos are more useful than the usual three-quarter shots.",
      postedAt: "2026-11-13T10:15:00Z",
      children: [],
    },
  ],
};

/** Top-level comments shown per page. */
export const COMMENT_PAGE_SIZE = 3;

export const THREAD_DISCLOSURE =
  "There is no comment store, so nobody can post a comment and the thread below is an example. A reply you write is kept in this browser and no one else can see it. There is also no moderation queue, so comments cannot be reported or removed.";

export const ROLE_DISCLOSURE =
  "The role labels describe the example, not a real person. TrueWheels does not verify who anyone is, so no comment carries a verified or certified badge.";

export const COMMENT_COMPOSER_DISCLOSURE =
  "Saved in this browser. It is not published, and nobody else can see it.";

const REPLY_STORAGE_PREFIX = "truewheels_comment_replies:";

export interface StoredReply {
  id: string;
  parentId: string | null;
  content: string;
  postedAt: string;
}

export function readReplies(postId: string): StoredReply[] {
  try {
    const raw = window.localStorage.getItem(`${REPLY_STORAGE_PREFIX}${postId}`);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredReply[]) : [];
  } catch {
    return [];
  }
}

/**
 * Writes a reply. Throws on failure rather than swallowing it, so the caller can
 * roll the optimistic update back and tell the reader what happened. Storage
 * throws in private browsing and when the quota is full.
 */
export function writeReply(postId: string, reply: StoredReply): void {
  const next = [...readReplies(postId), reply];
  window.localStorage.setItem(`${REPLY_STORAGE_PREFIX}${postId}`, JSON.stringify(next));
}

/** The reader's own author record. They are the only real person here. */
export const READER_AUTHOR: CommentAuthor = {
  name: "You",
  handle: "you",
  roleLabel: "This device",
};

/** Attaches the reader's stored replies to the seeded tree. */
export function buildThread(postId: string): CommentNode[] {
  const seeded = (SEEDED_COMMENTS[postId] ?? []).map(cloneNode);
  const stored = readReplies(postId);

  for (const reply of stored) {
    const node: CommentNode = {
      id: reply.id,
      parentId: reply.parentId,
      author: READER_AUTHOR,
      content: reply.content,
      postedAt: reply.postedAt,
      children: [],
    };

    if (reply.parentId === null) {
      seeded.unshift(node);
      continue;
    }

    const parent = findNode(seeded, reply.parentId);
    if (parent) parent.children.push(node);
    else seeded.unshift({ ...node, parentId: null });
  }

  return seeded;
}

function cloneNode(node: CommentNode): CommentNode {
  return { ...node, children: node.children.map(cloneNode) };
}

function findNode(nodes: CommentNode[], id: string): CommentNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNode(node.children, id);
    if (found) return found;
  }
  return undefined;
}

/** Counts a node and everything under it. */
export function countReplies(node: CommentNode): number {
  return node.children.reduce((total, child) => total + 1 + countReplies(child), 0);
}

/** Every comment in a thread, top-level and nested. */
export function threadSize(nodes: CommentNode[]): number {
  return nodes.reduce((total, node) => total + 1 + countReplies(node), 0);
}
