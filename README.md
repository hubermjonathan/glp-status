# glp-status

a paddle stacking tracker for green lake pickleball

## development

1. create `.env.local` from `.env.example`
2. run `npm run dev` to develop locally
3. commit to `main` to deploy to staging (runs against prod database)
4. pull commits from `main` into `prod` to deploy to prod

## upcoming work

- **improved algorithm** - track stacks and conditions better than just pulling the latest report
- **better styling** - make the website better to use (form, mobile-first, etc)
- **report history** - view history of reports including volume
- **number of courts reserved** - show how many courts are reserved
