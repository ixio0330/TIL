export interface PostEntity extends CreatePostDto {
  id: string;
  user_id: string;
  title: string;
  content: string;
}

export interface CreatePostDto {
  user_id: string;
  title: string;
  content: string;
}

export interface UpdatePostDto {
  id: string;
  title: string;
  content: string;
}

export interface PostDto {
  title: string;
  content: string;
}