import { Link } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useSiteData } from '../data/siteData'
import './Blog.css'

function Blog() {
  const { posts, siteSettings } = useSiteData()
  const [ref, isVisible] = useScrollAnimation(0.1)

  // Get blog settings with fallbacks
  const blogTitle = siteSettings.blog?.title || 'Blog'
  const blogIntro = siteSettings.blog?.intro || 'Thoughts, tutorials, and random musings.'

  return (
    <section className="blog-page">
      <div ref={ref} className={`section-container ${isVisible ? 'animate-in' : ''}`}>
        <header className="page-header">
          <h1 className="page-title">{blogTitle}</h1>
          <p className="page-intro">{blogIntro}</p>
          <div className="post-count" aria-hidden="true">{posts.length} entries</div>
        </header>

        <div className="posts-list">
          {posts.length === 0 ? (
            <p className="no-posts">[ no posts yet... check back soon ]</p>
          ) : (
            posts.map((post, index) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="post-card"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="post-card-header">
                  <span className="post-index" aria-hidden="true">[{String(index + 1).padStart(2, '0')}]</span>
                  <time className="post-date">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                </div>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt">{post.excerpt}</p>
                <span className="post-read-more" aria-hidden="true">read more →</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default Blog
