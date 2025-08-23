import { motion } from 'framer-motion'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-transparent text-[var(--text-silver)]">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between text-sm">
        <span>© {new Date().getFullYear()} Kongossa Doc</span>
        <div className="text-right">
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
          >
            développé par{' '}
            <a
              href="https://evoubabp.vercel.app/"
              target="_blank"
              rel="noreferrer noopener"
              className="text-[var(--accent-orange)] hover:underline"
            >
              evoubap.com
            </a>
          </motion.span>
        </div>
      </div>
    </footer>
  )
}

