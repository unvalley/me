import { Image } from "@/components/Image";
import { PageTitle } from "@/components/PageTitle";
import { PageSEO } from "@/components/SEO";
import SocialIcon from "@/components/social-icons";
import type { Authors } from "contentlayer/generated";
import type { ReactNode } from "react";
import { projectsData } from "@/data/index";
import { CustomLink } from "@/components/Link";

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
                    <PageTitle>ABOUT</PageTitle>
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
                        <h3 className="pt-4 pb-2 text-xl leading-8 tracking-tight">
                            {name}
                        </h3>
                    </div>
                    <div className="prose max-w-none pt-8 pb-8 dark:prose-dark xl:col-span-2">
                        {children}
                    </div>
                </div>
                <div>
                    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                        <h2
                            className="
        leading-9
        tracking-tight
        text-gray-900
        dark:text-gray-100
        sm:text-2xl
        sm:leading-10
        md:text-2xl
        md:leading-14
        font-helvetica
                        "
                        >
                            PROJECTS
                        </h2>
                    </div>
                    <div className="-m-4 space-y-2">
                        {projectsData.map((d) => (
                            <div key={d.title}>
                                <CustomLink
                                    href={d.href}
                                    className="flex gap-x-4 px-4 pt-4 rounded-[12px] border-none hover:bg-primary-100 dark:hover:bg-primary-900 group"
                                >
                                    <div className="flex flex-col text-sm border-b border-primary-100 dark:border-primary-900  flex-auto  pb-4 text-primary-700 group-hover:border-transparent dark:text-primary-300">
                                        <div className="text-lg">{d.title}</div>
                                        <div className="text-primary-500 dark:text-primary-500 flex justify-between gap-x-2 items-center">
                                            <div>{d.description}</div>
                                        </div>
                                    </div>
                                </CustomLink>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
