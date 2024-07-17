###

login/register/forgot password.
jwt token.
otp to verify email when register new account.
2fa login using Authenticator app on CH Play (optional).

###

CRUD Collection/NFT.

User can create offer for a NFT. 
Owner of NFT can accept or reject offer.

Owner of NFT can create Auction.
Other user can bid on auction for NFT.

A cron job will be run to check if auction is ended or expired to end auction and prevent other user bid on auction.

All offer, bid, accept offer, reject offer require OTP to verify.
After all, transaction will be created. 