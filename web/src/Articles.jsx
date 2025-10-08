import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Articles({ session }) {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error.message);
    } else {
      setArticles(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!session || !session.user) {
      setErrorMsg("You must be logged in to submit.");
      setLoading(false);
      return;
    }

    let image_url = null;

    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        setErrorMsg(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("article-images")
        .getPublicUrl(fileName);

      image_url = data.publicUrl;
    }
    const { error } = await supabase.from("articles").insert([
      {
        title,
        body,
        category,
        submitted_by: session.user.email,
        image_url,
      },
    ]);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setTitle("");
      setBody("");
      setCategory("");
      setImageFile(null);
      fetchArticles();
    }
    setLoading(false);
  };
  const handleDelete = async (id) => {
    if (!session || !session.user) return;

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      console.error("Delete error:", error.message);
      setErrorMsg("Failed to delete article.");
    } else {
      fetchArticles();
    }
  };
  return (
    <div>
      <h2>Articles</h2>
      {session && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Article"}
          </button>
        </form>
      )}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <ul className="article-list">
        {articles.map((article) => (
          <li key={article.id} className="article-card">
            <span className="category-badge">{article.category}</span>
            <h3>{article.title}</h3>

            {article.image_url && (
              <div className="article-image">
                <img src={article.image_url} alt={article.title} />
              </div>
            )}
            <p>{article.body}</p>
            <p className="article-meta">
              Submitted by: {article.submitted_by} •{" "}
              {new Date(article.created_at).toLocaleString()}
            </p>
            {session?.user?.email === article.submitted_by && (
              <button
                className="delete-btn"
                onClick={() => handleDelete(article.id)}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

