import Image from "next/image";

export default function Benefit() {
  const partners = [
    "HIMATIF",
    "KMI"
  ];

  const benefits = [
    "relasi",
    "Komunitas", 
    "ilmu",
    "Sertifikat"
  ];

  return (
    <section id="partners" className="py-16 bg-gray-800">
      {/* Partners Section */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold mb-2 tracking-wider">
            -- Partner
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Our Partners
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-gray-700 P-4 rounded-lg shadow hover:shadow-lg transition duration-300"
            >
              <Image
                src={`/assets/partners/${partner}.webp`}
                alt={partner}
                width={100}
                height={100}
                className="h-36 w-auto rounded-lg"
                priority={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto my-8">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold mb-2 tracking-wider">
            -- Benefit 
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Our Benefits 
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition duration-300 flex flex-col items-center"
            >
              <Image
                src={`/assets/benefits/${benefit}.webp`}
                alt={benefit}
                width={200}
                height={200}
                className="h-12 w-auto mb-4"
                priority={false}
              />
              <h3 className="text-white font-medium capitalize">
                {benefit}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}