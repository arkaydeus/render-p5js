# render-p5js

Headless P5JS renderer to product transparent Chromie Squiggles from a tokenhash.
Note that a tokenhash is not the same as the hash of the mint tx.

Token hashes can be found at 

https://token.artblocks.io/0

under the tokenHash key.

e.g.

"token_hash": "0x722899b10c66da3b72fb60a8e71df442ee1c004547ba2227d76bed357469b4ea"

## Example use

`GET /0xb5b54ea7d262bf7349c4329a43dc56b8959b41e585e3dafc63b1c0e4bd28483e`

`GET /0x722899b10c66da3b72fb60a8e71df442ee1c004547ba2227d76bed357469b4ea`

## Deployment - Vercel

Can be deployed on Vercel. Please not that target node runtime is 16.0.
There are issues with 18.0

In addition, the following environment variable is required as part
of the Vercel project setup:

`LD_LIBRARY_PATH=/var/task/node_modules/canvas/build/Release`

## Local deployment

`yarn start` will initialise a deployment on localhost, port 8080