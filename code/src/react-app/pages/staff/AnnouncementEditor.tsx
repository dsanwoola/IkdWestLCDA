import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, Save, CheckCircle, Clock, Megaphone, AlertTriangle, Bell
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Textarea } from '@/react-app/components/ui/textarea';
import { Label } from '@/react-app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/react-app/components/ui/select';

const types = [
  { value: 'notice', label: 'General Notice', icon: Bell },
  { value: 'important', label: 'Important', icon: AlertTriangle },
  { value: 'reminder', label: 'Reminder', icon: Clock },
  { value: 'opportunity', label: 'Opportunity', icon: Megaphone },
];

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export default function AnnouncementEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id && id !== 'new');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [announcement, setAnnouncement] = useState({
    title: '',
    content: '',
    type: 'notice',
    priority: 'normal',
    status: 'draft',
    starts_at: '',
    expires_at: '',
  });

  const fetchAnnouncement = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cms/announcements/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAnnouncement({
          ...data,
          starts_at: data.starts_at ? data.starts_at.slice(0, 16) : '',
          expires_at: data.expires_at ? data.expires_at.slice(0, 16) : '',
        });
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditing) {
      void fetchAnnouncement();
    }
  }, [fetchAnnouncement, isEditing]);

  const handleSave = async (status?: string) => {
    setSaving(true);
    try {
      const payload = {
        ...announcement,
        status: status || announcement.status,
        starts_at: announcement.starts_at || null,
        expires_at: announcement.expires_at || null,
      };

      const url = isEditing ? `/api/cms/announcements/${id}` : '/api/cms/announcements';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate('/staff/cms');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save announcement');
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading announcement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/staff/cms" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {isEditing ? 'Edit Announcement' : 'New Announcement'}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                className="bg-green-700 hover:bg-green-800" 
                onClick={() => handleSave('published')}
                disabled={saving}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Label className="text-sm font-medium text-gray-700">Title</Label>
              <Input
                value={announcement.title}
                onChange={(e) => setAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Announcement title..."
                className="mt-2 text-lg font-medium"
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Label className="text-sm font-medium text-gray-700">Content</Label>
              <Textarea
                value={announcement.content}
                onChange={(e) => setAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Announcement details..."
                className="mt-2 min-h-[200px]"
                rows={10}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Label className="text-sm font-medium text-gray-700">Type</Label>
              <Select
                value={announcement.type}
                onValueChange={(value) => setAnnouncement(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Label className="text-sm font-medium text-gray-700">Priority</Label>
              <Select
                value={announcement.priority}
                onValueChange={(value) => setAnnouncement(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Label className="text-sm font-medium text-gray-700">Schedule</Label>
              <div className="mt-3 space-y-4">
                <div>
                  <Label className="text-xs text-gray-500">Starts At</Label>
                  <Input
                    type="datetime-local"
                    value={announcement.starts_at}
                    onChange={(e) => setAnnouncement(prev => ({ ...prev, starts_at: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Expires At</Label>
                  <Input
                    type="datetime-local"
                    value={announcement.expires_at}
                    onChange={(e) => setAnnouncement(prev => ({ ...prev, expires_at: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Leave blank to show immediately with no expiration.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
