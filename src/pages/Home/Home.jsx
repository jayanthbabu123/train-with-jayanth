import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCallback } from 'react';

const features = [
  {
    title: 'Structured Learning Path',
    description: 'Follow a carefully designed curriculum that builds your skills step by step.',
    icon: '📚'
  },
  {
    title: 'Live Training Sessions',
    description: 'Interactive live sessions with real-time doubt clearing and discussions.',
    icon: '🎥'
  },
  {
    title: 'Project-Based Learning',
    description: 'Work on real-world projects to build your portfolio and gain practical experience.',
    icon: '💻'
  },
  {
    title: 'Regular Assessments',
    description: 'Track your progress with weekly assessments and personalized feedback.',
    icon: '📊'
  }
];

const benefits = [
  {
    title: 'For Students',
    items: [
      'Personalized learning experience',
      'Regular one-on-one mentoring sessions',
      'Access to recorded sessions and materials',
      'Project portfolio development',
      'Career guidance and support',
      'Community learning environment'
    ]
  },
  {
    title: 'Training Approach',
    items: [
      'Hands-on practical training',
      'Industry-relevant curriculum',
      'Regular doubt clearing sessions',
      'Mock interviews and assessments',
      'Resume building workshops',
      'Placement assistance'
    ]
  }
];

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Full Stack Developer',
    content: 'The training sessions were incredibly helpful. The practical approach and personal attention helped me land my dream job.',
    avatar: '👨'
  },
  {
    name: 'Priya Patel',
    role: 'Frontend Developer',
    content: 'The structured learning path and regular assessments kept me on track. The project-based approach gave me real-world experience.',
    avatar: '👩'
  },
  {
    name: 'Amit Kumar',
    role: 'Backend Developer',
    content: 'The mentorship and guidance were invaluable. The mock interviews and resume workshops helped me prepare for job opportunities.',
    avatar: '👨'
  }
];

const stats = [
  { number: '500+', label: 'Active Students' },
  { number: '10+', label: 'Training Batches' },
  { number: '98%', label: 'Student Satisfaction' },
  { number: '85%', label: 'Placement Rate' }
];

const technologies = [
  {
    name: 'HTML5',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    description: 'Master modern HTML5 for building robust web structures'
  },
  {
    name: 'CSS3',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    description: 'Create stunning designs with advanced CSS3 features'
  },
  {
    name: 'JavaScript',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    description: 'Learn JavaScript fundamentals and modern ES6+ features'
  },
  {
    name: 'React',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    description: 'Build dynamic user interfaces with React.js'
  },
  {
    name: 'Node.js',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    description: 'Develop scalable backend applications with Node.js'
  },
  {
    name: 'Express',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
    description: 'Create robust APIs using Express.js framework'
  },
  {
    name: 'MongoDB',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    description: 'Work with MongoDB for flexible data storage'
  },
  {
    name: 'Git',
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    description: 'Master version control and collaboration with Git'
  }
];

