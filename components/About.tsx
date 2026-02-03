import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="bg-gray-800">
      <div className="container mx-auto px-4 pt-8">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
          {/* Image */}
          <div className="lg:w-1/2">
            <p className="text-primary font-semibold mb-4 tracking-wider lg:hidden">
              -- About
            </p>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/assets/B2-Alkhawarizmi.webp"
                alt="About Al Khawarizmi"
                width={1200}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-1/2">
            <p className="text-primary font-semibold mb-4 tracking-wider hidden lg:block">
              -- About
            </p>
            <p className="text-gray-300 mb-8 text-justify">
              Hello everyone 👋, Kami adalah perkumpulan mahasiswa Islam di
              Informatika UPNYK, dikenal sebagai Lembaga Dakwah Kampus. Kami
              berkiprah di tingkat jurusan Informatika dengan tujuan
              menyelaraskan dakwah dan IPTEK. Melalui usaha kami, kami berusaha
              menciptakan lingkungan yang seimbang di mana nilai-nilai keislaman
              dan ilmu pengetahuan berjalan beriringan, memberdayakan mahasiswa
              untuk unggul secara spiritual dan akademis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
