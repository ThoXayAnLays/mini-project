/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
// import UsersController from '#controllers/users_controller'
// import CollectionsController from '#controllers/collections_controller'
// import NftsController from '#controllers/nfts_controller'
// import OffersController from '#controllers/offers_controller'
// import BidsController from '#controllers/bids_controller'
// import AuctionsController from '#controllers/auctions_controller'
// import TransactionsController from '#controllers/transactions_controller'
// import TwoFactorAuthsController from '#controllers/two_factor_auths_controller'

const UsersController = () => import('#controllers/users_controller')
const CollectionsController = () => import('#controllers/collections_controller')
const NftsController = () => import('#controllers/nfts_controller')
const OffersController = () => import('#controllers/offers_controller')
const BidsController = () => import('#controllers/bids_controller')
const AuctionsController = () => import('#controllers/auctions_controller')
const TransactionsController = () => import('#controllers/transactions_controller')
const TwoFactorAuthsController = () => import('#controllers/two_factor_auths_controller')

import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
// returns swagger in YAML
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
  // return AutoSwagger.default.scalar("/swagger", swagger); to use Scalar instead
  // return AutoSwagger.default.rapidoc("/swagger", swagger); to use RapiDoc instead
})

router
  .group(() => {
    router
      .group(() => {
        router.post('/register', [UsersController, 'register'])
        router.post('/login', [UsersController, 'login'])
        router.get('/me', [UsersController, 'me']).use(middleware.auth({ guards: ['api'] }))
        router
          .put('/update-profile', [UsersController, 'updateProfile'])
          .use(middleware.auth({ guards: ['api'] }))
        router.post('/send-otp', [UsersController, 'sendOtp'])
        router.post('/verify-otp', [UsersController, 'verifyOtp'])
        router.post('/forgot-password', [UsersController, 'forgotPassword'])
        router.post('/reset-password', [UsersController, 'resetPassword'])
      })
      .prefix('/auth')

    router
      .group(() => {
        router.post('/generate', [TwoFactorAuthsController, 'generateSecret'])
        router.post('/validate', [TwoFactorAuthsController, 'validateToken'])
      })
      .prefix('/twofa')
      .use(middleware.auth({ guards: ['api'] }))

    router
      .group(() => {
        router.get('/', [CollectionsController, 'index']).use(middleware.pagination())
        router
          .get('/get-by-owner', [CollectionsController, 'getByOwner'])
          .use(middleware.pagination())
          .use(middleware.auth({ guards: ['api'] }))
        router.get('/:id', [CollectionsController, 'show'])

        router
          .post('/', [CollectionsController, 'create'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .put('/:id', [CollectionsController, 'update'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .delete('/:id', [CollectionsController, 'delete'])
          .use(middleware.auth({ guards: ['api'] }))
      })
      .prefix('/collection')

    router
      .group(() => {
        router.get('/', [NftsController, 'index']).use(middleware.pagination())
        router
          .get('/getByOwner', [NftsController, 'showByOwner'])
          .use(middleware.auth({ guards: ['api'] }))
        router.get('/:id', [NftsController, 'show'])
        router.post('/', [NftsController, 'create']).use(middleware.auth({ guards: ['api'] }))
        router.put('/:id', [NftsController, 'update']).use(middleware.auth({ guards: ['api'] }))
        router.delete('/:id', [NftsController, 'delete']).use(middleware.auth({ guards: ['api'] }))
      })
      .prefix('/nft')

    router
      .group(() => {
        router.get('/offer-by-nft/:id', [OffersController, 'index']).use(middleware.pagination())
        router
          .get('/offer-by-user', [OffersController, 'show'])
          .use(middleware.pagination())
          .use(middleware.auth({ guards: ['api'] }))
        router
          .post('/send-otp', [TransactionsController, 'sendOtp'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .post('/', [TransactionsController, 'verifyOtp'])
          .use(middleware.auth({ guards: ['api'] }))
      })
      .prefix('/offer')

    router
      .group(() => {
        router.get('/', [AuctionsController, 'list']).use(middleware.pagination())
        router
          .get('/auction-by-id/:id', [AuctionsController, 'showItemOnList'])
          .use(middleware.pagination())
        router.get('/all-auction', [AuctionsController, 'index']).use(middleware.pagination())
        router.get('/auction-by-nft/:id', [AuctionsController, 'show']).use(middleware.pagination())
        router
          .get('/auction-by-user', [AuctionsController, 'auctionCreatedByUser'])
          .use(middleware.pagination())
          .use(middleware.auth({ guards: ['api'] }))
        router
          .post('/send-otp', [TransactionsController, 'sendOtp'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .post('/', [TransactionsController, 'verifyOtp'])
          .use(middleware.auth({ guards: ['api'] }))
      })
      .prefix('/auction')

    router
      .group(() => {
        router.get('/:id', [BidsController, 'bidByAuction']).use(middleware.pagination())
        router
          .get('/', [BidsController, 'bidByUser'])
          .use(middleware.pagination())
          .use(middleware.auth({ guards: ['api'] }))
        router
          .post('/send-otp', [TransactionsController, 'sendOtp'])
          .use(middleware.auth({ guards: ['api'] }))
        router
          .post('/', [TransactionsController, 'verifyOtp'])
          .use(middleware.auth({ guards: ['api'] }))
      })
      .prefix('/bid')

    router
      .group(() => {
        router.get('/', [TransactionsController, 'index']).use(middleware.pagination())
      })
      .prefix('/transaction')
  })
  .prefix('/api/v1')
