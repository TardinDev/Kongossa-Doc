import { motion } from 'framer-motion'
import { FiUpload, FiDownload, FiUsers, FiMessageSquare } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

export function HeroSection() {
  const { isSignedIn } = useAuth()

  const features = [
    {
      icon: <FiUpload className="w-6 h-6" />,
      title: "Partagez vos scoops",
      description: "Téléversez vos documents juteux et alimentez le kongossa"
    },
    {
      icon: <FiDownload className="w-6 h-6" />,
      title: "Découvrez les secrets",
      description: "Téléchargez les documents les plus croustillants"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Rejoignez la communauté",
      description: "Connectez-vous avec d'autres chasseurs de ragots"
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      title: "Commentez et débattez",
      description: "Partagez vos opinions sur les révélations"
    }
  ]

  return (
    <section className="relative overflow-hidden py-20 mb-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[var(--accent-orange)] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-[var(--color-primary)] rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[var(--accent-orange)] rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="text-gradient bg-gradient-to-r from-[var(--accent-orange)] to-[var(--color-primary)] bg-clip-text text-transparent">
              Kongossa
            </span>{' '}
            <span className="block mt-2">
              Le temple des 
              <span className="text-[var(--accent-orange)] ml-3">ragots</span>
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

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--accent-orange)] mb-1">1.2K+</div>
              <div className="text-sm text-[var(--text-silver)]">Documents partagés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-primary)] mb-1">450+</div>
              <div className="text-sm text-[var(--text-silver)]">Membres actifs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--accent-orange)] mb-1">89K+</div>
              <div className="text-sm text-[var(--text-silver)]">Téléchargements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--color-primary)] mb-1">2.3K+</div>
              <div className="text-sm text-[var(--text-silver)]">Commentaires échangés</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature cards */}
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
              className="group p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-[var(--accent-orange)] to-orange-600 rounded-2xl mb-4 group-hover:shadow-lg group-hover:shadow-[var(--accent-orange)]/25 transition-all">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-[var(--text-silver)] text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[var(--accent-orange)]/10 to-[var(--color-primary)]/10 border border-[var(--accent-orange)]/20"
        >
          <h3 className="text-2xl font-bold text-white mb-3">
            🗣️ Prêt à alimenter le kongossa ?
          </h3>
          <p className="text-[var(--text-silver)] mb-6 max-w-2xl mx-auto">
            Rejoignez une communauté passionnée de curieux et de lanceurs d'alertes. 
            Partagez vos découvertes, débattez des révélations et restez au cœur de l'actualité croustillante !
          </p>
          {!isSignedIn && (
            <Link
              to="/auth"
              className="inline-flex items-center px-6 py-3 bg-[var(--accent-orange)] text-black font-semibold rounded-lg hover:bg-orange-500/90 transition-colors"
            >
              <FiUsers className="w-5 h-5 mr-2" />
              Commencer maintenant
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}