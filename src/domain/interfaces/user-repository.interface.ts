import { UserEntity } from "../entities/user/user.entity";

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findManyUsers(): Promise<UserEntity[]>;
  save(user: UserEntity): Promise<UserEntity>;
  update(
    id: string,
    user: Partial<Omit<UserEntity, "id">>,
  ): Promise<UserEntity>;
}
