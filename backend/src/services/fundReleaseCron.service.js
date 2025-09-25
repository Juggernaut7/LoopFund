const cron = require('node-cron');
const fundReleaseService = require('./fundRelease.service');

class FundReleaseCronService {
  constructor() {
    this.isRunning = false;
  }

  // Start the cron job to check for completed funds every hour
  startFundReleaseCron() {
    if (this.isRunning) {
      console.log('Fund release cron job is already running');
      return;
    }

    // Run every hour at minute 0
    this.cronJob = cron.schedule('0 * * * *', async () => {
      console.log('🕐 Running fund release check...');
      try {
        const results = await fundReleaseService.checkAllCompletedFunds();
        
        if (results.totalReleased > 0) {
          console.log(`💰 Released ₦${results.totalReleased.toLocaleString()} in funds`);
          console.log(`Goals: ${results.goals.length}, Groups: ${results.groups.length}`);
        } else {
          console.log('No completed funds to release');
        }
      } catch (error) {
        console.error('❌ Error in fund release cron job:', error);
      }
    }, {
      scheduled: false,
      timezone: "Africa/Lagos"
    });

    this.cronJob.start();
    this.isRunning = true;
    console.log('✅ Fund release cron job started (runs every hour)');
  }

  // Stop the cron job
  stopFundReleaseCron() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.isRunning = false;
      console.log('⏹️ Fund release cron job stopped');
    }
  }

  // Get cron job status
  getStatus() {
    return {
      isRunning: this.isRunning,
      nextRun: this.cronJob ? this.cronJob.nextDate() : null
    };
  }

  // Manual trigger for testing
  async triggerFundReleaseCheck() {
    console.log('🔧 Manual fund release check triggered');
    try {
      const results = await fundReleaseService.checkAllCompletedFunds();
      console.log('Manual check results:', results);
      return results;
    } catch (error) {
      console.error('❌ Error in manual fund release check:', error);
      throw error;
    }
  }
}

module.exports = new FundReleaseCronService();
