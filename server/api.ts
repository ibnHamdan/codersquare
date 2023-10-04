import { Post, User } from './types';

/// Post APIs
export interface ListPostRequest {}
export interface ListPostResponse {
  posts: Post[];
}

export type CreatePostRequest = Pick<
  Post,
  'title' | 'url' | 'userId'
>;
export interface CreatePostResponse {}

export interface GetPostRequest {}
export interface GetPostResponse {
  post: Post;
}

// Comment APIs

// Like APIs

// Users APIs

export type SignUpRequest = Pick<
  User,
  'email' | 'firstName' | 'lastName' | 'username' | 'password'
>;
export interface SignUpResponse {
  jwt: string;
}

export interface SignInRequest {
  login: string;
  password: string;
}
export type SignInRespose = {
  user: Pick<
    User,
    'email' | 'firstName' | 'lastName' | 'username' | 'id'
  >;
  jwt: string;
};
