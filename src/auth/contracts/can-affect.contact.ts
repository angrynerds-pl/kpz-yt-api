import { User } from '../../user/entities/user.entity';
import { Identyficable } from 'src/common/interfaces/identyficable';

export interface CanAffect<Entity> {
  canAffect(user: User, entity: Entity | Identyficable): boolean;
}
