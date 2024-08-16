import Hero from './components/home/Hero';
import Navbar from './components/home/Navbar';
import Feature1 from './components/home/Feature1'
import Steps from './components/home/Steps';
import Testimonial from './components/home/Testimonial';
import CTA from './components/home/CTA';
import Pricing from './components/home/Pricing';
import FAQ from './components/home/FAQ';
import Contact from './components/home/Contact';
import Footer from './components/Footer';
const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Feature1/>
      <Steps/>
      <Testimonial/>
      <CTA/>
      <Pricing/>
      <FAQ/>
      <Contact/>
      <Footer />
    </div>
  );
};

export default Home;
