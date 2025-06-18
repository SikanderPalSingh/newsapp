import React, { useEffect, useState } from "react";

const API_KEY = "YOUR_NEWSAPI_KEY"; // Replace with your NewsAPI key
const PAGE_SIZE = 10;

export default function App() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchNews(pageNum) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&pageSize=${PAGE_SIZE}&page=${pageNum}&apiKey=${API_KEY}`
      );
      const data = await res.json();
      if (data.status !== "ok") {
        throw new Error(data.message || "Failed to fetch news");
      }
      if (pageNum === 1) {
        setArticles(data.articles);
      } else {
        setArticles((prev) => [...prev, ...data.articles]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews(page);
  }, [page]);

  function loadMore() {
    setPage((prev) => prev + 1);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Inshorts Style Live News</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div style={styles.cardsContainer}>
        {articles.map((article, index) => (
          <div key={index} style={styles.card}>
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                style={styles.image}
              />
            )}
            <h3 style={styles.headline}>{article.title}</h3>
            <p style={styles.description}>
              {article.description || "No description available."}
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.readMore}
            >
              Read More
            </a>
          </div>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <button onClick={loadMore} style={styles.loadMoreBtn}>
          Load More
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: "auto",
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: "center",
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 20,
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 15,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: 5,
    marginBottom: 10,
  },
  headline: {
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  readMore: {
    display: "inline-block",
    marginTop: 10,
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  loadMoreBtn: {
    marginTop: 20,
    padding: "10px 20px",
    fontSize: 16,
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 5,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
};
