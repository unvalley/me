import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	className?: string;
};

export const PageTitle = ({ children, className }: Props) => {
	return (
		<h1
			className={`text-3xl
        leading-9
        tracking-tight
        text-gray-900
        dark:text-gray-100
        sm:text-2xl
        sm:leading-10
        md:leading-14
        font-helvetica
         ${className}
        `}
		>
			{children}
		</h1>
	);
};
