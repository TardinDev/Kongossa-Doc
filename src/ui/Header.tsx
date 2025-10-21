import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { DarkModeToggle } from '../components/DarkModeToggle'
import { FaHeart } from 'react-icons/fa'
import { FiUpload } from 'react-icons/fi'
import { useState } from 'react'
import { UploadModal } from '../components/UploadModal'

export function Header() {
  const [showUploadModal, setShowUploadModal] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/40 border-b border-white/10 text-[var(--text-silver)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            className="w-8 h-8 rounded-md bg-[var(--color-primary)]"
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          />
          <span className="font-heading text-lg font-bold text-white">Kongossa Doc</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md transition-colors ${
                  isActive ? 'bg-[var(--accent-orange)] text-black font-semibold' : 'hover:bg-white/10'
                }`
              }
            >
              Accueil
            </NavLink>
            <SignedOut>
              <NavLink
                to="/auth"
                className={() =>
                  'px-3 py-1.5 rounded-md transition-colors bg-[var(--accent-orange)] text-black font-semibold hover:bg-orange-500/90'
                }
              >
                Connexion
              </NavLink>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--accent-orange)] text-black font-semibold hover:bg-orange-500/90 transition-colors"
              >
                <FiUpload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </button>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md transition-colors ${
                    isActive ? 'bg-[var(--accent-orange)] text-black font-semibold' : 'hover:bg-white/10'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                    isActive ? 'bg-[var(--accent-orange)] text-black font-semibold' : 'hover:bg-white/10'
                  }`
                }
              >
                <FaHeart className="w-4 h-4" />
                <span className="hidden sm:inline">Favoris</span>
              </NavLink>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonOuterIdentifier: 'font-sans' } }} />
            </SignedIn>
          </nav>
          <DarkModeToggle />
        </div>
      </div>
    </header>
      
      <UploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)}
      />
    </>
  )
}

