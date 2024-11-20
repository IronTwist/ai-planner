export const blobRepository = {
  delete: async (url: string | undefined) => {
    const resp = await fetch(`/api/notes/upload`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    const data = await resp.json();
    return data;
  },
};
