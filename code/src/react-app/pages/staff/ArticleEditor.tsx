import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, Save, Image, Tag, FileText,
  CheckCircle, Clock, Globe, Trash2
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Textarea } from '@/react-app/components/ui/textarea';
import { Label } from '@/react-app/components/ui/label';
import { Switch } from '@/react-app/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/react-app/components/ui/select';

const categories = [
  'General News',
  'Government Updates',
  'Community Events',
  'Development Projects',
  'Health & Welfare',
  'Education',
  'Environment',
  'Sports & Culture',
];

export default function ArticleEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id && id !== 'new');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: '',
    tags: '',
    status: 'draft',
    is_featured: false,
  });

  const fetchArticle = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cms/articles/${id}`);
      if (response.ok) {
        const data = await response.json();
        setArticle({
          ...data,
          is_featured: data.is_featured === 1,
        });
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEditing) {
      void fetchArticle();
    }
  }, [fetchArticle, isEditing]);

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setArticle(prev => ({
      ...prev,
      title,
      slug: !isEditing || !prev.slug ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSave = async (status?: string) => {
    setSaving(true);
    try {
      const payload = {
        ...article,
        status: status || article.status,
        is_featured: article.is_featured,
      };

      const url = isEditing ? `/api/cms/articles/${id}` : '/api/cms/articles';
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
        alert(error.error || 'Failed to save article');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading article...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/staff/cms" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {isEditing ? 'Edit Article' : 'New Article'}
                </h1>
                <p className="text-sm text-gray-500">
                  {article.status === 'published' ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Globe className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-600">
                      <Clock className="w-3 h-3" /> Draft
                    </span>
                  )}
                </p>
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
                {article.status === 'published' ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Label className="text-sm font-medium text-gray-700">Article Title</Label>
              <Input
                value={article.title}
                onChange={handleTitleChange}
                placeholder="Enter article title..."
                className="mt-2 text-lg font-medium"
              />
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <span>Slug:</span>
                <Input
                  value={article.slug}
                  onChange={(e) => setArticle(prev => ({ ...prev, slug: e.target.value }))}
                  className="h-8 text-sm"
                  placeholder="article-url-slug"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Label className="text-sm font-medium text-gray-700">Excerpt / Summary</Label>
              <Textarea
                value={article.excerpt}
                onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief summary of the article (appears in article listings)..."
                className="mt-2"
                rows={3}
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Label className="text-sm font-medium text-gray-700">Article Content</Label>
              <Textarea
                value={article.content}
                onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your article content here... (supports basic formatting)"
                className="mt-2 min-h-[400px] font-mono text-sm"
                rows={20}
              />
              <p className="mt-2 text-xs text-gray-500">
                Tip: You can use paragraphs, headings, and basic HTML for formatting.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Image className="w-4 h-4" />
                Featured Image
              </Label>
              {article.featured_image ? (
                <div className="mt-3 relative">
                  <img 
                    src={article.featured_image} 
                    alt="Featured" 
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setArticle(prev => ({ ...prev, featured_image: '' }))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="mt-3 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No image selected</p>
                </div>
              )}
              <Input
                value={article.featured_image}
                onChange={(e) => setArticle(prev => ({ ...prev, featured_image: e.target.value }))}
                placeholder="Enter image URL..."
                className="mt-3"
              />
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Category
              </Label>
              <Select
                value={article.category}
                onValueChange={(value) => setArticle(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </Label>
              <Input
                value={article.tags}
                onChange={(e) => setArticle(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="news, community, development"
                className="mt-2"
              />
              <p className="mt-2 text-xs text-gray-500">Separate tags with commas</p>
            </div>

            {/* Options */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Label className="text-sm font-medium text-gray-700">Options</Label>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Featured Article</p>
                    <p className="text-xs text-gray-500">Show on homepage spotlight</p>
                  </div>
                  <Switch
                    checked={article.is_featured}
                    onCheckedChange={(checked) => setArticle(prev => ({ ...prev, is_featured: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Status Info */}
            {isEditing && (
              <div className="bg-gray-100 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Status</span>
                    <span className={`font-medium ${article.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {article.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
