import { Tables } from '@/types/supabase'

export type Meta = Record<string, any>

export type Role = 'guest' | 'user' | 'admin' | 'superadmin'

export type Plan = 'free' | 'basic' | 'standard' | 'premium'

export type UserMeta = Tables<'usermeta'>

export type User = Tables<'users'> & {
  meta?: UserMeta[]
}

export type Email = Tables<'emails'>

export type Notification = Tables<'notifications'>

export type Vote = Tables<'votes'>

export type Author = Tables<'users'>

export type PostStatus =
  | 'publish'
  | 'future'
  | 'draft'
  | 'pending'
  | 'private'
  | 'trash'

export type PostType = 'post' | 'page' | 'revision'

export type PostMeta = Tables<'postmeta'>

export type CountPosts = {
  status: PostStatus
  count: number
}

export type Post = Tables<'posts'> & {
  author: Author | null
  meta?: PostMeta[]
  num?: number
}

export type Favorite = Tables<'favorites'>

export type TagMeta = Tables<'tagmeta'>

export type Tag = Tables<'tags'> & {
  meta?: TagMeta[]
}

export type PostTag = Tables<'post_tags'>

export type PostRank = {
  id: number
  title: string
  views: number
  num: number
}

export type Statistic = Tables<'statistics'>
