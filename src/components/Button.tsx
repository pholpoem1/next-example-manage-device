import { ReactNode } from "react";

interface IButton {
  isDisabled: boolean;
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
}

const Button = ({ children, isDisabled, isLoading, className }: IButton) => {
  return (
    <button
      disabled={isDisabled}
      type="submit"
      className={`bg-blue-500 text-white px-4 py-2 rounded inline-flex ${className}`}
    >
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5 mr-3 text-white"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25 bg-blue-500"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
