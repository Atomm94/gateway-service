import { Injectable } from '@nestjs/common';
import { MessagingService } from '../messaging/messaging.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserSignupSaga {
  private prisma = new PrismaClient();

  constructor(private readonly messaging: MessagingService) {}

  async execute(tenantId: string, email: string, password: string) {
    let user;
    try {
      // Step 1: Create user
      user = await this.prisma.user.create({
        data: { tenantId, email, password },
      });

      // Step 2: Emit event
      await this.messaging.sendUserCreatedEvent(user.id);

      // Step 3: Call onboarding microservice (example)
      // await this.onboardingService.start(user.id);

      return user;
    } catch (error) {
      // Step 4: Rollback if failed
      if (user) await this.prisma.user.delete({ where: { id: user.id } });
      throw error;
    }
  }
}
