import { 
  FaLayerGroup, 
  FaCode, 
  FaFemale, 
  FaDesktop,
  FaArrowRight 
} from 'react-icons/fa'

export default function Division() {
  const divisions = [
    {
      icon: <FaLayerGroup className="text-3xl" />,
      title: 'Divisi Kaderisasi',
      description: 'Merekrut dan mengembangkan anggota baru.'
    },
    {
      icon: <FaCode className="text-3xl" />,
      title: 'Divisi Syiar',
      description: 'Menyebarkan dakwah dan nilai-nilai Islam.'
    },
    {
      icon: <FaFemale className="text-3xl" />,
      title: 'Divisi Muslimah',
      description: 'Khusus untuk anggota perempuan.'
    },
    {
      icon: <FaDesktop className="text-3xl" />,
      title: 'Divisi Medinfo',
      description: 'Media dan informasi organisasi.'
    }
  ]

  return (
    <section id="services" className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold mb-2 tracking-wider">
            -- Divisi
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Divisi Kami
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {divisions.map((division, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-primary">
              <div className="text-primary mb-4">
                {division.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {division.title}
              </h3>
              <p className="text-gray-300 mb-4">
                {division.description}
              </p>
              <button className="text-primary font-medium hover:text-primary-light transition flex items-center">
                View More
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}