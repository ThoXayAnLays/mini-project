import cron from 'node-cron'
import Auction from '#models/auction'
import TransactionsController from '#controllers/transactions_controller'

cron.schedule('*/10 * * * * *', async () => {
    console.log('Running cron job');
    
    const auctions = await Auction.query()
      .where('auction_end', '<', new Date())
      .andWhere('is_ended', false)
    // biome-ignore lint/complexity/noForEach: <explanation>
    auctions.forEach(async (auction) => {
      await TransactionsController.endAuction(auction.id);
      console.log(`Auction ${auction.id} ended`);
    });
  })