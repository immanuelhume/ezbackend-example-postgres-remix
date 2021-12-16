import axios from "axios";

type NewPaste = {
  content: string;
  userId?: number;
};

export type Paste = {
  id: number;
  content: string;
  createdAt: string;
  userId?: number;
};

export async function savePaste(p: NewPaste): Promise<Paste> {
  let _p = Object.fromEntries(
    Object.entries(p).filter(([_, v]) => v !== null && v !== undefined)
  );
  const res = await axios.post(`${process.env.API_URL}/paste`, {
    ..._p,
  });

  return res.data;
}

export async function getPastes(limit: number = 10) {
  // by default, take the latest 10 pastes
  const res = await axios.get(`${process.env.API_URL}/paste/latest`, {
    params: { limit },
  });
  return res.data;
}

export async function getPasteById(id: string) {
  const res = await axios.get(`${process.env.API_URL}/paste/${id}`);
  return res.data;
}

// _getPastesForMe must be called on the client.
export async function _getPastesForMe(limit: number = 10) {
  try {
    const res = await axios.get(`${window.ENV.API_URL}/paste/me`, {
      withCredentials: true,
      // Set default limit as 10
      params: { limit },
    });
    return res.data;
  } catch (e) {
    return null;
  }
}
