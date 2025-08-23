import { SignIn, SignUp, useClerk } from '@clerk/clerk-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const { loaded } = useClerk()

  return (
    <div className="grid place-items-center py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setMode('signin')}
            className={`px-3 py-1.5 rounded-md border ${mode === 'signin' ? 'bg-[var(--accent-orange)] text-black font-semibold' : 'bg-white/5 border-white/10 hover:bg-white/10 text-[var(--text-silver)]'}`}
          >
            Se connecter
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`px-3 py-1.5 rounded-md border ${mode === 'signup' ? 'bg-[var(--accent-orange)] text-black font-semibold' : 'bg-white/5 border-white/10 hover:bg-white/10 text-[var(--text-silver)]'}`}
          >
            Créer un compte
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg bg-white/5 border border-white/10 p-4 backdrop-blur"
          >
            {loaded && mode === 'signin' ? <SignIn routing="hash" /> : null}
            {loaded && mode === 'signup' ? <SignUp routing="hash" /> : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

