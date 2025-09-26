import { cn } from '@/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export const TextInput = ({ className, ...props }: InputProps) => {
  return (
    <input
    
      className={cn(
        'w-full p-2 font-mono text-sm rounded-md grow border-0 outline outline-gray-200 focus:outline-none focus:ring-1 focus:ring-offset-2',
        className
      )}
      {...props}

    />
  );
};