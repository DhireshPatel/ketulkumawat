import fs from "fs";
import path from "path";
import NobelPrize2026 from "../../components/NobelPrize2026";

export const metadata = {
  title: "Nobel Prize in Chemistry 2026 | Dr. Ketul Kumawat",
  description:
    "Explore the 2026 Nobel Prize in Chemistry awarded to Henri B. Kagan and Kenso Soai for the discovery of non-linear effects and autocatalysis in asymmetric organic synthesis.",
  alternates: { canonical: "/nobel-prize-chemistry-2026" },
  openGraph: {
    title: "Nobel Prize in Chemistry 2026 | Dr. Ketul Kumawat",
    description:
      "Henri B. Kagan and Kenso Soai: non-linear effects and autocatalysis in asymmetric organic synthesis, explained for students and researchers.",
    url: "/nobel-prize-chemistry-2026",
    type: "article",
  },
};

// Use laureate photos only if the files exist in /public/images/laureates.
// Otherwise the component shows a graceful placeholder.
function findImage(names) {
  for (const name of names) {
    const file = path.join(
      process.cwd(),
      "public",
      "images",
      "laureates",
      name,
    );
    if (fs.existsSync(file)) return `/nobel/${name}`;
  }
  return null;
}

export default function Page() {
  const images = {
    kagan: findImage([
      "henri-kagan.jpg",
      "henri-kagan.jpeg",
      "henri-kagan.png",
      "henri-kagan.webp",
    ]),
    soai: findImage([
      "kenso-soai.jpg",
      "kenso-soai.jpeg",
      "kenso-soai.png",
      "kenso-soai.webp",
    ]),
  };
  return <NobelPrize2026 images={images} />;
}
