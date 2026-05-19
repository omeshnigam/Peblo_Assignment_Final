import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import parse from 'html-react-parser'
import appwriteService from '../../appwrite/config'
import Container from '../container/Container'
import { parseTags } from '../../utils/posts'

function PublicPost() {
  const [post, setPost] = useState(null)
  const [notAvailable, setNotAvailable] = useState(false)
  const { slug } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!slug) {
      navigate('/')
      return
    }

    appwriteService.getPost(slug).then((post) => {
      if (post?.isPublic && post.status === 'active') {
        setPost(post)
      } else {
        setNotAvailable(true)
      }
    })
  }, [slug, navigate])

  if (notAvailable) {
    return (
      <div className="py-16">
        <Container>
          <div className="animate-fade-up mx-auto max-w-2xl rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
            <h1 className="text-3xl font-black text-slate-950 dark:text-slate-100">This note is private</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              The owner has not enabled public sharing, or the note is no longer available.
            </p>
            <Link to="/" className="mt-7 inline-flex rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700">
              Go home
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-400" />
      </div>
    )
  }

  const tags = parseTags(post.tags)

  return (
    <div className="py-10">
      <Container>
        <article className="animate-fade-up mx-auto max-w-4xl rounded-2xl border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-slate-950/40 sm:p-8">
          {post.featuredImage && (
            <div className="mb-6 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
              <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="max-h-[480px] w-full object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">Shared note</p>
            <h1 className="text-4xl font-black text-slate-950 dark:text-slate-100">{post.title}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="browser-css text-slate-900 dark:text-slate-200">
            {parse(post.content)}
          </div>
        </article>
      </Container>
    </div>
  )
}

export default PublicPost
