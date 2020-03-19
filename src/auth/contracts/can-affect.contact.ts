import { User } from 'src/user/entities/user.entity';

export interface CanAffect<Entity> {
  canAffect(user: User, entity: Entity | { id: number }): boolean;
}
