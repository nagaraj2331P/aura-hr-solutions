'use client';

import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Award
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const LandingPage = () => {
  const features = [
    {
      icon: <GraduationCap className="w-8 h-8 text-primary-600" />,
      title: 'Skill-Based Matching',
      description: 'Get matched with projects that align with your skills and career goals.',
    },
    {
      icon: <Clock className="w-8 h-8 text-primary-600" />,
      title: 'Time Tracking',
      description: 'Automatic time logging with transparent hour tracking and approval system.',
    },
    {
      icon: <DollarSign className="w-8 h-8 text-primary-600" />,
      title: 'Earn While Learning',
      description: 'Get paid for your work while gaining valuable real-world experience.',
    },
    {
      icon: <Briefcase className="w-8 h-8 text-primary-600" />,
      title: 'Real Projects',
      description: 'Work on actual business projects that make a real impact.',
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Mentorship',
      description: 'Get guidance from experienced professionals throughout your journey.',
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary-600" />,
      title: 'Career Growth',
      description: 'Build your portfolio and advance your career with hands-on experience.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Active Students' },
    { number: '100+', label: 'Partner Companies' },
    { number: '1000+', label: 'Projects Completed' },
    { number: '95%', label: 'Success Rate' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      content: 'Aura HR Solutions helped me gain real-world experience while earning money. The projects were challenging and the mentorship was invaluable.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Student',
      content: 'The platform made it easy to find projects that matched my skills. I learned so much and built an amazing portfolio.',
      rating: 5,
    },
    {
      name: 'Emily Davis',
      role: 'Design Student',
      content: 'Working through Aura HR Solutions was the best decision I made during college. It prepared me for my career like nothing else.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-secondary-900">Aura HR Solutions</h1>
                <p className="text-sm text-secondary-600">Earn While You Learn</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container-responsive">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6">
              Turn Your Skills Into
              <span className="text-gradient block">Real Experience</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
              Join thousands of students who are earning money while gaining valuable work experience 
              through our innovative internship management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-responsive">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-secondary-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Why Choose Aura HR Solutions?
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              We provide everything you need to succeed in your internship journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center card-hover">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-secondary-600">
              Get started in just a few simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Create Your Profile
              </h3>
              <p className="text-secondary-600">
                Sign up and showcase your skills, education, and experience to get matched with relevant projects.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Get Matched
              </h3>
              <p className="text-secondary-600">
                Our intelligent matching system connects you with projects that align with your skills and interests.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Start Earning
              </h3>
              <p className="text-secondary-600">
                Work on real projects, track your time, and get paid while building valuable experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-secondary-600">
              Hear from students who have transformed their careers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-secondary-900">{testimonial.name}</div>
                  <div className="text-sm text-secondary-600">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container-responsive text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already earning while learning. 
            Your future career starts here.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50">
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="container-responsive">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold">Aura HR Solutions</div>
                  <div className="text-sm text-secondary-400">Earn While You Learn</div>
                </div>
              </div>
              <p className="text-secondary-400">
                Connecting students with real-world opportunities to build careers and earn money.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><Link href="/projects" className="hover:text-white">Browse Projects</Link></li>
                <li><Link href="/auth/register" className="hover:text-white">Sign Up</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Companies</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><Link href="/companies" className="hover:text-white">Post Projects</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Sales</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-secondary-400">
            <p>&copy; 2024 Aura HR Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
