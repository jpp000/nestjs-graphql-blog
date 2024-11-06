import { Post } from '../graphql/models/post'

export interface IPostsRepository {
  create(data: Omit<Post, 'id' | 'createdAt'>): Promise<Post>
  update(post: Post): Promise<Post>
  findById(id: string): Promise<Post>
  findBySlug(slug: string): Promise<Post>
  get(id: string): Promise<Post>
}
