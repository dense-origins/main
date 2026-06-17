import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ScrollReveal from '@/components/ScrollReveal';
import HeroSection from '@/components/home/HeroSection';
import Marquee from '@/components/home/Marquee';
import StatsStrip from '@/components/home/StatsStrip';
import AboutSection from '@/components/home/AboutSection';
import HomeProductsSection from '@/components/home/HomeProductsSection';
import ProcessSection from '@/components/home/ProcessSection';
import WhyUsSection from '@/components/home/WhyUsSection';
import HomeFaqSection from '@/components/home/HomeFaqSection';
import HomeContactSection from '@/components/home/HomeContactSection';

interface HomePageProps {
  searchParams: { product?: string };
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <Marquee />
        <StatsStrip />
        <AboutSection />
        <HomeProductsSection />
        <ProcessSection />
        <WhyUsSection />
        <HomeFaqSection />
        <HomeContactSection defaultProduct={searchParams.product} />
      </main>
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
