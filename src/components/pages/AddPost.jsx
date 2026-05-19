import React from 'react'
import PostForm from '../post-form/PostForm'
import Container from '../container/Container'

function AddPost() {
  return (
    <div className='py-10'>
    <Container>
        <div className="animate-fade-up mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">Create</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950 dark:text-slate-100">Write a new post</h1>
        </div>
        <PostForm />
    </Container>
</div>
  )
}

export default AddPost
