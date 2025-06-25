import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BhumiLandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const galleryImages = [
    {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXdx_xiVfWQc_a5RWuEnZ2-ABatpthDikz3g&s",
      title: "Education Support",
      description: "Empowering children through quality education and learning resources"
    },
    {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZyM0IR7UUAOzOnjZ3u-uTk_WiW8BScCtU_fuPhtlUp8H918ClxLVZrR4UkQKt_9fGvlk&usqp=CAU",
      title: "Community Development",
      description: "Building stronger communities through collaborative initiatives"
    },
    {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqE5iXeHaFNj-skSCWJ51VtbLYGGGhCWLoDZpCVCQqC6fbXu5ZUsBvoAjAL8_UH2fYDXc&usqp=CAU",
      title: "Volunteer Programs",
      description: "Engaging youth volunteers in meaningful social impact activities"
    },
    {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq2LADlPXaKPDIlEjf1ewUbaPN4ScAnidXog&s",
      title: "Skill Development",
      description: "Providing vocational training and skill development opportunities"
    },
    {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWbzh9VQ-GjZTS45yvfAzsaYSvIcNzMZyiieiFP7UK7NngurqH9hsMhpTAPK3zAs33_5o&usqp=CAU",
      title: "Environmental Conservation",
      description: "Promoting sustainable practices and environmental awareness"
    },
     {
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWbzh9VQ-GjZTS45yvfAzsaYSvIcNzMZyiieiFP7UK7NngurqH9hsMhpTAPK3zAs33_5o&usqp=CAU",
      title: "Environmental Conservation",
      description: "Promoting sustainable practices and environmental awareness"
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const impactStats = [
    { number: "12,000+", label: "Active Volunteers", icon: "👥" },
    { number: "12+", label: "Cities Covered", icon: "📍" },
    { number: "50,000+", label: "Lives Impacted", icon: "❤️" },
    { number: "15+", label: "Years of Service", icon: "🏆" }
  ];

  const donationTiers = [
    {
      amount: "₹500",
      title: "Support a Child",
      description: "Provide educational materials for one child for a month",
      impact: "Books, stationery, and learning resources"
    },
    {
      amount: "₹2,000",
      title: "Enable a Volunteer",
      description: "Support volunteer training and development programs",
      impact: "Training materials, workshops, and resources"
    },
    {
      amount: "₹5,000",
      title: "Transform a Community",
      description: "Fund community development initiatives and programs",
      impact: "Infrastructure, equipment, and program implementation"
    }
  ];

  return (
    <div className="font-sans bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 100 ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Bhumi</h1>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
                About Us
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
                Our Work
              </button>
              <button 
                onClick={() => scrollToSection('donate')}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
                Get Involved
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button className="text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Volunteer
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                onClick={() => window.location.href = '/payment'}>
                Donate Now
              </button>
              <Link to="/signin">
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://static.vecteezy.com/system/resources/thumbnails/037/487/582/small/children-education-s-donation-template-for-facebook-ads-editor_template.jpeg?last_updated=1706605710')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              BHUMI
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light mb-8 max-w-2xl mx-auto">
              Empowering Communities for Sustainable Change
            </p>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-8"></div>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join India's largest independent youth volunteer organization in creating lasting impact through education, environment, and community welfare initiatives.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/payment'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Make a Donation
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              See Our Impact
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact in Action</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how Bhumi is transforming lives across India through education, environment, and community development programs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                  <img 
                    src={image.url} 
                    alt={image.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                    <p className="text-sm text-gray-200">{image.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section id="donate" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Support Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your contribution helps us reach more communities and create lasting change. Every donation makes a difference in transforming lives.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="grid gap-6">
                {donationTiers.map((tier, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-600 mb-1">{tier.amount}</div>
                        <h3 className="text-xl font-semibold text-gray-900">{tier.title}</h3>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Donate
                      </button>
                    </div>
                    <p className="text-gray-600 mb-3">{tier.description}</p>
                    <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                      <strong>Impact:</strong> {tier.impact}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Other Ways to Help</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🙋</span>
                    </div>
                    <span className="text-gray-700">Volunteer with us in your city</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🤝</span>
                    </div>
                    <span className="text-gray-700">Corporate partnerships and CSR</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📢</span>
                    </div>
                    <span className="text-gray-700">Spread awareness about our mission</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://www.actionaidindia.org/act-for-children/images/act_for_children_mob_Ozfet.jpg" 
                  alt="Children benefiting from education programs" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">87%</div>
                  <div className="text-sm text-gray-600">of donations go directly to programs</div>
                </div>
              </div>
              
              <div className="absolute -top-8 -right-8 bg-blue-600 rounded-2xl p-6 shadow-xl text-white">
                <div className="text-center">
                  <div className="text-3xl font-bold">₹100</div>
                  <div className="text-sm opacity-90">can provide supplies for a week</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <h3 className="text-2xl font-bold">Bhumi</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Empowering communities for sustainable change through education, environment, and social welfare initiatives across India.
              </p>
              <div className="flex space-x-4">
                {[
                  { name: 'Facebook', color: 'bg-blue-600', icon: 'f' },
                  { name: 'Twitter', color: 'bg-blue-400', icon: 't' },
                  { name: 'Instagram', color: 'bg-pink-600', icon: 'i' },
                  { name: 'LinkedIn', color: 'bg-blue-700', icon: 'in' }
                ].map((social, index) => (
                  <button 
                    key={index} 
                    className={`w-10 h-10 ${social.color} rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity`}
                  >
                    <span className="text-white font-bold text-sm">{social.icon}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                {['About Us', 'Our Programs', 'Volunteer', 'Success Stories'].map((link, index) => (
                  <li key={index}>
                    <button className="text-gray-300 hover:text-white transition-colors">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Get Involved</h4>
              <ul className="space-y-2">
                {['Donate', 'Volunteer', 'Corporate Partnership', 'Fundraise'].map((link, index) => (
                  <li key={index}>
                    <button className="text-gray-300 hover:text-white transition-colors">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact</h4>
              <div className="space-y-3 text-gray-300">
                <p>📧 contact@bhumi.ngo</p>
                <p>📞 87544-13255</p>
                <p>📍 Chennai, India</p>
              </div>
              <div className="pt-4">
                <h5 className="font-semibold mb-2">Newsletter</h5>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Bhumi. All rights reserved. Registered NGO dedicated to community empowerment.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BhumiLandingPage;