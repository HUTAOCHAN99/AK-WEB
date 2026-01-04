'use client'
import { useEffect, useState } from 'react'
import { MdTimeline } from 'react-icons/md'

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  description: string;
  tags?: string;
}

export default function Timeline() {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const loadTimeline = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey) {
          setError('Supabase configuration is missing')
          console.error('Supabase configuration missing')
          return
        }
        
        // Import supabase secara langsung (tanpa dynamic import)
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(supabaseUrl, supabaseKey)
        
        const { data, error: supabaseError } = await supabase
          .from('timeline')
          .select('*')
          .order('date', { ascending: false })
          
        if (supabaseError) {
          setError('Failed to load timeline data')
          console.error('Supabase error:', supabaseError)
          return
        }
        setTimelineData(data || [])
      } catch (err) {
        setError('An unexpected error occurred')
        console.error('Error loading timeline:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadTimeline()
  }, [])
  
  return (
    <section id="journey" className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold mb-2 tracking-wider">
            -- Journey
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Our Journey
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            The growth and development timeline of KKMI Al-Khawarizmi
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-400">Loading timeline data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 text-red-500 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-400 mb-2">Error loading timeline</p>
            <p className="text-gray-400 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-white transition duration-300"
            >
              Retry
            </button>
          </div>
        ) : timelineData.length === 0 ? (
          <div className="text-center py-12">
            <MdTimeline className="text-4xl text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No timeline items found.</p>
            <p className="text-gray-500 text-sm mt-2">Add timeline items from the admin dashboard</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-700 hidden md:block"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                {timelineData.map((item, index) => (
                  <div key={item.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-4 border-gray-800 hidden md:block"></div>
                    
                    {/* Content card */}
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                      <div className="bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-primary">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              {item.title}
                            </h3>
                            <div className="text-primary font-medium">
                              {new Date(item.date).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                          <div className="text-gray-400 text-sm">
                            #{index + 1}
                          </div>
                        </div>
                        
                        <p className="text-gray-300 mb-6">
                          {item.description}
                        </p>
                        
                        {item.tags && item.tags.trim() !== '' && (
                          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-600">
                            {item.tags.split(',').map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="bg-primary/20 text-primary text-xs font-medium px-3 py-1 rounded-full"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Call to action for admin */}
        <div className="mt-16 text-center">
          <div className="bg-linear-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-2">
              Want to contribute to our timeline?
            </h3>
            <p className="text-gray-400 mb-4">
              If youre an admin, you can add new timeline events
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/admin/auth"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition duration-300"
              >
                Go to Admin Dashboard
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg border border-gray-600 transition duration-300"
              >
                Contact Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}