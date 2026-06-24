import { Link } from 'react-router';
import { 
  Target, 
  Eye, 
  Shield, 
  Users, 
  Award,
  Calendar,
  ArrowRight,
  Crown
} from 'lucide-react';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import Layout from '@/react-app/components/layout/Layout';

interface PhotoOrgNodeData {
  title: string;
  name?: string;
  image: string;
  level: 'executive' | 'management' | 'department' | 'unit';
}

const PhotoOrgCard = ({ title, name, image, level }: PhotoOrgNodeData) => {
  const styles = {
    executive: 'border-green-800 bg-green-800 text-white shadow-xl',
    management: 'border-green-700 bg-white text-green-900 shadow-lg',
    department: 'border-green-500 bg-white text-green-900 shadow-md',
    unit: 'border-green-300 bg-green-50 text-green-800 shadow-sm'
  };

  const imageSize = level === 'executive' ? 'h-24 w-24' : level === 'management' ? 'h-20 w-20' : 'h-16 w-16';

  return (
    <div className={`flex min-h-full flex-col items-center rounded-2xl border-2 p-3 text-center transition-all hover:-translate-y-1 hover:shadow-xl ${styles[level]}`}>
      <img
        src={image}
        alt={name ? `${name}, ${title}` : title}
        className={`${imageSize} rounded-full border-4 border-white object-cover shadow-md`}
      />
      {name && <span className="mt-3 text-xs font-semibold leading-tight">{name}</span>}
      <span className={`${name ? 'mt-1' : 'mt-3'} text-[11px] font-bold uppercase tracking-wide leading-tight ${level === 'executive' ? 'text-white/90' : 'text-green-700'}`}>
        {title}
      </span>
    </div>
  );
};

const executiveNode: PhotoOrgNodeData = {
  title: 'Executive Chairman',
  name: 'Hon. Otunba Suliamon Kazeem Olarewaju FCA, FCTI',
  image: '/assets/mocha/chairman-ikd-west.jpg',
  level: 'executive'
};

const viceChairmanNode: PhotoOrgNodeData = {
  title: 'Vice Chairman',
  image: '/assets/mocha/chair-2.jpeg',
  level: 'management'
};

const slgNode: PhotoOrgNodeData = {
  title: 'SLG',
  image: '/assets/mocha/chair-3.jpeg',
  level: 'management'
};

const supervisorsNode: PhotoOrgNodeData = {
  title: 'Supervisors',
  image: '/assets/mocha/Chairman\'s-office.jpeg',
  level: 'unit'
};

const councilManagerNode: PhotoOrgNodeData = {
  title: 'Council Manager',
  image: '/assets/mocha/hod-clerk-west.jpeg',
  level: 'management'
};

const legislativeNode: PhotoOrgNodeData = {
  title: 'Legislative Arm',
  image: '/assets/mocha/organogram.jpeg',
  level: 'management'
};

const clerkNode: PhotoOrgNodeData = {
  title: 'Clerk of the House',
  image: '/assets/mocha/hod-clerk-west.jpeg',
  level: 'unit'
};

const departmentNodes: PhotoOrgNodeData[] = [
  { title: 'Head, Admin & Human Resource Dept.', image: '/assets/mocha/hod-hr-west.jpeg', level: 'department' },
  { title: 'Head, Finance & Accounts Dept.', image: '/assets/mocha/HOD-FINANCE-IKD-WEST.jpeg', level: 'department' },
  { title: 'Head, Works & Infrastructure Dept.', image: '/assets/mocha/HOD-work-ikd-west.jpeg', level: 'department' },
  { title: 'Head, Agric & Social Services Dept.', image: '/assets/mocha/Hod-Agric-west.jpeg', level: 'department' },
  { title: 'Head, Education & Library Services Dept.', image: '/assets/mocha/Education-1.jpeg', level: 'department' },
  { title: 'Head, Planning, Budget, Research & Statistics Dept.', image: '/assets/mocha/HOD-du-ikd-west.jpeg', level: 'department' },
  { title: 'Head, WAPA Dept.', image: '/assets/mocha/hod-wapa-west.jpeg', level: 'department' },
  { title: 'Head, Primary Healthcare Services Dept.', image: '/assets/mocha/ikd-medical-hod.jpeg', level: 'department' },
  { title: 'Head, Environmental Services Dept.', image: '/assets/mocha/public-afric-hod-west.JPG', level: 'department' },
];

