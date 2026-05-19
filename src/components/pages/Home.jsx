import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import service from '../../appwrite/config'
import NoteDiscovery from '../NoteDiscovery'
import Container from '../container/Container'

export default function Home() {
    const [posts, setPosts] = useState([])
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {
        if (!authStatus) {
            setPosts([])
            return
        }

        service.getPosts().then((posts) => {
            if(posts) {
                setPosts(posts.documents)
            }
        })
    }, [authStatus])

    if(!authStatus){
        return (
            <div className="w-full py-16">
                <Container>
                    <div className="animate-fade-up mx-auto max-w-3xl rounded-2xl border border-white/70 bg-white/80 p-8 text-center shadow-xl shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-slate-950/50">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">Your notes are waiting</p>
                        <h1 className="gradient-text text-4xl font-black sm:text-5xl">
                            Login to read notes
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 dark:text-slate-400">
                            Keep ideas, drafts, and references in one smooth workspace.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Link to="/login" className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700">
                                Sign in
                            </Link>
                            <Link to="/signup" className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-blue-500 dark:hover:text-blue-300">
                                Create account
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if(posts.length === 0){
        return (
            <div className="w-full py-16">
                <Container>
                    <div className="animate-fade-up mx-auto max-w-2xl rounded-2xl border border-dashed border-blue-300 bg-white/75 p-10 text-center shadow-lg backdrop-blur dark:border-blue-500/40 dark:bg-slate-900/70">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            +
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">
                            No posts found
                        </h1>
                        <p className="mt-3 text-slate-600 dark:text-slate-400">
                            Start by creating your first note and it will appear here.
                        </p>
                        <Link to="/add-post" className="mt-7 inline-flex rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700">
                            Add your first post
                        </Link>
                    </div>
                </Container>
            </div>
        )
    }

    return(
        <div className='w-full py-10'>
            <Container>
                <div className="animate-fade-up mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">Notebook</p>
                        <h1 className="mt-1 text-3xl font-black text-slate-950 dark:text-slate-100">Recent notes</h1>
                    </div>
                    <Link to="/add-post" className="rounded-full bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700">
                        New post
                    </Link>
                </div>
            <NoteDiscovery posts={posts} />
            </Container>
        </div>
    )
}
