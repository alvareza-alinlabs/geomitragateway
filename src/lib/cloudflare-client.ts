const CF_API_URL = 'https://server.gmg-verifikasi.workers.dev/api/query';

export async function queryD1(query: string, params: any[] = []) {
  try {
    const response = await fetch(CF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, params }),
    });

    if (!response.ok) {
      throw new Error(`D1 Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("D1 Query Error:", err);
    throw err;
  }
}
