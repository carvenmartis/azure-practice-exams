import type { ExamNotes } from './types';

export const az304Notes: ExamNotes = [
  {
    area: 'Design identity, governance, and monitoring solutions',
    notes: [
      ['Management groups', 'Organize subscriptions into a hierarchy (up to 6 levels below the root) so policy and RBAC are applied once and inherited.'],
      ['Azure landing zone', 'A pre-designed environment (management groups, policies, networking, identity) that new workloads are deployed into.'],
      ['Azure Policy vs RBAC', 'RBAC decides who can do something; Policy decides what resources may look like, whoever creates them.'],
      ['Initiative', 'A set of policy definitions assigned together, for example a regulatory compliance standard.'],
      ['Microsoft Entra Conditional Access', 'If-then rules on sign-in: who, which app, device, location and risk decide whether to allow, block or require MFA. Needs Entra ID P1.'],
      ['PIM', 'Privileged Identity Management: just-in-time, time-limited and approved activation of admin roles. Needs Entra ID P2.'],
      ['Access reviews', 'Periodic reviews where owners or users confirm who still needs group, app or role access. Entra ID Governance or P2.'],
      ['Entitlement management', 'Access packages that bundle groups, apps and sites, with request, approval and expiry, also for external users.'],
      ['Identity Protection', 'Detects user and sign-in risk and can force a password change or MFA. Needs P2.'],
      ['Microsoft Entra B2B vs External ID for customers', 'B2B invites partners as guests into your tenant; External ID (formerly Azure AD B2C) gives customer-facing apps their own sign-up and sign-in.'],
      ['Managed identity', 'Identity for Azure resources with no secrets to store; the recommended way for apps to call Azure services.'],
      ['Azure Key Vault', 'Stores secrets, keys and certificates. Use RBAC, soft delete and purge protection; Managed HSM for FIPS 140-2 Level 3 single-tenant keys.'],
      ['Log Analytics workspace design', 'Prefer as few workspaces as possible; split by region for data residency or by team when access must be separated.'],
      ['Azure Monitor', 'Metrics, logs, alerts, workbooks and insights. Diagnostic settings route platform logs to a workspace, storage or Event Hubs.'],
      ['Microsoft Sentinel', 'Cloud SIEM and SOAR on top of a Log Analytics workspace.']
    ]
  },
  {
    area: 'Design data storage solutions',
    notes: [
      ['Azure SQL Database', 'Fully managed PaaS SQL Server engine, single databases or elastic pools. Best for new cloud apps.'],
      ['Azure SQL Managed Instance', 'Nearly 100% SQL Server compatible PaaS (SQL Agent, cross-database queries, CLR), in your VNet. Best for lift-and-shift.'],
      ['SQL Server on Azure VM', 'IaaS with full OS and SQL control, for features PaaS does not support.'],
      ['DTU vs vCore', 'DTU bundles compute, memory and IO in fixed sizes; vCore lets you choose compute and storage separately and use Azure Hybrid Benefit.'],
      ['Service tiers', 'General Purpose (remote storage), Business Critical (local SSD, built-in replicas, read scale-out) and Hyperscale (up to 128 TB, fast scaling).'],
      ['Serverless compute', 'vCore SQL Database tier that autoscales and auto-pauses when idle, billed per second.'],
      ['Elastic pool', 'Many databases share a pool of resources, good for many databases with varied, unpredictable usage.'],
      ['Cosmos DB', 'Globally distributed NoSQL with single-digit millisecond latency, five consistency levels and multi-region writes.'],
      ['Cosmos DB APIs', 'NoSQL, MongoDB, Cassandra, Gremlin (graph) and Table. Choose based on the existing app or data model.'],
      ['Azure Table Storage', 'Cheap key-value NoSQL storage in a storage account, without global distribution.'],
      ['Data Lake Storage Gen2', 'Blob Storage with hierarchical namespace for big data analytics and POSIX-style ACLs.'],
      ['Blob access tiers', 'Hot, Cool (30 days), Cold (90 days), Archive (180 days, offline). Lifecycle rules move data automatically.'],
      ['Storage redundancy', 'LRS, ZRS, GRS, GZRS and their read-access variants. Zone redundancy protects against a zone failure; geo against a region failure.'],
      ['Azure Data Factory', 'Cloud ETL and data integration: pipelines copy and transform data from many sources. Self-hosted integration runtime reaches on-premises data.'],
      ['Azure Synapse Analytics', 'Data warehousing (dedicated SQL pools) and big data analytics in one workspace.'],
      ['Azure Databricks', 'Apache Spark-based analytics and machine learning platform.'],
      ['Transparent Data Encryption', 'Encrypts SQL databases at rest, on by default; Always Encrypted protects columns so even DBAs cannot read them.'],
      ['Dynamic data masking', 'Hides sensitive values in query results for non-privileged users without changing the stored data.']
    ]
  },
  {
    area: 'Design business continuity solutions',
    notes: [
      ['RPO', 'Recovery point objective: the maximum amount of data, measured in time, you can afford to lose.'],
      ['RTO', 'Recovery time objective: the maximum time a service may be down before it is restored.'],
      ['SLA composition', 'Services that depend on each other multiply their SLAs, so the combined SLA is lower than each one alone. Redundant copies raise it.'],
      ['Availability zones', 'Separate datacenters in a region. Zone-redundant services survive a zone failure; zonal resources are pinned to one zone.'],
      ['Region pairs', 'Regions paired for geo-replication and staggered platform updates, such as East US and West US.'],
      ['Azure Backup', 'Backs up VMs, SQL and SAP HANA in VMs, Azure Files, blobs and disks to Recovery Services or Backup vaults.'],
      ['Azure Site Recovery', 'Replicates VMs to another region or on-premises machines to Azure, with recovery plans for orchestrated failover.'],
      ['Active geo-replication', 'Readable secondary copies of an Azure SQL database in other regions, with manual failover.'],
      ['Failover groups', 'Group databases (or a managed instance) for automatic failover to another region, with a listener endpoint that does not change.'],
      ['Cosmos DB multi-region', 'Replicate to more regions for reads; enable multi-region writes or service-managed failover for high availability.'],
      ['Active-active vs active-passive', 'Active-active serves traffic in several regions at once; active-passive keeps a standby region that takes over on failure.'],
      ['Backup redundancy', 'Recovery Services vault storage can be LRS, ZRS or GRS; Cross Region Restore lets you restore in the paired region.'],
      ['Soft delete and immutable vaults', 'Protect backups from accidental or malicious deletion.']
    ]
  },
  {
    area: 'Design infrastructure solutions',
    notes: [
      ['Compute decision', 'VMs for full control, App Service for web apps, Functions for event-driven code, Container Apps for serverless containers, AKS for full Kubernetes control.'],
      ['AKS', 'Managed Kubernetes. Node pools, cluster autoscaler, Azure CNI networking and Workload ID for pod identities.'],
      ['Azure Batch', 'Runs large-scale parallel and high-performance computing jobs on pools of VMs.'],
      ['Azure Virtual Desktop', 'Windows desktops and apps hosted in Azure, with multi-session Windows 11.'],
      ['Hub-and-spoke', 'Shared services (firewall, gateway, Bastion) in a hub VNet, workloads in peered spoke VNets.'],
      ['Azure Virtual WAN', 'Microsoft-managed hub-and-spoke for many branches and regions, with built-in routing.'],
      ['ExpressRoute vs VPN', 'ExpressRoute is a private connection with predictable performance; VPN Gateway uses encrypted tunnels over the internet. VPN can back up ExpressRoute.'],
      ['Load balancing choice', 'Global HTTP: Front Door. Global non-HTTP: Traffic Manager (DNS). Regional HTTP: Application Gateway. Regional TCP/UDP: Load Balancer.'],
      ['Azure Firewall', 'Managed stateful firewall with network and application rules, threat intelligence and, in Premium, TLS inspection and IDPS.'],
      ['WAF', 'Web application firewall on Front Door or Application Gateway against OWASP attacks such as SQL injection.'],
      ['Private Link vs service endpoints', 'Private endpoints give a PaaS resource a private IP in your VNet and work from on-premises; service endpoints only let a subnet through the service firewall.'],
      ['DDoS Protection', 'Network Protection (per VNet) or IP Protection (per public IP) adds tuned mitigation and cost protection beyond the free basic level.'],
      ['Messaging choice', 'Service Bus for business transactions, Event Grid for reactive events, Event Hubs for telemetry streams, Storage queues for simple, large queues.'],
      ['API Management', 'Gateway for publishing, securing and throttling APIs, with a developer portal.'],
      ['Migration tools', 'Azure Migrate discovers and assesses servers, databases and web apps; Azure Database Migration Service moves databases.'],
      ['Cloud Adoption Framework', 'Microsoft guidance for strategy, plan, ready, adopt, govern and manage in the cloud.'],
      ['Well-Architected Framework', 'Five pillars: reliability, security, cost optimization, operational excellence and performance efficiency.']
    ]
  }
];
