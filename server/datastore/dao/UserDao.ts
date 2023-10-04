// Dao Data access object .
//read for DB to memoery

import { User } from '../../types';

// fun contains functionality ,

export interface UserDao {
  createUser(user: User): Promise<void>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getuserByUsername(username: string): Promise<User | undefined>;
}
