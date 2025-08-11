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
  const { default: MDXContent, metadata: authorData } = (await import(
    "./_content/about.mdx"
  )) as {
    default: React.ComponentType;
    metadata: {
      name: string;
      avatar: string;
      job: string;
    };
  };

  return (
    <div>
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <PageTitle>ABOUT</PageTitle>
      </div>

      <div className="space-y-8">
        <section className="items-start space-y-4 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center self-center">
            <Image
              src={authorData.avatar}
              alt="avatar"
              width={120}
              height={120}
              className="rounded-full"
            />
          </div>
          <div className="prose dark:prose-dark max-w-none xl:col-span-2">
            <MDXContent />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:leading-14">
            PROJECTS
          </h2>
          <div className="space-y-4">
            {projectsData.map((project) => (
              <div
                key={project.title}
                className="border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                {project.href ? (
                  <CustomLink href={project.href} className="group block">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {project.description}
                    </p>
                  </CustomLink>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {project.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:leading-14">
            TALKS
          </h2>
          <div className="space-y-4">
            {talks.map((talk) => (
              <div
                key={talk.title}
                className="border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                {talk.href ? (
                  <CustomLink href={talk.href} className="group block">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      {talk.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Slides about {talk.topic} for {talk.event}
                    </p>
                  </CustomLink>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {talk.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Slides about {talk.topic} for {talk.event}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
