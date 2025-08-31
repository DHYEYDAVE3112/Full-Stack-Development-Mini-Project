import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaMoneyBill, FaTools, FaFileContract, FaUsers, FaChartLine } from 'react-icons/fa';

const LandingPage = () => {
  const features = [
    {
      icon: <FaBuilding className="w-8 h-8" />,
      title: "Property Management",
      description: "Manage all your properties from one central dashboard with detailed tracking and analytics."
    },
    {
      icon: <FaMoneyBill className="w-8 h-8" />,
      title: "Rent Tracking",
      description: "Track rent payments, send reminders, and manage late fees with automated workflows."
    },
    {
      icon: <FaTools className="w-8 h-8" />,
      title: "Maintenance Requests",
      description: "Handle maintenance requests efficiently with priority tracking and vendor management."
    },
    {
      icon: <FaFileContract className="w-8 h-8" />,
      title: "Lease Agreements",
      description: "Store and manage digital lease agreements with e-signature capabilities."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Property Owner",
      content: "RentEase has transformed how I manage my 15 rental properties. Everything is organized and automated!"
    },
    {
      name: "Michael Chen",
      role: "Real Estate Investor",
      content: "The maintenance tracking feature alone has saved me countless hours and improved tenant satisfaction."
    },
    {
      name: "Emily Davis",
      role: "Property Manager",
      content: "Finally, a platform that understands the needs of property managers. Highly recommended!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <FaBuilding className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">RentEase</span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/auth"
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simplify Your Property Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            RentEase is the all-in-one platform for landlords and property managers to streamline 
            operations, track payments, and maintain excellent tenant relationships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Free Trial
            </Link>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <FaUsers className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
              <div className="text-gray-600">Happy Landlords</div>
            </div>
            <div className="p-6">
              <FaBuilding className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">50,000+</div>
              <div className="text-gray-600">Properties Managed</div>
            </div>
            <div className="p-6">
              <FaChartLine className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">$2M+</div>
              <div className="text-gray-600">Rent Collected Monthly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From tenant screening to maintenance tracking, RentEase provides all the tools 
              you need to run a successful rental business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Property Professionals
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Property Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of landlords who have streamlined their operations with RentEase.
          </p>
          <Link
            to="/auth"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg inline-block"
          >
            Start Your Free Trial Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FaBuilding className="w-6 h-6" />
              <span className="text-xl font-bold">RentEase</span>
            </div>
            <div className="text-gray-400">
              © 2025 RentEase. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;