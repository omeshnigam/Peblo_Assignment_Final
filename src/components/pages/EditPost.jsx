import {useEffect, useState} from 'react'
import PostForm from '../post-form/PostForm'
import Container from '../container/Container';
import appwriteService from "../../appwrite/config";
import { useNavigate,  useParams } from 'react-router-dom';

function EditPost() {
    const [post, setPosts] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPosts(post)
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])
  return post ? (
    <div className='py-10'>
        <Container>
            <div className="animate-fade-up mb-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">Edit</p>
                <h1 className="mt-1 text-3xl font-black text-slate-950 dark:text-slate-100">Update your post</h1>
            </div>
            <PostForm post={post} />
        </Container>
    </div>
  ) : null
}

export default EditPost
