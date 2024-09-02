# dottxt

Information for extremely low bandwidth environments.

![a person with a large backpack, heavy blue jacket, beige snow pants, and snow boots standing right in front of mountains covered in snow. between the mountains is the text dottxt in a decorative font, with the text being partiallly obscured by the mountains.](./.github/assets/cover.jpg)

## Guide

Visit [dottxt.link](http://dottxt.link) for a list of valid urls and functionality. SSL is supported but not required.

## Limitations

dottxt is hosted with Cloudflare Workers. While there is no limitation on how long your client / browser can take to load a page, Cloudflare does, "updates the Workers runtime a few times per week." During this time there is a 30 second grace period before the worker is terminated. It is unlikely for you to run into a situation where it takes longer than 30 seconds to load a page, and Cloudflare happens to deploy an update at the same time.

Cloudflare always responds with certain headers, which are not necessary for functionality. This brings the total size of response headers to ~520 bytes uncompressed. With compression, the current size of the landing page sits around 600B - 650B.

## Roadmap

- [ ] Wikipedia
- [ ] More Carriers

## Project Goals

Viewing important information with (almost) as little bandwidth as possible.

## Scripts

### Develop

To start the dev server, run the following command:

```sh
cd dottxt
pnpm run dev
```

### Deploy

To build and deploy to Cloudflare Workers, run the following command:

```sh
cd dottxt
pnpm run deploy
```

## License

Copyright © 2024 Alexander Liu

MIT License
