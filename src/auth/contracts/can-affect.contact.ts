import { User } from '../../user/entities/user.entity';
import { Identifiable } from 'src/common/interfaces/identifiable';

export interface CanAffect<Entity> {
  canAffect(user: User, entity: Entity | Identifiable): Promise<boolean>;
}
