import { CircularProgress } from '@mui/material';

export type ButtonType = {
  name: string;
  loading?: boolean;
  onClick: () => void;
};

export const Button = ({ name, loading, onClick }: ButtonType) => {
  return (
    <button className='bg-cyan-900 text-white p-2 rounded-md' onClick={onClick}>
      {loading && <CircularProgress color='success' />} {name}
    </button>
  );
};
