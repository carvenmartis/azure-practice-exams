import type { ExamNotes } from './types';

export const sc500Notes: ExamNotes = [
  {
    area: 'Manage identity, access, and governance',
    notes: [
      ['PIM', 'Privileged Identity Management: eligible assignments are activated just in time, with maximum duration, MFA, justification and approval.'],
      ['PIM for Groups', 'Eligible group membership or ownership, so roles granted to the group become time-bound.'],
      ['Authentication strengths', 'Conditional Access can demand specific methods. Phishing-resistant MFA allows only FIDO2 passkeys, Windows Hello for Business and certificate-based auth.'],
      ['Temporary Access Pass', 'A time-limited passcode that counts as strong authentication, used to onboard users so they can register passwordless methods.'],
      ['Enterprise application', 'The service principal of an app in your tenant. User assignment, Assignment required and consent grants live here.'],
      ['User consent settings', 'Allow user consent only for verified publishers and low-impact permissions, and turn on the admin consent workflow for the rest.'],
      ['Stopping a malicious app', 'Revoke its permission grants and disable sign-in for the enterprise app.'],
      ['Application vs delegated permissions', 'Application permissions apply tenant-wide with no user; delegated permissions are limited to what the signed-in user can access.'],
      ['Key Vault permission model', 'Azure RBAC is recommended. With access policies, anyone who can write to the vault (such as Key Vault Contributor) can grant themselves data access.'],
      ['Key Vault Secrets User', 'Least-privilege role for an app that only reads secret values.'],
      ['Key Vault protection', 'Soft delete (7 to 90 days) and purge protection. Azure SQL TDE with customer-managed keys requires both.'],
      ['Trusted Microsoft services', 'A Key Vault firewall exception that lets services such as Azure SQL reach the vault while other public traffic is blocked.'],
      ['Key rotation policy', 'Rotates a key automatically on a schedule, with expiry and notifications.'],
      ['Defender for Key Vault', 'Agentless detection of unusual vault access, such as from suspicious IP addresses.'],
      ['Policy remediation identity', 'Modify and DeployIfNotExists run as the assignment managed identity, which needs the roles in the policy roleDefinitionIds.'],
      ['Policy exemption', 'Excludes a scope with category Waiver or Mitigated and an optional expiry date.'],
      ['Role Based Access Control Administrator', 'Can assign roles, optionally with a condition limiting which roles and principal types; safer than Owner or User Access Administrator.'],
      ['Entra custom roles', 'Directory roles with specific permissions, such as updating app credentials, scoped to single app registrations.'],
      ['Backup protection', 'Always-on soft delete, immutable vaults in the Locked state, and multi-user authorization with a Resource Guard owned by the security team.'],
      ['Microsoft Security DevOps', 'Pipeline task that runs IaC scanners (Template Analyzer, Checkov) and reports to Defender for Cloud DevOps security.'],
      ['AKS access', 'Use Entra integration with Azure RBAC and disable local accounts.'],
      ['API Management validate-azure-ad-token', 'Policy that checks Entra tokens, audience and claims and rejects invalid requests.']
    ]
  },
  {
    area: 'Secure storage, databases, and networking',
    notes: [
      ['Deny vs DenyAction', 'Deny blocks non-compliant creates and updates; DenyAction blocks a specific action (currently DELETE).'],
      ['ReadOnly lock and keys', 'A ReadOnly lock blocks POST operations such as listKeys, so the portal cannot read blobs with key authorization.'],
      ['NotActions', 'Only removes permissions from that one role; another role can still grant them. Use deny assignments to block.'],
      ['Disallow Shared Key', 'Stops account key and key-signed SAS access; only Entra ID and user delegation SAS keep working.'],
      ['Revoking SAS', 'An ad hoc SAS is revoked only by rotating the signing key; a SAS tied to a stored access policy is revoked by changing or deleting the policy.'],
      ['Storage data roles', 'Storage Blob Data Reader, Contributor and Owner grant data-plane access; scope them to a container for least privilege.'],
      ['Resource instance rule', 'Lets a specific Azure resource instance (such as a Synapse workspace) through the storage firewall based on its managed identity.'],
      ['Defender for Storage', 'On-upload malware scanning (results in blob index tags and Event Grid) and sensitive data threat detection using Purview labels.'],
      ['Immutable storage', 'Time-based retention in WORM mode; lock the policy for regulatory compliance.'],
      ['Entra-only authentication', 'Disables SQL authentication on an Azure SQL server, including the SQL admin.'],
      ['Always Encrypted', 'Encrypts columns in the client so the database engine and DBAs never see plain text.'],
      ['SQL auditing', 'Server-level auditing covers every database; set both server and database auditing and the database is audited twice. Managed Instance uses a diagnostic setting plus CREATE SERVER AUDIT TO EXTERNAL_MONITOR.'],
      ['Vulnerability assessment', 'Express configuration is the default and needs no storage account.'],
      ['NSG processing', 'Lowest priority number first; processing stops at the first match. ASGs group NICs by role.'],
      ['Virtual Network Manager security admin rules', 'Evaluated before NSGs. Deny blocks regardless of NSGs; Always Allow skips NSG evaluation.'],
      ['Azure Firewall rule order', 'DNAT rules, then network rules, then application rules. FQDNs in network rules need DNS proxy.'],
      ['Azure Firewall Premium', 'Adds TLS inspection, signature-based IDPS and full URL filtering.'],
      ['Virtual WAN routing intent', 'A private traffic routing policy sends branch, VNet and inter-hub traffic through the hub firewall.'],
      ['Point-to-site with Entra ID', 'Only supported with the OpenVPN protocol, so Conditional Access can apply.'],
      ['Microsoft Entra Private Access', 'Part of Global Secure Access: publish private apps through connectors with per-app Conditional Access instead of VPN. Quick Access is the starting point.'],
      ['Private endpoint DNS', 'Link the privatelink private DNS zone (such as privatelink.blob.core.windows.net) to the client VNet.'],
      ['Private endpoint network policies', 'Must be enabled on the subnet for NSGs and UDRs to apply to private endpoint traffic.'],
      ['Private Link service', 'Exposes your own service behind a Standard Load Balancer to consumers in other tenants through private endpoints.'],
      ['App Service network isolation', 'Private endpoint for inbound traffic, VNet integration for outbound calls.'],
      ['Network Watcher', 'IP flow verify tests one 5-tuple against NSGs; effective security rules show all rules on a NIC.']
    ]
  },
  {
    area: 'Secure compute',
    notes: [
      ['Encryption at host', 'Encrypts temp disks and OS and data disk caches on the VM host, end to end.'],
      ['Trusted launch', 'Secure boot plus vTPM, with boot integrity monitoring through the Guest Attestation extension.'],
      ['Azure Bastion Premium', 'Adds session recording and private-only deployment.'],
      ['Just-in-time VM access', 'Defender for Servers Plan 2 feature that opens management ports only on request through NSG and Azure Firewall rules.'],
      ['Defender for Servers plans', 'Plan 1 includes Defender for Endpoint; Plan 2 adds JIT, agentless scanning, file integrity monitoring and more.'],
      ['Agentless scanning', 'Snapshots VM disks and scans them out of band with no agent or performance impact.'],
      ['Azure Arc', 'The Connected Machine agent makes on-premises and other-cloud servers Azure resources so Defender, Policy and machine configuration apply.'],
      ['Machine configuration modes', 'Audit, ApplyAndMonitor and ApplyAndAutoCorrect.'],
      ['Defender for Containers sensor', 'Collects runtime events on nodes; binary drift detection alerts when a container runs an executable not in its image.'],
      ['ACR network security', 'Private endpoints and firewall rules need the Premium SKU.'],
      ['WAF exclusions', 'Remove a specific request attribute from selected rules to fix false positives without weakening others.'],
      ['AI guardrails', 'Controls that set risks and intervention points (user input, tool call, tool response, output). An agent guardrail fully overrides the model guardrail.'],
      ['Defender for AI services', 'Threat protection for AI apps; turn on user prompt evidence to include suspicious prompt parts in alerts.'],
      ['APIM AI gateway policies', 'llm-token-limit enforces tokens per minute or quotas per key; llm-content-safety screens prompts with Azure AI Content Safety.'],
      ['Agent identity', 'Entra identities for AI agents. Conditional Access targets agent identities or the agent identity blueprint; sponsors can disable an agent identity.'],
      ['DSPM for AI', 'Microsoft Purview view of AI interactions and sensitive data in prompts, with one-click policies and weekly risk assessments.'],
      ['Oversharing controls', 'SharePoint data access governance reports and Restricted Content Discovery limit what Microsoft 365 Copilot can surface.']
    ]
  },
  {
    area: 'Manage and monitor security posture',
    notes: [
      ['Defender CSPM', 'The paid posture plan: attack path analysis, cloud security explorer, agentless secrets scanning and KQL custom recommendations.'],
      ['Regulatory compliance dashboard', 'Assign standards such as PCI DSS and see results mapped to their controls.'],
      ['Multicloud connectors', 'AWS uses a CloudFormation template; GCP uses a Cloud Shell script or Terraform. Arc can be auto-provisioned for servers.'],
      ['Defender EASM', 'External Attack Surface Management discovers internet-facing assets from seeds such as domains and IP blocks.'],
      ['Enabling plans at scale', 'Assign the built-in DeployIfNotExists policies at a management group so new subscriptions get Defender plans.'],
      ['Microsoft Sentinel', 'SIEM built on a Log Analytics workspace.'],
      ['Sentinel roles', 'Reader views, Responder manages incidents, Contributor creates rules. Automation Contributor on the playbook resource group lets automation rules run playbooks.'],
      ['Automation rules', 'Run on incident creation or update: assign owners, add tags and run playbooks in order.'],
      ['Content hub', 'Solutions install templates for analytics rules, connectors and workbooks; you still create rules from the templates.'],
      ['Data connectors with AMA', 'CEF via AMA uses a Linux forwarder and a DCR (CommonSecurityLog); Windows Security Events via AMA supports XPath filters; Windows Forwarded Events reads a WEC server.'],
      ['Custom logs', 'Tables ending in _CL, fed by the Logs Ingestion API through a data collection rule.'],
      ['Retention tiers', 'Analytics tier is typically kept 90 days; total retention in the data lake can be up to 12 years. Data lake tables lose real-time analytics and hunting.'],
      ['Microsoft Security Copilot', 'Generative AI for security. Owners manage plugins; contributors use it. Users also need permissions in each underlying service; the data location is fixed at creation.']
    ]
  }
];
