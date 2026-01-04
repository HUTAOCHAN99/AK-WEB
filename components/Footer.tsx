import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="py-12 bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <div className="mb-6 md:mb-0">
            <a href="#home">
              <img src="/assets/alkhawarizmi.png" alt="Logo" className="h-16" />
            </a>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6 mb-6 md:mb-0">
            <a href="https://github.com/Al-Khawarizmi-UPNYK" target="_blank" className="text-gray-400 hover:text-white text-2xl transition duration-300">
              <FaGithub />
            </a>
            <a href="https://www.instagram.com/alkhawarizmiifupnyk" target="_blank" className="text-gray-400 hover:text-white text-2xl transition duration-300">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/company/kkmi-al-khawarizmi-upnyk/" target="_blank" className="text-gray-400 hover:text-white text-2xl transition duration-300">
              <FaLinkedin />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              Copyright © 2025 KKMI Al-Khawarizmi
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Muslim Family Organization
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}