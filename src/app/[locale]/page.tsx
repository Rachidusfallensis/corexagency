import Hero from '@/components/home/Hero'
import Offers from '@/components/home/Offers'
import ExamplesDigital from '@/components/home/ExamplesDigital'
import ExamplesSaas from '@/components/home/ExamplesSaas'
import Process from '@/components/home/Process'
import WhyCorex from '@/components/home/WhyCorex'
import SaasSection from '@/components/home/SaasSection'
import CtaSection from '@/components/home/CtaSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Offers />
      <ExamplesDigital />
      <ExamplesSaas />
      <Process />
      <WhyCorex />
      <SaasSection />
      <CtaSection />
    </>
  )
}
