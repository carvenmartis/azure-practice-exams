import type { ExamNotes } from './types';

export const az204Notes: ExamNotes = [
  {
    area: 'Develop Azure compute solutions',
    notes: [
      ['App Service plan', 'Defines region, OS, VM size, instance count and pricing tier. All apps in the plan share its VMs and scale together. Free and Shared tiers cannot scale out.'],
      ['Deployment slots', 'Live environments with their own host name (such as staging). Swap with production for zero downtime and swap back to roll back. Standard, Premium or Isolated tier only.'],
      ['Sticky (slot) settings', 'App settings and connection strings marked as deployment slot settings stay with the slot when you swap.'],
      ['Autoscale', 'Scale out (more instances) by metric or schedule rules; scale up means a bigger tier. Autoscale needs Standard or higher.'],
      ['App settings', 'Exposed to the app as environment variables. WEBSITE_TIME_ZONE changes the default UTC time zone; WEBSITES_PORT tells App Service which port a custom container listens on.'],
      ['Azure Functions trigger', 'What starts a function, such as HTTP, timer, queue or blob. Every function has exactly one trigger.'],
      ['Bindings', 'Declarative input and output connections to other services, so you do not write SDK code. A function can have many bindings.'],
      ['Consumption plan', 'Pay per execution and GB-seconds, scales automatically (to 200 instances on Windows, 100 on Linux). Timeout 5 minutes by default, 10 maximum. Has cold starts.'],
      ['Flex Consumption plan', 'Serverless plan with scale to zero, always-ready instances against cold starts and VNet integration. Linux only.'],
      ['Premium plan', 'Prewarmed instances (no cold start), VNet integration, 30-minute default timeout and unlimited maximum.'],
      ['Dedicated plan', 'Runs functions in an App Service plan you already pay for; scaling is manual or autoscale.'],
      ['host.json and local.settings.json', 'host.json holds settings for all functions in the app; local.settings.json is only for local development and is not deployed.'],
      ['Durable Functions', 'Stateful orchestrations in code. Patterns: function chaining, fan-out/fan-in, async HTTP APIs, monitor and human interaction.'],
      ['Timer trigger', 'Runs on a six-field NCRONTAB expression: {second} {minute} {hour} {day} {month} {day-of-week}.'],
      ['ACI', 'Azure Container Instances: one container or container group on demand, no orchestrator, no autoscale.'],
      ['Azure Container Apps', 'Serverless microservices on Kubernetes with KEDA scaling (to zero), Dapr, revisions and traffic splitting.'],
      ['ACR', 'Azure Container Registry. az acr build builds and pushes an image in Azure (ACR Tasks). Geo-replication needs the Premium tier.'],
      ['Bicep loops', 'for-expressions deploy many resources or modules; they iterate over values known at deployment start, up to 800 iterations.']
    ]
  },
  {
    area: 'Develop for Azure storage',
    notes: [
      ['Cosmos DB partition key', 'Choose a property that never changes, has many distinct values and spreads storage and RU/s evenly. You cannot change it in place; copy to a new container.'],
      ['Logical vs physical partition', 'All items with the same partition key value form a logical partition (max 20 GB). Azure groups logical partitions onto physical partitions.'],
      ['RU', 'Request unit: the normalized cost of a database operation. A 1 KB point read costs about 1 RU. Throughput is provisioned in RU/s.'],
      ['Autoscale throughput', 'Scales instantly between 10% and 100% of the maximum RU/s you set (for example 100 to 1,000 RU/s).'],
      ['Consistency levels', 'From strongest to weakest: Strong, Bounded staleness, Session (default), Consistent prefix, Eventual. Stronger means higher latency and RU cost.'],
      ['Session consistency', 'The default level. A client reads its own writes within its session, through a session token.'],
      ['Change feed', 'An ordered log of inserts and updates per partition key. Read it with the change feed processor (needs a lease container) or an Azure Functions Cosmos DB trigger.'],
      ['Point read', 'Reading one item by id and partition key. The cheapest and fastest operation, it skips the query engine.'],
      ['Stored procedures and triggers', 'Server-side JavaScript in Cosmos DB that runs in a transaction scoped to one partition key.'],
      ['Blob types', 'Block blobs for files and objects, append blobs for logs, page blobs for VM disks (random read/write).'],
      ['Access tiers', 'Hot (frequent), Cool (30-day minimum), Cold (90-day minimum) and Archive (180-day minimum, offline, must be rehydrated).'],
      ['Blob metadata and properties', 'System properties (such as Content-Type and ETag) and user-defined metadata name-value pairs sent as x-ms-meta- headers.'],
      ['ETag and leases', 'Optimistic concurrency uses the ETag with If-Match. A lease is a lock for exclusive write or delete access (15 to 60 seconds or infinite).'],
      ['Storage redundancy', 'LRS (3 copies in one datacenter), ZRS (3 zones), GRS and GZRS (plus asynchronous copy in the paired region, possible data loss under 15 minutes). RA- adds read access to the secondary.'],
      ['General-purpose v2', 'The standard storage account type with all services and tiers. Upgrading from v1 is permanent.']
    ]
  },
  {
    area: 'Implement Azure security',
    notes: [
      ['Microsoft identity platform', 'Issues tokens to apps with OAuth 2.0 and OpenID Connect. An app registration defines the app; the service principal is its instance in a tenant.'],
      ['MSAL', 'Microsoft Authentication Library: acquires and caches tokens. Public client apps (desktop, mobile) cannot keep secrets; confidential clients (web apps, APIs) can.'],
      ['OAuth flows', 'Authorization code (with PKCE) for user sign-in, client credentials for app-only service calls, on-behalf-of for an API calling another API as the user, device code for devices without a browser.'],
      ['Scopes and consent', 'Delegated permissions act as the signed-in user; application permissions act as the app itself and need admin consent.'],
      ['Microsoft Graph', 'One REST endpoint (graph.microsoft.com) for Microsoft 365 data such as users, mail and files.'],
      ['Managed identity', 'An Entra identity for an Azure resource with no secrets to manage. System-assigned is tied to one resource and deleted with it; user-assigned is its own resource and can be shared.'],
      ['DefaultAzureCredential', 'Tries environment variables, managed identity and developer sign-ins in order, so the same code works locally and in Azure.'],
      ['Key Vault objects', 'Secrets (any sensitive string), keys (cryptographic keys that never leave the vault in plain text) and certificates.'],
      ['Key Vault soft delete', 'Deleted vaults and objects are kept 7 to 90 days (90 by default) and can be recovered. Cannot be turned off.'],
      ['Purge protection', 'Prevents permanent deletion until the retention period ends. Needs soft delete and cannot be disabled once on.'],
      ['Key Vault reference', 'An app setting like @Microsoft.KeyVault(SecretUri=...) that App Service or Functions resolve with the app managed identity.'],
      ['Azure App Configuration', 'Central store for settings and feature flags, with labels per environment. Not for secrets: reference Key Vault for those.'],
      ['Sentinel key', 'A single App Configuration key that the app watches; when it changes, the app reloads all settings at once.'],
      ['User delegation SAS', 'A SAS signed with Entra credentials, the most secure type, for Blob and Data Lake Storage.'],
      ['Service SAS and account SAS', 'Both signed with the account key. Service SAS covers one service; account SAS can span services and service-level operations.'],
      ['Stored access policy', 'Server-side SAS settings on a container, so you can revoke or change SAS tokens without rotating account keys.']
    ]
  },
  {
    area: 'Monitor, troubleshoot, and optimize Azure solutions',
    notes: [
      ['Metrics vs logs', 'Metrics are numbers at regular intervals in a time-series database; logs are records you query with KQL in Log Analytics.'],
      ['Application Insights', 'Application performance monitoring in Azure Monitor: requests, dependencies, exceptions, page views and custom telemetry.'],
      ['Sampling', 'Keeps only a percentage of telemetry to cut cost while keeping related items together. Adaptive sampling adjusts the rate automatically.'],
      ['Availability tests', 'Standard tests and URL ping tests call your endpoint from several regions and alert when it fails.'],
      ['Application Map', 'Shows the components of an app and the calls between them, with failure rates and durations.'],
      ['TrackEvent, TrackMetric, TrackDependency', 'SDK calls for custom events, custom metrics and calls to external services.'],
      ['Azure Cache for Redis', 'In-memory cache. Cache-aside pattern: read the cache, on a miss read the database and store the result with an expiry.'],
      ['Azure CDN and Front Door caching', 'Serve static content from edge locations. Purge to remove cached content before its time to live expires.']
    ]
  },
  {
    area: 'Connect to and consume Azure services and third-party services',
    notes: [
      ['Azure API Management', 'A gateway in front of your APIs: products, subscriptions (keys), developer portal and policies.'],
      ['APIM policies', 'XML in inbound, backend, outbound and on-error sections, for example rate-limit-by-key, quota, validate-jwt, set-header and cache-lookup.'],
      ['Event Grid', 'Serverless publish-subscribe for discrete events (such as BlobCreated), push delivery, at-least-once. Retries with exponential backoff up to 30 attempts or 24 hours.'],
      ['Event Hubs', 'Big data streaming: millions of events per second, partitions, consumer groups and retention. Read with checkpoints (Event Processor).'],
      ['Service Bus', 'Enterprise message broker: queues and topics, FIFO with sessions, transactions, duplicate detection and dead-lettering.'],
      ['Service Bus lock duration', 'PeekLock locks a message for 1 minute by default, up to 5 minutes. If not completed, it becomes visible again.'],
      ['Dead-letter queue (DLQ)', 'Built into every queue and subscription. Messages land there after the max delivery count (10 by default), on expiry if enabled, or when the app dead-letters them.'],
      ['Topics and subscriptions', 'Each subscription gets its own copy of every message; filters (SQL or correlation) choose which messages a subscription keeps.'],
      ['Storage queues', 'Simple queue in a storage account: messages up to 64 KB, default time to live 7 days, use when you need more than 80 GB of messages or a simple API.'],
      ['Service Bus vs Storage queues', 'Service Bus: messages up to 256 KB (100 MB in Premium), FIFO, sessions, transactions, duplicate detection. Storage queues: cheaper, simpler, larger total size.']
    ]
  }
];
