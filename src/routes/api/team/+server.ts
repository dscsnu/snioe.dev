import type { RequestHandler } from './$types';
import { fetchTeam, coreFetchTeam } from '$lib/server/googleSheets';

let cache: { at: number; data: unknown } | null = null;
const TTL_MS = 60_000;

export const GET: RequestHandler = async () => {
	try {
        console.log(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
		const now = Date.now();
		if (cache && now - cache.at < TTL_MS) {
			return new Response(JSON.stringify(cache.data), {
				headers: { 'content-type': 'application/json', 'x-cache': 'HIT' }
			});
		}
		const team = await fetchTeam();
        const coreSubCore = await coreFetchTeam();
        console.log(team);
        console.log(coreSubCore);
		cache = { at: now, data: {"coreSubCore": coreSubCore, "team": team} };
		return new Response(JSON.stringify({"coreSubCore": coreSubCore, "team": team}), {
			headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=30' }
		});
	} catch (err: any) {
		return new Response(JSON.stringify({ error: 'Failed to load team', detail: err.message }), { status: 500 });
	}
};