const unitNodes: PhotoOrgNodeData[] = [
  { title: 'Head, Audit Unit', image: '/assets/mocha/HOD-audit-ikd-west.jpeg', level: 'unit' },
  { title: 'Head, Legal Service Unit', image: '/assets/mocha/ikd-west-legal-hod.jpeg', level: 'unit' },
  { title: 'Head, Public Affairs Unit', image: '/assets/mocha/public-afric-hod-west.JPG', level: 'unit' },
  { title: 'Head, Tourism Unit', image: '/assets/mocha/HOD-tourism-ikd-west.jpeg', level: 'unit' },
  { title: 'Head, ICT Unit', image: '/assets/mocha/hod-ict-west.jpeg', level: 'unit' },
  { title: 'Head, Procurement Unit', image: '/assets/mocha/area-a-hod-west.jpeg', level: 'unit' },
  { title: 'Area Officers', image: '/assets/mocha/area-b-hod-west.jpeg', level: 'unit' },
];

// Core values
const coreValues = [
  { icon: Shield, title: 'Resilience', description: 'We persist through challenges with determination, adapting to changing circumstances while maintaining our commitment to serving the community.' },
  { icon: Target, title: 'Focused', description: 'We remain steadfast in our goals, channeling our resources and efforts toward achieving sustainable development for Ikorodu West.' },
  { icon: Award, title: 'Integrity', description: 'We uphold the highest ethical standards in all our dealings, ensuring public trust through honest and principled governance.' },
  { icon: Users, title: 'Team Work', description: 'We collaborate effectively across departments and with citizens, recognizing that collective effort drives meaningful progress.' },
];

