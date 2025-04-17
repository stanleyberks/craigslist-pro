import { processAllAlerts } from '../lib/worker';

async function main() {
  console.log('Starting cron job at:', new Date().toISOString());
  
  try {
    await processAllAlerts();
    console.log('Successfully processed all alerts');
  } catch (error) {
    console.error('Error in cron job:', error);
    process.exit(1);
  }
}

main();
