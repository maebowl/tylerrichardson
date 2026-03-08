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
        {/* Terminal window chrome */}
        <div className="terminal-window">
          <div className="terminal-titlebar" aria-hidden="true">
            <div className="terminal-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <span className="terminal-title">tyler@blog ~ zsh</span>
            <div className="terminal-titlebar-spacer"></div>
          </div>
          <div className="terminal-body">
            <div className="terminal-prompt" aria-hidden="true">
              <span className="prompt-user">tyler</span>
              <span className="prompt-at">@</span>
              <span className="prompt-host">site</span>
              <span className="prompt-colon">:</span>
              <span className="prompt-path">~/blog</span>
              <span className="prompt-dollar">$</span>
              <span className="prompt-cmd">ls -la --sort=date</span>
              <span className="blink-cursor">_</span>
            </div>
            <div className="terminal-output" aria-hidden="true">
              <span className="output-line">total {posts.length} entries</span>
              <span className="output-line">drwxr-xr-x  {posts.length} tyler  staff  {posts.length * 4096} {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} .</span>
            </div>
            <h1 className="page-title">{blogTitle}</h1>
            <p className="page-intro">{blogIntro}</p>
            <div className="terminal-bar" aria-hidden="true">
              <span className="bar-label">RESULTS:</span>
              <span>{posts.length} entries</span>
              <span className="bar-separator">|</span>
              <span>sorted: newest first</span>
              <span className="bar-separator">|</span>
              <span className="bar-status">EXIT: 0</span>
            </div>

            <div className="posts-list">
              {posts.length === 0 ? (
                <p className="no-posts">$ cat posts.md<br/>[ no posts yet... check back soon ]</p>
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
                      <span className="post-permissions" aria-hidden="true">-rw-r--r--</span>
                      <time className="post-date">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                    </div>
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <span className="post-read-more" aria-hidden="true">cat {post.slug}.md →</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Blog
