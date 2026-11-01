export interface Post {
  id: number | string;
  title: string;
  content: string;
  author?: string;
  createdAt?: string;
}

export type CreatePostDto = Omit<Post, 'id' | 'createdAt'>;