// const API_URL = "";

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const { email } = credentials;
  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          ok: true,
          status: 200,
          data: {
            user: {
              userName: email.split('@')[0],
              email,
            },
            token: Math.floor(Math.random() * 16).toString(16),
          },
        }),
      2000,
    ),
  );
};
