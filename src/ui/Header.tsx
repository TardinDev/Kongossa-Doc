import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { DarkModeToggle } from '../components/DarkModeToggle'
import { FaHeart } from 'react-icons/fa'
import { FiUpload, FiMessageSquare } from 'react-icons/fi'
import { useState } from 'react'
import { UploadModal } from '../components/UploadModal'
import { NotificationCenter } from '../components/NotificationCenter'

export function Header() {
  const [showUploadModal, setShowUploadModal] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/40 border-b border-white/10 text-[var(--text-silver)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          {/* Enhanced Logo with gradient and animation */}
          <motion.div
            className="relative w-10 h-10"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--accent-orange)] to-[var(--color-primary)] opacity-75 blur-md"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Main logo shape */}
            <motion.div
              className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-orange)] via-orange-500 to-[var(--color-primary)] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-[var(--accent-orange)]/50 transition-shadow"
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              {/* Icon inside logo */}
              <FiMessageSquare className="w-5 h-5 text-white" />

              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
          </motion.div>

          {/* Logo Text with gradient */}
          <div className="flex flex-col">
            <motion.span
              className="font-heading text-xl font-bold bg-gradient-to-r from-white via-[var(--accent-orange)] to-white bg-clip-text text-transparent group-hover:from-[var(--accent-orange)] group-hover:via-white group-hover:to-[var(--accent-orange)] transition-all duration-500"
              style={{ backgroundSize: '200% auto' }}
            >
              KongossaDoc
            </motion.span>
            <span className="text-xs text-[var(--text-silver)] -mt-1 hidden sm:block">
              Le temple des ragots
            </span>
          </div>
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
              <NotificationCenter />
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

