import CTASection from "@/components/home/CTASection";
import FeaturedNutritionists from "@/components/home/FeaturedNutritionists";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
      <div className="container py-10">
          <Hero />
          <HowItWorks />
          <FeaturedNutritionists />
          <WhyChooseUs />
          <Testimonials />
          <CTASection />
      </div>
  );
}
