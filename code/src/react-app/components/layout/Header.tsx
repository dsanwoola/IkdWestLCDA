import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, ChevronDown, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';

const navigationItems = [
  { label: 'Home', href: '/' },
  { 
    label: 'About Us', 
    href: '/about',
    children: [
      { label: 'History & Vision', href: '/about' },
      { label: 'Leadership', href: '/about/leadership' },
      { label: 'Organizational Structure', href: '/about/structure' },
    ]
  },
  { label: "Chairman's Office", href: '/chairman' },
  { label: 'Departments', href: '/departments' },
  { label: 'Projects', href: '/projects' },
  { label: 'News', href: '/news' },
  { 
    label: 'Services', 
    href: '/services',
    children: [
      { label: 'Citizen Services', href: '/services' },
      { label: 'Budget Transparency', href: '/budget' },
      { label: 'Submit Request', href: '/services/request' },
    ]
  },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground text-xs sm:text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center gap-2">
          <div className="flex items-center gap-x-4 gap-y-1 flex-wrap">
            <a href="tel:+2341234567890" className="flex min-h-8 items-center gap-1.5 hover:opacity-80 transition-opacity">
              <Phone className="w-3.5 h-3.5" />
              <span>+234 123 456 7890</span>
            </a>
            <a href="mailto:info@ikoroduwestlcda.gov.ng" className="flex min-h-8 items-center gap-1.5 hover:opacity-80 transition-opacity break-all sm:break-normal">
              <Mail className="w-3.5 h-3.5" />
              <span>info@ikoroduwestlcda.gov.ng</span>
            </a>
          </div>
          <div className="flex min-h-8 items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Ikorodu, Lagos State, Nigeria</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-white shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between min-h-16 sm:min-h-20 py-2">
            {/* Logo */}
            <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
              <img 
                src="/assets/mocha/ikd-logo.jpg" 
                alt="Ikorodu Logo" 
                className="h-10 w-10 rounded-full object-cover shadow-md sm:h-12 sm:w-12"
              />
              <img 
                src="/assets/mocha/ikd-west-logo.jpeg" 
                alt="Ikorodu West LCDA Crest" 
                className="h-10 w-10 object-contain sm:h-12 sm:w-12"
              />
              <div className="min-w-0">
                <h1 className="max-w-[9rem] truncate text-sm font-bold leading-tight text-foreground sm:max-w-none sm:text-lg">
                  Ikorodu West LCDA
                </h1>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  Lagos State, Nigeria
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => (
                <div 
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-primary bg-primary/5'
                        : 'text-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {item.label}
                    {item.children && <ChevronDown className="w-3.5 h-3.5" />}
                  </Link>
                  
                  {item.children && openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA & Mobile Menu */}
            <div className="flex items-center gap-3">
              <Button asChild className="hidden md:inline-flex bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link to="/services/request">Report Issue</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link to="/login">Staff Portal</Link>
              </Button>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden min-h-11 min-w-11 p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-white animate-in slide-in-from-top-2 duration-200">
            <nav className="max-h-[calc(100dvh-9rem)] max-w-7xl mx-auto overflow-y-auto px-4 py-4 space-y-1 safe-bottom">
              {navigationItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    className={`block min-h-11 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-primary bg-primary/5'
                        : 'text-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block min-h-10 px-4 py-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Link to="/services/request">Report Issue</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/login">Staff Portal</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
