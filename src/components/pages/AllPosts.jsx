import React, {useState, useEffect} from 'react'
import appwriteService from "../../appwrite/config"
import NoteDiscovery from '../NoteDiscovery'
import Container from '../container/Container'
import { Link } from 'react-router-dom'

function AllPosts() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])

  return (
    <div className='w-full py-10'>
        <Container>
        <div className="animate-fade-up mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">Library</p>
                <h1 className="mt-1 text-3xl font-black text-slate-950 dark:text-slate-100">All posts</h1>
            </div>
            <Link to="/add-post" className="rounded-full bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700">
                New post
            </Link>
        </div>
        <NoteDiscovery
            posts={posts}
            emptyTitle="Nothing here yet"
            emptyDescription="Create a post to fill your library, or reset your filters."
        />
        </Container>
    </div>
  )
}

export default AllPosts
