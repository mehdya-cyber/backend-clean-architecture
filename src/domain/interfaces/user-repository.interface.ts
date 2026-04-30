import { IUserEntity } from "../entities/user/user.entity";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUserEntity | null>;
  findById(id: string): Promise<IUserEntity | null>;
  findManyUsers(): Promise<IUserEntity[]>;
  save(user: IUserEntity): Promise<IUserEntity>;
  update(
    id: string,
    user: Partial<Omit<IUserEntity, "id">>,
  ): Promise<IUserEntity>;
}
