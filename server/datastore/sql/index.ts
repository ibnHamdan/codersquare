import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';

import { Datastore } from '..';
import { User, Post, Like, Comment } from '../../types';

export class SqlDataStore implements Datastore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;
  public async openDb() {
    // open the databse
    this.db = await open({
      filename: path.join(__dirname, 'codersquare.sqlite'),
      driver: sqlite3.Database,
    });

    this.db.run('PRAGMA foreign_keys = ON;');

    await this.db.migrate({
      migrationsPath: path.join(__dirname, 'migrations'),
    });

    return this;
  }
  async createUser(user: User): Promise<void> {
    await this.db.run(
      `INSERT INTO users (id, email, password, firstName, lastName, username) Values (?,?,?,?,?,?)`,
      user.id,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.username
    );
  }
  getUserById(id: string): Promise<User | undefined> {
    return this.db.get<User>(`SELECT * FROM users WHERE id = ? `, id);
  }
  getUserByEmail(email: string): Promise<User | undefined> {
    return this.db.get<User>(
      `SELECT * FROM users WHERE email = ? `,
      email
    );
  }
  getuserByUsername(username: string): Promise<User | undefined> {
    return this.db.get<User>(
      `SELECT * FROM users WHERE username = ? `,
      username
    );
  }
  listPosts(): Promise<Post[]> {
    return this.db.all<Post[]>('SELECT * FROM posts');
  }
  async createPost(post: Post): Promise<void> {
    await this.db.run(
      'INSERT INTO posts (id, title, url, postedAt, userId) VALUES (?,?,?,?,?)',
      post.userId,
      post.title,
      post.url,
      post.postedAt,
      post.userId
    );
  }
  getPost(id: string): Promise<Post | undefined> {
    throw new Error('Method not implemented.');
  }
  deletePost(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  createLike(like: Like): Promise<void> {
    throw new Error('Method not implemented.');
  }
  createComment(comment: Comment): Promise<void> {
    throw new Error('Method not implemented.');
  }
  listComments(postId: string): Promise<Comment[]> {
    throw new Error('Method not implemented.');
  }
  deleteComment(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
