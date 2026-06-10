import { useState } from 'react';
import { Link } from 'react-router';
import { 
  ArrowRight, 
  MapPin,
  Calendar,
  Clock,
  Camera,
  Utensils,
  Music,
  TreePine,
  Building,
  Waves,
  Star,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Compass,
  Sun,
  Users
} from 'lucide-react';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { Badge } from '@/react-app/components/ui/badge';
import Layout from '@/react-app/components/layout/Layout';

const attractions = [
  {
    id: 1,
    name: 'Ikorodu Heritage Museum',
    category: 'Culture',
    description: 'Discover the rich history of Ikorodu through artifacts, photographs, and interactive exhibits spanning centuries of Yoruba civilization.',
    image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=600&h=400&fit=crop',
    location: 'Ikorodu Town Center',
    hours: '9AM - 5PM (Tue-Sun)',
    entryFee: '₦500',
    rating: 4.5,
    featured: true
  },
  {
    id: 2,
    name: 'Majidun Waterfront',
    category: 'Nature',
    description: 'A scenic waterfront along the Lagos Lagoon, perfect for relaxation, photography, and enjoying fresh seafood at local restaurants.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    location: 'Majidun Area',
    hours: 'Open 24 hours',
    entryFee: 'Free',
    rating: 4.3
  },
  {
    id: 3,
    name: 'Ita-Elewa Palace',
    category: 'Heritage',
    description: 'The historic palace of the Ayangburen of Ikorodu, showcasing traditional Yoruba architecture and royal heritage.',
    image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=600&h=400&fit=crop',
    location: 'Ita-Elewa, Ikorodu',
    hours: 'By appointment',
    entryFee: '₦1,000',
    rating: 4.7
  },
  {
    id: 4,
    name: 'Agric-Owutu Nature Trail',
    category: 'Nature',
    description: 'A 5km nature trail through lush vegetation, ideal for hiking, bird watching, and connecting with nature.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
    location: 'Agric Area',
    hours: '6AM - 6PM',
    entryFee: '₦300',
    rating: 4.2
  },
  {
    id: 5,
    name: 'Ikorodu Arts & Crafts Market',
    category: 'Shopping',
    description: 'Browse traditional crafts, textiles, beadwork, and souvenirs made by local artisans.',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&h=400&fit=crop',
    location: 'Ikorodu Main Market',
    hours: '8AM - 6PM (Mon-Sat)',
    entryFee: 'Free',
    rating: 4.0
  },
  {
    id: 6,
    name: 'Ijede Beach Resort',
    category: 'Recreation',
    description: 'A family-friendly beach resort with swimming, water sports, and weekend entertainment.',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
    location: 'Ijede',
    hours: '8AM - 8PM',
    entryFee: '₦2,000',
    rating: 4.4,
    featured: true
  }
];

const festivals = [
  {
    name: 'Ikorodu Oga Day',
    month: 'December',
    description: 'Annual cultural festival celebrating Ikorodu heritage with masquerades, music, and traditional performances.',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop'
  },
  {
    name: 'Eyo Festival',
    month: 'Varies',
    description: 'Iconic Lagos cultural festival featuring white-clad Eyo masquerades, often celebrated in Ikorodu.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'
  },
  {
    name: 'Agemo Festival',
    month: 'July',
    description: 'Traditional Ijebu festival honoring the deity Agemo with colorful processions and rituals.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop'
  }
];

const localCuisine = [
  {
    name: 'Fresh Seafood',
    description: 'Grilled fish, prawns, and crab from the Lagos Lagoon',
    icon: Waves
  },
  {
    name: 'Pounded Yam & Egusi',
    description: 'Traditional Yoruba delicacy with rich melon soup',
    icon: Utensils
  },
  {
    name: 'Ofada Rice',
    description: 'Local rice variety served with spicy ofada sauce',
    icon: Utensils
  },
  {
    name: 'Palm Wine',
    description: 'Fresh palm wine tapped from local palm trees',
    icon: TreePine
  }
];

