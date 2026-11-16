import { useSyncExternalStore } from "react";
import { INITIAL_SOCIAL_ACCOUNTS, SocialAccount } from "./socialData";

// Tiny in-memory store so the analytics account switcher and the
// "Connected Accounts" screen share the same mock connection state.
let accounts: SocialAccount[] = INITIAL_SOCIAL_ACCOUNTS;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return accounts;
}

export function updateSocialAccounts(updater: (prev: SocialAccount[]) => SocialAccount[]) {
  accounts = updater(accounts);
  listeners.forEach((l) => l());
}

export function useSocialAccounts() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
