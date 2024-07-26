# ncats-frontend-library

Monorepo currently for Rare Disease Alert System

####install dependencies
`npm i`
####build API
`nx build rdas-express --prod`
####build UI (prerendered)
\*\*\*note - needs environments file

`nx run rdas:prerender:production`
####move dist/apps/rdas-express to api directory
`cd {api_dir}`

`npm i`
####run api
`nohup node main.js &`

####move dist/rdas/browser to UI directory
