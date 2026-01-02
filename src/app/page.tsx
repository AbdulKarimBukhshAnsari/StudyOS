import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProblemStatement } from "@/components/ProblemStatement";
import { Features } from "@/components/Features";
import { SolutionOverview } from "@/components/SolutionOverview";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ProblemStatement />
      <Features />
      <SolutionOverview />
      <Footer />
    </div>
  );
}
