import type { Metadata } from "next";
import Image from "next/image";
import { CustomLink } from "@/components/Link";
import { PageTitle } from "@/components/PageTitle";
import { projectsData, talks } from "@/data/index";

export const metadata: Metadata = {
  title: "About",
  description: "About the author of this blog.",
};

export default async function About() {
  const { default: MDXContent, metadata: authorData } = await import(
    "./_content/about.mdx"
  ) as {
    default: React.ComponentType;
    metadata: {
      name: string;
      avatar: string;
      job: string;
    };
  };

  return (
    <div className="">
      <div className="pt-6 pb-8 space-y-2 md:space-y-5">
        <PageTitle>ABOUT</PageTitle>
      </div>

      <section className="items-start space-y-2 pt-8 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
        <div className="flex flex-col items-center">
          <Image
            src={authorData.avatar}
            alt="avatar"
            width={150}
            height={150}
            className="w-48 h-48 rounded-full"
          />
          <h3 className="pt-4 pb-2 text-xl leading-8 tracking-tight">
            {authorData.name}
          </h3>
        </div>
        <div className="pt-8 pb-8 prose dark:prose-dark max-w-none xl:col-span-2">
          <MDXContent />
        </div>
      </section>

      <section className="pt-6 pb-8 space-y-2 md:space-y-5">
        <h2 className="text-2xl tracking-tight text-gray-900 dark:text-gray-100 md:leading-14">
          PROJECTS
        </h2>
        {projectsData.map((project) => (
          <div key={project.title} className="mb-4 space-y-2 -m-4">
            {project.href ? (
              <CustomLink
                href={project.href}
                className="flex items-center gap-x-4 p-4 rounded-lg border border-transparent hover:bg-primary-100 dark:hover:bg-primary-900 group"
              >
                <div className="flex-auto flex flex-col pb-4 border-b border-primary-100 dark:border-primary-900 text-primary-700 dark:text-primary-300">
                  <span className="text-lg">{project.title}</span>
                  <span className="text-primary-500 dark:text-primary-500">
                    {project.description}
                  </span>
                </div>
              </CustomLink>
            ) : (
              <div className="flex items-center gap-x-4 p-4 rounded-lg border border-transparent">
                <div className="flex-auto flex flex-col pb-4 border-b border-primary-100 dark:border-primary-900 text-primary-700 dark:text-primary-300">
                  <span className="text-lg">{project.title}</span>
                  <span className="text-primary-500 dark:text-primary-500">
                    {project.description}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="pt-6 pb-8 space-y-2 md:space-y-5">
        <h2 className="text-2xl tracking-tight text-gray-900 dark:text-gray-100 md:leading-14">
          TALKS
        </h2>
        {talks.map((talk) => (
          <div key={talk.title} className="mb-4 space-y-2 -m-4">
            {talk.href ? (
              <CustomLink
                href={talk.href}
                className="flex items-center gap-x-4 p-4 rounded-lg border border-transparent hover:bg-primary-100 dark:hover:bg-primary-900 group"
              >
                <div className="flex-auto flex flex-col pb-4 border-b border-primary-100 dark:border-primary-900 text-primary-700 dark:text-primary-300">
                  <span className="text-lg">{talk.title}</span>
                  <span className="text-primary-500 dark:text-primary-500">
                    Slides about {talk.topic} for {talk.event}
                  </span>
                </div>
              </CustomLink>
            ) : (
              <div className="flex items-center gap-x-4 p-4 rounded-lg border border-transparent">
                <div className="flex-auto flex flex-col pb-4 border-b border-primary-100 dark:border-primary-900 text-primary-700 dark:text-primary-300">
                  <span className="text-lg">{talk.title}</span>
                  <span className="text-primary-500 dark:text-primary-500">
                    Slides about {talk.topic} for {talk.event}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
