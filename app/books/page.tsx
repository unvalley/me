import type { Metadata } from "next";
import { BooksCanvas } from "./Client";

export const metadata: Metadata = {
  title: "Books Canvas",
  description: "Drag & play with scattered book covers.",
};

export default function Page() {
  return <BooksCanvas />;
}
