/* ============================================================
   Boxes & Arrows — quiz bank
   One or two Duolingo-style checkpoints per lesson, grounded in
   the lesson content. Exposes QUIZ_BANK (also used by Review).
   Loaded after the course files and before app.js.
   ============================================================ */
(function(){
"use strict";
function C(t,ok,why){return{t:t,ok:!!ok,why:why||""};}
function Q(q,cs){return{q:q,choices:cs};}

var QUIZ_BANK={

/* ---------- Unit 01 · Foundations ---------- */
"request-lifecycle":[
 Q("Round-trip time (RTT) is set mainly by…",[
  C("how fast your server's CPU is",false,"RTT is a property of the network path, not the server."),
  C("distance and the network",true,"Distance and the network set RTT; a faster server can't beat physics."),
  C("the size of the response",false,"Size affects transfer time, but the round trip itself is distance and network."),
  C("the browser's cache",false,"Caching avoids the round trip rather than setting it.")]),
 Q("In the 'one slow query' case, where does the fix belong?",[
  C("the database",true,"The network was fine; the cost was a slow query — fix it with an index."),
  C("the load balancer",false,"The balancer was not the bottleneck."),
  C("the user's browser",false,"The browser was not the problem."),
  C("the CDN",false,"There was no static-asset issue.")])],
"latency-throughput":[
 Q("Plan to run at about what utilization at peak?",[
  C("90–95%",false,"Too tight — the hockey stick bites almost immediately."),
  C("60–70%",true,"Keep headroom so latency stays flat when a new request arrives."),
  C("30–40%",false,"Wasteful; you are paying for capacity you don't need."),
  C("100%",false,"At full utilization latency explodes.")])
],
"napkin-math":[
 Q("Handy shortcut: 1M requests per day ≈ how many requests per second?",[
  C("~12",true,"1,000,000 / 86,400 ≈ 12 rps."),
  C("~100",false,"That would be about 8.6M requests a day."),
  C("~1,000",false,"That would be about 86M requests a day."),
  C("~1M",false,"That is the daily figure, not per second.")])
],
/* ---------- Unit 02 · Scaling ---------- */
"vertical-horizontal":[
 Q("Why is scaling up (vertical) a good first move?",[
  C("It removes the single point of failure",false,"One bigger box is still one box."),
  C("Zero code changes and nothing new to operate",true,"A great first move while it is cheap and simple."),
  C("It scales writes without limit",false,"Vertical scaling has a hard ceiling."),
  C("It is always cheaper than scaling out",false,"At the top of the range the price grows faster than the power.")])
],
"load-balancing":[
 Q("Which strategy sends each request to the server with the fewest active connections?",[
  C("Round robin",false,"Round robin takes turns without looking at busyness."),
  C("Least connections",true,"It looks at how busy each server actually is."),
  C("IP hash",false,"IP hash pins a client to one server, not the least busy one."),
  C("Power of two choices",false,"That picks two at random and uses the less busy — a different trick.")])
],
"stateless":[
 Q("What is the recommended fix for state in a horizontally scaled system?",[
  C("Sticky sessions on every server",false,"Sticky users can't be moved and each server becomes a small SPOF."),
  C("Move the state out to a shared store or a token",true,"Then any server can serve any request."),
  C("Keep state in memory and hope for the best",false,"Every other server is then useless for that user."),
  C("Disable autoscaling",false,"That gives up the benefit you scaled out for.")])
],
"caching":[
 Q("A cache stampede happens when…",[
  C("the cache is too small",false,"Size affects hit rate, not a stampede."),
  C("a popular key expires and many requests all try to refill it at once",true,"Let one request refill it (single-flight) so the rest wait."),
  C("the database is down",false,"That is a different failure."),
  C("two keys collide",false,"Collisions are not a stampede.")])
],
"cdn":[
 Q("Why give every asset version a new name (a content hash)?",[
  C("to make the files smaller",false,"Hashing does not compress."),
  C("so updates appear immediately despite long TTLs",true,"A new URL is a new cache key, so the new logo shows up at once."),
  C("to hide the asset from users",false,"The opposite — it is a public URL."),
  C("to reduce the number of requests",false,"It does not change request count.")])
],
/* ---------- Unit 03 · Data & Storage ---------- */
"sql-nosql":[
 Q("In ACID, the 'I' stands for…",[
  C("Isolated",true,"No half-done views of another transaction."),
  C("Indexed",false,"Indexes are separate from ACID."),
  C("Immutable",false,"Not part of ACID."),
  C("Immediate",false,"Durability covers the 'saved' promise.")])
],
"indexes":[
 Q("A table with 6 indexes performs how many writes per insert?",[
  C("1",false,"That would ignore the indexes."),
  C("6",false,"The table row itself is also written."),
  C("7",true,"Six index updates plus the table row."),
  C("12",false,"Only the indexes you defined are maintained.")])
],
"storage-engines":[
 Q("What does the write-ahead log (WAL) give you?",[
  C("Faster reads",false,"The WAL is about not losing writes."),
  C("Durability — committed writes survive a crash",true,"After a crash the engine replays the log."),
  C("Compression",false,"Not its job."),
  C("Automatic sharding",false,"Not its job.")])
],
"replication":[
 Q("Sending reads to followers does NOT help which workload?",[
  C("Read-heavy",false,"That is exactly what followers help."),
  C("Write-heavy",true,"Every write still goes through one leader."),
  C("Reporting",false,"Followers can carry heavy read scans."),
  C("Global reads",false,"Followers in other regions help read latency.")])
],
"sharding":[
 Q("A shard key must spread…",[
  C("only the data",false,"Traffic matters as much as data."),
  C("both the data and the traffic",true,"Otherwise you get hot spots."),
  C("only the traffic",false,"Data must also be spread."),
  C("the indexes",false,"Indexes follow the data.")])
],
"consistent-hashing":[
 Q("Adding a server with consistent hashing moves about…",[
  C("all of the keys",false,"That is hash % N when N changes."),
  C("1/N of the keys — the minimum possible",true,"Only the arc the new server takes over moves."),
  C("half of the keys",false,"Far more than necessary."),
  C("none of the keys",false,"Some keys must move to use the new server.")])
],
"unique-ids":[
 Q("Why put the time at the front of an id (e.g. UUIDv7)?",[
  C("to make the id unguessable",false,"Randomness gives secrecy, not order."),
  C("so ids sort by creation time and the index stays append-friendly",true,"New ids land at the right edge of the B-tree."),
  C("to make the id smaller",false,"It does not shrink the id."),
  C("to remove the need for a primary key",false,"You still need a key.")])
],
"cap":[
 Q("When a network partition happens, CAP forces a choice between…",[
  C("consistency and availability",true,"You can be right or reachable, not both, during a split."),
  C("cost and latency",false,"That is a different trade-off."),
  C("durability and throughput",false,"Not the CAP trade-off."),
  C("security and scale",false,"Not the CAP trade-off.")])
],
"consensus":[
 Q("In consensus, nothing counts without…",[
  C("a majority (quorum)",true,"The minority side gives up so the data stays consistent."),
  C("every node answering",false,"That would make the system fragile."),
  C("the fastest node",false,"Speed is irrelevant."),
  C("a wall-clock timestamp",false,"Nodes must not compare clocks.")])
],
"transactions":[
 Q("ACID's 'I' (isolation) is best described as…",[
  C("a switch that is always on",false,"A transaction alone does not stop races."),
  C("a dial — an isolation level you choose",true,"Read committed, repeatable read, serializable…"),
  C("a constraint on the schema",false,"Constraints are a separate safety net."),
  C("a property of the network",false,"Isolation is a database behaviour.")])
],
"files":[
 Q("Where do file bytes belong?",[
  C("In the database, next to the facts",false,"Shipping megabytes through the database is expensive."),
  C("In object storage; the facts stay in the database",true,"The standard split."),
  C("On each server's local disk",false,"Local disk disappears for every other server."),
  C("In the browser's cache",false,"That is not durable storage.")])
],
/* ---------- Unit 04 · Communication ---------- */
"apis":[
 Q("GraphQL shines when…",[
  C("you need strict typing inside the data centre",false,"That is gRPC's strength."),
  C("many different clients each need slightly different data",true,"Each client asks for exactly what it needs."),
  C("you want the simplest possible contract",false,"REST is simpler to start with."),
  C("browsers must call it without a proxy",false,"gRPC, not GraphQL, has that browser limitation.")])
],
"queues":[
 Q("A queue turns 'too much work right now' into…",[
  C("'a bit more waiting later'",true,"That is load levelling."),
  C("'the work disappears'",false,"A queue buys time, not capacity."),
  C("'faster responses'",false,"It often adds a little latency."),
  C("'stronger consistency'",false,"Queues are about decoupling, not consistency.")])
],
"pubsub":[
 Q("Queue vs topic?",[
  C("Queue: 'someone do this.' Topic: 'this happened.'",true,"A queue assigns work; a topic announces a fact."),
  C("Queue: 'this happened.' Topic: 'someone do this.'",false,"That is the reverse."),
  C("They are the same thing",false,"They differ in who consumes."),
  C("Queues are faster",false,"Speed is not the distinction.")])
],
"realtime":[
 Q("Use WebSockets when…",[
  C("the client talks back often (chat, games, collaborative editing)",true,"You need a two-way, long-lived connection."),
  C("data changes slowly (a build status)",false,"Plain polling is fine there."),
  C("you only ever send one-way updates",false,"Server-Sent Events cover one-way streams."),
  C("you need the simplest fallback",false,"Long polling is the simple fallback.")])
],
/* ---------- Unit 05 · Reliability ---------- */
"redundancy":[
 Q("Two 99.9% copies in parallel give about…",[
  C("99.9%",false,"Parallel copies multiply failure chances."),
  C("99.9999% on paper",true,"Real pairs do worse because failover takes time and copies share risks."),
  C("99.95%",false,"That is the cautious real-world figure for a pair."),
  C("100%",false,"Nothing is 100%.")])
],
"rate-limiting":[
 Q("The token bucket has two numbers:",[
  C("bucket size (bursts) and refill rate (long-run average)",true,"Two knobs, easy to explain."),
  C("CPU and memory",false,"Those are capacity, not rate limiting."),
  C("latency and throughput",false,"Not the bucket's knobs."),
  C("connections and threads",false,"Not the bucket's knobs.")])
],
"timeouts-retries":[
 Q("Only retry errors that…",[
  C("are 400 Bad Request",false,"Retrying a 400 just fails again."),
  C("might succeed next time (timeouts, 503s)",true,"Transient faults are worth another try."),
  C("are authentication failures",false,"Those will keep failing."),
  C("happened more than once",false,"Repetition is not the criterion.")])
],
"observability":[
 Q("Metrics tell you something is wrong; traces show where; logs explain…",[
  C("why",true,"You need all three."),
  C("who",false,"Identity is part of the story, not the third pillar's role."),
  C("when",false,"The timeline is in the metrics/traces."),
  C("how much it cost",false,"Cost is a separate concern.")])
],
/* ---------- Unit 06 · Architecture ---------- */
"microservices":[
 Q("Split a system by…",[
  C("technical layer (a 'database service', a 'UI service')",false,"That just moves the coupling around."),
  C("business capability",true,"Each service owns a coherent area of the business."),
  C("team size",false,"Team shape follows the split, not the reverse."),
  C("programming language",false,"Language is not a boundary.")])
],
"service-discovery":[
 Q("Instances come and go, so…",[
  C("write addresses into config",false,"Any config address goes stale."),
  C("use a service registry",true,"Instances register and heartbeat; callers look them up."),
  C("give every service a fixed IP",false,"Autoscaling breaks that."),
  C("restart everything on change",false,"That is not discovery.")])
],
"sagas":[
 Q("A saga trades…",[
  C("availability for isolation",false,"It trades isolation for availability — the reverse."),
  C("isolation for availability",true,"No locks are held across services; the system is briefly between states."),
  C("consistency for cost",false,"Not the saga trade-off."),
  C("latency for durability",false,"Not the saga trade-off.")])
],
"batch-stream":[
 Q("Batch answers 'what happened?'. Stream processing answers…",[
  C("'what is happening?'",true,"Compute as events arrive."),
  C("'what will happen?'",false,"That is prediction, not stream processing."),
  C("'who did it?'",false,"Audit, not streaming."),
  C("'how much did it cost?'",false,"Cost analysis, not streaming.")])
],
/* ---------- Unit 07 · Security ---------- */
"authentication":[
 Q("Store passwords as…",[
  C("MD5 or SHA-256",false,"Fast hashes are the wrong tool — a GPU tries billions per second."),
  C("a slow, salted hash (bcrypt/Argon2)",true,"Slow and salted resists cracking."),
  C("plain text, encrypted at rest",false,"Assume the database leaks."),
  C("a reversible cipher",false,"Reversible means stealable.")])
],
"authorization":[
 Q("Hiding a button in the UI is…",[
  C("authorization",false,"Attackers call your API directly."),
  C("not authorization — check ownership on every request",true,"Check server-side, every time."),
  C("a complete security model",false,"Far from it."),
  C("the same as a random id",false,"A random id helps but is no substitute for the check.")])
],
"encryption":[
 Q("A secret that touched git should be treated as…",[
  C("safe, if the repo is private",false,"History, forks and laptops keep it."),
  C("compromised",true,"Rotate it."),
  C("fine after 30 days",false,"No amount of time un-leaks it."),
  C("only a problem if it was a password",false,"Any secret counts.")])
],
/* ---------- Unit 08 · Shipping ---------- */
"testing":[
 Q("The test pyramid warns against…",[
  C("mostly unit tests",false,"That is the wide base you want."),
  C("mostly end-to-end tests",true,"An upside-down pyramid is slow and flaky."),
  C("any integration tests",false,"The middle layer matters."),
  C("testing at all",false,"The opposite of the lesson.")])
],
"cicd":[
 Q("Build once, promote…",[
  C("the same artifact",true,"Never rebuild for production — you might ship a different program."),
  C("a fresh build for each environment",false,"That is the anti-pattern."),
  C("only the config",false,"Config is not the artifact."),
  C("whatever is fastest",false,"Speed is not the point.")])
],
/* ---------- Unit 09 · Whole Systems ---------- */
"hld-lld":[
 Q("A good high-level design fits on…",[
  C("one page",true,"If a box needs a paragraph, that belongs in its LLD."),
  C("a 40-page document",false,"Too deep for an HLD."),
  C("a whiteboard only",false,"It should be written down."),
  C("as many diagrams as possible",false,"Brevity is the point.")])
],
"design-url-shortener":[
 Q("A shortener's reads dominate, so…",[
  C("cache them",true,"100 reads per write says cache."),
  C("shard more",false,"Reads are not the sharding problem."),
  C("compress the URLs",false,"Not the bottleneck."),
  C("use a column store",false,"Not the point.")])
],
"design-news-feed":[
 Q("When reads far outnumber writes, move the work to…",[
  C("write time",true,"Push posts to followers when they are written."),
  C("read time",false,"That is the slow first draft."),
  C("a nightly batch",false,"Feeds need to be fresh."),
  C("the client",false,"The client just renders.")])
],
"design-chat":[
 Q("Chat's real protocol is…",[
  C("store, then sync",true,"Live delivery is only an optimisation that makes the sync sooner."),
  C("live delivery only",false,"A tunnel breaks that."),
  C("polling only",false,"Too slow for chat."),
  C("fire and forget",false,"Messages must arrive.")])
],
/* ---------- Unit 10 · Design Judgement ---------- */
"guarantees-tradeoffs":[
 Q("A design doc that opens with Kafka and Kubernetes is missing…",[
  C("the guarantees",true,"Start with what the system promises and what happens when it breaks."),
  C("the diagrams",false,"Diagrams come after the guarantees."),
  C("the cost estimate",false,"Cost is one of the guarantees."),
  C("the team list",false,"Not the missing piece.")])
],
"consistency-in-practice":[
 Q("Which is NOT one of the six promises?",[
  C("Latency",false,"One of the six."),
  C("Popularity",true,"Popularity is not a system guarantee."),
  C("Availability",false,"One of the six."),
  C("Durability",false,"One of the six.")])
],
"scaling-judgement":[
 Q("Vertical first, then horizontal: scale the … tier.",[
  C("stateless",true,"Keep state in one careful place."),
  C("database",false,"The database is the careful place."),
  C("cache",false,"Caches scale separately."),
  C("CDN",false,"The CDN is already distributed.")])
],
/* ---------- Unit 11 · Networking & the Edge ---------- */
"tcp-udp":[
 Q("Use UDP when…",[
  C("every byte must arrive, in order",false,"That is TCP."),
  C("late data is worse than lost data",true,"Live video, voice, game state."),
  C("you are sending a file",false,"Files need every byte."),
  C("you need a handshake",false,"UDP has none.")])
],
"dns":[
 Q("In a DNS lookup, who does the legwork?",[
  C("the recursive resolver",true,"It chases referrals and caches the answer."),
  C("the root server",false,"Roots only point to TLDs."),
  C("the authoritative server",false,"It gives the final answer but does no legwork."),
  C("the browser's cache only",false,"The cache helps, but the resolver does the work.")])
],
"proxies":[
 Q("A reverse proxy hides…",[
  C("the client from the servers",false,"That is a forward proxy."),
  C("the servers from the clients",true,"Clients only ever see the proxy."),
  C("the load balancer",false,"A reverse proxy can be a load balancer."),
  C("DNS",false,"Unrelated.")])
],
"api-gateway":[
 Q("The gateway's composition job is to…",[
  C("fan out to services and return one response",true,"One client call instead of many."),
  C("replace the database",false,"No."),
  C("generate API keys only",false,"That is one small feature."),
  C("cache every request",false,"Caching is one feature, not the point.")])
],
/* ---------- Unit 12 · Patterns & Data Modelling ---------- */
"idempotency":[
 Q("Which operation is idempotent?",[
  C("balance += 10",false,"Each repeat changes the result."),
  C("set email = a@example.com",true,"Same result every time."),
  C("create a new row",false,"Each call creates another row."),
  C("advance to the next status",false,"Each call moves it again.")])
],
"circuit-breaker":[
 Q("In the OPEN state, the breaker…",[
  C("passes calls through and counts failures",false,"That is CLOSED."),
  C("fails fast and makes no calls",true,"It protects the sick service and the callers."),
  C("lets every request through",false,"That is CLOSED."),
  C("shuts down the service",false,"It stops calling, not the service.")])
],
"backpressure":[
 Q("A bounded queue that is full should…",[
  C("keep growing in memory",false,"That is the trap."),
  C("reject new work with 503",true,"The queued jobs keep good throughput."),
  C("drop the oldest jobs silently",false,"Silent drops are worse."),
  C("restart the consumer",false,"Not the answer.")])
],
"event-sourcing":[
 Q("Event sourcing stores…",[
  C("the current state, overwritten each time",false,"That is a normal update."),
  C("every change in an append-only log",true,"State is derived by replaying events."),
  C("only the last event",false,"You need the whole history."),
  C("events for communication between services",false,"That is EDA, a different idea.")])
],
"normalization":[
 Q("Normalization removes…",[
  C("redundancy and anomalies",true,"Each fact lives in one place."),
  C("joins",false,"Normalization creates the need for joins."),
  C("primary keys",false,"Keys remain."),
  C("the schema",false,"It shapes the schema.")])
],
"geohashing":[
 Q("Two locations with a longer shared geohash prefix are…",[
  C("farther apart",false,"The opposite."),
  C("closer together",true,"Proximity becomes a prefix match."),
  C("in different time zones",false,"Unrelated."),
  C("exactly the same point",false,"A shared prefix means nearby, not identical.")])
],

/* ---------- Unit 13 · Build the Giants: Messaging ---------- */
"whatsapp":[
 Q("A message is stored before it is put on the sync queue. Why?",[
  C("so the sender's ack can be sent sooner",false,"That is a useful side effect, not the reason."),
  C("so no consumer sees a message the store does not have",true,"Publish only after the commit — the queue must never get ahead of the record."),
  C("so the sequencing service can be skipped",false,"The ID is assigned before the write."),
  C("so push notifications are guaranteed",false,"Push stays best-effort even with a durable queue.")]),
 Q("Bob is offline when Alice sends. What happens to the message?",[
  C("It is dropped and retried next time Bob opens the app",false,"It is never dropped — it is already in the store."),
  C("It waits in Alice's phone until Bob is seen online",false,"A phone is an endpoint, not the authority."),
  C("It stays in the store and Bob replays from the last ID he saw",true,"Push is a hint; the message log is the truth."),
  C("The sequencer holds it for Bob's next socket",false,"The sequencer only assigns order.")])
],
"discord-messages":[
 Q("Why move off Cassandra at trillion-message scale?",[
  C("Cassandra could not store that many rows",false,"Capacity was not the wall — predictability was."),
  C("Reads were costly, compaction and GC pauses hurt p99, and upkeep got expensive",true,"The LSM read path plus compaction, pauses and maintenance compounded."),
  C("Cassandra lost the channel data model",false,"The compatible engine kept that model."),
  C("MongoDB became cheaper again",false,"MongoDB was the store before Cassandra.")]),
 Q("Why partition messages by channel and time bucket?",[
  C("so each message can be indexed by its author",false,"That is not the hot read."),
  C("so 'newest N in this channel' is one contiguous scan",true,"Key the store for the read you do most often."),
  C("so the messages can be encrypted",false,"Encryption is independent of partitioning."),
  C("so every read fans out across every bucket",false,"You want the opposite of that.")])
],
"slack-message":[
 Q("Which server decides which Channel Server owns a channel?",[
  C("WebApp",false,"WebApp is the client API."),
  C("Admin Server, with consistent hashing on the channel ID",true,"Mapping channel IDs to owners is the Admin Server's job."),
  C("Gateway Server",false,"Gateways hold device subscriptions, not channel ownership."),
  C("Envoy",false,"Envoy is the edge proxy.")]),
 Q("Why WebSocket rather than SSE for a chat client?",[
  C("SSE cannot push from server to browser",false,"SSE does push — it is just one-way."),
  C("WebSocket is full duplex, so both sides can send with low latency",true,"Chat needs replies and pushes over one cheap channel."),
  C("WebSocket needs no connection upgrade",false,"It begins with an upgrade."),
  C("SSE is not supported in browsers",false,"It is supported; the limitation is direction.")])
],

/* ---------- Unit 14 · Build the Giants: Media ---------- */
"youtube-uploads":[
 Q("Why did YouTube build VCUs instead of just adding more general-purpose servers?",[
  C("VCUs are cheap, off-the-shelf parts",false,"Custom silicon is an investment, not a bargain-bin component."),
  C("Encoding is one narrow, enormous job, and VCUs do it far more efficiently",true,"Hardware built for transcoding delivered the reported 20–33× efficiency gain."),
  C("VCUs remove the need to store several renditions",false,"The ladder still has to be produced and stored."),
  C("Software cannot produce 720p or 4K at all",false,"Software can — the problem was cost and speed.")]),
 Q("Why transcode an upload into a ladder of resolutions and bitrates?",[
  C("so every device downloads the same number of bytes",false,"The whole point is that the renditions differ in size."),
  C("so the player can pick a rung that suits its screen and connection",true,"Renditions are the raw material of adaptive bitrate playback."),
  C("so the original source file can be deleted immediately",false,"The source is usually kept as well."),
  C("so the CDN does not have to cache the video",false,"CDNs cache the renditions — that is how they stay fast.")])
],
"live-streaming":[
 Q("Why cut a live video into segments only a few seconds long?",[
  C("so each piece can be fetched quickly and recovered from a hiccup",true,"Short, keyframe-aligned segments give fast start and quick recovery."),
  C("to make the video smaller on disk",false,"Compression does that; segmentation does not."),
  C("to avoid producing multiple bitrates",false,"Several bitrates are produced alongside segmentation."),
  C("to remove the need for a CDN",false,"Segments are exactly what CDNs distribute to viewers.")]),
 Q("A viewer's bandwidth drops mid-broadcast. What keeps the stream playing?",[
  C("the server resends the whole video at a lower resolution",false,"There is no finished video in a live stream — only recent segments."),
  C("the player switches to a lower-bitrate rung listed in the manifest",true,"Adaptive bitrate streaming is built from the ladder made during encoding."),
  C("the CDN grows the buffer until bandwidth returns",false,"A bigger buffer adds delay rather than fixing the drop."),
  C("the viewer switches from HLS to RTC",false,"RTC is for conversations, not broadcast delivery.")])
],
"netflix-caching":[
 Q("Which EVCache use makes the cache the only store read online?",[
  C("Lookaside caching",false,"In lookaside, the database is still the source of truth."),
  C("Precomputed home pages written nightly and read as a primary store",true,"The home page is built offline, and online services only read EVCache."),
  C("Playback session state",false,"Sessions are transient state shared across services."),
  C("UI strings and translations",false,"Those are async-published, high-volume data — not the whole read path.")]),
 Q("In a lookaside cache, what happens when a key is missing?",[
  C("the request fails until somebody refills the cache",false,"The request continues to the backend."),
  C("the service reads the database and fills the cache for next time",true,"Miss → backend service → database → cache fill."),
  C("the cache silently returns an empty home page",false,"That is the failure mode of a primary-store cache, not a lookaside one."),
  C("the viewer is redirected to another region",false,"Regions do not fix a cache miss.")])
],

/* ---------- Unit 15 · Build the Giants: Social & Mail ---------- */
"twitter-for-you":[
 Q("Why cut roughly 500 million candidate tweets down to about 1,500 before ranking?",[
  C("so the ranking model can see only posts from people you follow",false,"Follow graph is only one candidate source — the cut is about cost, not ownership."),
  C("the expensive scorer can only afford a small pool, and cheap rules can remove obvious non-candidates first",true,"Global filtering throws away most of the pool so the neural ranker sees a manageable set."),
  C("because a neural network cannot process more than 1,500 inputs at all",false,"The limit is a latency and cost choice, not a hard model limit."),
  C("so that ads can be inserted before the tweets are scored",false,"Ads are injected at the final mixing stage, after ranking.")]),
 Q("A ranked feed is dominated by the same author and the same story. Which stage should fix that?",[
  C("candidate sourcing",false,"Sourcing adds choices; it does not remove repetition from the chosen set."),
  C("feature hydration",false,"Hydration gathers signals for scoring; it does not enforce variety."),
  C("diversity filtering, which caps repeated authors and near-duplicate content",true,"That is exactly the job of the second filtering stage."),
  C("global filtering",false,"Global filtering happens before ranking and checks eligibility, not variety.")])
],
"design-gmail":[
 Q("Alice sends a message to Bob's Gmail address. How does Bob's client normally read it?",[
  C("SMTP pushes it from Gmail straight onto Bob's screen",false,"SMTP moves mail between servers; clients retrieve it another way."),
  C("through IMAP or POP3, pulling from the mailbox stored on Gmail's servers",true,"Retrieval is a pull from a mailbox that has already been filled."),
  C("by querying DNS MX records each time it opens",false,"MX records tell senders where to deliver, not recipients how to read."),
  C("the message waits in Alice's client until Bob comes online",false,"The sender's server accepts and stores it; Alice can go offline.")]),
 Q("The next mail server is down for an hour. What should the sending MTA do?",[
  C("drop the message and ask Alice to send it again",false,"A mail server queues and retries rather than discarding accepted mail."),
  C("deliver it to a CDN edge instead",false,"CDNs are not part of the SMTP relay path here."),
  C("hold it in a durable queue and retry until it can be accepted",true,"Store-and-forward makes an outage a delay, not a loss."),
  C("forward it to Bob's phone directly over IMAP",false,"IMAP is a retrieval protocol to a client, not a relay mechanism.")])
],
"reddit-architecture":[
 Q("Why are votes and link submissions sent through RabbitMQ instead of being handled inline?",[
  C("so the request returns quickly and workers can absorb bursts and retry expensive work",true,"The guide describes expensive operations being deferred to async job workers."),
  C("because Postgres cannot store votes at all",false,"Postgres is Reddit's core data store; the queue is about load and latency."),
  C("so that Fastly can cache the vote response at the edge",false,"A CDN caches reads, not user writes."),
  C("because GraphQL Federation requires a message queue",false,"Federation and the write path are independent choices.")]),
 Q("What problem does Debezium's change data capture solve in Reddit's stack?",[
  C("it replaces Postgres with Cassandra for core entities",false,"The two stores coexist for different workloads."),
  C("it compresses memcached entries so more fit in memory",false,"Compression is not what CDC is for."),
  C("it streams database changes so caches and replicas stay consistent after a write",true,"CDC publishes changes from the source database instead of relying on multiple coordinated writes."),
  C("it authenticates GraphQL queries from mobile apps",false,"Authentication is not the role of CDC.")])
],

/* ---------- Unit 16 · Mobility & Commerce ---------- */
"uber-api-layer":[
 Q("In the guide’s first-generation Uber architecture, what did the dispatch service do?",[
  C("It stored the long-term records of users and trips",false,"That was the API service’s job."),
  C("It connected a rider with a driver",true,"The dispatch service did the live rider–driver match."),
  C("It was the all-encompassing API gateway",false,"The single gateway belongs to the second generation."),
  C("It indexed nearby restaurants with geohash",false,"Geohash belongs to the separate proximity guide.")
 ]),
 Q("Why does the proximity guide encode locations as geohash prefixes?",[
  C("So a radius search can use an index instead of computing distance to every row",true,"Prefix lookups shrink the candidate set before any precise distance work."),
  C("Because latitude and longitude cannot be stored in a SQL database",false,"They can; the problem is the cost of scanning all of them."),
  C("To make every grid cell hold roughly the same number of restaurants",false,"The guide explicitly notes that skew between dense and empty cells remains."),
  C("To remove the need for any distance calculation at all",false,"An exact distance check is still applied to the finalists.")
 ])
],
"airbnb-soa":[
 Q("Which Airbnb service role is the entry point for all reads and writes of a data entity?",[
  C("The data service",true,"Data services sit at the bottom layer and own the entity."),
  C("The derived data service",false,"Derived services read from data services and apply light logic."),
  C("The middle-tier service",false,"The middle tier holds logic that does not fit at the data layers."),
  C("The presentation service",false,"Presentation services aggregate results for clients.")
 ]),
 Q("What had to happen before Airbnb could eliminate the Monorail?",[
  C("All reads and writes had to move to the new services",true,"The guide says the monolith was removed after the full migration."),
  C("It had to be kept on as a read replica",false,"Keeping a second owner for the same data is the problem, not the fix."),
  C("Every service had to be rewritten in Ruby on Rails",false,"Rails was the old monolith, not a migration requirement."),
  C("The gateway had to be moved inside it",false,"The gateway fronts the services; it is not part of the monolith.")
 ])
],
"ecommerce-workflow":[
 Q("In the e-commerce workflow, what happens just before the customer pays?",[
  C("Order management reserves stock in the inventory system",true,"The guide reserves stock first and then takes payment."),
  C("Transportation ships the parcel",false,"The outbound order comes after payment."),
  C("The promotion system defines coupons",false,"Promotions are set up earlier, before the customer orders."),
  C("Procurement settles invoices with suppliers",false,"That is a separate business-area flow.")
 ]),
 Q("In Amazon’s Brazil build system, what is a version set?",[
  C("A private collection of package versions for a package and its dependencies",true,"Version sets give teams an isolated space for their dependency choices."),
  C("A list of planned release dates",false,"It is a collection of package versions, not a schedule."),
  C("The ARM build target",false,"ARM is one of the platforms the package builder supports."),
  C("The public CI schedule for master commits",false,"The public default space is called ‘live’, not a version set.")
 ])
]
};

/* Expose for the app (Review) and inject checkpoints into every lesson. */
var G=(typeof window!=="undefined")?window:globalThis;
if(G)G.QUIZ_BANK=QUIZ_BANK;
if(typeof COURSE_LESSONS!=="undefined"){
  Object.keys(QUIZ_BANK).forEach(function(id){
    var L=COURSE_LESSONS[id];if(!L||!L.steps)return;
    var qs=QUIZ_BANK[id].map(function(q,i){
      return {short:"Check",chapter:"quiz",title:"Quick check",qk:id+"#"+i,quiz:q};
    });
    var idx=L.steps.length;
    if(L.steps.length&&L.steps[L.steps.length-1].chapter==="recap")idx=L.steps.length-1;
    L.steps.splice.apply(L.steps,[idx,0].concat(qs));
  });
}
})();
