import { useEffect, useState } from 'react';
import type { Post, CreatePostDto } from './types';


const API_URL = 'http://localhost:3000/posts';

export function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Ошибка при загрузке данных с сервера');
      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Не удалось загрузить объявления');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPostData: CreatePostDto = {
      title,
      content,
      author: author.trim() || undefined,
    };

    try {
      setSubmitting(true);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPostData),
      });

      if (!res.ok) throw new Error('Ошибка при сохранении объявления');

      const createdPost = await res.json();
      setPosts((prev) => [createdPost, ...prev]);
      setTitle('');
      setContent('');
      setAuthor('');
    } catch (err: any) {
      alert(err.message || 'Не удалось отправить объявление');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ maxWidth: '640px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
      <h1>Доска объявлений</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2.5rem' }}>
        <input
          type="text"
          placeholder="Заголовок объявления"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '8px', fontSize: '1rem' }}
        />
        <input
          type="text"
          placeholder="Ваше имя (автор)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ padding: '8px', fontSize: '1rem' }}
        />
        <textarea
          placeholder="Текст объявления"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
          style={{ padding: '8px', fontSize: '1rem' }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{ padding: '10px', fontSize: '1rem', cursor: submitting ? 'not-allowed' : 'pointer' }}
        >
          {submitting ? 'Отправка...' : 'Опубликовать'}
        </button>
      </form>

      <h2>Список объявлений</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Загрузка объявлений...</p>
      ) : posts.length === 0 ? (
        <p>Объявлений пока нет.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '14px', background: '#fafafa' }}
            >
              <h3 style={{ margin: '0 0 8px 0' }}>{post.title}</h3>
              <p style={{ margin: '0 0 10px 0', whiteSpace: 'pre-wrap' }}>{post.content}</p>
              <small style={{ color: '#666' }}>
                {post.author ? `Автор: ${post.author}` : 'Анонимно'}
                {post.createdAt ? ` • ${new Date(post.createdAt).toLocaleDateString()}` : ''}
              </small>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;