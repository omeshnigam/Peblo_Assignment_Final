import {Container, Logo, LogoutBtn, ThemeToggle} from '../index'
import { Link, useLocation } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
  },
  {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
  },
  {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
  },
  {
      name: "Dashboard",
      slug: "/dashboard",
      active: authStatus,
  },
  {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
  },
  ]


  return (
    <header className='sticky top-0 z-50 border-b border-white/60 bg-white/85 py-3 text-slate-900 shadow-sm backdrop-blur-xl transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950/80 dark:text-slate-100 dark:shadow-slate-950/30'>
      <Container>
        <nav className='flex items-center gap-4'>
          <div className='mr-2 transition-transform duration-200 hover:scale-105'>
            <Link to='/' aria-label='OmniNotes home'>
              <Logo width='70px'   />

              </Link>
          </div>
          <ul className='ml-auto flex flex-wrap items-center justify-end gap-2'>
            {navItems.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button
                onClick={() => navigate(item.slug)}
                className={`inline-block rounded-full px-5 py-2 text-sm font-medium duration-200 hover:-translate-y-0.5 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:hover:bg-slate-800 ${location.pathname === item.slug ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 dark:bg-blue-500' : ''}`}
                >{item.name}</button>
              </li>
            ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
        </Container>
    </header>
  )
}

export default Header
