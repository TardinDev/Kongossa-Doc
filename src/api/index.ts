// Documents API
export {
  fetchDocuments,
  fetchDocumentById,
  uploadDocument,
  updateDocument,
  deleteDocument,
  incrementDownloadCount,
  fetchUserDocuments,
  type PaginatedDocuments,
  type FetchDocumentsParams
} from './documents'

// Comments API
export {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
  getCommentCount
} from './comments'

// Favorites API
export {
  getFavoriteDocuments,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  getFavoriteCount,
  getFavoriteIds
} from './favorites'

// Collections API
export {
  getCollections,
  getCollection,
  getCollectionDocuments,
  createCollection,
  updateCollection,
  deleteCollection,
  addDocumentToCollection,
  removeDocumentFromCollection,
  addDocumentsToCollection
} from './collections'
