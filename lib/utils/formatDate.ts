import siteMetadata from "@/data/siteMetadata";

export const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const now = new Date(date).toLocaleDateString(siteMetadata.locale, options);
  return now;
};
