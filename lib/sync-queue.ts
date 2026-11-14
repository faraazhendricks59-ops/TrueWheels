export type QueuedActionType = "message" | "like" | "bid" | "listing_update";

export interface QueuedAction { id: string; type: QueuedActionType; payload: unknown; timestamp: number; }

type SyncWindow = Window & { syncQueue?: SyncQueue };

class SyncQueue {
  private readonly queueKey = "truewheels_sync_queue";

  constructor() {
    if (typeof window !== "undefined") (window as SyncWindow).syncQueue = this;
  }

  addAction(type: QueuedActionType, payload: unknown) {
    const action: QueuedAction = { id: `action_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`, type, payload, timestamp: Date.now() };
    const queue = this.getQueue();
    queue.push(action);
    this.writeQueue(queue);
    return action.id;
  }

  getQueue(): QueuedAction[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(this.queueKey);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed as QueuedAction[] : [];
    } catch {
      return [];
    }
  }

  async sync() {
    if (typeof navigator === "undefined" || !navigator.onLine) return;
    const queue = this.getQueue();
    for (const action of queue) {
      try { await this.processAction(action); }
      catch { return; }
    }
    if (queue.length > 0) this.clearQueue();
  }

  getQueueLength() { return this.getQueue().length; }
  clearQueue() { if (typeof window !== "undefined") window.localStorage.removeItem(this.queueKey); }
  private writeQueue(queue: QueuedAction[]) { if (typeof window !== "undefined") window.localStorage.setItem(this.queueKey, JSON.stringify(queue)); }
  private async processAction(_action: QueuedAction) { await new Promise((resolve) => window.setTimeout(resolve, 250)); }
}

export const syncQueue = new SyncQueue();
