import type { ExamNotes } from './types';

export const ai200Notes: ExamNotes = [
  {
    area: 'Develop containerized solutions on Azure',
    notes: [
      ['ACR', 'Azure Container Registry: private registry for images and OCI artifacts. Geo-replication needs Premium.'],
      ['ACR Tasks', 'Build, test and push images in Azure (az acr build), triggered by commits, schedules or base image updates.'],
      ['AcrPull', 'The role that lets a cluster or app pull images. az aks update --attach-acr grants it to the AKS kubelet identity.'],
      ['Azure Container Apps', 'Serverless containers on Kubernetes, KEDA and Envoy, with revisions, traffic splitting and scale to zero.'],
      ['Container Apps environment', 'The secure boundary for a group of apps: shared virtual network and log destination.'],
      ['Revision modes', 'Single revision mode replaces the old revision; multiple revision mode keeps several active and splits traffic by percentage.'],
      ['Default scale rule', 'Without a rule, Container Apps uses HTTP scaling from 0 to 10 replicas. Custom rules poll every 30 seconds with a 300-second cooldown before scaling to zero.'],
      ['KEDA scalers', 'Scale on event sources such as Service Bus queue length; the rule can authenticate with a managed identity.'],
      ['Container Apps jobs', 'Run tasks to completion: manual, scheduled or event-driven.'],
      ['Kubernetes Deployment', 'Keeps a desired number of pod replicas through a ReplicaSet and performs rolling updates.'],
      ['Readiness vs liveness probe', 'Readiness decides if a pod gets traffic (wait until the model is loaded); liveness restarts a stuck container.'],
      ['HPA', 'Horizontal Pod Autoscaler. CPU targets are a percentage of the requested CPU, so pods need resource requests.'],
      ['kubectl troubleshooting', 'kubectl describe pod shows events like ErrImagePull; kubectl logs --previous shows the log of the last crashed container.'],
      ['WEBSITES_PORT', 'App Service setting that tells it which port a custom container listens on.']
    ]
  },
  {
    area: 'Develop AI solutions by using Azure data management services',
    notes: [
      ['Cosmos DB consistency', 'Strong, Bounded staleness, Session (default), Consistent prefix, Eventual. Eventual has the lowest latency and RU cost.'],
      ['Partition key', 'Pick high cardinality and even spread of reads, writes and storage. Hierarchical partition keys allow up to three levels, such as tenantId then userId.'],
      ['Point read', 'Read by id and partition key: the cheapest operation, it skips the query engine.'],
      ['Autoscale throughput', 'Scales between 10% and 100% of the maximum RU/s instantly.'],
      ['Indexing policy', 'Every property is indexed by default; exclude paths you never query to save RUs on writes.'],
      ['Cosmos DB vector search', 'Needs a container vector embedding policy (path, dimensions, data type, distance) and a vector index on that path. Policies cannot be changed in place.'],
      ['Vector index types', 'flat (exact, up to 505 dimensions), quantizedFlat (up to about 50,000 vectors) and diskANN (large scale). quantizedFlat and diskANN need at least 1,000 vectors.'],
      ['VectorDistance', 'Cosmos DB function for similarity. Use SELECT TOP N ... ORDER BY VectorDistance(...) so only the nearest items return.'],
      ['float16 vectors', 'Halve vector storage compared with float32, with a small accuracy cost.'],
      ['Change feed', 'Ordered log of changes per partition key. Latest version mode misses deletes; all versions and deletes mode needs continuous backup. The processor uses a lease container.'],
      ['pgvector', 'PostgreSQL extension (enabled as vector) with the vector type and HNSW and IVFFlat indexes, up to 2,000 indexed dimensions.'],
      ['pgvector operators', '<=> cosine distance, <-> Euclidean (L2) distance, <#> negative inner product.'],
      ['HNSW vs IVFFlat tuning', 'Raise hnsw.ef_search or ivfflat.probes for better recall. Create IVFFlat after loading data. Index builds use maintenance_work_mem.'],
      ['pg_diskann and azure_ai', 'pg_diskann adds DiskANN indexes; azure_ai lets SQL call Azure OpenAI, for example azure_openai.create_embeddings.'],
      ['PgBouncer', 'Built-in connection pooling for Azure Database for PostgreSQL to avoid running out of connections.'],
      ['Azure Managed Redis', 'In-memory cache. Set a TTL on keys, invalidate keys on updates (cache-aside) and use RediSearch for vector and semantic caching.'],
      ['RediSearch rules', 'Modules are chosen when the cache is created and RediSearch requires the NoEviction policy.'],
      ['Semantic cache', 'Returns a stored answer for a similar prompt. Raise the similarity threshold if wrong answers are reused.']
    ]
  },
  {
    area: 'Connect to and consume Azure services',
    notes: [
      ['Service Bus queue', 'Durable messaging with competing consumers, locks and dead-lettering. Standard supports 256 KB messages; Premium supports larger ones.'],
      ['Topic and subscriptions', 'Every subscription gets a copy of each message and can filter with rules.'],
      ['PeekLock', 'Locks a message while you process it; complete on success, abandon to retry. After 10 failed deliveries by default it is dead-lettered.'],
      ['Sessions', 'Group messages by session ID (such as order ID) for ordered processing by one receiver at a time.'],
      ['Duplicate detection', 'Drops messages whose MessageId was seen within a configured time window.'],
      ['Event Grid', 'Push-based events (such as BlobCreated) to handlers, with filters on event type and subject. Retries for up to 30 attempts or 24 hours; dead-lettering needs a blob container.'],
      ['Event Grid delivery', 'Waits 30 seconds for a response before retrying, so handlers must cope with duplicates. 400 and 413 responses are not retried.'],
      ['Event Hubs', 'High-throughput event streaming with partitions and retention.'],
      ['Azure Functions basics', 'Exactly one trigger per function, any number of input and output bindings. host.json holds settings for all functions.'],
      ['Flex Consumption plan', 'Scale to zero, always-ready instances, VNet integration (subnet delegated to Microsoft.App/environments). No deployment slots; C# only with the isolated worker; blob trigger only with the Event Grid source.'],
      ['Function auth levels', 'anonymous, function (needs a function key in x-functions-key or ?code=) and admin.'],
      ['Durable Functions fan-out/fan-in', 'Start activities in parallel, wait for all and combine the results with checkpointing.']
    ]
  },
  {
    area: 'Secure, monitor, and troubleshoot Azure solutions',
    notes: [
      ['Azure Key Vault', 'Stores secrets with access control, auditing and versions. Apps read it with a managed identity and the Key Vault Secrets User role.'],
      ['Key Vault reference', 'App setting syntax @Microsoft.KeyVault(SecretUri=...) resolved by App Service or Functions with the app identity.'],
      ['Soft delete and purge protection', 'Deleted secrets are kept 7 to 90 days (90 by default) and can be recovered; purge protection blocks permanent deletion during that time.'],
      ['Azure App Configuration', 'Central key-values and feature flags. Labels give one key a value per environment; a sentinel key triggers a refresh of all settings.'],
      ['Feature flag targeting filter', 'Turns a feature on for specific users, groups or a percentage of users.'],
      ['DefaultAzureCredential', 'Tries environment, managed identity and developer sign-ins in order, so the same code works locally and in Azure.'],
      ['Workload ID', 'Federates a Kubernetes service account with a managed identity so pods get tokens without stored secrets.'],
      ['OpenTelemetry', 'Vendor-neutral traces, metrics and logs. The Azure Monitor OpenTelemetry Distro sets up export to Application Insights in one call.'],
      ['Trace context', 'W3C traceparent headers carry the trace ID between services so all spans join one end-to-end trace.'],
      ['KQL basics', 'requests | where success == false | summarize count() by operation_Name, bin(timestamp, 5m) | render timechart. percentile() for p95; join on operation_Id to correlate.'],
      ['Application Insights transaction view', 'Shows a request and each dependency call with durations, to find slow downstream services.'],
      ['Sampling', 'Keeps a representative share of telemetry while preserving whole traces, to cut ingestion cost.']
    ]
  }
];
