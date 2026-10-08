/** One functional group of an exam's official "skills measured" outline. */
export interface SkillArea {
  name: string;
  /** Share of the exam, e.g. '20–25%'. */
  weight: string;
  /** The second-level skills Microsoft lists under this area. */
  skills: string[];
  /**
   * Lowercase terms that place a question in this area. Each term matches
   * at the start of a word, so 'container' also matches 'containers'.
   */
  keywords: string[];
}

export interface ExamGuide {
  slug: string;
  /** Official Microsoft Learn study guide for the exam. */
  studyGuide: string;
  /** Microsoft Learn exam page with the training paths and course. */
  examPage: string;
  /** Free Microsoft practice assessment, where Microsoft offers one. */
  practiceAssessment?: string;
  /** Shown above the outline, e.g. when the exam has been retired. */
  note?: string;
  areas: SkillArea[];
}

const studyGuideBase = 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/';
const examPageBase = 'https://learn.microsoft.com/en-us/credentials/certifications/exams/';

function practiceAssessment(code: string, assessmentId: number) {
  return `${examPageBase}${code}/practice/assessment?assessment-type=practice&assessmentId=${assessmentId}`;
}

/**
 * Skills outlines and links from the Microsoft Learn study guides (checked
 * October 2026). Weakest topics and the study mode topic filter use the area names,
 * so renaming an area starts its history over.
 */
