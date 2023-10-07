import { Image } from "@/components/Image";
import { PageTitle } from "@/components/PageTitle";
import { PageSEO } from "@/components/SEO";
import SocialIcon from "@/components/social-icons";
import type { Authors } from "contentlayer/generated";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    content: Omit<Authors, "_id" | "_raw" | "body">;
}

export default function AuthorLayout({ children, content }: Props) {
    const { name, avatar, job, email, x, linkedin, github } = content;

    return (
        <>
            <PageSEO
                title={`About - ${name}`}
                description={`About me - ${name}`}
            />
            <div className="divide-y">
                <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                    <PageTitle>About</PageTitle>
                </div>
                <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
                    <div className="flex flex-col items-center pt-8">
                        <Image
                            src={avatar}
                            alt="avatar"
                            width={150}
                            height={150}
                            className="h-48 w-48 rounded-full"
                        />
                        <h3 className="pt-4 pb-2 text-2xl leading-8 tracking-tight">
                            {name}
                        </h3>
                    </div>
                    <div className="prose max-w-none pt-8 pb-8 dark:prose-dark xl:col-span-2">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
