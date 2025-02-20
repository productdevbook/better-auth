import { type BetterFetchPlugin } from "@better-fetch/fetch";

export const redirectPlugin = {
	id: "redirect",
	name: "Redirect",
	hooks: {
		onSuccess(context) {
			if (context.data?.url && context.data?.redirect) {
				if (typeof window !== "undefined" && window.location) {
					if (window.location) {
						try {
							window.location.href = context.data.url;
						} catch {}
					}
				}
			}
		},
	},
} satisfies BetterFetchPlugin;

export const addCurrentURL = {
	id: "add-current-url",
	name: "Add current URL",
	hooks: {
		onRequest(context) {
			if (typeof window !== "undefined" && window.location) {
				if (window.location) {
					try {
						const url = new URL(context.url);
						url.searchParams.set("currentURL", window.location.href);
						context.url = url;
					} catch {}
				}
			}
			return context;
		},
	},
} satisfies BetterFetchPlugin;
