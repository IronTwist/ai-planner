export const blobRepository = {
  getImageByUrl: async (url: string | undefined) => {
    const params = `?url=${url}`;
    const resp = await fetch(`/api/notes/upload` + params, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/image',
        'Access-Control-Allow-Origin': '*',
      },
    });

    const data = await resp.blob();

    console.log('respVercelBlob: ', data);
    return data;
  },
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
