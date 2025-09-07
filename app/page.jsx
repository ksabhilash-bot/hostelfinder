"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Users,
  Star,
  Wifi,
  Car,
  Coffee,
  Shield,
  ArrowRight,
  Calendar,
  Filter,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Refs for GSAP animations
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const searchRef = useRef(null);
  const statsRef = useRef(null);
  const sectionTitleRef = useRef(null);
  const hostelsRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power2.out" }
      );

      gsap.fromTo(
        searchRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "back.out(1.7)" }
      );

      gsap.fromTo(
        statsRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          delay: 1,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Section title animations
      gsap.fromTo(
        sectionTitleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionTitleRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        hostelsRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.2,
          scrollTrigger: {
            trigger: hostelsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Features animation
      gsap.fromTo(
        featuresRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // CTA section animation
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Add hover animations to cards
      const hostelCards = hostelsRef.current?.children;
      if (hostelCards) {
        Array.from(hostelCards).forEach((card) => {
          card.addEventListener("mouseenter", () => {
            gsap.to(card, { y: -10, duration: 0.3, ease: "power1.out" });
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card, { y: 0, duration: 0.3, ease: "power1.out" });
          });
        });
      }
    }

    // Clean up
    return () => {
      if (typeof window !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, []);

  const featuredHostels = [
    {
      id: 1,
      name: "Sunrise Backpackers",
      location: "Mumbai, Maharashtra",
      rating: 4.8,
      reviews: 324,
      price: "₹800",
      image:
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
      features: ["Free WiFi", "Breakfast", "AC"],
    },
    {
      id: 2,
      name: "Mountain View Hostel",
      location: "Manali, Himachal Pradesh",
      rating: 4.9,
      reviews: 156,
      price: "₹600",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      features: ["Mountain View", "Bonfire", "Trekking"],
    },
    {
      id: 3,
      name: "Beach Side Retreat",
      location: "Goa",
      rating: 4.7,
      reviews: 289,
      price: "₹900",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      features: ["Beach Access", "Pool", "Cafe"],
    },
  ];

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Easy Search",
      description: "Find the perfect hostel with our advanced search filters",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Listings",
      description:
        "All hostels are verified and regularly inspected for quality",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Real Reviews",
      description: "Genuine reviews from real travelers to help you decide",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Prime Locations",
      description: "Hostels in the best locations across popular destinations",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-12">
            <h1
              ref={titleRef}
              className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight"
            >
              Find Your Perfect
              <span className="block bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Hostel Stay
              </span>
            </h1>
            <p
              ref={subtitleRef}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Discover amazing hostels across India with verified reviews, great
              amenities, and unbeatable prices. Your adventure starts here.
            </p>
          </div>

          {/* Search Bar */}
          <div
            ref={searchRef}
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 border border-rose-200"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center bg-rose-50 rounded-xl p-3">
                  <Search className="w-5 h-5 text-rose-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search by city, area, or hostel name"
                    className="bg-transparent w-full focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 px-6 rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all flex items-center justify-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>

          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
          >
            {[
              { number: "500+", label: "Verified Hostels" },
              { number: "50+", label: "Cities Covered" },
              { number: "10k+", label: "Happy Travelers" },
              { number: "4.8", label: "Average Rating" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-rose-200"
              >
                <div className="text-3xl font-bold text-rose-600">
                  {stat.number}
                </div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={sectionTitleRef} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Featured Hostels
            </h2>
            <p className="text-xl text-gray-600">
              Discover top-rated hostels loved by travelers and students
            </p>
          </div>

          <div
            ref={hostelsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredHostels.map((hostel) => (
              <div
                key={hostel.id}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={hostel.image}
                    alt={hostel.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-rose-600">
                    {hostel.price}/night
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {hostel.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{hostel.location}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700 ml-1">
                        {hostel.rating}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({hostel.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hostel.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2 rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all flex items-center justify-center space-x-1">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose HostelFinder?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make finding and booking the perfect hostel simple, safe, and
              affordable
            </p>
          </div>

          <div
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={ctaRef}
        className="py-20 bg-gradient-to-r from-rose-600 to-pink-600 text-white"
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who trust HostelFinder for their
            accommodation needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-rose-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all transform hover:scale-105">
              Start Searching
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="text-2xl font-bold">HostelFinder</span>
              </div>
              <p className="text-gray-400">
                Making hostel discovery simple and enjoyable for every traveler.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 HostelFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
