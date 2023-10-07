import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export const PageTitle = ({ children }: Props) => {
    return (
        <h1
            className="text-3xl
        leading-9
        tracking-tight
        text-gray-900
        dark:text-gray-100
        sm:text-2xl
        sm:leading-10
        md:text-3xl
        md:leading-14
        font-helvetica
        uppercase
        "
        >
            {children}
        </h1>
    );
};
