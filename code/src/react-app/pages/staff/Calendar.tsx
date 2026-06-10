import { useState } from 'react';
import { Link } from 'react-router';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';
import { Input } from '@/react-app/components/ui/input';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  attendees: string[];
  type: 'department' | 'council' | 'public' | 'other';
}

const sampleMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Monthly Staff Meeting',
    date: '2025-01-15',
    time: '10:00 AM',
    duration: '2 hours',
    location: 'Council Chamber',
    attendees: ['All Department Heads', 'Chairman', 'Secretary'],
    type: 'council'
  },
  {
    id: '2',
    title: 'Works & Infrastructure Review',
    date: '2025-01-16',
    time: '2:00 PM',
    duration: '1 hour',
    location: 'Conference Room A',
    attendees: ['HOD Works', 'Project Managers'],
    type: 'department'
  },
  {
    id: '3',
    title: 'Community Town Hall',
    date: '2025-01-18',
    time: '4:00 PM',
    duration: '3 hours',
    location: 'Ikorodu West Civic Center',
    attendees: ['Chairman', 'All Staff', 'Community Leaders'],
    type: 'public'
  },
  {
    id: '4',
    title: 'Budget Planning Session',
    date: '2025-01-20',
    time: '9:00 AM',
    duration: '4 hours',
    location: 'Finance Department',
    attendees: ['HOD Finance', 'Accountants', 'Secretary'],
    type: 'department'
  },
];

const meetingTypeColors = {
  department: 'bg-blue-100 text-blue-700 border-blue-200',
  council: 'bg-purple-100 text-purple-700 border-purple-200',
  public: 'bg-green-100 text-green-700 border-green-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200',
};

const departments = [
  'Administration & General Services',
  'Health Services',
  'Education',
  'Works & Infrastructure',
  'Agriculture & Natural Resources',
  'Social Welfare & Community Development',
  'Environment & Sanitation',
  'Revenue & Finance',
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [meetings] = useState<Meeting[]>(sampleMeetings);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    duration: '1 hour',
    location: '',
    department: '',
    type: 'department' as 'department' | 'council' | 'public' | 'other',
    description: ''
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getMeetingsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return meetings.filter(m => m.date === dateStr);
  };

  const handleScheduleMeeting = () => {
    // In production, this would save to the database
    alert('Meeting scheduled successfully! Attendees will be notified.');
    setShowNewMeetingModal(false);
    setNewMeeting({
      title: '',
      date: '',
      time: '',
      duration: '1 hour',
      location: '',
      department: '',
      type: 'department' as 'department' | 'council' | 'public' | 'other',
      description: ''
    });
  };

  const upcomingMeetings = meetings
    .filter(m => new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

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
                <h1 className="text-xl font-bold text-gray-900">Calendar</h1>
                <p className="text-sm text-muted-foreground">Schedule meetings and events</p>
              </div>
            </div>
            <Button onClick={() => setShowNewMeetingModal(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Schedule Meeting
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={prevMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={nextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-20 bg-gray-50 rounded-lg" />
                  ))}
                  
                  {/* Days of the month */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayMeetings = getMeetingsForDate(day);
                    const isToday = 
                      new Date().getDate() === day && 
                      new Date().getMonth() === currentDate.getMonth() &&
                      new Date().getFullYear() === currentDate.getFullYear();
                    
                    return (
                      <div 
                        key={day} 
                        className={`
                          h-20 p-1 rounded-lg border transition-colors cursor-pointer
                          ${isToday ? 'bg-primary/5 border-primary' : 'bg-white border-gray-100 hover:border-gray-200'}
                        `}
                      >
                        <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                          {day}
                        </div>
                        <div className="space-y-0.5 overflow-hidden">
                          {dayMeetings.slice(0, 2).map(meeting => (
                            <div 
                              key={meeting.id}
                              className={`text-[10px] px-1 py-0.5 rounded truncate ${meetingTypeColors[meeting.type]}`}
                            >
                              {meeting.title}
                            </div>
                          ))}
                          {dayMeetings.length > 2 && (
                            <div className="text-[10px] text-muted-foreground">
                              +{dayMeetings.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-200" />
                    <span className="text-xs text-muted-foreground">Department</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-purple-200" />
                    <span className="text-xs text-muted-foreground">Council</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-200" />
                    <span className="text-xs text-muted-foreground">Public</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Meetings Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="w-5 h-5 text-primary" />
                  Upcoming Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMeetings.map(meeting => (
                    <div 
                      key={meeting.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-sm">{meeting.title}</h3>
                        <Badge className={meetingTypeColors[meeting.type]} variant="outline">
                          {meeting.type}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-3 h-3" />
                          {new Date(meeting.date).toLocaleDateString('en-NG', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })} at {meeting.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {meeting.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          {meeting.attendees.length} attendees
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-xs text-muted-foreground">This Month</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">3</div>
                    <div className="text-xs text-muted-foreground">This Week</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* New Meeting Modal */}
      {showNewMeetingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Schedule New Meeting</CardTitle>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowNewMeetingModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Meeting Title *</label>
                <Input 
                  placeholder="e.g., Weekly Department Review"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input 
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time *</label>
                  <input 
                    type="time"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
                  >
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>3 hours</option>
                    <option>Half day</option>
                    <option>Full day</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meeting Type</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={newMeeting.type}
                    onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value as 'department' | 'council' | 'public' | 'other' })}
                  >
                    <option value="department">Department Meeting</option>
                    <option value="council">Council Meeting</option>
                    <option value="public">Public/Town Hall</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location *</label>
                <Input 
                  placeholder="e.g., Council Chamber, Conference Room A"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Invite Department</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={newMeeting.department}
                  onChange={(e) => setNewMeeting({ ...newMeeting, department: e.target.value })}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description / Agenda</label>
                <textarea 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  rows={3}
                  placeholder="Meeting agenda and notes..."
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowNewMeetingModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  disabled={!newMeeting.title || !newMeeting.date || !newMeeting.time || !newMeeting.location}
                  onClick={handleScheduleMeeting}
                >
                  Schedule Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
