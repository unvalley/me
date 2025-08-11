import { PageTitle } from "@/components/PageTitle";
import { toolsData } from "@/data/index";
import { CustomLink } from "@/components/Link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools - unvalley",
  description: "Tools what unvalley use.",
};

export default function Tools() {
  const services = toolsData.filter((x) => x.category === "services");
  const aiServices = toolsData.filter((x) => x.category === "ai");
  const daily = toolsData.filter((x) => x.category === "daily");

  return (
    <div>
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <PageTitle>TOOLS</PageTitle>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          What I use.
        </p>
      </div>

      <div className="prose max-w-none dark:prose-dark">
        <h2>Services</h2>
        <ul>
          {services.map((x) => (
            <li key={x.name}>
              <CustomLink href={x.href}>{x.name}</CustomLink>
              <span> - {x.description}</span>
            </li>
          ))}
        </ul>

        <h2>AI</h2>
        <ul>
          {aiServices.map((x) => (
            <li key={x.name}>
              <CustomLink href={x.href}>{x.name}</CustomLink>
              <span> - {x.description}</span>
            </li>
          ))}
        </ul>

        <h2>Daily</h2>
        <ul>
          {daily.map((x) => (
            <li key={x.name}>
              <CustomLink href={x.href}>{x.name}</CustomLink>
              {x.affiliate ? " (Affiliate)" : ""}
              <span> - {x.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
