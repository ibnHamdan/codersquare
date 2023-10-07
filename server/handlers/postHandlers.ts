import crypto from 'crypto';
import { db } from '../datastore';
import { ExpressHandler, Post } from '../types';
import {
  CreatePostRequest,
  CreatePostResponse,
  ListPostRequest,
  ListPostResponse,
} from '../api';

export const listPostHandler: ExpressHandler<
  ListPostRequest,
  ListPostResponse
> = async (req, res) => {
  res.send({ posts: await db.listPosts() });
};

export const createPostHandler: ExpressHandler<
  CreatePostRequest,
  CreatePostResponse
> = async (req, res) => {
  // TODO: validate user exist
  // TODO: get user ID from session
  // TODO: validate tile and url are non-empty
  // TODO: validate url is new, otherwise add +1 to existing post
  if (!req.body.title || !req.body.url) {
    return res.sendStatus(400);
  }
  const post: Post = {
    id: crypto.randomUUID(),
    postedAt: Date.now(),
    title: req.body.title,
    url: req.body.url,
    userId: res.locals.userId,
  };
  console.log('post created, ', post);
  await db.createPost(post);
  res.sendStatus(200);
};
