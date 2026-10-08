import type { ExamNotes } from './types';

export const az104Notes: ExamNotes = [
  {
    area: 'Manage Azure identities and governance',
    notes: [
      ['Microsoft Entra ID', 'The cloud identity service (formerly Azure AD) that holds users, groups and app registrations and signs them in to Azure and Microsoft 365.'],
      ['Guest user (B2B)', 'An external person invited into your tenant. They sign in with their own account and get access through groups and roles like any user.'],
      ['Dynamic group', 'A group whose members are added and removed automatically by a rule on user or device attributes. Needs Entra ID P1.'],
      ['Administrative unit', 'A container in Entra ID that limits an admin role to a subset of users or groups, for example one department.'],
      ['SSPR', 'Self-service password reset. Users reset or unlock their own password after verifying with registered methods. Needs Entra ID P1 or P2 for on-premises writeback and group targeting.'],
      ['Management group hierarchy', 'Root management group > management groups (up to 6 levels) > subscriptions > resource groups > resources. Policies and roles assigned higher up are inherited below.'],
      ['Azure RBAC', 'Role-based access control: a role assignment is a security principal + role definition + scope. Permissions add up, and assignments are inherited by child scopes.'],
      ['Owner', 'Full access to manage resources and to assign roles to others.'],
      ['Contributor', 'Can create and manage all resources but cannot grant access to others.'],
      ['Reader', 'Can view resources but not change them or read secrets.'],
      ['User Access Administrator', 'Can manage role assignments (who has access) without managing the resources themselves.'],
      ['Custom role', 'A role you define with Actions, NotActions, DataActions and AssignableScopes when no built-in role fits.'],
      ['Azure Policy', 'Evaluates resource properties against rules and enforces them no matter who makes the change. RBAC controls who can act; Policy controls what the result may look like.'],
      ['Policy effects', 'Deny blocks the request, Audit only records non-compliance, Modify changes properties (such as tags), DeployIfNotExists deploys a missing setting, Append adds fields, DenyAction blocks one action such as delete.'],
      ['Initiative', 'A group of policy definitions assigned together (a policy set) with one compliance result.'],
      ['Remediation task', 'Applies DeployIfNotExists or Modify policies to resources that existed before the assignment. Needs a managed identity on the assignment.'],
      ['Resource lock', 'CanNotDelete allows changes but blocks deletion; ReadOnly blocks changes and deletion. Locks are inherited and the most restrictive one wins. They protect the control plane only, not data.'],
      ['Tags', 'Name and value pairs on resources, resource groups and subscriptions. Names are case-insensitive, values case-sensitive, and resources do not inherit tags from their group unless a policy adds them.'],
      ['Resource group', 'A container for resources that share a life cycle. Each resource is in exactly one group; deleting the group deletes everything in it. Its region only stores metadata.'],
      ['Moving resources', 'Resources can move between resource groups and subscriptions; both groups are locked during the move and the resource IDs change.'],
      ['Budget', 'A Cost Management threshold that sends alerts (and can trigger action groups) at set percentages. It never stops resources by itself.'],
      ['Azure Advisor', 'Free recommendations for cost, security, reliability, performance and operational excellence.']
    ]
  },
  {
    area: 'Implement and manage storage',
    notes: [
      ['LRS', 'Locally redundant storage: three copies in one datacenter. Cheapest, at least 11 nines durability, no protection from a datacenter outage.'],
      ['ZRS', 'Zone-redundant storage: three synchronous copies across availability zones in one region. Survives a zone failure.'],
      ['GRS / RA-GRS', 'Geo-redundant: LRS in the primary region plus an asynchronous copy (LRS) in the paired region. RA- adds read access to the secondary.'],
      ['GZRS / RA-GZRS', 'Geo-zone-redundant: ZRS in the primary region plus an asynchronous copy in the paired region. The highest durability (16 nines). RA- adds read access.'],
      ['Storage account types', 'Standard general-purpose v2 for almost everything; Premium block blobs, Premium file shares and Premium page blobs for low latency.'],
      ['Access tiers', 'Hot (frequent access), Cool (30-day minimum), Cold (90-day minimum) and Archive (180-day minimum, offline, must be rehydrated before reading).'],
      ['Rehydration', 'Moving an archived blob back to Hot or Cool. Standard priority can take up to 15 hours; high priority is faster and costs more.'],
      ['Lifecycle management', 'Rules that move blobs to cooler tiers or delete them after a number of days since last modified or last accessed.'],
      ['Account key', 'Full access to the whole storage account. Two keys exist so you can rotate one while using the other.'],
      ['Account SAS', 'A shared access signature signed with the account key that can cover several services in the account.'],
      ['Service SAS', 'A SAS signed with the account key for one service (blob, file, queue or table).'],
      ['User delegation SAS', 'A SAS signed with Microsoft Entra credentials instead of the account key. The recommended, most secure SAS, for Blob and Data Lake Storage.'],
      ['Stored access policy', 'Defines a SAS start, expiry and permissions on a container, so you can change or revoke those SAS tokens without rotating keys. Ad hoc SAS cannot be revoked except by rotating the key.'],
      ['Storage firewall', 'Network rules that allow only selected VNets (through service endpoints), public IP ranges, resource instances and trusted Microsoft services.'],
      ['Encryption at rest', 'Always on with AES-256, free, cannot be turned off. Microsoft-managed keys by default, or customer-managed keys in Key Vault.'],
      ['Azure Files', 'Managed SMB and NFS file shares. Identity-based access over SMB uses Kerberos from AD DS, Microsoft Entra Domain Services or Microsoft Entra Kerberos (one source per account).'],
      ['Azure File Sync', 'Syncs Azure file shares to Windows Servers, with cloud tiering to keep only hot files on premises. Storage Sync Service > sync group > cloud and server endpoints.'],
      ['Soft delete', 'Keeps deleted blobs, containers or file shares for a retention period (1 to 365 days) so they can be restored.'],
      ['Blob versioning', 'Keeps previous versions of a blob automatically each time it is overwritten.'],
      ['Object replication', 'Asynchronously copies block blobs between two storage accounts. Needs versioning on both and change feed on the source.'],
      ['Immutable storage', 'WORM (write once, read many) policies: time-based retention or legal hold, so blobs cannot be changed or deleted.'],
      ['AzCopy', 'Command-line tool to copy data to, from and between storage accounts. Storage Explorer is the desktop GUI.']
    ]
  },
  {
    area: 'Deploy and manage Azure compute resources',
    notes: [
      ['ARM template', 'A JSON file that declares resources for Azure Resource Manager. Deployments are idempotent; incremental mode (default) leaves other resources alone, complete mode deletes resources not in the template.'],
      ['Bicep', 'A simpler language that compiles to ARM JSON. Same deployment engine and features, with modules for reuse.'],
      ['Availability set', 'Spreads VMs over fault domains (shared power and network, up to 3) and update domains (rebooted together, up to 20). 99.95% SLA.'],
      ['Availability zone', 'A physically separate datacenter group in a region with its own power, cooling and network. VMs across two or more zones get a 99.99% SLA.'],
      ['VM Scale Sets', 'A group of load-balanced VMs that scale out and in by rules or schedule. Uniform mode uses identical VMs; Flexible mode allows mixed sizes, up to 1,000 instances.'],
      ['Resize a VM', 'Changing the size usually restarts the VM. If the size is not available on the current cluster you must deallocate it first.'],
      ['Managed disks', 'Standard HDD, Standard SSD, Premium SSD, Premium SSD v2 and Ultra Disk. The disk type sets IOPS, throughput and the SLA.'],
      ['Azure Disk Encryption vs encryption at host', 'Azure Disk Encryption uses BitLocker or DM-Crypt inside the OS with keys in Key Vault; encryption at host encrypts temp disk and caches on the host.'],
      ['VM extensions', 'Small agents for post-deployment tasks, such as the Custom Script Extension that runs a script on the VM.'],
      ['Azure Bastion', 'Browser-based RDP and SSH to VMs over TLS without public IP addresses on the VMs. Needs a subnet named AzureBastionSubnet.'],
      ['ACI', 'Azure Container Instances: run one container or container group quickly, no orchestration, billed per second.'],
      ['Azure Container Apps', 'Serverless containers with scale to zero, revisions and traffic splitting, built on Kubernetes and KEDA.'],
      ['ACR', 'Azure Container Registry: private registry for container images. Basic, Standard and Premium tiers; geo-replication needs Premium.'],
      ['App Service plan', 'The compute (region, OS, size, instance count) shared by all apps in it. Free and Shared tiers cannot scale out; autoscale starts at Standard.'],
      ['Deployment slots', 'Separate live environments of an app (such as staging) that you swap with production for zero downtime. Standard tier or higher.'],
      ['Slot setting', 'An app setting or connection string marked as sticky stays with its slot during a swap.']
    ]
  },
  {
    area: 'Implement and manage virtual networking',
    notes: [
      ['Virtual network (VNet)', 'Your private network in one region, split into subnets. Azure reserves 5 IP addresses in every subnet.'],
      ['NSG', 'Network security group: allow or deny rules on source, destination, port and protocol, attached to a subnet or NIC. Rules are stateful.'],
      ['NSG priority', 'Custom rules use 100 to 4096; the lowest number is checked first and the first match wins. Default rules (65000+) allow VNet and load balancer traffic and deny everything else inbound.'],
      ['ASG', 'Application security group: a named group of NICs (such as web servers) used as source or destination in NSG rules instead of IP addresses.'],
      ['Service tag', 'A Microsoft-maintained name for a set of IP prefixes, such as Internet, VirtualNetwork, AzureLoadBalancer or Storage, for use in NSG rules.'],
      ['VNet peering', 'Private, low-latency connection between two VNets over the Microsoft backbone, in the same region or globally. Not transitive and address spaces must not overlap.'],
      ['Gateway transit', 'Lets a peered spoke VNet use the hub VNet VPN or ExpressRoute gateway (Allow gateway transit on the hub, Use remote gateways on the spoke).'],
      ['UDR', 'User-defined route in a route table associated with a subnet. Overrides system routes, for example to send traffic to a firewall with next hop Virtual appliance.'],
      ['Next hop types', 'Virtual network gateway, Virtual network, Internet, Virtual appliance and None (drops the traffic).'],
      ['IP forwarding', 'Must be enabled on the NIC of a VM that acts as a router or network virtual appliance.'],
      ['Service endpoint', 'Extends the VNet identity to a PaaS service so its firewall can allow your subnet. Traffic stays on the backbone but the service keeps its public IP.'],
      ['Private endpoint', 'A NIC with a private IP from your subnet for one PaaS resource (Private Link). Needs private DNS so the name resolves to the private IP.'],
      ['Azure DNS', 'Hosts public DNS zones (delegate with NS records) and private DNS zones linked to VNets, with optional auto-registration of VM records.'],
      ['VPN Gateway', 'Encrypted IPsec tunnels over the internet. Site-to-site connects an on-premises network, point-to-site connects single computers. Needs a GatewaySubnet.'],
      ['ExpressRoute', 'A private connection to Azure through a connectivity provider, not over the internet, with higher bandwidth and predictable latency.'],
      ['Azure Load Balancer', 'Layer 4 (TCP/UDP) load balancing with health probes. Standard SKU is zone-redundant, secure by default and recommended; Basic is retired.'],
      ['Application Gateway', 'Layer 7 regional HTTP load balancer: path- and host-based routing, TLS termination, cookie affinity and an optional WAF.'],
      ['Traffic Manager', 'DNS-based global routing (priority, weighted, performance, geographic). Clients connect to endpoints directly.'],
      ['Azure Front Door', 'Global layer 7 entry point with anycast, caching, TLS offload and WAF for web apps.'],
      ['NAT gateway', 'Gives a subnet a fixed outbound public IP and many SNAT ports for outbound internet traffic.'],
      ['Network Watcher', 'Diagnostics: IP flow verify (is a packet allowed by NSGs), next hop, effective security rules, connection troubleshoot, packet capture and flow logs.']
    ]
  },
  {
    area: 'Monitor and maintain Azure resources',
    notes: [
      ['Azure Monitor', 'Collects metrics (numbers over time) and logs (records in a Log Analytics workspace) for all Azure resources.'],
      ['Log Analytics workspace', 'Stores log data that you query with KQL (Kusto Query Language).'],
      ['Diagnostic settings', 'Send a resource platform logs and metrics to a Log Analytics workspace, a storage account or an event hub.'],
      ['Alert rule', 'Scope + condition (metric, log query or activity log) + action group. Fires when the condition is met.'],
      ['Action group', 'Who to notify and what to run when an alert fires: email, SMS, push, voice, webhook, Logic App, Function or runbook.'],
      ['Activity log', 'Subscription-level record of control plane operations (who created, changed or deleted what), kept 90 days.'],
      ['VM insights', 'Performance and dependency maps for VMs, using the Azure Monitor agent and a data collection rule.'],
      ['Recovery Services vault', 'Holds backups of Azure VMs, SQL in VMs and Azure Files, plus Site Recovery replication. It must be in the same region as the VMs it backs up.'],
      ['Backup policy', 'Sets the backup schedule and how long daily, weekly, monthly and yearly recovery points are kept.'],
      ['Backup vault', 'Newer vault type for Azure Disks, Blobs, PostgreSQL and AKS backups.'],
      ['Soft delete for backups', 'Deleted backup data is kept 14 days by default so it can be recovered.'],
      ['Azure Site Recovery', 'Replicates VMs to another region (or on-premises machines to Azure) and fails them over during a disaster. RPO is how much data you can lose; RTO is how long recovery may take.']
    ]
  }
];
