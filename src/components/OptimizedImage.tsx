import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  placeholder?: string
  onLoad?: () => void
  onError?: (error: string | Event) => void
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before image comes into view
        threshold: 0.1
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsError(true)
    onError?.(e.nativeEvent)
  }

  // Generate optimized src URLs based on image CDN or local optimization
  const getOptimizedSrc = (originalSrc: string, targetWidth?: number) => {
    // If using a CDN like Cloudinary, Vercel, or similar, you can add transformations here
    // For now, return original src
    if (targetWidth && originalSrc.includes('picsum.photos')) {
      // For demo purposes with picsum
      return originalSrc.replace(/\/(\d+)\/(\d+)/, `/${targetWidth}/${Math.round((targetWidth * parseInt(originalSrc.split('/')[4])) / parseInt(originalSrc.split('/')[3]))}`)
    }
    return originalSrc
  }

  // Generate srcSet for responsive images
  const generateSrcSet = (originalSrc: string) => {
    if (originalSrc.includes('picsum.photos')) {
      const sizes = [320, 640, 960, 1280, 1920]
      return sizes
        .map(size => `${getOptimizedSrc(originalSrc, size)} ${size}w`)
        .join(', ')
    }
    return undefined
  }

  const srcSet = generateSrcSet(src)
  const optimizedSrc = width ? getOptimizedSrc(src, width) : src

  if (isError) {
    return (
      <div 
        className={`bg-gray-800 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-gray-400">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-sm">Image non disponible</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-800 flex items-center justify-center"
          >
            {placeholder ? (
              <img 
                src={placeholder} 
                alt="" 
                className="w-full h-full object-cover opacity-30 blur-sm"
              />
            ) : (
              <div className="shimmer w-full h-full bg-gray-700" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading spinner */}
      <AnimatePresence>
        {isInView && !isLoaded && !isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-800/50"
          >
            <div className="w-8 h-8 border-2 border-[var(--accent-orange)] border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual image */}
      {isInView && (
        <motion.img
          src={optimizedSrc}
          srcSet={srcSet}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
        />
      )}
    </div>
  )
}