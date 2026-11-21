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
