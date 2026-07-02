import { PortfolioHome } from "@/components/portfolio/portfolio-home";
import { getContributions } from "@/lib/github";

export default async function Home() {
  const contributions = await getContributions("AdityaChaudhari901");

  return <PortfolioHome contributions={contributions} />;
}
