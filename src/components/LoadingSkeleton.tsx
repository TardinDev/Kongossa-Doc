import { motion } from 'framer-motion'

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
        <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse" />
        <div className="h-10 w-full sm:w-64 bg-white/10 rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
          >
            <div className="aspect-video w-full bg-white/10 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
                <div className="h-5 w-12 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="h-8 w-20 bg-white/10 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function DocumentCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden animate-pulse">
      <div className="aspect-video w-full bg-white/10" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="h-5 w-32 bg-white/10 rounded" />
          <div className="h-5 w-12 bg-white/10 rounded" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="h-8 w-20 bg-white/10 rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-white/10 rounded" />
            <div className="h-8 w-8 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}