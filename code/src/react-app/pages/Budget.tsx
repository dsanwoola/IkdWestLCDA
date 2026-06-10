import { useState } from 'react';
import { Link } from 'react-router';
import { 
  ArrowRight, 
  Download,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  FileText,
  Eye,
  Search,
  Building2,
  Briefcase,
  GraduationCap,
  Heart,
  Trash2,
  Users,
  Landmark,
  CircleDollarSign,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { Badge } from '@/react-app/components/ui/badge';
import { Input } from '@/react-app/components/ui/input';
import Layout from '@/react-app/components/layout/Layout';

const fiscalYears = ['2024', '2023', '2022', '2021'];

const budgetOverview = {
  totalBudget: 4500000000,
  totalRevenue: 4250000000,
  totalExpenditure: 3890000000,
  capitalExpenditure: 2340000000,
  recurrentExpenditure: 1550000000,
  budgetPerformance: 86.4
};

const revenueBreakdown = [
  { source: 'Federal Allocation', amount: 1850000000, percentage: 43.5, icon: Landmark, color: 'bg-blue-500' },
  { source: 'State Grants', amount: 980000000, percentage: 23.1, icon: Building2, color: 'bg-green-500' },
  { source: 'Internal Revenue', amount: 720000000, percentage: 16.9, icon: CircleDollarSign, color: 'bg-amber-500' },
  { source: 'Taxes & Levies', amount: 450000000, percentage: 10.6, icon: FileText, color: 'bg-purple-500' },
  { source: 'Other Sources', amount: 250000000, percentage: 5.9, icon: Briefcase, color: 'bg-pink-500' }
];

const expenditureByDepartment = [
  { department: 'Works & Infrastructure', budget: 1200000000, spent: 1080000000, icon: Building2, color: 'bg-blue-500' },
  { department: 'Health Services', budget: 650000000, spent: 598000000, icon: Heart, color: 'bg-red-500' },
  { department: 'Education', budget: 580000000, spent: 522000000, icon: GraduationCap, color: 'bg-indigo-500' },
  { department: 'Administration', budget: 450000000, spent: 427500000, icon: Briefcase, color: 'bg-gray-500' },
  { department: 'Environment & Sanitation', budget: 380000000, spent: 361000000, icon: Trash2, color: 'bg-teal-500' },
  { department: 'Social Welfare', budget: 320000000, spent: 288000000, icon: Users, color: 'bg-purple-500' }
];

const projectExpenditures = [
  { 
    name: 'Ikorodu-Igbogbo Road Rehabilitation',
    budget: 450000000,
    spent: 382500000,
    status: 'Ongoing',
    contractor: 'Julius Berger Nigeria',
    startDate: 'Jan 2024'
  },
  { 
    name: 'Primary Health Center - Agric',
    budget: 180000000,
    spent: 180000000,
    status: 'Completed',
    contractor: 'MediBuild Construction',
    startDate: 'Mar 2023'
  },
  { 
    name: 'Majidun Market Upgrade',
    budget: 250000000,
    spent: 175000000,
    status: 'Ongoing',
    contractor: 'Lagos Markets Ltd',
    startDate: 'Jun 2024'
  },
  { 
    name: 'School Renovation Project (15 Schools)',
    budget: 320000000,
    spent: 256000000,
    status: 'Ongoing',
    contractor: 'EduBuild Nigeria',
    startDate: 'Feb 2024'
  },
  { 
    name: 'Street Light Installation',
    budget: 120000000,
    spent: 120000000,
    status: 'Completed',
    contractor: 'PowerLight Solutions',
    startDate: 'Nov 2023'
  }
];

const budgetDocuments = [
  { name: '2024 Approved Budget', type: 'PDF', size: '2.4 MB', date: 'Jan 2024' },
  { name: 'Q3 2024 Budget Performance Report', type: 'PDF', size: '1.8 MB', date: 'Oct 2024' },
  { name: 'Q2 2024 Budget Performance Report', type: 'PDF', size: '1.6 MB', date: 'Jul 2024' },
  { name: 'Q1 2024 Budget Performance Report', type: 'PDF', size: '1.5 MB', date: 'Apr 2024' },
  { name: '2023 Annual Financial Report', type: 'PDF', size: '4.2 MB', date: 'Mar 2024' },
  { name: 'Citizens Budget 2024 (Simplified)', type: 'PDF', size: '850 KB', date: 'Feb 2024' }
];

const formatCurrency = (amount: number) => {
  if (amount >= 1000000000) {
    return `₦${(amount / 1000000000).toFixed(2)}B`;
  }
  if (amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(1)}M`;
  }
  return `₦${amount.toLocaleString()}`;
};

export default function BudgetPage() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projectExpenditures.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contractor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Budget Transparency</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <Badge className="bg-secondary text-secondary-foreground mb-4">
                Open Government Initiative
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Budget Transparency Portal
              </h1>
              <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
                Access detailed information about how your local government allocates and 
                spends public funds. Transparency is key to good governance.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                {fiscalYears.map(year => (
                  <option key={year} value={year} className="text-gray-900">
                    FY {year}
                  </option>
                ))}
              </select>
              <Button className="bg-white text-primary hover:bg-white/90 gap-2">
                <Download className="w-4 h-4" />
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Budget Overview Cards */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <PieChart className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge variant="secondary">FY 2024</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{formatCurrency(budgetOverview.totalBudget)}</div>
                <div className="text-muted-foreground text-sm">Total Budget</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    +8.2%
                  </span>
                </div>
                <div className="text-2xl font-bold mb-1">{formatCurrency(budgetOverview.totalRevenue)}</div>
                <div className="text-muted-foreground text-sm">Total Revenue</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-amber-600" />
                  </div>
                  <span className="text-amber-600 text-sm font-semibold">{budgetOverview.budgetPerformance}%</span>
                </div>
                <div className="text-2xl font-bold mb-1">{formatCurrency(budgetOverview.totalExpenditure)}</div>
                <div className="text-muted-foreground text-sm">Total Expenditure</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{budgetOverview.budgetPerformance}%</div>
                <div className="text-muted-foreground text-sm">Budget Performance</div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full"
                    style={{ width: `${budgetOverview.budgetPerformance}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Revenue & Expenditure Breakdown */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Revenue Sources */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Revenue Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueBreakdown.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}>
                            <item.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-sm">{item.source}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(item.amount)}</div>
                          <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                  <span className="font-semibold">Total Revenue</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(budgetOverview.totalRevenue)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Expenditure by Department */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-amber-600" />
                  Expenditure by Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenditureByDepartment.map((dept, idx) => {
                    const percentage = (dept.spent / dept.budget) * 100;
                    return (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${dept.color} rounded-lg flex items-center justify-center`}>
                              <dept.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-sm">{dept.department}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(dept.spent)}</div>
                            <div className="text-xs text-muted-foreground">of {formatCurrency(dept.budget)}</div>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${dept.color} rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                  <span className="font-semibold">Total Expenditure</span>
                  <span className="text-xl font-bold text-amber-600">{formatCurrency(budgetOverview.totalExpenditure)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Capital vs Recurrent */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Expenditure Classification</span>
            <h2 className="text-3xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Capital vs Recurrent Expenditure
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-green-500" />
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{formatCurrency(budgetOverview.capitalExpenditure)}</h3>
                    <p className="text-muted-foreground">Capital Expenditure</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Investments in infrastructure, equipment, and long-term assets that benefit 
                  the community for years to come.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Roads & Bridges</span>
                    <span className="font-semibold">₦980M</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Buildings & Facilities</span>
                    <span className="font-semibold">₦620M</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Equipment & Vehicles</span>
                    <span className="font-semibold">₦420M</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Water & Sanitation</span>
                    <span className="font-semibold">₦320M</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{formatCurrency(budgetOverview.recurrentExpenditure)}</h3>
                    <p className="text-muted-foreground">Recurrent Expenditure</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Day-to-day operational costs including salaries, utilities, and 
                  administrative expenses.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Personnel Costs</span>
                    <span className="font-semibold">₦850M</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Overhead Costs</span>
                    <span className="font-semibold">₦380M</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Maintenance</span>
                    <span className="font-semibold">₦180M</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Other Services</span>
                    <span className="font-semibold">₦140M</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Project Expenditures */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Project Tracking</span>
              <h2 className="text-3xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Project Expenditures
              </h2>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold">Project Name</th>
                  <th className="text-left p-4 font-semibold">Contractor</th>
                  <th className="text-left p-4 font-semibold">Budget</th>
                  <th className="text-left p-4 font-semibold">Spent</th>
                  <th className="text-left p-4 font-semibold">Progress</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, idx) => {
                  const progress = (project.spent / project.budget) * 100;
                  return (
                    <tr key={idx} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-xs text-muted-foreground">Started: {project.startDate}</div>
                      </td>
                      <td className="p-4 text-sm">{project.contractor}</td>
                      <td className="p-4 font-semibold">{formatCurrency(project.budget)}</td>
                      <td className="p-4 font-semibold text-primary">{formatCurrency(project.spent)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                progress === 100 ? 'bg-green-500' : 'bg-primary'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={
                          project.status === 'Completed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }>
                          {project.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/projects" className="gap-2">
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Budget Documents */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Downloads</span>
            <h2 className="text-3xl font-bold mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Budget Documents
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetDocuments.map((doc, idx) => (
              <Card key={idx} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {doc.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Citizen Engagement */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Your Voice Matters</span>
              <h2 className="text-3xl font-bold mt-2 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Citizen Budget Participation
              </h2>
              <p className="text-muted-foreground mb-6">
                We believe in participatory budgeting. Your input helps us prioritize 
                projects and allocate resources effectively. Join town hall meetings 
                and submit your feedback on budget priorities.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                  <Eye className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Public Budget Hearings</h4>
                    <p className="text-sm text-muted-foreground">Attend quarterly budget review meetings open to all residents.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                  <FileText className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Submit Budget Proposals</h4>
                    <p className="text-sm text-muted-foreground">Suggest projects and initiatives for consideration in the next fiscal year.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                  <Info className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Report Concerns</h4>
                    <p className="text-sm text-muted-foreground">Flag issues or concerns about spending to our oversight committee.</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6">Submit Your Feedback</h3>
                <form className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                    <Input placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Budget Priority Suggestion</option>
                      <option>Spending Concern</option>
                      <option>Project Feedback</option>
                      <option>General Comment</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Feedback</label>
                    <textarea 
                      rows={4}
                      placeholder="Share your thoughts..."
                      className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <Button className="w-full gap-2">
                    Submit Feedback
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Questions About the Budget?
          </h2>
          <p className="text-white/80 mb-8">
            Our Finance & Budget Department is available to answer your questions and 
            provide detailed information about government spending.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
              <Link to="/contact">
                Contact Finance Department
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
              <Link to="/departments">
                View All Departments
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
