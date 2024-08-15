import Hero from './components/home/Hero';
import Navbar from './components/Navbar';
import Feature1 from './components/home/Feature1'
import Steps from './components/home/Steps';
import Testimonial from './components/home/Testimonial';

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Feature1/>
      <Steps/>
      <Testimonial/>
    </div>
  );
};

export default Home;
