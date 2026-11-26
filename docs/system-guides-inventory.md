# ByteByteGo guide inventory → Boxes & Arrows section plan

Source: [ByteByteGoHq/system-design-101 · data/guides](https://github.com/ByteByteGoHq/system-design-101/tree/main/data/guides) — **400 guide files** inventoried 2026-11-25.

The app currently has 12 units / 53 lessons. Unit 9 (Whole Systems) only has a generic URL shortener, news feed and chat system. This inventory identifies the **named, real-world systems** in the guide set and groups them into proposed walkthrough sections. Every entry below is a real file in `data/guides`.

## Coverage at a glance

- **A · Chat, messaging & notifications (WhatsApp)** — 8 guides
- **B · Video, streaming & caching (YouTube / Netflix)** — 6 guides
- **C · Feed, mail & social (Twitter / Gmail / Reddit)** — 7 guides
- **D · Mobility, travel & commerce (Uber / Airbnb / Amazon)** — 8 guides
- **E · Search, maps, docs & Q&A (Google / Stack Overflow)** — 7 guides
- **F · Payments & fintech** — 16 guides
- **G · Other named products & systems** — 11 guides

**Total named-system / product guides mapped: 63**

## Proposed new app sections

| Unit | Title | Lessons (walkthroughs) |
|---|---|---|
| 13 | Build the Giants: Messaging | How to build WhatsApp · Discord at scale · The journey of a Slack message |
| 14 | Build the Giants: Media | How YouTube handles uploads · Live streaming · How Netflix caches |
| 15 | Build the Giants: Social & Mail | Twitter's For You pipeline · Design Gmail · Reddit's core architecture |
| 16 | Build the Giants: Mobility & Commerce | Uber's API layer · Airbnb's architecture · E-commerce workflow |
| 17 | Build the Giants: Payments | Design a payment system · UPI in India · Avoiding double payment |
| 18 | Build the Giants: Search & Maps | How search engines work · Design Google Maps · How Google Docs works |

Each lesson follows the existing step format: a walkthrough of the system's *shape* (clients, services, stores, queues) rendered as boxes-and-arrows scenes, then the concrete flow, then the trade-offs and failure modes. Content is paraphrased from the linked guides and credited in the lesson body.

## Guide index by batch


### A · Chat, messaging & notifications (WhatsApp)

- [How do we design a chat application like whatsapp facebook messenger or discord](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-do-we-design-a-chat-application-like-whatsapp-facebook-messenger-or-discord.md) — `how-do-we-design-a-chat-application-like-whatsapp-facebook-messenger-or-discord.md`
- [Build a simple chat application](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/build-a-simple-chat-application.md) — `build-a-simple-chat-application.md`
- [How discord stores trillions of messages](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-discord-stores-trillions-of-messages.md) — `how-discord-stores-trillions-of-messages.md`
- [What is the journey of a slack message](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/what-is-the-journey-of-a-slack-message.md) — `what-is-the-journey-of-a-slack-message.md`
- [How are notifications pushed to our phones or pcs](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-are-notifications-pushed-to-our-phones-or-pcs.md) — `how-are-notifications-pushed-to-our-phones-or-pcs.md`
- [How does a typical push notification system work](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-does-a-typical-push-notification-system-work.md) — `how-does-a-typical-push-notification-system-work.md`
- [How does netflix scale push messaging for millions of devices](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-does-netflix-scale-push-messaging-for-millions-of-devices.md) — `how-does-netflix-scale-push-messaging-for-millions-of-devices.md`
- [Shortlong polling sse websocket](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/shortlong-polling-sse-websocket.md) — `shortlong-polling-sse-websocket.md`

### B · Video, streaming & caching (YouTube / Netflix)

- [How does youtube handle massive video content upload](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-does-youtube-handle-massive-video-content-upload.md) — `how-does-youtube-handle-massive-video-content-upload.md`
- [Live streaming explained](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/live-streaming-explained.md) — `live-streaming-explained.md`
- [4 ways netflix uses caching to hold user attention](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/4-ways-netflix-uses-caching-to-hold-user-attention.md) — `4-ways-netflix-uses-caching-to-hold-user-attention.md`
- [Netflixs overall architecture](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/netflixs-overall-architecture.md) — `netflixs-overall-architecture.md`
- [Evolution of the netflix api architecture](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/evolution-of-the-netflix-api-architecture.md) — `evolution-of-the-netflix-api-architecture.md`
- [How does netflix scale push messaging for millions of devices](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-does-netflix-scale-push-messaging-for-millions-of-devices.md) — `how-does-netflix-scale-push-messaging-for-millions-of-devices.md`

### C · Feed, mail & social (Twitter / Gmail / Reddit)

- [Twitter 10 tech stack](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/twitter-10-tech-stack.md) — `twitter-10-tech-stack.md`
- [Twitter architecture 2022 vs 2012](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/twitter-architecture-2022-vs-2012.md) — `twitter-architecture-2022-vs-2012.md`
- [How does twitter recommend tweets](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-does-twitter-recommend-tweets.md) — `how-does-twitter-recommend-tweets.md`
- [Reddit's core architecture](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/reddit's-core-architecture.md) — `reddit's-core-architecture.md`
- [Design gmail](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/design-gmail.md) — `design-gmail.md`
- [How is email delivered](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-is-email-delivered.md) — `how-is-email-delivered.md`
- [How do we design a permission system](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-do-we-design-a-permission-system.md) — `how-do-we-design-a-permission-system.md`

### D · Mobility, travel & commerce (Uber / Airbnb / Amazon)

- [Evolution of uber's api layer](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/evolution-of-uber's-api-layer.md) — `evolution-of-uber's-api-layer.md`
- [Uber tech stack](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/uber-tech-stack.md) — `uber-tech-stack.md`
- [Uber tech stack cicd](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/uber-tech-stack-cicd.md) — `uber-tech-stack-cicd.md`
- [Proximity service](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/proximity-service.md) — `proximity-service.md`
- [Airbnb artchitectural evolution](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/airbnb-artchitectural-evolution.md) — `airbnb-artchitectural-evolution.md`
- [Evolution of airbnb's microservice](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/evolution-of-airbnb's-microservice.md) — `evolution-of-airbnb's-microservice.md`
- [E commerce workflow](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/e-commerce-workflow.md) — `e-commerce-workflow.md`
- [How does amazon build system work](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-does-amazon-build-system-work.md) — `how-does-amazon-build-system-work.md`

### E · Search, maps, docs & Q&A (Google / Stack Overflow)

- [Design google maps](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/design-google-maps.md) — `design-google-maps.md`
- [How do googleapple maps blur license plates and human faces on street view](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-do-googleapple-maps-blur-license-plates-and-human-faces-on-street-view.md) — `how-do-googleapple-maps-blur-license-plates-and-human-faces-on-street-view.md`
- [How do search engines work](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-do-search-engines-work.md) — `how-do-search-engines-work.md`
- [What happens when you type google](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/what-happens-when-you-type-google.md) — `what-happens-when-you-type-google.md`
- [How to design google docs](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-to-design-google-docs.md) — `how-to-design-google-docs.md`
- [How will you design the stack overflow website](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-will-you-design-the-stack-overflow-website.md) — `how-will-you-design-the-stack-overflow-website.md`
- [How to avoid crawling duplicate urls at google scale](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-to-avoid-crawling-duplicate-urls-at-google-scale.md) — `how-to-avoid-crawling-duplicate-urls-at-google-scale.md`

### F · Payments & fintech

- [Payment system](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/payment-system.md) — `payment-system.md`
- [The payments ecosystem](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/the-payments-ecosystem.md) — `the-payments-ecosystem.md`
- [Unified payments interface upi in india](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/unified-payments-interface-upi-in-india.md) — `unified-payments-interface-upi-in-india.md`
- [Foreign exchange payments](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/foreign-exchange-payments.md) — `foreign-exchange-payments.md`
- [Swift payment messaging system](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/swift-payment-messaging-system.md) — `swift-payment-messaging-system.md`
- [How applegoogle pay works](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-applegoogle-pay-works.md) — `how-applegoogle-pay-works.md`
- [4 ways of qr code payment](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/4-ways-of-qr-code-payment.md) — `4-ways-of-qr-code-payment.md`
- [How does ach payment work](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-does-ach-payment-work.md) — `how-does-ach-payment-work.md`
- [How does scan to pay work](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-does-scan-to-pay-work.md) — `how-does-scan-to-pay-work.md`
- [How does visa work when we swipe a credit card at a merchant's shop](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-does-visa-work-when-we-swipe-a-credit-card-at-a-merchant's-shop.md) — `how-does-visa-work-when-we-swipe-a-credit-card-at-a-merchant's-shop.md`
- [How does visa make money](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-does-visa-make-money.md) — `how-does-visa-make-money.md`
- [How to avoid double payment](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-to-avoid-double-payment.md) — `how-to-avoid-double-payment.md`
- [Reconciliation in payment](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/reconciliation-in-payment.md) — `reconciliation-in-payment.md`
- [Handling hotspot accounts](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/handling-hotspot-accounts.md) — `handling-hotspot-accounts.md`
- [10 principles for building resilient payment systems by shopify](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/10-principles-for-building-resilient-payment-systems-by-shopify.md) — `10-principles-for-building-resilient-payment-systems-by-shopify.md`
- [Money movement](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/money-movement.md) — `money-movement.md`

### G · Other named products & systems

- [How does chatgpt work](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-does-chatgpt-work.md) — `how-does-chatgpt-work.md`
- [How does a password manager such as 1password or lastpass work](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-does-a-password-manager-such-as-1password-or-lastpass-work.md) — `how-does-a-password-manager-such-as-1password-or-lastpass-work.md`
- [Is telegram secure](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/is-telegram-secure.md) — `is-telegram-secure.md`
- [How does google authenticator or other types of 2 factor authenticators work](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-does-google-authenticator-or-other-types-of-2-factor-authenticators-work.md) — `how-does-google-authenticator-or-other-types-of-2-factor-authenticators-work.md`
- [How do airtags work](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-do-airtags-work.md) — `how-do-airtags-work.md`
- [How does a vpn work](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-does-a-vpn-work.md) — `how-does-a-vpn-work.md`
- [Design stock exchange](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/design-stock-exchange.md) — `design-stock-exchange.md`
- [Low latency stock exchange](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/low-latency-stock-exchange.md) — `low-latency-stock-exchange.md`
- [How levelsfyi scaled to millions of users with google sheets](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-levelsfyi-scaled-to-millions-of-users-with-google-sheets.md) — `how-levelsfyi-scaled-to-millions-of-users-with-google-sheets.md`
- [How tiktok manages a 200k file frontend monorepo](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/how-tiktok-manages-a-200k-file-frontend-monorepo.md) — `how-tiktok-manages-a-200k-file-frontend-monorepo.md`
- [Fixing bugs automatically at meta scale](https://github.com/ByteByteGoHq/system-design-101/blob/main/data/guides/fixing-bugs-automatically-at-meta-scale.md) — `fixing-bugs-automatically-at-meta-scale.md`
