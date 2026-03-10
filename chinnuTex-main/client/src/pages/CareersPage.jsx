import { useState } from 'react';

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    {
      id: 1,
      title: 'Process Engineer',
      department: 'Engineering',
      type: 'Full-time',
      experience: '3+ years',
      location: 'Erode, Tamil Nadu',
      description: 'Optimize sizing and weaving workflows with data-driven process improvements',
      responsibilities: [
        'Develop and implement process improvements for sizing operations',
        'Analyze production data to identify optimization opportunities',
        'Collaborate with operations team to troubleshoot technical issues',
        'Ensure compliance with quality standards and safety protocols'
      ],
      requirements: [
        'Bachelor\'s degree in Chemical/Textile Engineering',
        'Minimum 3 years of experience in textile processing',
        'Strong analytical and problem-solving skills',
        'Knowledge of sizing and weaving processes'
      ]
    },
    {
      id: 2,
      title: 'Quality Control Specialist',
      department: 'Operations',
      type: 'Full-time',
      experience: '2+ years',
      location: 'Erode, Tamil Nadu',
      description: 'Ensure compliance with international standards and customer specifications',
      responsibilities: [
        'Conduct quality inspections on sized yarns and woven fabrics',
        'Document and report quality metrics and deviations',
        'Implement quality control procedures and standards',
        'Train staff on quality requirements and best practices'
      ],
      requirements: [
        'Diploma/Degree in Textile Technology or related field',
        'Minimum 2 years of experience in textile quality control',
        'Familiarity with testing equipment and procedures',
        'Attention to detail and strong communication skills'
      ]
    },
    {
      id: 3,
      title: 'Operations Manager',
      department: 'Management',
      type: 'Full-time',
      experience: '5+ years',
      location: 'Erode, Tamil Nadu',
      description: 'Lead day-to-day operations and drive continuous improvement initiatives',
      responsibilities: [
        'Oversee all sizing and weaving production activities',
        'Manage and mentor operations team members',
        'Develop and implement operational strategies',
        'Monitor KPIs and drive performance improvements'
      ],
      requirements: [
        'Bachelor\'s degree in Textile Engineering/Management',
        'Minimum 5 years of operations management experience',
        'Strong leadership and team management skills',
        'Proven track record of process optimization'
      ]
    },
    {
      id: 4,
      title: 'Maintenance Technician',
      department: 'Technical',
      type: 'Full-time',
      experience: '2+ years',
      location: 'Erode, Tamil Nadu',
      description: 'Maintain and repair sizing and weaving machinery for optimal performance',
      responsibilities: [
        'Perform preventive maintenance on sizing and weaving equipment',
        'Diagnose and repair mechanical/electrical issues',
        'Maintain maintenance logs and documentation',
        'Coordinate with vendors for spare parts and services'
      ],
      requirements: [
        'ITI/Diploma in Mechanical/Electrical Engineering',
        'Minimum 2 years of experience in textile machinery maintenance',
        'Strong troubleshooting and repair skills',
        'Knowledge of PLC and automation systems preferred'
      ]
    },
    {
      id: 5,
      title: 'Sizing Operator',
      department: 'Production',
      type: 'Full-time',
      experience: '1+ years',
      location: 'Erode, Tamil Nadu',
      description: 'Operate sizing machines and ensure quality yarn processing for weaving',
      responsibilities: [
        'Operate and monitor sizing machines for optimal performance',
        'Prepare sizing solution according to specifications',
        'Conduct quality checks on sized yarns',
        'Maintain production records and daily reports',
        'Follow safety protocols and maintain clean work environment'
      ],
      requirements: [
        'High school diploma or equivalent',
        'Minimum 1 year of experience in textile sizing operations',
        'Knowledge of different yarn types and sizing requirements',
        'Ability to work in shifts and meet production targets',
        'Good attention to detail and quality consciousness'
      ]
    },
    {
      id: 6,
      title: 'Weaving Operator',
      department: 'Production',
      type: 'Full-time',
      experience: '1+ years',
      location: 'Erode, Tamil Nadu',
      description: 'Operate weaving looms and produce high-quality woven fabrics',
      responsibilities: [
        'Operate and monitor weaving looms efficiently',
        'Set up looms with proper warp and weft threads',
        'Identify and fix weaving defects promptly',
        'Perform routine loom maintenance and adjustments',
        'Ensure production targets and quality standards are met'
      ],
      requirements: [
        'High school diploma or equivalent',
        'Minimum 1 year of experience in weaving operations',
        'Knowledge of different weaving patterns and fabric types',
        'Ability to work in shifts and handle physical demands',
        'Strong problem-solving skills and attention to detail'
      ]
    }
  ];

  const benefits = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Competitive Wages',
      description: 'Fair pay with overtime and incentive bonuses'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Health & Safety',
      description: 'Medical insurance, ESI, and safe working conditions'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Skill Training',
      description: 'On-the-job training and technical skill development'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Shift Flexibility',
      description: 'Rotating shifts with weekly offs and festival holidays'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Growth Opportunities',
      description: 'Promotion from operator to supervisor roles'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Supportive Team',
      description: 'Respectful workplace with experienced supervisors'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>
        {/* Animated Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto text-center relative z-10 px-4">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-full shadow-2xl mb-8">
            <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Join Our <span className="text-indigo-400">Growing Team</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Shape the future of textile processing with Chinnu Tex.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-slate-300 font-medium">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Erode, Tamil Nadu</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{jobs.length} Open Positions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white relative z-20 -mt-10 rounded-t-[3rem]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Why Join Chinnu Tex?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">We offer more than just a job - we provide a career path with growth opportunities</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="group p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Open Positions</h2>
            <p className="text-slate-500 text-lg">Find the perfect role that matches your skills and passion</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="group bg-white rounded-2xl p-8 hover:shadow-xl hover:shadow-indigo-500/5 transition-all border border-slate-100 hover:border-indigo-200 cursor-pointer relative overflow-hidden"
                onClick={() => setSelectedJob(job)}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold uppercase tracking-wider ml-4">
                    {job.type}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {job.department}
                  </span>
                  <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {job.experience}
                  </span>
                  <span className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                </div>

                <div className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl font-medium group-hover:border-indigo-600 group-hover:text-indigo-600 transition-all flex items-center justify-center gap-2 group-hover:bg-indigo-50">
                  <span>View Details</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-indigo-900/50 to-transparent"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to Make an Impact?</h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Don't see the perfect role? Send us your resume anyway. We're always looking for talented individuals.
          </p>
          <div className="flex flex-col items-center gap-3">
            <a
              href="mailto:careers@chinnutex.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Your Resume
            </a>
            <p className="text-slate-500 text-sm font-medium">or email careers@chinnutex.com</p>
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="bg-white rounded-[2rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 p-6 z-10 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">{selectedJob.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {selectedJob.department}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {selectedJob.type}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {selectedJob.experience}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <div className="flex items-center gap-2 text-slate-500 mb-4 font-medium">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{selectedJob.location}</span>
                </div>
                <p className="text-slate-700 text-lg leading-relaxed">{selectedJob.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Key Responsibilities</h3>
                  <ul className="space-y-3">
                    {selectedJob.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-700 text-sm leading-relaxed">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Requirements</h3>
                  <ul className="space-y-3">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-700 text-sm leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>


              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <a
                  href={`mailto:careers@chinnutex.com?subject=Application for ${selectedJob.title}`}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold text-center hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Apply Now
                </a>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-8 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
