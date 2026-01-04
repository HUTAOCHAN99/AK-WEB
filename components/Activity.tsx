import { FaCampground, FaUsers, FaBook, FaLaptopCode, FaPray, FaGraduationCap } from 'react-icons/fa'

export default function Activity() {
  const activities = [
    {
      image: '/assets/activities/camping.jpg',
      title: 'Camping & Outdoor Activity',
      description: 'Team building dan bonding di alam terbuka',
      icon: <FaCampground className="text-2xl text-primary" />
    },
    {
      image: '/assets/activities/study.jpg',
      title: 'Study Circle & Diskusi',
      description: 'Kajian Islam dan diskusi ilmiah',
      icon: <FaBook className="text-2xl text-primary" />
    },
    {
      image: '/assets/activities/workshop.jpg',
      title: 'Workshop & Pelatihan',
      description: 'Pengembangan skill IT dan soft skills',
      icon: <FaLaptopCode className="text-2xl text-primary" />
    },
    {
      image: '/assets/activities/social.jpg',
      title: 'Social & Community Service',
      description: 'Aksi sosial dan pengabdian masyarakat',
      icon: <FaUsers className="text-2xl text-primary" />
    },
    {
      image: '/assets/activities/prayer.jpg',
      title: 'Religious Activities',
      description: 'Shalat berjamaah dan kegiatan keagamaan',
      icon: <FaPray className="text-2xl text-primary" />
    },
    {
      image: '/assets/activities/competition.jpg',
      title: 'Competitions & Events',
      description: 'Lomba dan event internal/external',
      icon: <FaGraduationCap className="text-2xl text-primary" />
    }
  ]

  return (
    <section id="project" className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold mb-2 tracking-wider">
            -- Activity
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Our Activities
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Berbagai kegiatan yang kami selenggarakan untuk membangun ukhuwah islamiyah 
            dan mengembangkan potensi anggota di bidang teknologi dan dakwah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <div key={index} className="group">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition duration-300 bg-gray-800">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-gray-900 to-transparent z-10"></div>
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    {activity.icon}
                  </div>
                  {/* You can replace with actual images when available */}
                  <div className="absolute bottom-4 left-4 z-20">
                    <h3 className="text-xl font-semibold text-white">
                      {activity.title}
                    </h3>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="mr-4 mt-1">
                      {activity.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {activity.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Regular Activity
                      </span>
                      <button className="text-primary hover:text-primary-light text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                        Learn More
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-white mb-2">
              Our Impact in Numbers
            </h3>
            <p className="text-gray-400">Pencapaian dan aktivitas kami dalam angka</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '50+', label: 'Active Members', icon: <FaUsers className="text-primary text-xl" /> },
              { number: '12+', label: 'Monthly Activities', icon: <FaCampground className="text-primary text-xl" /> },
              { number: '4', label: 'Core Divisions', icon: <FaLaptopCode className="text-primary text-xl" /> },
              { number: '100%', label: 'Member Satisfaction', icon: <FaGraduationCap className="text-primary text-xl" /> }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-linear-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Ready to Join Our Activities?
            </h3>
            <p className="text-gray-300 mb-6">
              Bergabunglah dengan kami dalam membangun komunitas muslim yang unggul 
              dalam teknologi dan keislaman.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#contact" 
                className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg shadow hover:shadow-md transition duration-300"
              >
                Contact Us Now
              </a>
              <a 
                href="https://bit.ly/4bMUFnx" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg border border-gray-600 hover:border-gray-500 transition duration-300"
              >
                Join WhatsApp Group
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}