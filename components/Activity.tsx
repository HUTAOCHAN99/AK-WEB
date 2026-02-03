// components/Activity.tsx
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import {
  FaCalendar,
  FaUsers,
  FaLaptopCode,
  FaGraduationCap,
} from "react-icons/fa";

interface Activity {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  status: "active" | "inactive";
  category?: string;
  order_index: number;
}

export default function Activity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          setError("Supabase configuration is missing");
          return;
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error: supabaseError } = await supabase
          .from("activities")
          .select("*")
          .eq("status", "active")
          .order("order_index", { ascending: true })
          .order("created_at", { ascending: false });

        if (supabaseError) {
          setError("Failed to load activities");
          console.error("Supabase error:", supabaseError);
          return;
        }

        setActivities(data || []);
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Error loading activities:", err);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  return (
    <section id="project" className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold mb-2 tracking-wider">
            -- Aktivitas
          </p>
          <h2 className="text-3xl font-semibold text-white">Aktivitas Kami</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Berbagai kegiatan yang kami selenggarakan untuk membangun ukhuwah
            islamiyah dan mengembangkan potensi anggota di bidang teknologi dan
            dakwah.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-400">Loading activities...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 text-red-500 mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-400 mb-2">Error loading activities</p>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendar className="text-4xl text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No activities found.</p>
            <p className="text-gray-500 text-sm mt-2">
              Check back later for upcoming activities
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {activities.map((activity) => (
                <div key={activity.id} className="group">
                  <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition duration-300 bg-gray-800 h-full flex flex-col hover:translate-y-[-4px] transition-transform duration-300">
                    {/* Thumbnail Container */}
                    <div className="relative h-48 md:h-56 overflow-hidden bg-gray-700">
                      {activity.image_url ? (
                        <img
                          src={activity.image_url}
                          alt={activity.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback jika gambar gagal load
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            // Tampilkan placeholder
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full bg-linear-to-br from-gray-700 to-gray-800 flex flex-col items-center justify-center">
                                  <svg class="w-12 h-12 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <p class="text-gray-400 text-sm">Image not available</p>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-800 flex flex-col items-center justify-center">
                          <svg
                            className="w-12 h-12 text-gray-500 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-gray-400 text-sm">No thumbnail</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-semibold text-white">
                          {activity.title}
                        </h3>
                        {activity.category && (
                          <span className="inline-block px-2 py-1 text-xs bg-primary/20 text-primary rounded mt-2">
                            {activity.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 md:p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-white mb-3">
                          {activity.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                          {activity.description}
                        </p>
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-700">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400 flex items-center">
                            <FaCalendar className="w-3 h-3 mr-2" />
                            Regular Activity
                          </span>
                          <Link
                            href={`/activity/${activity.id}`} // Ubah href ini
                            className="text-primary hover:text-primary-light font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300"
                          >
                            Learn More
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            {/* Stats Section */}
            <div className="mt-16 pt-8 border-t border-gray-800">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Our Impact in Numbers
                </h3>
                <p className="text-gray-400">
                  Pencapaian dan aktivitas kami dalam angka
                </p>
              </div>

              {/* Centered Grid Wrapper */}
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    {
                      number: "15",
                      label: "Member Aktif",
                      icon: <FaUsers className="text-primary text-2xl" />,
                    },
                    {
                      number: `${activities.length}+`,
                      label: "Program Kerja",
                      icon: <FaCalendar className="text-primary text-2xl" />,
                    },
                    {
                      number: "4",
                      label: "Divisi Inti",
                      icon: <FaLaptopCode className="text-primary text-2xl" />,
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="group text-center p-6 bg-gray-800 rounded-xl shadow-md
                     hover:bg-gray-700 hover:-translate-y-1
                     transition-all duration-300"
                    >
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/20">
                          {stat.icon}
                        </div>
                      </div>

                      <div className="text-3xl font-bold text-white mb-1">
                        {stat.number}
                      </div>

                      <div className="text-gray-300 text-sm tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <div className="bg-linear-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-6 md:p-8 max-w-3xl mx-auto">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">
                  Ready to Join Our Activities?
                </h3>
                <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
                  Bergabunglah dengan kami dalam membangun komunitas muslim yang
                  unggul dalam teknologi dan keislaman.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                  <Link
                    href="#contact"
                    className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg shadow hover:shadow-md transition duration-300 text-center"
                  >
                    Contact Us Now
                  </Link>
                  <a
                    href="https://bit.ly/4bMUFnx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg border border-gray-600 hover:border-gray-500 transition duration-300 text-center"
                  >
                    Join WhatsApp Group
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
