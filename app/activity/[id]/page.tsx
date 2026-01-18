// app/activity/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  FaTag,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaHome,
  FaCalendarAlt,
} from 'react-icons/fa'
import Link from 'next/link'

interface ActivityDetail {
  id: string;
  title: string;
  description: string;
  content?: string;
  image_url?: string;
  status: 'active' | 'inactive';
  category?: string;
  tags?: string[];
  registration_link?: string;
  created_at: string;
  updated_at: string;
}

export default function ActivityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activity, setActivity] = useState<ActivityDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedActivities, setRelatedActivities] = useState<ActivityDetail[]>([])

  useEffect(() => {
    const loadActivity = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey) {
          setError('Configuration error')
          return
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey)
        
        // Load activity detail
        const { data: activityData, error: activityError } = await supabase
          .from('activities')
          .select('*')
          .eq('id', params.id)
          .single()
          
        if (activityError) {
          setError('Activity not found')
          console.error('Error loading activity:', activityError)
          return
        }
        
        setActivity(activityData)
        
        // Load related activities (exclude current activity)
        const { data: relatedData } = await supabase
          .from('activities')
          .select('*')
          .eq('status', 'active')
          .neq('id', params.id)
          .order('order_index', { ascending: true })
          .limit(4)
          
        setRelatedActivities(relatedData || [])
      } catch (err) {
        setError('An unexpected error occurred')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    if (params.id) {
      loadActivity()
    }
  }, [params.id])

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-900 pt-24">
          <div className="container mx-auto px-4">
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-400">Loading activity details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !activity) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-900 pt-24">
          <div className="container mx-auto px-4">
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 text-red-500 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Activity Not Found</h2>
              <p className="text-gray-400 mb-6">{error || 'The activity you are looking for does not exist.'}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.back()}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                >
                  Go Back
                </button>
                <Link
                  href="/#project"
                  className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                >
                  View All Activities
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-900 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <button
              onClick={() => router.back()}
              className="flex items-center hover:text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <span className="text-gray-600">/</span>
            <Link 
              href="/"
              className="flex items-center hover:text-white transition duration-300"
            >
              <FaHome className="w-3 h-3 mr-1" />
              Home
            </Link>
            <span className="text-gray-600">/</span>
            <Link 
              href="/#project"
              className="hover:text-white transition duration-300"
            >
              Activities
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white truncate max-w-xs">{activity.title}</span>
          </nav>
        </div>

        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="relative rounded-2xl overflow-hidden mb-8">
            {activity.image_url ? (
              <div className="relative h-64 md:h-96">
                <img
                  src={activity.image_url}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <div class="text-center p-4">
                            <svg class="w-16 h-16 text-primary/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h3 class="text-xl font-semibold text-white">${activity.title}</h3>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
              </div>
            ) : (
              <div className="h-64 md:h-96 bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <div className="text-center p-4">
                  <svg className="w-16 h-16 text-primary/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-xl font-semibold text-white">{activity.title}</h3>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {activity.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                    {activity.category}
                  </span>
                )}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                  {activity.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {activity.title}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Activity Details */}
              <div className="bg-gray-800/50 rounded-xl p-6 md:p-8 mb-8">
                <h2 className="text-2xl font-semibold text-white mb-6">About This Activity</h2>
                
                <div className="text-gray-300 leading-relaxed space-y-4">
                  {activity.content ? (
                    <div 
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: activity.content }}
                    />
                  ) : (
                    <p className="whitespace-pre-line">{activity.description}</p>
                  )}
                </div>

                {/* Tags */}
                {activity.tags && activity.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <FaTag className="w-4 h-4 mr-2 text-primary" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activity.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-700 text-gray-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Registration CTA */}
              {activity.registration_link && (
                <div className="bg-linear-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl p-6 md:p-8">
                  <div className="flex items-start">
                    <FaCalendarAlt className="w-6 h-6 text-primary mt-1 mr-4 shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Ready to Join?</h3>
                      <p className="text-gray-300 mb-4">
                        Don&apos;t miss this opportunity to be part of our community activity. 
                        Register now to secure your spot!
                      </p>
                      <a
                        href={activity.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg shadow hover:shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        Register Now
                        <FaExternalLinkAlt className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Only Related Activities */}
            <div className="lg:col-span-1">
              {/* Related Activities */}
              {relatedActivities.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-6 sticky top-24">
                  <h3 className="text-xl font-semibold text-white mb-6">Other Activities</h3>
                  <div className="space-y-4">
                    {relatedActivities.map((related) => (
                      <Link
                        key={related.id}
                        href={`/activity/${related.id}`}
                        className="block group"
                      >
                        <div className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition duration-300 border border-gray-700 hover:border-gray-600">
                          {related.image_url ? (
                            <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-700">
                              <img
                                src={related.image_url}
                                alt={related.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="shrink-0 w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                              <svg className="w-6 h-6 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                          )}
                          <div className="ml-4 flex-1">
                            <h4 className="text-sm font-medium text-white group-hover:text-primary transition duration-300 line-clamp-2">
                              {related.title}
                            </h4>
                            <div className="flex items-center mt-1">
                              {related.category && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-300">
                                  {related.category}
                                </span>
                              )}
                              <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs ${
                                related.status === 'active' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-gray-600 text-gray-400'
                              }`}>
                                {related.status === 'active' ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* View All Activities Link */}
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <Link
                      href="/#project"
                      className="flex items-center justify-center text-primary hover:text-primary-light font-medium py-2 transition duration-300 group"
                    >
                      <span>View All Activities</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}