import siteMetadata from "@/data/siteMetadata";
import { CoreContent } from "@/lib/utils/contentlayer";
import type { Blog } from "contentlayer/generated";
import dynamic from "next/dynamic";

interface Props {
    frontMatter: CoreContent<Blog>;
}

const UtterancesComponent = dynamic(
    () => {
        return import("@/components/comments/Utterances");
    },
    { ssr: false },
);
const DisqusComponent = dynamic(
    () => {
        return import("@/components/comments/Disqus");
    },
    { ssr: false },
);

const Comments = ({ frontMatter }: Props) => {
    const comment = siteMetadata?.comment;
    if (!comment || Object.keys(comment).length === 0) return <></>;
    return (
        <div id="comment">
            {siteMetadata.comment &&
                siteMetadata.comment.provider === "utterances" && (
                    <UtterancesComponent />
                )}
            {siteMetadata.comment &&
                siteMetadata.comment.provider === "disqus" && (
                    <DisqusComponent frontMatter={frontMatter} />
                )}
        </div>
    );
};

export default Comments;
