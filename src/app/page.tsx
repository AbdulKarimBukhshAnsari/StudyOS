import { Header } from "@/components/HomePage/Header";
import { Hero } from "@/components/HomePage/Hero";
import { ProblemStatement } from "@/components/HomePage/ProblemStatement";
import { Features } from "@/components/HomePage/Features";
import { SolutionOverview } from "@/components/HomePage/SolutionOverview";
import { Footer } from "@/components/HomePage/Footer";

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
