
import HeroSection from "../components/HomeComponents/HeroSection"
import FeaturedAuthors from "../components/AuthorComponents/FeaturedAuthors"
import TrendingWorks from "../components/TrendingWorks"



function Home() {
  return (
    <>
      
      <HeroSection />
      <FeaturedAuthors limit={3} />
      <TrendingWorks limit={4} showViewAll={true} />
  
    </>
  );
}
export default Home