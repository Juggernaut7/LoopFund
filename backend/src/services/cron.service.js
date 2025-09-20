const cron = require('node-cron');
const notificationService = require('./notification.service');

class CronService {
  constructor() {
    this.jobs = new Map();
    this.isRunning = false;
  }

  // Start all scheduled jobs
  start() {
    if (this.isRunning) {
      console.log('⚠️ Cron service is already running');
      return;
    }

    console.log('🕐 Starting cron service...');

    // Daily notification checks at 9:00 AM
    const dailyCheckJob = cron.schedule('0 9 * * *', async () => {
      console.log('🔔 Running daily notification checks...');
      try {
        await notificationService.runDailyNotificationChecks();
      } catch (error) {
        console.error('Error in daily notification checks:', error);
      }
    }, {
      scheduled: false,
      timezone: "Africa/Lagos"
    });

    // Hourly due date checks (for urgent notifications)
    const hourlyCheckJob = cron.schedule('0 * * * *', async () => {
      console.log('🔔 Running hourly due date checks...');
      try {
        await notificationService.checkAndNotifyDueDates();
      } catch (error) {
        console.error('Error in hourly due date checks:', error);
      }
    }, {
      scheduled: false,
      timezone: "Africa/Lagos"
    });

    // Weekly summary notifications (Sundays at 6:00 PM)
    const weeklySummaryJob = cron.schedule('0 18 * * 0', async () => {
      console.log('📊 Running weekly summary notifications...');
      try {
        // This could be expanded to send weekly progress summaries
        console.log('Weekly summary notifications not yet implemented');
      } catch (error) {
        console.error('Error in weekly summary notifications:', error);
      }
    }, {
      scheduled: false,
      timezone: "Africa/Lagos"
    });

    // Store jobs
    this.jobs.set('dailyCheck', dailyCheckJob);
    this.jobs.set('hourlyCheck', hourlyCheckJob);
    this.jobs.set('weeklySummary', weeklySummaryJob);

    // Start all jobs
    this.jobs.forEach((job, name) => {
      job.start();
      console.log(`✅ Started cron job: ${name}`);
    });

    this.isRunning = true;
    console.log('🎉 All cron jobs started successfully');
  }

  // Stop all scheduled jobs
  stop() {
    if (!this.isRunning) {
      console.log('⚠️ Cron service is not running');
      return;
    }

    console.log('🛑 Stopping cron service...');
    
    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`⏹️ Stopped cron job: ${name}`);
    });

    this.jobs.clear();
    this.isRunning = false;
    console.log('✅ All cron jobs stopped');
  }

  // Get status of all jobs
  getStatus() {
    const status = {
      isRunning: this.isRunning,
      jobs: {}
    };

    this.jobs.forEach((job, name) => {
      status.jobs[name] = {
        running: job.running,
        scheduled: job.scheduled
      };
    });

    return status;
  }

  // Manually trigger a specific job
  async triggerJob(jobName) {
    if (!this.jobs.has(jobName)) {
      throw new Error(`Job ${jobName} not found`);
    }

    console.log(`🔧 Manually triggering job: ${jobName}`);
    
    switch (jobName) {
      case 'dailyCheck':
        await notificationService.runDailyNotificationChecks();
        break;
      case 'hourlyCheck':
        await notificationService.checkAndNotifyDueDates();
        break;
      case 'weeklySummary':
        console.log('Weekly summary not yet implemented');
        break;
      default:
        throw new Error(`Unknown job: ${jobName}`);
    }
  }
}

// Create singleton instance
const cronService = new CronService();

module.exports = cronService;
