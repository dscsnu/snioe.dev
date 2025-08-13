import type { PageLoad } from './$types';

export interface CoreMember {
  name: string;
  role: string;
  isCore: string; // "1" core, "0" subcore
  avatar?: string;
}
export interface TeamMember { name: string; role: string; avatar?: string }

interface ApiResponse {
  coreSubCore: CoreMember[];
  team: TeamMember[];
}

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/api/team');
  if (!res.ok) {
    return { core: [], subcore: [], grouped: {}, roles: [], error: true };
  }
  const json: ApiResponse = await res.json();
  const core = json.coreSubCore.filter(m => m.isCore === '1');
  const subcore = json.coreSubCore.filter(m => m.isCore !== '1');
  const grouped: Record<string, TeamMember[]> = {};
  for (const m of json.team) {
    const role = m.role.trim();
    if (!grouped[role]) grouped[role] = [];
    grouped[role].push(m);
  }
  const roles = Object.keys(grouped).sort();
  return { core, subcore, grouped, roles };
};
