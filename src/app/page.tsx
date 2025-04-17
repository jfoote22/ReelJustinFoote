"use client"
// Updated to use Star Wars: The Old Republic video 
import Link from "next/link"
import Image from "next/image"
import { Menu, Mail, Phone, Linkedin } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import BackgroundSlider from "@/components/background-slider"
import VideoPlayer from "@/components/video-player"
import PDFModal from "@/components/pdf-modal"
import VideoCarousel from "@/components/VideoCarousel"
import PDFEmbed from "@/components/pdf-embed"
import YouTubeEmbed from "@/components/youtube-embed"

export default function Home() {
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <BackgroundSlider />

      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 bg-black">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex flex-col text-xl sm:text-2xl font-light tracking-wider">
            <span>JUSTIN FOOTE</span>
            <span>TECHNICAL VFX ARTIST</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Button 
              variant="ghost" 
              className="text-white hover:text-gray-300 transition-colors p-0 h-auto font-normal text-base"
              onClick={() => setIsPDFModalOpen(true)}
              style={{ fontFamily: 'inherit' }}
            >
              Resume
            </Button>
            <Link href="#contact" className="hover:text-gray-300 transition-colors">
              Contact
            </Link>
          </nav>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-black/95 text-white border-gray-800">
              <div className="flex flex-col gap-6 mt-10">
                <Button 
                  variant="ghost" 
                  className="text-xl text-white hover:text-gray-300 transition-colors justify-start p-0 h-auto"
                  onClick={() => setIsPDFModalOpen(true)}
                >
                  Resume
                </Button>
                <Link href="#contact" className="text-xl hover:text-gray-300 transition-colors">
                  Contact
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <PDFModal isOpen={isPDFModalOpen} onClose={() => setIsPDFModalOpen(false)} />

      <main className="pt-[calc(20vh+200px)] sm:pt-[calc(25vh+250px)] pb-16 relative z-10">
        <section id="reels" className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Featured Reels */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-8 tracking-wide">FEATURED WORK</h2>
            
            <div className="flex flex-col gap-8 mb-12">
              <div>
                <h3 className="text-xl font-light mb-4 tracking-wide">TECHNICAL VFX WORK</h3>
                <YouTubeEmbed 
                  videoId="OvgfweQ6mr4" 
                  title="Justin Foote Technical VFX Reel" 
                  autoplay={false}
                  loop={true}
                />
              </div>
              
              <div>
                <h3 className="text-xl font-light mb-4 tracking-wide">IN-GAME VFX WORK</h3>
                <YouTubeEmbed 
                  videoId="Byraswh5Rk8" 
                  title="Justin Foote In-Game VFX Reel"
                  autoplay={false}
                  loop={true}
                />
              </div>
            </div>
            
            <h2 className="text-2xl font-light mb-6 tracking-wide">PREVIOUS WORK</h2>
            <VideoCarousel />
          </div>

          {/* About Section */}
          <section id="about" className="mb-16">
            <h2 className="text-2xl font-light mb-8 tracking-wide">ABOUT</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
                <p className="text-base sm:text-lg leading-relaxed">
                  I&apos;m a Visual Effects Artist with 21 years of experience in the video game industry, passionate about creating immersive VFX and I&apos;ve been fortunate to have contributed to a wide range of high-profile projects alongside some of the industry&apos;s most talented teams.
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  I began my career at Amaze Entertainment, working on Call of Duty: Roads to Victory for PSP, followed by Shrek the Third and Where the Wild Things Are for the XBox. I then joined BioWare Austin to work on Star Wars: The Old Republic, contributing to multiple areas including VFX, sky scenes, and microtransaction asset creation. I later supported titles like Dragon Age: Inquisition (IGN&apos;s 2014 Game of the Year), its DLC The Descent, and Mass Effect: Andromeda.
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                 Seeking new challenges, I joined Microsoft to develop for the cutting-edge HoloLens platform, gaining hands-on experience with AR technologies and utilizing more technical skills like shader creation and Houdini workflows. I later joined Bungie, achieving a major career milestone, working on Destiny 2 and the DLC Curse of Osiris before receiving a unique opportunity to join State Street R&D as VP of AR/VR Technologies. There, I was part of a world-class research team exploring advanced AR/VR cloud infrastructure tools, server farm monitoring tools, and machine learning visualization tools.
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                 My next adventure, I received an opportunity to work at Dimensional Inc. (formerly Daybreak), where I helped kick off development on a Marvel MMO alongside the team behind DC Universe Online, supporting both projects during my time there. Following that, I became the Lead VFX Artist at Big Time, an ambitious new studio where we are creating visually striking, multiplayer-driven experiences.
                </p>
                <p className="text-base sm:text-lg leading-relaxed">
                  I&apos;m driven by curiosity, innovation, and a love for creating impactful visual experiences.
                </p>
              </div>
              <div className="lg:sticky lg:top-32 order-1 lg:order-2">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src="/images/profile_pic.jpg"
                    alt="Justin Foote - VFX Artist"
                    fill
                    className="rounded-lg shadow-xl object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="text-center">
            <h2 className="text-xl sm:text-2xl font-light mb-6 tracking-wide">CONTACT</h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Interested in collaboration? Let&apos;s create something amazing together.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <a 
                href="mailto:justinfoote@gmail.com" 
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
              >
                <Mail className="h-5 w-5" />
                justinfoote@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/justin-foote-26820113/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </a>
              <a 
                href="tel:206-334-8792"
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
              >
                <Phone className="h-5 w-5" />
                206-334-8792
              </a>
            </div>
          </section>
        </section>
      </main>

      <footer className="py-6 border-t border-gray-800/30 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Justin Foote. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
