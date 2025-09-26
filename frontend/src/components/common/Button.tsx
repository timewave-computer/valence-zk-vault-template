import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const buttonVariants = cva("inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-sm hover:shadow-md", {
    variants: {
        variant: {
            primary: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
            secondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
        },
        isDisabled: {
            true: "opacity-50 cursor-not-allowed",
        },
    },
});

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = ({ children, onClick, variant, isDisabled }: ButtonProps) => {
    return (
        <button
        onClick={onClick}
        disabled={isDisabled ?? false}
        className={cn(buttonVariants({ variant, isDisabled }))}
      >
        {children}
      </button>
    );
};