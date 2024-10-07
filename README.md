This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Installing dependencies

-- Node JS

First ensure you have the Node version from this project to avoid issues: 18.15.0

You can download node right here: https://nodejs.org/en/download

After you install node and the npm package manager from the node install you will most likely have the latest version of node. To avoid conflicts or errors please ensure you have the same version as the one in this project.

Go into a terminal and type:

```bash
npm install -g node@18.15.0
```

-- Next JS and other packages

To install next and other dependencies js simply use the following commands:

```bash
npm install nextjs
npm install
```

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Testing and Building

Before deploying its recommended to ensures the program builds and passes all tests without any issues. Our pipelines are configured do this automatically but to test locally you can use the following command:

```bash
npm run component:local
npm run build
```

It should run all tests and build if everything passes with no issues.

## Deploying on Vercel

In order to deploy we use the Vercel service. The pipelines are configured so each push to the development branch uploads the site to a private preview using only a valid account (information on the account is in the wiki). As for actual deployement in production, its configured to happen only during pushes to the main branch.

If you would like to do a manual deployement locally then ensure you have vercel installed and use the following commands:

```bash
npm install vercel
npx vercel # Preview deployements
npx vercel --prod # Production deployements
```

This will ask you to log into your Vercel account and proceed to do the deployement for you.

## Additional resources

Our wiki should cover everything else not already mentioned in this readme. It containss basic info of how our code base is designed and resources such as accounts used for firebase and vercel.