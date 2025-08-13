import { google } from 'googleapis';
import {GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_KEY, GOOGLE_SHEETS_TEAM_SPREADSHEET_ID} from '$env/static/private';
function getAuth() {
  const clientEmail = GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!clientEmail || !privateKey) {
    throw new Error('Missing Google service account env vars');
  }
  privateKey = privateKey.replace(/\\n/g, '\n');
  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });
}

export interface TeamMember {
  name: string;
  role: string;
  isCore?: string;
  avatar?: string;
}

export async function fetchTeam(): Promise<TeamMember[]> {
  const spreadsheetId = GOOGLE_SHEETS_TEAM_SPREADSHEET_ID;
  const range = "TeamMembers!A2:B";
  if (!spreadsheetId) throw new Error('GOOGLE_SHEETS_TEAM_SPREADSHEET_ID not set');

  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = res.data.values || [];
  return rows.map((r) => ({
    name: r[0] || '',
    role: r[1] || '',
    track: r[2] || undefined,
    avatar: r[3] || undefined
  })).filter(r => r.name && r.role);
}

export async function coreFetchTeam(): Promise<TeamMember[]> {
  const spreadsheetId = GOOGLE_SHEETS_TEAM_SPREADSHEET_ID;
  const range = "CoreSubcore!A2:D";
  if (!spreadsheetId) throw new Error('GOOGLE_SHEETS_TEAM_SPREADSHEET_ID not set');

  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = res.data.values || [];
  return rows.map((r) => ({
    name: r[0] || '',
    role: r[1] || '',
    isCore: r[2] || undefined,
    avatar: r[3] || undefined
  })).filter(r => r.name && r.role);
}