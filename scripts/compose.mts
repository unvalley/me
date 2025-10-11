import fs from "node:fs";

const genFrontMatter = () => {
  const d = new Date();
  const date = [
    d.getFullYear(),
    `0${d.getMonth() + 1}`.slice(-2),
    `0${d.getDate()}`.slice(-2),
  ].join("-");

  const frontMatter = `export const metadata = {
  title: "",
  date: '${date}',
  description: "",
  tags: [],
  draft: true,
}
`;

  return frontMatter;
};

const fileName = Math.floor(Date.now() / 1000);
const frontMatter = genFrontMatter();
const articlesDir = "app/(site)/blog/_articles";

if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir, { recursive: true });
}
const filePath = `${articlesDir}/${fileName}.mdx`;
fs.writeFile(filePath, frontMatter, { flag: "wx" }, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Blog post generated successfully at ${filePath}`);
});
