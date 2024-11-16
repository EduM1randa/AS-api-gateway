import * as celery from 'celery-node';

export class CeleryService {
  private client;

  constructor() {
    
    this.client = celery.createClient(
      'amqp://otlvzjsh:9ca3dasMysqshBXsWwvaB0Bf0GZSWexD@jackal.rmq.cloudamqp.com/otlvzjsh', 
      'redis://default:TuRUNrLhvCI02ezrVeVWHx3gG7BRIV1k@redis-10551.c308.sa-east-1-1.ec2.redns.redis-cloud.com:10551/0'
    );
  }
  async sendNotification(userId: string, notificationType: string, message: string) {
    try {
      const task = this.client.createTask('notifications.tasks.send_notification');
      const result = await task.applyAsync([userId, notificationType, message]);
      return await result.get(); 
    } catch (error) {
      console.error('Error while sending notification:', error);
      throw new Error('Failed to send notification');
    }
  }
  async markAsRead(userId: string) {
    const task = this.client.createTask('notifications.tasks.mark_as_read');
    const result = await task.applyAsync([userId]);
    return result.get(); 
  }
  async getUnreadNotifications(userId: string) {
    try {
      const task = this.client.createTask('notifications.tasks.unread'); 
      const result = await task.applyAsync([userId]);
       return result.get(); 
    }catch (error) {
      console.error('Error while getting unread notifications:', error);
      throw new Error('Failed to get unread notifications');
    }
  }
  
}