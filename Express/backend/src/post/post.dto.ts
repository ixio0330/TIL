export interface PostEntity extends CreatePostDto {
  id: string;
  created_on: string;
  updated_on: string;
}

export interface CreatePostDto {
  user_id: string;
  title: string;
  content: string;
}

export interface UpdatePostDto {
  id: string;
  user_id: string;
  title: string;
  content: string;
}