import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export const TextInput = ({ className, ...props }: InputProps) => {
  return (
    <input
      onWheel={(e) => e.currentTarget.blur()} // disable scroll on number fields
      className={cn(
        "noscroll [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none", // hide arrows for number fields
        "w-full p-2 font-mono text-sm rounded-md grow border-0 outline hover:ring-1 hover:ring-offset-2   outline-gray-200  focus:ring-1 focus:ring-offset-2 transition-all duration-200",
        className,
      )}
      {...props}
    />
  );
};