export const examGuides: ExamGuide[] = [
  {
    slug: 'az-104',
    studyGuide: `${studyGuideBase}az-104`,
    examPage: `${examPageBase}az-104`,
    practiceAssessment: practiceAssessment('az-104', 21),
    areas: [
      {
        name: 'Manage Azure identities and governance',
        weight: '20–25%',
        skills: [
          'Manage Microsoft Entra users and groups',
          'Manage access to Azure resources',
          'Manage Azure subscriptions and governance'
        ],
        keywords: ['entra', 'azure ad', 'azure active directory', 'user', 'group', 'guest', 'rbac', 'role', 'azure policy', 'policy', 'policies', 'management group', 'subscription', 'tag', 'resource lock', 'lock', 'resource group', 'budget', 'cost', 'administrative unit', 'self-service password', 'sspr', 'licens', 'initiative', 'owner', 'contributor', 'reader']
      },
      {
        name: 'Implement and manage storage',
        weight: '15–20%',
        skills: [
          'Configure access to storage',
          'Configure and manage storage accounts',
          'Configure Azure Files and Azure Blob Storage'
        ],
        keywords: ['storage', 'blob', 'azure files', 'file share', 'file sync', 'shared access signature', 'sas', 'lrs', 'zrs', 'grs', 'gzrs', 'ra-grs', 'ra‑grs', 'lifecycle', 'azcopy', 'access tier', 'archive tier', 'cool tier', 'hot tier', 'object replication', 'immutab', 'soft delete', 'access key']
      },
      {
        name: 'Deploy and manage Azure compute resources',
        weight: '20–25%',
        skills: [
          'Automate deployment of resources by using ARM templates or Bicep files',
          'Create and configure virtual machines',
          'Provision and manage containers in the Azure portal',
          'Create and configure Azure App Service'
        ],
        keywords: ['virtual machine', 'vm', 'scale set', 'vmss', 'availability set', 'availability zone', 'arm template', 'template', 'bicep', 'container instance', 'aci', 'container app', 'container registry', 'acr', 'app service', 'web app', 'deployment slot', 'slot', 'disk', 'extension', 'custom script', 'resize', 'image']
      },
      {
        name: 'Implement and manage virtual networking',
        weight: '15–20%',
        skills: [
          'Configure and manage virtual networks in Azure',
          'Configure secure access to virtual networks',
          'Configure name resolution and load balancing'
        ],
        keywords: ['virtual network', 'vnet', 'subnet', 'nsg', 'network security group', 'application security group', 'peering', 'vpn', 'expressroute', 'load balancer', 'application gateway', 'dns', 'private endpoint', 'private link', 'service endpoint', 'bastion', 'route table', 'user-defined route', 'udr', 'azure firewall', 'public ip', 'ip address', 'nat gateway', 'traffic manager', 'front door']
      },
      {
        name: 'Monitor and maintain Azure resources',
        weight: '10–15%',
        skills: ['Monitor resources in Azure', 'Implement backup and recovery'],
        keywords: ['azure monitor', 'monitor', 'log analytics', 'alert', 'metric', 'diagnostic', 'kql', 'kusto', 'application insights', 'network watcher', 'connection monitor', 'action group', 'workbook', 'backup', 'recovery services', 'site recovery', 'restore', 'snapshot', 'vm insights']
      }
    ]
  },
  {
    slug: 'az-204',
    studyGuide: `${studyGuideBase}az-204`,
    examPage: `${examPageBase}az-204`,
    practiceAssessment: practiceAssessment('az-204', 35),
    note: 'Microsoft retired AZ‑204 on July 31, 2026. This is the last published outline.',
    areas: [
      {
        name: 'Develop Azure compute solutions',
        weight: '25–30%',
        skills: [
          'Implement containerized solutions',
          'Implement Azure App Service Web Apps',
          'Implement Azure Functions'
        ],
        keywords: ['container', 'docker', 'acr', 'aci', 'app service', 'web app', 'deployment slot', 'slot', 'autoscal', 'scale out', 'function', 'trigger', 'binding', 'durable', 'consumption plan', 'premium plan', 'app setting', 'kudu', 'webjob', 'bicep', 'arm template']
      },
      {
        name: 'Develop for Azure storage',
        weight: '15–20%',
        skills: [
          'Develop solutions that use Azure Cosmos DB',
          'Develop solutions that use Azure Blob Storage'
        ],
        keywords: ['cosmos', 'partition key', 'consistency', 'change feed', 'request unit', 'ru/s', 'blob', 'storage account', 'lifecycle', 'access tier', 'metadata', 'lease', 'blobserviceclient', 'stored procedure']
      },
      {
        name: 'Implement Azure security',
        weight: '15–20%',
        skills: [
          'Implement user authentication and authorization',
          'Implement secure Azure solutions'
        ],
        keywords: ['microsoft identity platform', 'entra', 'azure ad', 'msal', 'oauth', 'openid', 'token', 'consent', 'scope', 'graph', 'shared access signature', 'sas', 'key vault', 'managed identit', 'app configuration', 'secret', 'certificate', 'authenticat', 'authoriz', 'service principal', 'app registration']
      },
      {
        name: 'Monitor, troubleshoot, and optimize Azure solutions',
        weight: '5–10%',
        skills: ['Monitor and troubleshoot solutions by using Azure Monitor Application Insights'],
        keywords: ['application insights', 'availability test', 'telemetry', 'azure monitor', 'log analytics', 'alert', 'metric', 'kql', 'trace', 'cache', 'redis', 'cdn', 'front door']
      },
      {
        name: 'Connect to and consume Azure services and third-party services',
        weight: '20–25%',
        skills: [
          'Implement Azure API Management',
          'Develop event-based solutions',
          'Develop message-based solutions'
        ],
        keywords: ['api management', 'apim', 'policy', 'policies', 'subscription key', 'gateway', 'event grid', 'event hub', 'service bus', 'queue', 'topic', 'dead-letter', 'dead letter', 'message', 'event']
      }
    ]
  },
  {
    slug: 'az-400',
    studyGuide: `${studyGuideBase}az-400`,
    examPage: `${examPageBase}az-400`,
    practiceAssessment: practiceAssessment('az-400', 56),
    areas: [
      {
        name: 'Design and implement processes and communications',
        weight: '10–15%',
        skills: [
          'Design and implement traceability and flow of work',
          'Design and implement appropriate metrics and queries for DevOps',
          'Configure collaboration and communication'
        ],
        keywords: ['work item', 'azure boards', 'boards', 'kanban', 'sprint', 'backlog', 'wiki', 'dashboard', 'cycle time', 'lead time', 'velocity', 'burndown', 'webhook', 'teams', 'slack', 'traceab', 'mermaid', 'release notes', 'github projects', 'issue', 'process template', 'agile', 'scrum']
      },
      {
        name: 'Design and implement a source control strategy',
        weight: '10–15%',
        skills: [
          'Design and implement branching strategies for the source code',
          'Configure and manage repositories'
        ],
        keywords: ['branch', 'merge', 'pull request', 'git', 'repo', 'trunk', 'gitflow', 'rebase', 'squash', 'cherry', 'commit', 'lfs', 'large file', 'monorepo', 'submodule', 'codeowners', 'fork', 'scalar']
      },
      {
        name: 'Design and implement build and release pipelines',
        weight: '50–55%',
        skills: [
          'Design and implement a package management strategy',
          'Design and implement a testing strategy for pipelines',
          'Design and implement pipelines',
          'Design and implement deployments',
          'Design and implement infrastructure as code (IaC)',
          'Maintain pipelines'
        ],
        keywords: ['pipeline', 'yaml', 'stage', 'job', 'agent', 'artifact', 'feed', 'package', 'nuget', 'npm', 'semver', 'semantic version', 'test', 'code coverage', 'github actions', 'workflow', 'deployment', 'blue-green', 'blue/green', 'canary', 'ring', 'feature flag', 'slot', 'release', 'approval', 'gate', 'environment', 'template', 'bicep', 'arm', 'terraform', 'desired state', 'dsc', 'infrastructure as code', 'iac', 'container', 'kubernetes', 'aks', 'helm', 'build', 'cache', 'trigger', 'retention']
      },
      {
        name: 'Develop a security and compliance plan',
        weight: '10–15%',
        skills: [
          'Design and implement authentication and authorization methods',
          'Design and implement a strategy for managing sensitive information in automation',
          'Automate security and compliance scanning'
        ],
        keywords: ['service principal', 'managed identit', 'service connection', 'personal access token', 'pat', 'workload identity', 'oidc', 'federat', 'permission', 'security group', 'key vault', 'secret', 'variable group', 'secure file', 'credential', 'dependabot', 'codeql', 'code scanning', 'secret scanning', 'advanced security', 'defender', 'license', 'vulnerab', 'sast', 'dast', 'compliance', 'policy']
      },
      {
        name: 'Implement an instrumentation strategy',
        weight: '5–10%',
        skills: [
          'Configure monitoring for a DevOps environment',
          'Analyze metrics from instrumentation'
        ],
        keywords: ['azure monitor', 'monitor', 'application insights', 'log analytics', 'kql', 'telemetry', 'alert', 'metric', 'vm insights', 'container insights', 'distributed tracing', 'trace', 'availability test']
      }
    ]
  },
  {
    slug: 'az-304',
    studyGuide: `${studyGuideBase}az-305`,
    examPage: `${examPageBase}az-305`,
    practiceAssessment: practiceAssessment('az-305', 15),
    note: 'AZ‑304 has been retired and replaced by AZ‑305: Designing Microsoft Azure Infrastructure Solutions. This is the current AZ‑305 outline, which covers the same design topics.',
    areas: [
      {
        name: 'Design identity, governance, and monitoring solutions',
        weight: '25–30%',
        skills: [
          'Design solutions for logging and monitoring',
          'Design authentication and authorization solutions',
          'Design governance'
        ],
        keywords: ['entra', 'azure ad', 'identity', 'identities', 'b2b', 'b2c', 'external id', 'conditional access', 'multifactor', 'mfa', 'privileged identity', 'pim', 'rbac', 'role', 'managed identit', 'key vault', 'policy', 'policies', 'management group', 'subscription', 'tag', 'blueprint', 'landing zone', 'governance', 'monitor', 'log analytics', 'application insights', 'diagnostic', 'alert', 'sentinel']
      },
      {
        name: 'Design data storage solutions',
        weight: '20–25%',
        skills: [
          'Design data storage solutions for relational data',
          'Design data storage solutions for semi-structured and unstructured data',
          'Design data integration'
        ],
        keywords: ['sql', 'database', 'cosmos', 'storage', 'blob', 'data lake', 'table storage', 'azure files', 'redundan', 'lrs', 'zrs', 'grs', 'data factory', 'synapse', 'databricks', 'stream analytics', 'elastic pool', 'hyperscale', 'dtu', 'vcore', 'transparent data encryption', 'always encrypted', 'access tier', 'archive']
      },
      {
        name: 'Design business continuity solutions',
        weight: '15–20%',
        skills: [
          'Design solutions for backup and disaster recovery',
          'Design for high availability'
        ],
        keywords: ['backup', 'disaster recovery', 'site recovery', 'rpo', 'rto', 'failover', 'geo-replication', 'auto-failover', 'failover group', 'high availability', 'availability zone', 'availability set', 'paired region', 'sla', 'resilien', 'restore', 'self heal', 'self-heal', 'bcdr', 'business continuity']
      },
      {
        name: 'Design infrastructure solutions',
        weight: '30–35%',
        skills: [
          'Design compute solutions',
          'Design an application architecture',
          'Design migrations',
          'Design network solutions'
        ],
        keywords: ['virtual machine', 'vm', 'scale set', 'app service', 'function', 'container', 'kubernetes', 'aks', 'batch', 'logic app', 'service bus', 'event grid', 'event hub', 'api management', 'cache', 'redis', 'migrat', 'azure migrate', 'data box', 'virtual network', 'vnet', 'subnet', 'vpn', 'expressroute', 'virtual wan', 'load balancer', 'application gateway', 'front door', 'traffic manager', 'firewall', 'private endpoint', 'private link', 'peering', 'dns', 'nsg', 'scale out', 'scale-out', 'partition', 'coordination', 'managed service', 'evolution', 'design for operations', 'build for business', 'microservice', 'loose', 'cqrs', 'event sourcing', 'design principle', 'cloud-adoption', 'cloud adoption']
      }
    ]
  },
  {
    slug: 'ai-103',
    studyGuide: `${studyGuideBase}ai-103`,
    examPage: `${examPageBase}ai-103`,
    areas: [
      {
        name: 'Plan and manage an Azure AI solution',
        weight: '25–30%',
        skills: [
          'Choose the appropriate Foundry services for generative AI and agents',
          'Set up AI solutions in Foundry',
          'Manage, monitor, and secure AI systems',
          'Implement responsible AI across generative AI and agentic systems'
        ],
        keywords: ['foundry project', 'foundry resource', 'hub', 'deployment type', 'provisioned', 'global standard', 'quota', 'managed identit', 'key vault', 'private endpoint', 'network', 'rbac', 'role', 'monitor', 'cost', 'responsible ai', 'content safety', 'content filter', 'prompt shield', 'jailbreak', 'groundedness', 'protected material', 'harm', 'blocklist', 'model catalog']
      },
      {
        name: 'Implement generative AI and agentic solutions',
        weight: '30–35%',
        skills: [
          'Build generative applications by using Foundry',
          'Build agents by using Foundry',
          'Optimize and operationalize generative AI systems'
        ],
        keywords: ['agent', 'tool', 'function calling', 'prompt', 'system message', 'chat completion', 'responses api', 'temperature', 'top_p', 'token', 'structured output', 'json schema', 'reasoning', 'fine-tun', 'evaluat', 'tracing', 'prompt flow', 'semantic kernel', 'agent framework', 'orchestrat', 'multi-agent', 'mcp', 'connected agent', 'code interpreter', 'conversation', 'streaming']
      },
      {
        name: 'Implement computer vision solutions',
        weight: '10–15%',
        skills: [
          'Design and implement image- and video-generation solutions',
          'Design and implement multimodal understanding workflows',
          'Implement responsible AI for multimodal content'
        ],
        keywords: ['image', 'vision', 'video', 'dall', 'gpt-image', 'sora', 'multimodal', 'ocr', 'caption', 'face', 'photo', 'visual']
      },
      {
        name: 'Implement text analysis solutions',
        weight: '10–15%',
        skills: ['Apply language model text analysis', 'Implement speech solutions'],
        keywords: ['language', 'sentiment', 'entity', 'entities', 'pii', 'key phrase', 'summariz', 'classif', 'translat', 'speech', 'text to speech', 'speech to text', 'voice', 'transcri', 'ssml', 'audio']
      },
      {
        name: 'Implement information extraction solutions',
        weight: '10–15%',
        skills: ['Build retrieval and grounding pipelines', 'Extract content from documents'],
        keywords: ['ai search', 'azure search', 'index', 'indexer', 'skillset', 'vector', 'embedding', 'hybrid search', 'semantic rank', 'rag', 'retrieval', 'grounding', 'chunk', 'knowledge', 'document intelligence', 'content understanding', 'invoice', 'receipt', 'layout model', 'extract', 'analyzer']
      }
    ]
  },
  {
    slug: 'ai-200',
    studyGuide: `${studyGuideBase}ai-200`,
    examPage: `${examPageBase}ai-200`,
    areas: [
      {
        name: 'Develop containerized solutions on Azure',
        weight: '20–25%',
        skills: [
          'Implement container application hosting',
          'Implement container-orchestrated solutions'
        ],
        keywords: ['container', 'docker', 'image', 'registry', 'acr', 'aks', 'kubernetes', 'pod', 'helm', 'keda', 'revision', 'replica', 'dapr', 'sidecar', 'ingress', 'gpu']
      },
      {
        name: 'Develop AI solutions by using Azure data management services',
        weight: '25–30%',
        skills: [
          'Develop AI solutions by using Azure Cosmos DB for NoSQL',
          'Develop AI solutions by using Azure Database for PostgreSQL',
          'Integrate Azure Managed Redis in AI solutions'
        ],
        keywords: ['cosmos', 'partition', 'change feed', 'request unit', 'vector', 'embedding', 'diskann', 'quantiz', 'full-text', 'hybrid search', 'postgres', 'pgvector', 'azure_ai', 'redis', 'cache', 'semantic cach', 'similarity', 'consistency']
      },
      {
        name: 'Connect to and consume Azure services',
        weight: '20–25%',
        skills: [
          'Develop event- and message-based AI solutions',
          'Develop and implement Azure Functions'
        ],
        keywords: ['event grid', 'event hub', 'service bus', 'queue', 'topic', 'session', 'dead-letter', 'dead letter', 'retry', 'retries', 'message', 'event', 'function', 'trigger', 'binding', 'flex consumption', 'durable', 'consumption plan']
      },
      {
        name: 'Secure, monitor, and troubleshoot Azure solutions',
        weight: '20–25%',
        skills: ['Implement secure Azure solutions', 'Monitor and troubleshoot Azure solutions'],
        keywords: ['managed identit', 'key vault', 'secret', 'rbac', 'role', 'entra', 'private endpoint', 'network', 'app configuration', 'certificate', 'application insights', 'opentelemetry', 'azure monitor', 'monitor', 'log analytics', 'kql', 'alert', 'metric', 'trace', 'diagnos', 'troubleshoot']
      }
    ]
  },
  {
    slug: 'ai-300',
    studyGuide: `${studyGuideBase}ai-300`,
    examPage: `${examPageBase}ai-300`,
    areas: [
      {
        name: 'Design and implement an MLOps infrastructure',
        weight: '15–20%',
        skills: [
          'Create and manage resources in a Machine Learning workspace',
          'Create and manage assets in a Machine Learning workspace',
          'Implement IaC for Machine Learning'
        ],
        keywords: ['workspace', 'compute instance', 'compute cluster', 'serverless compute', 'datastore', 'data asset', 'environment', 'registry', 'registries', 'bicep', 'terraform', 'cli', 'infrastructure as code', 'iac', 'managed virtual network', 'private endpoint', 'github actions', 'azure devops']
      },
      {
        name: 'Implement machine learning model lifecycle and operations',
        weight: '25–30%',
        skills: [
          'Orchestrate model training',
          'Implement model registration and versioning',
          'Deploy machine learning models for production environments',
          'Monitor and maintain machine learning models in production'
        ],
        keywords: ['pipeline', 'component', 'sweep', 'hyperparameter', 'bandit', 'automl', 'automated ml', 'mlflow', 'training', 'train', 'register', 'model version', 'online endpoint', 'batch endpoint', 'managed online', 'traffic', 'mirror', 'safe rollout', 'drift', 'model monitor', 'retrain', 'scoring']
      },
      {
        name: 'Design and implement a GenAIOps infrastructure',
        weight: '20–25%',
        skills: [
          'Implement Foundry environments and platform configuration',
          'Deploy and manage foundation models for production workloads',
          'Implement prompt versioning and management with source control'
        ],
        keywords: ['foundry', 'hub', 'connection', 'foundation model', 'model catalog', 'serverless api', 'provisioned', 'ptu', 'global standard', 'quota', 'rate limit', 'tokens per minute', 'tpm', 'prompt version', 'prompty', 'prompt flow', 'source control', 'deployment type']
      },
      {
        name: 'Implement generative AI quality assurance and observability',
        weight: '10–15%',
        skills: [
          'Configure evaluation and validation for generative AI applications and agents',
          'Implement observability for generative AI applications and agents'
        ],
        keywords: ['evaluat', 'groundedness', 'relevance', 'coherence', 'fluency', 'red team', 'safety', 'content filter', 'tracing', 'trace', 'opentelemetry', 'application insights', 'observab', 'monitor']
      },
      {
        name: 'Optimize generative AI systems and model performance',
        weight: '10–15%',
        skills: [
          'Optimize retrieval-augmented generation (RAG) performance and accuracy',
          'Implement advanced fine-tuning and model customization'
        ],
        keywords: ['rag', 'retrieval', 'chunk', 'embedding', 'vector', 'hybrid search', 'semantic rank', 'rerank', 'top k', 'top-k', 'ai search', 'fine-tun', 'lora', 'distillation', 'dpo', 'direct preference', 'reinforcement', 'supervised', 'epoch', 'learning rate', 'customiz']
      }
    ]
  }
];

/** Microsoft Learn training search for one skill area. */
export function trainingSearchUrl(area: SkillArea) {
  return `https://learn.microsoft.com/en-us/training/browse/?terms=${encodeURIComponent(area.name)}`;
}

/** The guide for one exam, or undefined if it has none. */
export function getExamGuide(slug: string): ExamGuide | undefined {
  return examGuides.find((guide) => guide.slug === slug);
}
