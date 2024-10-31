export type ButtonType = {
  name: string;
  onClick: () => void;
};

export const Button = ({ name, onClick }: ButtonType) => {
  return (
    <button className="bg-cyan-900 text-white p-2 rounded-md" onClick={onClick}>
      {name}
    </button>
  );
};
