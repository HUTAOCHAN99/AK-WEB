import Image from 'next/image'

export default function Benefit() {
  const skills = [
    "html.svg",
    "css.svg",
    "javascript.svg",
    "react.svg",
    "nextjs.svg",
    "tailwind.svg",
  ];

  return (
    <section id="skills" className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold mb-2 tracking-wider">
            -- Benefit & Partner
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Our Benefits and Partners
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition duration-300"
            >
              <Image
                src={`/assets/skills/${skill}`}
                alt={skill.replace(".svg", "")}
                width={48}
                height={48}
                className="h-12 w-auto"
                priority={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
