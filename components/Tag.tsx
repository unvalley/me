import { kebabCase } from "@/lib/utils/kebabCase";
import Link from "next/link";

type Props = {
	text: string;
};

export const Tag = ({ text }: Props) => {
	return (
        <Link
            href={`/tags/${kebabCase(text)}`}
            className="mr-3 text-sm font-medium text-primary-800 hover:text-primary-500 dark:hover:text-primary-400">
            #{text.split(" ").join("-")}
        </Link>
    );
};
