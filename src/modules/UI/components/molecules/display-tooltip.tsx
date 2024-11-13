import { IconButton, Tooltip } from '@mui/material';

export type TooltipProps = {
  title: string;
  content: React.ReactNode;
};

export const DisplayTooltip = ({ title, content }: TooltipProps) => {
  return (
    <Tooltip sx={{ fontSize: '1rem', borderRadius: '10px' }} title={title}>
      <IconButton>{content}</IconButton>
    </Tooltip>
  );
};