// Timeline milestones
const milestones = [
  { year: '2003', title: 'LCDA Established', description: 'Ikorodu West LCDA was officially created as part of the Lagos State local government reforms.' },
  { year: '2008', title: 'First Major Infrastructure Project', description: 'Completion of the Agric-Owutu road network, connecting major communities.' },
  { year: '2012', title: 'Healthcare Expansion', description: 'Establishment of 5 primary healthcare centers across all major wards.' },
  { year: '2016', title: 'Education Initiative Launch', description: 'Introduction of free education programs and school renovation projects.' },
  { year: '2020', title: 'Digital Transformation Begins', description: 'Launch of e-governance initiatives and online citizen services.' },
  { year: '2024', title: 'Digital Governance Portal', description: 'Launch of comprehensive digital platform for citizen engagement and service delivery.' },
];

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/mocha/ikd-west-building.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">About Us</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              About Ikorodu West LCDA
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Serving the vibrant communities of Ikorodu West with dedication, transparency, 
              and a commitment to sustainable development since 2003.
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our History</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Brief History of Ikorodu West LCDA
            </h2>
          </div>
          
          {/* Main History Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Ikorodu West Local Council Development Area is one of the 37 LCDAs created by the former 
                Lagos State Governor, Senator Bola Ahmed Tinubu in 2003 (now the President of the Federal 
                Republic of Nigeria), which resulted in a long row between him and the former President, 
                Chief Olusegun Obasanjo.
              </p>
              <p>
                The creation was due to the increasing demands for more council areas, particularly in 
                Ikorodu which had a single Local Government then despite its huge size. The influx of 
                people into the division and expansion equally necessitated these demands. With the 
                acceptance of the people in this regard, Ikorodu Local Government Area was carved along 
                with five (5) other LCDAs.
              </p>
              <p>
                The council is surrounded and bounded by the Lagos Lagoon at Ipakodo and Ebute Iga, 
                Majidun River at Majidun entrance into the division, and creeks in Owutu and Isawo axis. 
                The council is a gateway in and out of Ikorodu Division.
              </p>
              <p>
                The council has had the privilege of being administered by experienced elected Council 
                Chairmen, Appointed Sole Administrators, and Executive Secretaries since its establishment 
                in 2003.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-secondary/20 rounded-full blur-2xl" />
              <img 
                src="https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=400&fit=crop"
                alt="Ikorodu Community"
                className="rounded-2xl shadow-2xl relative"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6">
                <div className="text-4xl font-bold text-primary">20+</div>
                <div className="text-sm text-muted-foreground">Years of Service</div>
              </div>
            </div>
          </div>

          {/* Past Leaders */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Executive Chairmen / Administrators */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Council Bosses Since Inception
                </h3>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">1.</span>
                    <span>Chief Akin Atoloye (Executive Chairman)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">2.</span>
                    <span>Hon. Babajide Banjoko (Executive Chairman)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">3.</span>
                    <span>Princess/Hon. Mrs. Olajumoke Jimbo-Ademehin (Executive Chairman) <em className="text-sm">(2011-2013)</em></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">4.</span>
                    <span>Princess Adunni Oyefusi (Executive Secretary) <em className="text-sm">(2013-2015)</em></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">5.</span>
                    <span>Mr. Abdul-Gamal Adesegun Anifowoshe (Sole Administrator) <em className="text-sm">(2016-2017)</em></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">6.</span>
                    <span>Princess Olajumoke Jimbo-Ademehin (Executive Chairman) <em className="text-sm">(2017-2021)</em></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">7.</span>
                    <span>Hon. Sulaimon Kazeem Olanrewaju (FCA, FCT) (Executive Chairman) <em className="text-sm">(2021-Till Date)</em></span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            {/* Vice Chairmen */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 text-secondary" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Past Vice Chairmen
                </h3>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-semibold text-secondary">1.</span>
                    <span>Hon. Babajide Banjoko <em className="text-sm">(2003-2004)</em></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-secondary">2.</span>
                    <span>Hon. Wasiu Adio Adekoya <em className="text-sm">(2004-2006)</em></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-secondary">3.</span>
                    <span>Princess Olajumoke Jimbo-Ademehin <em className="text-sm">(2008-2011)</em></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-secondary">4.</span>
                    <span>Hon. Sulaimon Kazeem Olanrewaju (FCA, FCTD) <em className="text-sm">(2011-2014)</em></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-secondary">5.</span>
                    <span>Hon. Sesan Dada <em className="text-sm">(2017-2021)</em></span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Legislative Arm & Wards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Legislative Staff */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Legislative Arm Leadership
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">Leader:</span>
                    <span>Hon. Abraham-Oba Jessica Enitan (Ward A)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">Deputy Leader:</span>
                    <span>Hon. Batife Daisi Ehiyerimini (Ward B)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">Chief Whip:</span>
                    <span>Hon. Ganiyu Odunayo Anifowoshe (Ward C)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">Deputy Chief Whip:</span>
                    <span>Hon. Dare Adeleke Oluyelu (Ward D)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-primary">Majority Leader:</span>
                    <span>Hon. Taiwo Samuel Abimbola (Ward E)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Wards */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/5 to-secondary/10">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  The Five Wards
                </h3>
                <p className="text-muted-foreground mb-4">
                  The council has five wards, each represented in the Legislative Arm by a councillor:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3 items-center">
                    <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">A</span>
                    <span><strong>Ipakodo</strong> - Ward A</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">B</span>
                    <span><strong>Majidun/Ogolonto</strong> - Ward B</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">C</span>
                    <span><strong>Owutu</strong> - Ward C</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">D</span>
                    <span><strong>Ajaguro</strong> - Ward D</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">E</span>
                    <span><strong>Isawo</strong> - Ward E</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Traditional Institution */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Crown className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Traditional Institution
                    </h3>
                    <p className="text-muted-foreground">
                      The traditional governance structure of Ikorodu West LCDA
                    </p>
                  </div>
                </div>

                {/* Oba of Ipakodo */}
                <div className="mb-8 p-6 bg-white/60 dark:bg-gray-800/40 rounded-xl">
                  <h4 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-4 flex items-center gap-2">
                    <Crown className="w-5 h-5" /> OBA OF IPAKODO
                  </h4>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-amber-200 dark:border-amber-800">
                          <th className="py-2 px-3 text-left font-semibold">S/N</th>
                          <th className="py-2 px-3 text-left font-semibold">Full Name</th>
                          <th className="py-2 px-3 text-left font-semibold">Title</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2 px-3">1.</td>
                          <td className="py-2 px-3 font-medium">HRM Oba (Engr) Basiru Aremu Sotonwa</td>
                          <td className="py-2 px-3">Osomeku 1, Sekumade of Ipakodo</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    The Oba of Ipakodo, known as the <strong>Sekumade of Ipakodo Kingdom</strong> (currently His Royal Majesty, 
                    Oba Basiru Aremu Sotonwa, installed in 2018), serves as the paramount traditional ruler of Ipakodo in the 
                    Ikorodu West Local Council Development Area (LCDA) of Lagos State.
                  </p>
                  <h5 className="font-semibold text-sm mb-3 text-amber-700 dark:text-amber-400">Functions of the Sekumade of Ipakodo:</h5>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                      <span className="text-amber-600">•</span>
                      <span><strong>Cultural Preservation and Tradition:</strong> Serving as the custodian of Ipakodo heritage, fostering cultural pride, and presiding over traditional events, such as the annual Ipakodo Day Celebrations.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600">•</span>
                      <span><strong>Community Development and Unity:</strong> Championing infrastructural development and unity among residents, including both indigenes and non-indigenes, often promoting peace and dialogue in the community.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600">•</span>
                      <span><strong>Administrative and Judicial Roles:</strong> Mediating family and community disputes with traditional wisdom to ensure peace. The monarch also works with the Sekumade-in-Council to govern the Ipakodo community.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600">•</span>
                      <span><strong>Facilitating Infrastructure:</strong> Initiating and supporting major developmental projects, such as the construction of the ultra-modern Sekumade Palace in partnership with community organizations like IDPIL.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600">•</span>
                      <span><strong>Promoting Social Welfare:</strong> Encouraging self-help projects, education, and empowering youth, as seen in his support for local business owners and philanthropic initiatives.</span>
                    </li>
                  </ul>
                </div>

                {/* Traditional Chiefs */}
                <div className="mb-8 p-6 bg-white/60 dark:bg-gray-800/40 rounded-xl">
                  <h4 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-4">TRADITIONAL CHIEFS</h4>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-amber-200 dark:border-amber-800">
                          <th className="py-2 px-3 text-left font-semibold">S/N</th>
                          <th className="py-2 px-3 text-left font-semibold">Full Name</th>
                          <th className="py-2 px-3 text-left font-semibold">Title</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-100 dark:divide-amber-900">
                        <tr><td className="py-2 px-3">1.</td><td className="py-2 px-3">Chief Oludayo Sotomiwa</td><td className="py-2 px-3">Olisa of Ipakodo</td></tr>
                        <tr><td className="py-2 px-3">2.</td><td className="py-2 px-3">Chief L.O.S. Animashaun</td><td className="py-2 px-3">Odofin of Ipakodo</td></tr>
                        <tr><td className="py-2 px-3">3.</td><td className="py-2 px-3">Chief Samuel Adele Ogunlade</td><td className="py-2 px-3">Balogun of Ipakodo</td></tr>
                        <tr><td className="py-2 px-3">4.</td><td className="py-2 px-3">Chief (Mrs.) T. G. Bamimosu Atufagbon</td><td className="py-2 px-3">Olotu Erelu of Ipakodo</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    The Chiefs of Ipakodo Kingdom in Ikorodu, Lagos State—operating under the leadership of the Sekumade of Ipakodo, 
                    Oba Basiru Sotonwa—play a pivotal role in the administration, culture, and development of their community. 
                    They represent the traditional authority, working closely with the monarch to foster peace and progress.
                  </p>
                  <h5 className="font-semibold text-sm mb-3 text-amber-700 dark:text-amber-400">Key Functions of the Chiefs of Ipakodo:</h5>
                  <div className="text-sm text-muted-foreground space-y-4">
                    <div>
                      <p className="font-semibold mb-1">1. Administrative and Advisory Role</p>
                      <ul className="space-y-1 ml-4">
                        <li>• Advising the Monarch: Chiefs, particularly high-ranking ones like the Olisa (the prime minister or next in rank to the Oba), advise the Sekumade on governance matters.</li>
                        <li>• Administration of Ruling Houses: The traditional system recognizes distinct ruling houses (e.g., Osomeku Ruling House) involved in the selection of the Oba.</li>
                        <li>• Maintaining Stability: They ensure smooth operation of local governance and keep peace in the community.</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">2. Custodians of Culture and Tradition</p>
                      <ul className="space-y-1 ml-4">
                        <li>• Cultural Preservation: Responsible for promoting and preserving the cultural heritage of the Ipakodo Kingdom.</li>
                        <li>• Festivals and Rituals: Significant role in traditional festivals, such as the Ipakodo Day celebration.</li>
                        <li>• Land Matters: Work with the Oba to manage traditional land stewardship within the community.</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">3. Community Development and Mediation</p>
                      <ul className="space-y-1 ml-4">
                        <li>• Dispute Resolution: Mediate conflicts among residents and families, fostering unity and peace.</li>
                        <li>• Supporting Development Projects: Support initiatives like the construction of the new Sekumade Palace and Pavilion.</li>
                        <li>• Engaging Government: Serve as a bridge between the community and Lagos State Government and Ikorodu West LCDA.</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">4. Ceremonial and Judicial Roles</p>
                      <ul className="space-y-1 ml-4">
                        <li>• Installation of Chiefs: The Oba, with support of existing chiefs, installs new titleholders to ensure continuity of leadership.</li>
                        <li>• Eyo Festival Compliance: Ensure that traditional laws and customs are adhered to during traditional ceremonies.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Baales */}
                <div className="p-6 bg-white/60 dark:bg-gray-800/40 rounded-xl">
                  <h4 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-4">BAALES</h4>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-amber-200 dark:border-amber-800">
                          <th className="py-2 px-3 text-left font-semibold">S/N</th>
                          <th className="py-2 px-3 text-left font-semibold">Full Name</th>
                          <th className="py-2 px-3 text-left font-semibold">Title</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-100 dark:divide-amber-900">
                        <tr><td className="py-2 px-3">1.</td><td className="py-2 px-3">Chief J. O. Aluko</td><td className="py-2 px-3">Baale of Owutu</td></tr>
                        <tr><td className="py-2 px-3">2.</td><td className="py-2 px-3">Chief S. K. Aregbe</td><td className="py-2 px-3">Baale of Itowolo</td></tr>
                        <tr><td className="py-2 px-3">3.</td><td className="py-2 px-3">Chief S. O. Orepitan</td><td className="py-2 px-3">Baale of Ajaguro</td></tr>
                        <tr><td className="py-2 px-3">4.</td><td className="py-2 px-3">Chief O. Y. O. Fatola</td><td className="py-2 px-3">Baale of Ogolonto</td></tr>
                        <tr><td className="py-2 px-3">5.</td><td className="py-2 px-3">Chief M. A Jaiyesimi</td><td className="py-2 px-3">Baale of Oriokuta</td></tr>
                        <tr><td className="py-2 px-3">6.</td><td className="py-2 px-3">Chief Alex Omoyele</td><td className="py-2 px-3">Baale of Majidun Ilaje</td></tr>
                        <tr><td className="py-2 px-3">7.</td><td className="py-2 px-3">Chief Musafau I. Jokogbola</td><td className="py-2 px-3">Baale of Agbede Olunla</td></tr>
                        <tr><td className="py-2 px-3">8.</td><td className="py-2 px-3">Chief Jacob O. Oluwatosin</td><td className="py-2 px-3">Baale of Itasin</td></tr>
                        <tr><td className="py-2 px-3">9.</td><td className="py-2 px-3">Chief Oluwasegun Oyepero</td><td className="py-2 px-3">Baale of Majidun Awori</td></tr>
                        <tr><td className="py-2 px-3">10.</td><td className="py-2 px-3">Chief S. O. Ojebiyi</td><td className="py-2 px-3">Baale of Palapo</td></tr>
                        <tr><td className="py-2 px-3">11.</td><td className="py-2 px-3">Chief L. T. Eshinlokun</td><td className="py-2 px-3">Baale of Ebute-Iga</td></tr>
                        <tr><td className="py-2 px-3">12.</td><td className="py-2 px-3">Late Chief D. O. Orisan</td><td className="py-2 px-3">Baale of Isawo</td></tr>
                        <tr><td className="py-2 px-3">13.</td><td className="py-2 px-3">Chief W. F. Ojebiyi</td><td className="py-2 px-3">Baale of Ewenla</td></tr>
                        <tr><td className="py-2 px-3">14.</td><td className="py-2 px-3">Chief Musediq Ibrahim</td><td className="py-2 px-3">Baale Oke-Oko/Oke Tapa</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    A <strong>Baale</strong> is a traditional Yoruba community leader (village/district head) or family head responsible for 
                    maintaining peace, settling local disputes, managing communal land, and preserving cultural traditions. They act as 
                    the primary representative of the Oba (King) at the local level, ensuring stability and community development.
                  </p>
                  <h5 className="font-semibold text-sm mb-3 text-amber-700 dark:text-amber-400">Key Functions of a Baale:</h5>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                      <span className="text-amber-600">•</span>
                      <span><strong>Local Administration and Governance:</strong> Baales manage specific towns, villages, or districts within a kingdom, overseeing daily affairs, maintaining security, and implementing community development initiatives.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600">•</span>
                      <span><strong>Land Management and Disputes:</strong> They hold responsibility for overseeing community land and often preside over, or help settle, local disputes related to land, boundaries, or marriage.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600">•</span>
                      <span><strong>Representation of the Oba:</strong> In many systems, they are required to pledge loyalty and pay homage to the central Oba.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600">•</span>
                      <span><strong>Custodians of Culture:</strong> They are guardians of Yoruba tradition, ensuring the preservation of customs, values, and traditional festivals within their jurisdiction.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600">•</span>
                      <span><strong>Judicial/Mediation Role:</strong> Baales frequently act as adjudicators in minor community issues and are sometimes appointed as presidents of customary courts to handle matters at the local level.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600">•</span>
                      <span><strong>Protocol and Security:</strong> They maintain law and order within their domain and act as the first point of contact for security issues.</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Our Vision
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  The delivery of a pragmatic and sustainable development of the Local Government 
                  through a motivated workforce, private partnership and citizenship outreach.
                </p>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-secondary to-secondary/60" />
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Our Mission
                </h3>
                <ul className="text-muted-foreground leading-relaxed text-lg space-y-3">
                  <li className="flex gap-2">
                    <span className="font-semibold text-secondary">1.</span>
                    <span>To deliver efficient and effective service that will enhance the quality of life of the citizenry.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-secondary">2.</span>
                    <span>To harmonize best Government and Private sectors practices in decision making process.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">What Guides Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide our decisions and actions as we serve the people of Ikorodu West.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value) => (
              <Card key={value.title} className="group hover:shadow-lg transition-all border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Key Milestones
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/20 -translate-x-1/2" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div 
                  key={milestone.year}
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-secondary rounded-full -translate-x-1/2 z-10 shadow-lg shadow-secondary/50" />
                  
                  {/* Content */}
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="inline-flex items-center gap-2 bg-secondary/20 rounded-full px-3 py-1 mb-3">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span className="text-secondary font-semibold">{milestone.year}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-white/70 text-sm">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Leadership</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Council Management Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated leaders working to transform Ikorodu West LCDA.
            </p>
          </div>

          <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-green-50/60 shadow-xl">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="w-full overflow-x-auto pb-4">
                <div className="min-w-[980px]">
                  <div className="flex flex-col items-center">
                    <div className="w-80">
                      <PhotoOrgCard {...executiveNode} />
                    </div>

                    <div className="h-8 w-0.5 bg-green-600" />

                    <div className="w-60">
                      <PhotoOrgCard {...viceChairmanNode} />
                    </div>

                    <div className="h-8 w-0.5 bg-green-600" />

                    <div className="relative w-full max-w-6xl">
                      <div className="absolute left-1/4 right-1/4 top-0 h-0.5 bg-green-600" />

                      <div className="flex items-start justify-between gap-6 px-4 pt-8">
                        <div className="flex w-44 flex-col items-center">
                          <div className="-mt-8 h-8 w-0.5 bg-green-600" />
                          <PhotoOrgCard {...slgNode} />
                          <div className="h-6 w-0.5 bg-green-500" />
                          <PhotoOrgCard {...supervisorsNode} />
                        </div>

                        <div className="mx-4 flex flex-1 flex-col items-center">
                          <div className="-mt-8 h-8 w-0.5 bg-green-600" />
                          <div className="w-64">
                            <PhotoOrgCard {...councilManagerNode} />
                          </div>

                          <div className="h-8 w-0.5 bg-green-600" />

                          <div className="relative w-full">
                            <div className="absolute left-8 right-8 top-0 h-0.5 bg-green-500" />
                            <div className="grid grid-cols-3 gap-3 pt-6">
                              {departmentNodes.map((department) => (
                                <div key={department.title} className="flex flex-col items-center">
                                  <div className="-mt-4 h-4 w-0.5 bg-green-500" />
                                  <PhotoOrgCard {...department} />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-8 w-full">
                            <div className="mb-4 flex items-center justify-center gap-2">
                              <div className="h-0.5 flex-1 bg-green-400" />
                              <span className="px-3 text-xs font-semibold uppercase tracking-wide text-green-700">Units</span>
                              <div className="h-0.5 flex-1 bg-green-400" />
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {unitNodes.map((unit) => (
                                <PhotoOrgCard key={unit.title} {...unit} />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex w-48 flex-col items-center">
                          <div className="-mt-8 h-8 w-0.5 bg-green-600" />
                          <PhotoOrgCard {...legislativeNode} />
                          <div className="h-6 w-0.5 bg-green-500" />
                          <PhotoOrgCard {...clerkNode} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Structure</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Administrative Structure
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Chairman */}
            <div className="flex justify-center mb-8">
              <div className="bg-primary text-white px-8 py-4 rounded-xl text-center shadow-lg">
                <div className="font-semibold">Executive Chairman</div>
                <div className="text-sm text-white/80">Chief Executive Officer</div>
              </div>
            </div>

            {/* Vice Chairman & Secretary */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="bg-primary/90 text-white px-6 py-3 rounded-xl text-center shadow-md">
                <div className="font-semibold text-sm">Vice Chairman</div>
              </div>
              <div className="bg-primary/90 text-white px-6 py-3 rounded-xl text-center shadow-md">
                <div className="font-semibold text-sm">Council Secretary</div>
              </div>
            </div>

            {/* Departments */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Works & Infrastructure', 'Health Services', 'Environment', 'Education', 'Agriculture', 'Budget & Planning', 'Administration', 'Community Dev.'].map((dept) => (
                <div key={dept} className="bg-muted px-4 py-3 rounded-lg text-center border">
                  <div className="text-sm font-medium">{dept}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Get in Touch
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Have questions about our services or want to learn more about Ikorodu West LCDA? 
            We'd love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
              <Link to="/contact">
                Contact Us
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
              <Link to="/departments">
                View Departments
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