const courseBenefits = [
  {
    title: 'Free Trial Classes',
    description: 'Start with 7 free classes to experience the quality of training',
    icon: '🎯',
    highlight: '7 Free Classes',
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'No-Risk Learning',
    description: 'Leave anytime if you don\'t find the training valuable',
    icon: '🛡️',
    highlight: 'Money-Back Guarantee',
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Daily Recordings',
    description: 'Access recordings of all classes for revision and catch-up',
    icon: '🎥',
    highlight: 'Lifetime Access',
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: 'Comprehensive Notes',
    description: 'Get detailed notes and study materials for each topic',
    icon: '📝',
    highlight: 'Daily Updates',
    color: 'from-pink-500 to-pink-600'
  },
  {
    title: 'Practical Assignments',
    description: 'Hands-on assignments to reinforce your learning',
    icon: '💻',
    highlight: 'Real-World Projects',
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: 'Interview Preparation',
    description: 'Regular mock interviews and interview guidance sessions',
    icon: '🎯',
    highlight: 'Mock Interviews',
    color: 'from-red-500 to-red-600'
  },
  {
    title: 'Live Projects',
    description: 'Work on real-time projects to build your portfolio',
    icon: '🚀',
    highlight: 'Industry Projects',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    title: 'Career Support',
    description: 'Get guidance on resume building and job search',
    icon: '💼',
    highlight: 'Placement Assistance',
    color: 'from-teal-500 to-teal-600'
  }
];

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Helper for CTA navigation
  const handleCTANavigate = useCallback((path) => {
    if (currentUser) {
      navigate(path);
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-[linear-gradient(to_bottom_right,#3b82f6,#1e3a8a)] text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-20">
              {/* Left Content */}
              <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
                <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <span className="text-sm font-medium">👋 Welcome to Train With Jayanth</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Learn & Grow with Personalized Training
                </h1>
                <p className="text-xl md:text-2xl mb-4 text-[#e0f2fe] max-w-xl">
                  Join my training sessions to master new skills, get personalized guidance, and achieve your learning goals with expert mentorship.
                </p>
                <p className="text-lg text-[#e0f2fe] mb-8">You can attend 7 classes for free to decide if you want to continue.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => handleCTANavigate(currentUser ? '/student/assignments' : '/login')}
                    className="bg-white text-[#3b82f6] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Start Learning
                  </button>
                  <button
                    onClick={() => handleCTANavigate(currentUser ? '/student/courses' : '/login')}
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors text-lg"
                  >
                    View My Courses
                  </button>
                </div>
                {/* Trust Indicators */}
                <div className="mt-12">
                  <p className="text-[#bae6fd] mb-4">Join our growing community</p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold">500+</div>
                      <div className="text-sm text-[#bae6fd]">Active Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">10+</div>
                      <div className="text-sm text-[#bae6fd]">Training Batches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">98%</div>
                      <div className="text-sm text-[#bae6fd]">Student Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Feature Cards */}
              <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl transform hover:-translate-y-1 transition-all duration-300">
                  <div className="text-4xl mb-4">👨‍🏫</div>
                  <h3 className="text-xl font-semibold mb-2">Expert Training</h3>
                  <p className="text-[#e0f2fe]">Learn from an experienced trainer with proven track record</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl transform hover:-translate-y-1 transition-all duration-300">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold mb-2">Batch Learning</h3>
                  <p className="text-[#e0f2fe]">Join structured batches with focused learning paths</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl transform hover:-translate-y-1 transition-all duration-300">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
                  <p className="text-[#e0f2fe]">Access training materials and sessions anytime</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl transform hover:-translate-y-1 transition-all duration-300">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold mb-2">Personal Attention</h3>
                  <p className="text-[#e0f2fe]">Get individual feedback and guidance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Technologies You'll Master</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A comprehensive curriculum covering the most in-demand technologies in web development
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="group relative bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-4 transition-transform duration-300 group-hover:scale-110">
                    <img
                      src={tech.logo}
                      alt={tech.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{tech.name}</h3>
                  <p className="text-sm text-gray-600 text-center">{tech.description}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/0 to-[#3b82f6]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Benefits Section */}
      <div className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What You'll Get in This Course</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A comprehensive learning experience designed to help you succeed in your career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courseBenefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${benefit.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className="relative p-8 flex items-start space-x-6">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-r ${benefit.color} flex items-center justify-center text-3xl text-white shadow-lg`}>
                    {benefit.icon}
                  </div>
                  <div className="flex-1">
                    <div className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                      {benefit.highlight}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Start Your Journey Section */}
          <div className="mt-16 relative">
            {/* Background with gradient and pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,#3b82f6,#1e3a8a)] rounded-3xl"></div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>

            {/* Content */}
            <div className="relative p-8 md:p-12">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white mb-4">
                    Start Your Journey Today
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
                    Experience Our Training First-Hand
                  </h3>
                  <p className="text-white/80 text-lg max-w-2xl mx-auto">
                    Join our training program with a 7-day free trial. No commitment required, and you can leave anytime if you're not satisfied.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-xl">✓</span>
                    </div>
                    <div className="text-white font-semibold mb-1">7 Free Classes</div>
                    <div className="text-white/70 text-sm">Start learning immediately</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-xl">✓</span>
                    </div>
                    <div className="text-white font-semibold mb-1">No Commitment</div>
                    <div className="text-white/70 text-sm">Leave anytime if not satisfied</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-xl">✓</span>
                    </div>
                    <div className="text-white font-semibold mb-1">Money-Back Guarantee</div>
                    <div className="text-white/70 text-sm">100% satisfaction guaranteed</div>
                  </div>
                </div>

                <div className="text-center">
                  <button onClick={() => handleCTANavigate('/student/batches')} className="inline-flex items-center justify-center bg-white text-[#3b82f6] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <span className="mr-2">Enroll for a New Batch</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-block bg-[#3b82f6]/10 text-[#3b82f6] px-4 py-2 rounded-full text-sm font-medium mb-4">
              Success Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our students about their learning journey and career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-[#3b82f6]/10 text-4xl font-serif">"</div>
                
                {/* Avatar */}
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#3b82f6]/10 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-[#3b82f6] text-sm">{testimonial.role}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {testimonial.content}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-[#3b82f6]/0 group-hover:border-[#3b82f6]/20 transition-colors duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left Content */}
              <div className="lg:w-1/2">
                <div className="relative">
                  {/* Decorative Elements */}
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#3b82f6]/5 rounded-full"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#3b82f6]/5 rounded-full"></div>
                  
                  {/* Main Content */}
                  <div className="relative">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                      Ready to Transform Your Career?
                    </h2>
                    <p className="text-gray-600 text-lg mb-8">
                      Take the first step towards becoming a professional developer. Join our next batch and start your journey today.
                    </p>
                    
                    {/* Key Points */}
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-[#3b82f6]/10 rounded-full flex items-center justify-center mr-3 mt-1">
                          <svg className="w-4 h-4 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">Next Batch Starting Soon</div>
                          <div className="text-gray-600 text-sm">Limited seats available</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-[#3b82f6]/10 rounded-full flex items-center justify-center mr-3 mt-1">
                          <svg className="w-4 h-4 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">Early Bird Discount</div>
                          <div className="text-gray-600 text-sm">Save up to 20% on course fee</div>
                        </div>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to="/signup"
                        className="inline-flex items-center justify-center bg-[#3b82f6] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#1e3a8a] transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <span className="mr-2">Enroll Now</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                      <Link
                        to="/schedule"
                        className="inline-flex items-center justify-center border-2 border-[#3b82f6] text-[#3b82f6] px-8 py-4 rounded-xl font-semibold hover:bg-[#3b82f6]/5 transition-all duration-300 text-lg"
                      >
                        <span className="mr-2">View Schedule</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Batch Info Card */}
              <div className="lg:w-1/2">
                <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
                  <div className="text-center mb-8">
                    <div className="inline-block bg-[#3b82f6]/10 text-[#3b82f6] px-4 py-2 rounded-full text-sm font-medium mb-4">
                      Next Batch Details
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Full Stack Development</h3>
                    <p className="text-gray-600">Starting in 7 days</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-[#3b82f6] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">Duration</span>
                      </div>
                      <span className="font-semibold text-gray-800">6 Months</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-[#3b82f6] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-gray-600">Batch Size</span>
                      </div>
                      <span className="font-semibold text-gray-800">15 Students</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-[#3b82f6] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">Early Bird Price</span>
                      </div>
                      <span className="font-semibold text-gray-800">₹49,999</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Offer ends in 3 days
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">About Me</h3>
              <p className="text-gray-400">
                Dedicated to helping students master technology skills and build successful careers through personalized training and mentorship.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/courses" className="text-gray-400 hover:text-white">Courses</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white">Login</Link></li>
                <li><Link to="/signup" className="text-gray-400 hover:text-white">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: jayanth@trainwithjayanth.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Location: Bangalore, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Train With Jayanth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 