import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Bell, Map, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Lost Something?<br />We Help You Find It
              </h1>
              <p className="text-primary-100 text-lg md:text-xl mb-8 max-w-lg">
                Our campus lost and found system makes it easy to report lost items, 
                discover found ones, and reunite people with their belongings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Link to="/dashboard" className="btn bg-white text-primary-700 hover:bg-primary-50">
                      Go to Dashboard
                    </Link>
                    <Link to="/report" className="btn bg-primary-500 text-white border border-primary-400 hover:bg-primary-400">
                      Report an Item
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50">
                      Get Started
                    </Link>
                    <Link to="/login" className="btn bg-primary-500 text-white border border-primary-400 hover:bg-primary-400">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 bg-primary-400 rounded-full opacity-20 absolute top-0 right-0"></div>
                <Package className="w-56 h-56 text-white relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our simple process helps you find what you've lost or report what you've found in just a few steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Report Items</h3>
            <p className="text-gray-600">
              Quickly report lost or found items with our simple form, including photos and location details.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Admin Verification</h3>
            <p className="text-gray-600">
              Our admins verify reports to ensure accuracy and help match lost items with found ones.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
              <Bell className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Notified</h3>
            <p className="text-gray-600">
              Receive updates when your item is found or when someone claims a found item.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
              <Map className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Item Recovery</h3>
            <p className="text-gray-600">
              Easily arrange to recover your lost item or return a found item to its owner.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  Ready to get started?
                </h2>
                <p className="mt-4 max-w-lg text-accent-100">
                  Join our campus lost and found system today and help create a community where lost items are quickly returned to their owners.
                </p>
              </div>
              <div className="mt-8 flex lg:mt-0 lg:ml-8">
                {user ? (
                  <Link
                    to="/report"
                    className="btn bg-white text-accent-600 hover:bg-accent-50 shadow-sm"
                  >
                    Report an Item
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="btn bg-white text-accent-600 hover:bg-accent-50 shadow-sm"
                  >
                    Sign up free
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;