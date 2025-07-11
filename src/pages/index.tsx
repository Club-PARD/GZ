// pages/index.tsx
import HeroSection from '../components/index-components/hero-section'
import EmailAuthFeature from '../components/index-components/email-auth-feature'
import DepositFeature from '../components/index-components/deposit-feature'
import ProductsFeature from '../components/index-components/products-feature'
import Header from '@/components/index-header';
import Footer from '@/components/loginFooter';
import Divider from '@/components/index-components/divider';

export default function Home() {
  return (
    
    <main className="space-y-0 bg-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white h-16">
        <Header />
      </div>

      
      <HeroSection />
      <EmailAuthFeature />
      <DepositFeature />
      <Divider />
      <ProductsFeature />
      <Divider />
      <Footer />
    </main>
  )
}
