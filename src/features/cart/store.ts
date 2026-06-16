import { useSyncExternalStore } from 'react';

let drawerOpen = false;
const listeners = new Set<() => void>();

function emit() {
	for (const listener of listeners) {
		listener();
	}
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export const CartStore = {
	get drawerOpen() {
		return drawerOpen;
	},
	setDrawerOpen(open: boolean) {
		drawerOpen = open;
		emit();
	},
	openDrawer() {
		this.setDrawerOpen(true);
	},
	closeDrawer() {
		this.setDrawerOpen(false);
	},
	toggleDrawer() {
		this.setDrawerOpen(!drawerOpen);
	},
	subscribe,
};

export function useCartDrawerOpen() {
	return useSyncExternalStore(subscribe, () => drawerOpen, () => false);
}
