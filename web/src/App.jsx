// src/App.jsx
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase.from('articles').select('*');
      if (error) {
        setError(error.message);
        console.error('Error fetching articles:', error);
      } else {
        setArticles(data);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div>
      <h1>News Platform</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.body}</p>
            <small>Category: {article.category}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