const visitorTips = [
  {
    title: 'Best Time to Visit',
    description: 'November to March offers the best weather with less rainfall and cooler temperatures.',
    icon: Sun
  },
  {
    title: 'Getting Around',
    description: 'Tricycles (Keke) and buses are readily available. Boats connect to Lagos Island.',
    icon: Compass
  },
  {
    title: 'Local Guides',
    description: 'Hire certified tour guides from the Tourism Office for authentic experiences.',
    icon: Users
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Culture': return Camera;
    case 'Nature': return TreePine;
    case 'Heritage': return Building;
    case 'Shopping': return Star;
    case 'Recreation': return Waves;
    default: return MapPin;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Culture': return 'bg-purple-100 text-purple-700';
    case 'Nature': return 'bg-green-100 text-green-700';
    case 'Heritage': return 'bg-amber-100 text-amber-700';
    case 'Shopping': return 'bg-pink-100 text-pink-700';
    case 'Recreation': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function TourismPage() {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const featuredAttractions = attractions.filter(a => a.featured);

  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&h=600&fit=crop', caption: 'Lagos Lagoon at sunset' },
    { url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&h=600&fit=crop', caption: 'Traditional Yoruba architecture' },
    { url: 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=1200&h=600&fit=crop', caption: 'Local artisan at work' },
    { url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&h=600&fit=crop', caption: 'Cultural festival celebrations' }
  ];

  const nextImage = () => setActiveGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () => setActiveGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1600&h=900&fit=crop"
            alt="Ikorodu West Tourism"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-white">
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Tourism</span>
          </nav>
          <Badge className="bg-secondary text-secondary-foreground mb-4">
            Discover Ikorodu West
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl" style={{ fontFamily: 'Playfair Display, serif' }}>
            Experience the Heart of Lagos East
          </h1>
          <p className="text-xl text-white/90 leading-relaxed max-w-2xl mb-8">
            Rich cultural heritage, stunning waterfront views, vibrant festivals, and warm hospitality 
            await you in Ikorodu West LCDA.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
              <Compass className="w-5 h-5" />
              Explore Attractions
            </Button>
            <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Events
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">15+</div>
              <div className="text-white/70">Attractions</div>
            </div>
            <div>
              <div className="text-3xl font-bold">8</div>
              <div className="text-white/70">Annual Festivals</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-white/70">Local Restaurants</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100K+</div>
              <div className="text-white/70">Visitors Yearly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Attractions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Must See</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Featured Attractions
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {featuredAttractions.map((attraction) => {
              const Icon = getCategoryIcon(attraction.category);
              return (
                <Card key={attraction.id} className="overflow-hidden border-0 shadow-xl group">
                  <div className="grid md:grid-cols-2">
                    <div className="relative h-64 md:h-auto overflow-hidden">
                      <img 
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                        Featured
                      </Badge>
                    </div>
                    <CardContent className="p-6 flex flex-col justify-center">
                      <Badge className={`w-fit mb-3 ${getCategoryColor(attraction.category)}`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {attraction.category}
                      </Badge>
                      <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {attraction.name}
                      </h3>
                      <p className="text-muted-foreground mb-4">{attraction.description}</p>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          {attraction.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          {attraction.hours}
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          {attraction.rating} rating
                        </div>
                      </div>
                      <Button className="w-fit gap-2">
                        Learn More <ArrowRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Attractions */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Explore</span>
              <h2 className="text-3xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                All Attractions
              </h2>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              {['All', 'Nature', 'Culture', 'Heritage', 'Recreation'].map((cat) => (
                <Button key={cat} variant={cat === 'All' ? 'default' : 'outline'} size="sm">
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction) => {
              const Icon = getCategoryIcon(attraction.category);
              return (
                <Card key={attraction.id} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className={`absolute top-3 left-3 ${getCategoryColor(attraction.category)}`}>
                      <Icon className="w-3 h-3 mr-1" />
                      {attraction.category}
                    </Badge>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {attraction.rating}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {attraction.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {attraction.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        {attraction.location}
                      </span>
                      <span className="font-semibold text-primary">{attraction.entryFee}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Gallery</span>
            <h2 className="text-3xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Capture the Beauty
            </h2>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={galleryImages[activeGalleryIndex].url}
              alt={galleryImages[activeGalleryIndex].caption}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <p className="text-white text-xl font-semibold">{galleryImages[activeGalleryIndex].caption}</p>
              <div className="flex gap-2">
                <Button size="icon" variant="secondary" onClick={prevImage} className="rounded-full">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="secondary" onClick={nextImage} className="rounded-full">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveGalleryIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === activeGalleryIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Festivals & Events */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Celebrate</span>
            <h2 className="text-3xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Festivals & Cultural Events
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {festivals.map((festival, idx) => (
              <Card key={idx} className="overflow-hidden border-0 shadow-lg group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={festival.image}
                    alt={festival.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-secondary text-secondary-foreground mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      {festival.month}
                    </Badge>
                    <h3 className="text-white font-bold text-lg">{festival.name}</h3>
                  </div>
                </div>
                <CardContent className="p-5">
                  <p className="text-muted-foreground text-sm">{festival.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Local Cuisine */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Taste</span>
              <h2 className="text-3xl font-bold mt-2 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Local Cuisine & Delicacies
              </h2>
              <p className="text-muted-foreground mb-8">
                Ikorodu's cuisine reflects its coastal location and Yoruba heritage. From fresh 
                seafood to traditional dishes, every meal is an experience.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {localCuisine.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&h=500&fit=crop"
                alt="Local cuisine"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <div className="font-bold">50+ Restaurants</div>
                    <div className="text-sm text-muted-foreground">Local & Continental</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visitor Information */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Plan Your Visit</span>
            <h2 className="text-3xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Visitor Information
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {visitorTips.map((tip, idx) => (
              <Card key={idx} className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <tip.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
                  <p className="text-muted-foreground text-sm">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Tourism Office */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 bg-primary text-white">
                <Music className="w-10 h-10 mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Tourism & Culture Office
                </h3>
                <p className="text-white/80 mb-6">
                  Need help planning your visit? Our tourism team is here to assist with 
                  recommendations, tour guides, and event information.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <span>+234 123 456 7890</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" />
                    <span>tourism@ikoroduwestlcda.gov.ng</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <span>LCDA Secretariat, Ikorodu</span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h4 className="font-semibold text-lg mb-4">Quick Inquiry</h4>
                <form className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    className="w-full px-4 py-3 rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <textarea 
                    placeholder="How can we help with your visit?"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <Button className="w-full gap-2">
                    Send Inquiry
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to Explore Ikorodu West?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Plan your visit today and discover the rich culture, beautiful landscapes, and 
            warm hospitality that make Ikorodu West a unique destination.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
              <Link to="/contact">
                Contact Tourism Office
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
              Download Visitor Guide
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
