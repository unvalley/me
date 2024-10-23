import type { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export const SectionContainer = function SectionContainer({ children }: Props) {
	return (
		<div className="mx-auto my-auto max-w-2xl px-4 sm:px-6 xl:max-w-2xl xl:px-0">
			{children}
		</div>
	);
};
