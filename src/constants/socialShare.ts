export const SOCIAL_SHARE_URLS = {
  tiktok: (url: string, text: string) => 
    `https://www.tiktok.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  facebook: (url: string) => 
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  instagram: (url: string) => 
    `https://www.instagram.com/?url=${encodeURIComponent(url)}`,
  linkedin: (url: string) => 
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  whatsapp: (url: string, text: string) => 
    `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
  twitter: (url: string, text: string) => 
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
} as const

export const SOCIAL_PLATFORMS = [
  { key: 'tiktok', name: 'TikTok', icon: 'SiTiktok' },
  { key: 'facebook', name: 'Facebook', icon: 'SiFacebook' },
  { key: 'instagram', name: 'Instagram', icon: 'SiInstagram' },
  { key: 'linkedin', name: 'LinkedIn', icon: 'SiLinkedin' },
  { key: 'whatsapp', name: 'WhatsApp', icon: 'SiWhatsapp' },
  { key: 'twitter', name: 'X (Twitter)', icon: 'SiX' },
] as const