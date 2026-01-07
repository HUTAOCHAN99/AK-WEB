'use client'
import Header from '../components/Header'
import Hero from '../components/Hero'
import About from '../components/About'
import BackToTop from '../components/BackToTop'
import Benefit from '../components/Benefit'
import Contact from '../components/Contact'
import Division from '../components/Division'
import Footer from '../components/Footer'
import Timeline from '../components/Timeline'
import ActivityComponent from '../components/Activity'

export default function Home() {
  return (
    <>
      <BackToTop />
      <Header />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Division />
        <Benefit />
        <ActivityComponent />
        <Contact />
      </main>
      <Footer />
    </>
  )
}