import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Match, BroadcastState } from "@/lib/supabase/types";

interface MpflDB extends DBSchema {
  matches: {
    key: string;
    value: Match;
  };
  broadcast_state: {
    key: string;
    value: BroadcastState;
  };
  pending_actions: {
    key: number;
    value: {
      id?: number;
      table: string;
      action: "upsert" | "update" | "delete";
      payload: Record<string, unknown>;
      timestamp: number;
    };
    autoIncrement: true;
  };
}

let db: IDBPDatabase<MpflDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<MpflDB>> {
  if (db) return db;
  db = await openDB<MpflDB>("mpfl-gfx", 1, {
    upgrade(database) {
      database.createObjectStore("matches", { keyPath: "id" });
      database.createObjectStore("broadcast_state", { keyPath: "id" });
      database.createObjectStore("pending_actions", {
        keyPath: "id",
        autoIncrement: true,
      });
    },
  });
  return db;
}

export async function cacheMatch(match: Match) {
  const database = await getDB();
  await database.put("matches", match);
}

export async function getCachedMatch(id: string): Promise<Match | undefined> {
  const database = await getDB();
  return database.get("matches", id);
}

export async function cacheBroadcastState(state: BroadcastState) {
  const database = await getDB();
  await database.put("broadcast_state", state);
}

export async function getCachedBroadcastState(): Promise<BroadcastState | undefined> {
  const database = await getDB();
  return database.get("broadcast_state", "main");
}

export async function queuePendingAction(
  table: string,
  action: "upsert" | "update" | "delete",
  payload: Record<string, unknown>
) {
  const database = await getDB();
  await database.add("pending_actions", {
    table,
    action,
    payload,
    timestamp: Date.now(),
  });
}

export async function flushPendingActions(
  onFlush: (
    table: string,
    action: string,
    payload: Record<string, unknown>
  ) => Promise<void>
) {
  const database = await getDB();
  const actions = await database.getAll("pending_actions");
  for (const action of actions) {
    await onFlush(action.table, action.action, action.payload);
    if (action.id !== undefined) {
      await database.delete("pending_actions", action.id);
    }
  }
}
