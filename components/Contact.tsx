import { 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaWhatsapp, 
  FaArrowRight 
} from 'react-icons/fa'

export default function Contact() {
  return (
    <section id="contact" className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Form */}
          <div className="lg:w-1/2">
            <div className="mb-8">
              <p className="text-primary font-semibold mb-2 tracking-wider">
                -- Contact
              </p>
              <h2 className="text-3xl font-semibold text-white">
                Get In Touch
              </h2>
            </div>

            <form action="https://formsubmit.co/alkhawarizmiifupnyk@gmail.com" method="POST" className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 font-medium mb-2">
                  Name
                </label>
                <input type="text" id="name" name="name" required className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white transition duration-300" placeholder="Your Name" />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
                  Email
                </label>
                <input type="email" id="email" name="email" required className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white transition duration-300" placeholder="you@example.com" />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-300 font-medium mb-2">
                  Message
                </label>
                <textarea id="message" name="message" rows={4} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white transition duration-300" placeholder="Your Message"></textarea>
              </div>

              <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg shadow hover:shadow-md transition duration-300">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-semibold text-white mb-8">
              Be a part of our team?
              <span className="block">Lets Join!</span>
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="text-primary mr-4 mt-1">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">
                    Location
                  </h4>
                  <a href="https://maps.app.goo.gl/z8KxLwoDgtP68AhJ6" target="_blank" className="text-gray-300 hover:text-primary transition duration-300">
                    Lantai PATT II, Gedung Pattimura, Kampus II UPNVY
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-primary mr-4 mt-1">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">
                    Email
                  </h4>
                  <a href="mailto:alkhawarizmiifupnyk@gmail.com" className="text-gray-300 hover:text-primary transition duration-300">
                    alkhawarizmiifupnyk@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-primary mr-4 mt-1">
                  <FaWhatsapp className="text-xl" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">
                    WhatsApp
                  </h4>
                  <a href="https://bit.ly/4bMUFnx" target="_blank" className="text-gray-300 hover:text-primary transition duration-300">
                    +62 856 5630 5716
                  </a>
                </div>
              </div>

              <div className="pt-8">
                <a href="#" className="inline-flex items-center text-primary font-medium hover:text-primary-light transition duration-300">
                  Register Members
                  <FaArrowRight className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}