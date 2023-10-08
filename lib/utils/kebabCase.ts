import { slug } from "github-slugger";

const kebabCase = (str: string) => slug(str, true);

export default kebabCase;
