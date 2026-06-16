"use client"
import Achievements from "@/components/Achievements";
import Book from "@/components/Book";
import CertificateHome from "@/components/CertificateHome";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Lightbox from "@/components/Lightbox";
import Navbar from "@/components/Navbar";
import News from "@/components/News";
import ScrollReveal from "@/components/ScrollReveal";
import Teaching from "@/components/Teaching";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [lightboxSrc, setLightboxSrc] = useState(null)
  // const [lightboxImage, setLightboxImage] = useState(null)

  const [currentPage, setCurrentPage] = useState("home");

  if (currentPage === 'Home') {
    return <Home setCurrentPage={setCurrentPage} />
  }

  if (currentPage === 'Certificates') {
    return <Certificates />
  }

  const openLightbox = (src) => {
    if (!src) return
    setLightboxSrc(src)
  }

  const closeLightbox = () => {
    setLightboxSrc(null)
  }

  return (
    <>
      <ScrollReveal />
      <Navbar />
      <Hero onOpenLightbox={openLightbox} />
      <Achievements onOpenLightbox={openLightbox} />
      <Book />
      <Gallery onOpenLightbox={openLightbox} />
      <News onOpenLightbox={openLightbox} />
      <Education onOpenLightbox={openLightbox} />
      <CertificateHome />
      <Teaching />
      <Contact />
      <Footer />
      <Lightbox src={lightboxSrc} onClose={closeLightbox} />
    </>
  );
}
