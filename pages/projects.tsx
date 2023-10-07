import { Card } from "@/components/Card";
import { PageTitle } from "@/components/PageTitle";
import { PageSEO } from "@/components/SEO";
import { projectsData } from "@/data/index";
import siteMetadata from "@/data/siteMetadata";

export default function Projects() {
    return (
        <>
            <PageSEO
                title={`Projects - ${siteMetadata.author}`}
                description={siteMetadata.description}
            />
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                    <PageTitle>Projects</PageTitle>
                </div>
                <div className="container py-8">
                    <div className="-m-4 flex flex-wrap">
                        {projectsData.map((d) => (
                            <Card
                                key={d.title}
                                title={d.title}
                                description={d.description}
                                imgSrc={d.imgSrc}
                                href={d.href}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
