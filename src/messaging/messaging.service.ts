import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MessagingService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  async sendUserCreatedEvent(userId: string) {
    return this.client.emit('user_created', { userId });
  }
}
