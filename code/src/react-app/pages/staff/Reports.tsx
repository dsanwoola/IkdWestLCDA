import { useState } from 'react';
import { Link } from 'react-router';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  ClipboardList,
  Building2,
  Filter
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';

const reportTypes = [
  { 
    id: 'service-requests', 
    title: 'Service Requests Report', 
    description: 'Summary of all citizen service requests, status breakdown, and resolution times',
    icon: ClipboardList,
    color: 'bg-blue-100 text-blue-600'
  },
  { 
    id: 'projects', 
    title: 'Projects Progress Report', 
    description: 'Detailed progress on all LCDA projects, budgets, and milestones',
    icon: Building2,
    color: 'bg-green-100 text-green-600'
  },
  { 
    id: 'revenue', 
    title: 'Revenue & Finance Report', 
    description: 'Income, expenditure, and budget utilization analysis',
    icon: TrendingUp,
    color: 'bg-amber-100 text-amber-600'
  },
  { 
    id: 'staff', 
    title: 'Staff Performance Report', 
    description: 'Department activity, task completion rates, and attendance',
    icon: Users,
    color: 'bg-purple-100 text-purple-600'
  },
  { 
    id: 'marriage', 
    title: 'Marriage Applications Report', 
    description: 'Marriage certificate applications, processing times, and revenue',
    icon: FileText,
    color: 'bg-pink-100 text-pink-600'
  },
  { 
    id: 'department', 
    title: 'Department Summary Report', 
    description: 'Per-department breakdown of activities and key metrics',
    icon: BarChart3,
    color: 'bg-indigo-100 text-indigo-600'
  },
];

const recentReports = [
  { name: 'Weekly Service Requests - Jan 6-12, 2025', date: '2025-01-12', type: 'service-requests' },
  { name: 'Monthly Revenue Report - December 2024', date: '2025-01-05', type: 'revenue' },
  { name: 'Q4 2024 Projects Summary', date: '2025-01-02', type: 'projects' },
  { name: 'Annual Staff Performance 2024', date: '2024-12-31', type: 'staff' },
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!selectedType) return;
    
    setGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGenerating(false);
    
    // In a real implementation, this would trigger a download
    alert('Report generated successfully! Download will start shortly.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/staff" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Reports</h1>
                <p className="text-sm text-muted-foreground">Generate and download reports</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Report Generator */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Generate New Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Report Type Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Select Report Type</label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {reportTypes.map((report) => (
                      <button
                        key={report.id}
                        onClick={() => setSelectedType(report.id)}
                        className={`
                          p-4 rounded-xl border-2 text-left transition-all
                          ${selectedType === report.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${report.color}`}>
                            <report.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{report.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium mb-3">Date Range</label>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex-1 min-w-[140px]">
                      <label className="block text-xs text-muted-foreground mb-1">Start Date</label>
                      <input 
                        type="date" 
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="flex-1 min-w-[140px]">
                      <label className="block text-xs text-muted-foreground mb-1">End Date</label>
                      <input 
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const today = new Date();
                        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        setDateRange({ 
                          start: weekAgo.toISOString().split('T')[0], 
                          end: today.toISOString().split('T')[0] 
                        });
                      }}
                    >
                      Last 7 days
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const today = new Date();
                        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                        setDateRange({ 
                          start: monthAgo.toISOString().split('T')[0], 
                          end: today.toISOString().split('T')[0] 
                        });
                      }}
                    >
                      Last 30 days
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const today = new Date();
                        const yearStart = new Date(today.getFullYear(), 0, 1);
                        setDateRange({ 
                          start: yearStart.toISOString().split('T')[0], 
                          end: today.toISOString().split('T')[0] 
                        });
                      }}
                    >
                      This Year
                    </Button>
                  </div>
                </div>

                {/* Generate Button */}
                <Button 
                  className="w-full gap-2"
                  disabled={!selectedType || generating}
                  onClick={handleGenerateReport}
                >
                  {generating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Generate & Download Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="w-5 h-5 text-primary" />
                  Recent Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReports.map((report, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{report.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{report.date}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Filter className="w-5 h-5 text-primary" />
                  Report Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Reports This Month</span>
                    <Badge variant="secondary">24</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Most Generated</span>
                    <Badge className="bg-blue-100 text-blue-700">Service Requests</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Generated</span>
                    <Badge variant="outline">2 hours ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
