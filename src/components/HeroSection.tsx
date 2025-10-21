import { motion } from 'framer-motion'
import { FiUpload, FiDownload, FiUsers, FiMessageSquare, FiZap, FiShield } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'

export function HeroSection() {
  const { isSignedIn } = useAuth()
  const [counters, setCounters] = useState({ docs: 0, members: 0, downloads: 0, comments: 0 })

  // Animated counters
  useEffect(() => {
    const targets = { docs: 1200, members: 450, downloads: 89000, comments: 2300 }
    const duration = 2000
    const steps = 60
    const stepTime = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      setCounters({
        docs: Math.floor(targets.docs * progress),
        members: Math.floor(targets.members * progress),
        downloads: Math.floor(targets.downloads * progress),
        comments: Math.floor(targets.comments * progress)
      })
      if (currentStep >= steps) clearInterval(interval)
    }, stepTime)

    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <FiUpload className="w-6 h-6" />,
      title: "Partagez vos scoops",
      description: "Téléversez vos documents juteux et alimentez le kongossa",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <FiDownload className="w-6 h-6" />,
      title: "Découvrez les secrets",
      description: "Téléchargez les documents les plus croustillants",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Accès instantané",
      description: "Consultez les documents en un clic, où que vous soyez",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      title: "Commentez et débattez",
      description: "Partagez vos opinions sur les révélations",
      color: "from-green-500 to-teal-500"
    }
  ]

  return (
    <section className="relative overflow-hidden py-20 mb-12">
      {/* Enhanced background with gradients and animated shapes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-[var(--accent-orange)] to-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-[var(--color-primary)] to-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-bl from-blue-500 to-teal-500 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[var(--accent-orange)] rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              y: [null, Math.random() * -100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main headline with enhanced styling */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight">
            <motion.span
              className="inline-block bg-gradient-to-r from-[var(--accent-orange)] via-yellow-500 to-[var(--color-primary)] bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              style={{ backgroundSize: '200% 200%' }}
            >
              KongossaDoc
            </motion.span>
            <span className="block mt-3 text-3xl md:text-4xl lg:text-5xl">
              Le temple des{' '}
              <span className="relative inline-block">
                <span className="text-[var(--accent-orange)]">ragots</span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-orange)] to-transparent"
                  animate={{ scaleX: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-[var(--text-silver)] mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            🔥 <strong>Partagez, découvrez et débattez</strong> autour des documents les plus croustillants ! 
            <br />
            Alimentez le <span className="text-[var(--accent-orange)] font-semibold">kongossa</span> avec vos scoops exclusifs
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            {isSignedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="group relative px-8 py-4 bg-gradient-to-r from-[var(--accent-orange)] to-orange-600 text-black font-bold rounded-xl text-lg hover:shadow-lg hover:shadow-[var(--accent-orange)]/25 transition-all duration-300 transform hover:scale-105"
                >
                  <FiUpload className="inline-block w-5 h-5 mr-2" />
                  Partager un scoop
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                <button
                  onClick={() => document.getElementById('documents')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 border-2 border-[var(--accent-orange)] text-[var(--accent-orange)] font-bold rounded-xl text-lg hover:bg-[var(--accent-orange)] hover:text-black transition-all duration-300 transform hover:scale-105"
                >
                  <FiDownload className="inline-block w-5 h-5 mr-2" />
                  Découvrir les ragots
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="group relative px-8 py-4 bg-gradient-to-r from-[var(--accent-orange)] to-orange-600 text-black font-bold rounded-xl text-lg hover:shadow-lg hover:shadow-[var(--accent-orange)]/25 transition-all duration-300 transform hover:scale-105"
                >
                  <FiUsers className="inline-block w-5 h-5 mr-2" />
                  Rejoindre le kongossa
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                <button
                  onClick={() => document.getElementById('documents')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 border-2 border-[var(--accent-orange)] text-[var(--accent-orange)] font-bold rounded-xl text-lg hover:bg-[var(--accent-orange)] hover:text-black transition-all duration-300 transform hover:scale-105"
                >
                  <FiDownload className="inline-block w-5 h-5 mr-2" />
                  Explorer sans compte
                </button>
              </>
            )}
          </motion.div>

          {/* Animated Stats with glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            <motion.div
              className="relative text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[var(--accent-orange)]/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-orange)]/10 to-transparent rounded-2xl"></div>
              <div className="relative">
                <div className="text-4xl font-bold text-[var(--accent-orange)] mb-1">
                  {counters.docs.toLocaleString()}+
                </div>
                <div className="text-sm text-[var(--text-silver)]">Documents partagés</div>
              </div>
            </motion.div>
            <motion.div
              className="relative text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[var(--color-primary)]/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent rounded-2xl"></div>
              <div className="relative">
                <div className="text-4xl font-bold text-[var(--color-primary)] mb-1">
                  {counters.members.toLocaleString()}+
                </div>
                <div className="text-sm text-[var(--text-silver)]">Membres actifs</div>
              </div>
            </motion.div>
            <motion.div
              className="relative text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[var(--accent-orange)]/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-2xl"></div>
              <div className="relative">
                <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-[var(--accent-orange)] bg-clip-text text-transparent mb-1">
                  {counters.downloads.toLocaleString()}+
                </div>
                <div className="text-sm text-[var(--text-silver)]">Téléchargements</div>
              </div>
            </motion.div>
            <motion.div
              className="relative text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-green-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl"></div>
              <div className="relative">
                <div className="text-4xl font-bold text-green-400 mb-1">
                  {counters.comments.toLocaleString()}+
                </div>
                <div className="text-sm text-[var(--text-silver)]">Commentaires</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Feature cards with unique gradients */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -10 }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ background: `linear-gradient(to bottom right, var(--accent-orange), var(--color-primary))` }}
              ></div>

              <div className="relative z-10">
                <motion.div
                  className={`flex items-center justify-center w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl mb-4 shadow-lg transition-all duration-300`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[var(--accent-orange)] transition-colors">{feature.title}</h3>
                <p className="text-[var(--text-silver)] text-sm leading-relaxed">{feature.description}</p>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: '0 0 30px rgba(249, 115, 22, 0.3)',
                }}
              ></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Call to action with 3D effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="relative mt-16 p-8 md:p-12 rounded-3xl overflow-hidden group"
          whileHover={{ scale: 1.02 }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-orange)]/20 via-[var(--color-primary)]/20 to-[var(--accent-orange)]/20 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border border-[var(--accent-orange)]/30 rounded-3xl"></div>

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              className="inline-block mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-5xl">🗣️</span>
            </motion.div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white via-[var(--accent-orange)] to-white bg-clip-text text-transparent">
              Prêt à alimenter le kongossa ?
            </h3>
            <p className="text-[var(--text-silver)] text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
              Rejoignez une communauté passionnée de <span className="text-[var(--accent-orange)] font-semibold">curieux</span> et de{' '}
              <span className="text-[var(--color-primary)] font-semibold">lanceurs d'alertes</span>.
              Partagez vos découvertes, débattez des révélations et restez au cœur de l'actualité croustillante !
            </p>
            {!isSignedIn && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/auth"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[var(--accent-orange)] to-orange-600 text-black font-bold rounded-xl text-lg shadow-xl hover:shadow-2xl hover:shadow-[var(--accent-orange)]/50 transition-all duration-300"
                >
                  <FiUsers className="w-6 h-6 mr-2" />
                  Commencer maintenant
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            )}

            {/* Trust badges */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[var(--text-silver)]">
              <div className="flex items-center gap-2">
                <FiShield className="w-4 h-4 text-green-400" />
                <span>100% Sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <FiZap className="w-4 h-4 text-yellow-400" />
                <span>Accès instantané</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-[var(--color-primary)]" />
                <span>450+ membres</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}