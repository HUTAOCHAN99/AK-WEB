import { FaGithub, FaInstagram, FaLinkedin, FaArrowRight } from 'react-icons/fa'

export default function Hero() {
  return (
    <section id="home" className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="relative lg:w-1/2 h-full">
            {/* Gambar Background */}
            <img src="/assets/B1-AlKhawarizmi.png" alt="Al Khawarizmi"
              className="w-full h-full object-cover max-w-md mx-auto my-16 py-16 lg:mx-0" />

            {/* Overlay Container */}
            <div className="absolute inset-0 flex items-end p-6">
              {/* Container Teks + Social Media */}
              <div className="space-y-4 text-left">
                {/* Teks */}
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                    KKMI
                    <span className="block">AL-Khawarizmi</span>
                  </h1>
                  <div className="w-14 h-1 bg-primary mt-2"></div>
                </div>

                {/* Social Icons */}
                <div className="flex space-x-6">
                  <a href="https://github.com/Al-Khawarizmi-UPNYK" target="_blank"
                    className="text-gray-300 hover:text-white text-2xl transition duration-300">
                    <FaGithub />
                  </a>
                  <a href="https://www.instagram.com/alkhawarizmiifupnyk" target="_blank"
                    className="text-gray-300 hover:text-white text-2xl transition duration-300">
                    <FaInstagram />
                  </a>
                  <a href="https://www.linkedin.com/company/kkmi-al-khawarizmi-upnyk/" target="_blank"
                    className="text-gray-300 hover:text-white text-2xl transition duration-300">
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Right Content */}
          <div className="lg:w-1/2">
            <p className="text-primary font-semibold mb-4 tracking-wider">
              -- Introduction
            </p>
            <h2 className="text-2xl md:text-3xl font-medium text-white mb-6">
              Perkumpulan Mahasiswa Islam dari Jurusan Informatika UPN Yogyakarta.
            </h2>
            <p className="text-gray-300 mb-8 text-justify">
              We are a Muslim Family Organization. We have a passion to build and develop the Akhlaq and also the
              environment of Muslim students.
            </p>
            <a href="#about" className="inline-flex items-center text-primary font-medium hover:text-primary-light transition duration-300">
              Petualangan kami
              <FaArrowRight className="ml-2 text-xl" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}