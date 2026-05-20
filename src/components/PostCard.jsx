import appwriteService from '../appwrite/config'
import {Link} from 'react-router-dom'
import { parseTags } from '../utils/posts'

function PostCard({$id, title, featuredImage, tags, isPublic}) {
    const postTags = parseTags(tags).slice(0, 3)

  return (
    <Link to={`/post/${$id}`}>
        <div className='group h-full w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40 dark:hover:shadow-blue-950/30'>
            <div className='mb-4 aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800'>
                {featuredImage ? (
                    <img src={appwriteService.getFilePreview(featuredImage)} alt={title} className='h-full w-full object-cover transition duration-500 group-hover:scale-105' />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 via-white to-cyan-100 p-6 text-center text-sm font-bold text-blue-700 transition duration-500 group-hover:scale-105 dark:from-blue-950 dark:via-slate-900 dark:to-cyan-950 dark:text-blue-300">
                        No featured image
                    </div>
                )}
            </div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
                {isPublic && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        Public
                    </span>
                )}
                {postTags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        #{tag}
                    </span>
                ))}
            </div>
            <h2 className='line-clamp-2 text-xl font-bold text-slate-950 transition-colors duration-200 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-300'>{title}</h2>
        </div>
    </Link>
  )
}

export default PostCard
