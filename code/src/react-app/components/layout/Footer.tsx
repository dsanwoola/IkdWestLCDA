import { Link } from 'react-router';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Departments', href: '/departments' },
  { label: 'Projects', href: '/projects' },
  { label: 'News & Updates', href: '/news' },
  { label: 'Budget & Finance', href: '/budget' },
  { label: 'Contact Us', href: '/contact' },
];

const citizenServices = [
  { label: 'Submit Request', href: '/services/request' },
  { label: 'Track Request', href: '/services/track' },
  { label: 'Environmental Services', href: '/services' },
  { label: 'Business Registration', href: '/services' },
  { label: 'Marriage Registration', href: '/services' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/assets/mocha/ikd-logo.jpg" 
                alt="Ikorodu Logo" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <img 
                src="/assets/mocha/ikd-west-logo.jpeg" 
                alt="Ikorodu West LCDA Crest" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h3 className="font-bold text-lg">Ikorodu West LCDA</h3>
                <p className="text-sm text-slate-400">Lagos State, Nigeria</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Committed to transparent governance, citizen engagement, and sustainable 
              development for all residents of Ikorodu West.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 relative">
              Quick Links
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-secondary -mb-2"></span>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-slate-300 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Citizen Services */}
          <div>
            <h4 className="font-semibold text-lg mb-6 relative">
              Citizen Services
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-secondary -mb-2"></span>
            </h4>
            <ul className="space-y-3">
              {citizenServices.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-slate-300 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-6 relative">
              Contact Us
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-secondary -mb-2"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">
                  LCDA Secretariat, Ikorodu West,<br />
                  Ikorodu, Lagos State, Nigeria
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                <a href="tel:+2341234567890" className="text-slate-300 hover:text-white text-sm transition-colors">
                  +234 123 456 7890
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <a href="mailto:info@ikoroduwestlcda.gov.ng" className="text-slate-300 hover:text-white text-sm transition-colors">
                  info@ikoroduwestlcda.gov.ng
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="w-5 h-5 text-secondary flex-shrink-0" />
                <span className="text-slate-300 text-sm">
                  Mon - Fri: 8:00 AM - 4:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>© {currentYear} Ikorodu West LCDA. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
