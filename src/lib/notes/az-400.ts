import type { ExamNotes } from './types';

export const az400Notes: ExamNotes = [
  {
    area: 'Design and implement processes and communications',
    notes: [
      ['GitHub Flow', 'A light branching workflow: branch from main, commit, open a pull request, review, merge and deploy. main is always deployable.'],
      ['Azure Boards', 'Work tracking with epics, features, user stories (or product backlog items), tasks and bugs, on backlogs, boards and sprints.'],
      ['Traceability', 'Linking commits, pull requests and builds to work items, for example AB#123 in a GitHub commit message links Azure Boards item 123.'],
      ['Cycle time vs lead time', 'Lead time runs from when a work item is created to when it is done; cycle time from when work starts to when it is done.'],
      ['Cumulative flow diagram', 'Shows how many items are in each state over time, revealing bottlenecks and work in progress.'],
      ['Burndown chart', 'Shows remaining work against time in a sprint or release.'],
      ['DORA metrics', 'Deployment frequency, lead time for changes, change failure rate and mean time to restore: the four measures of delivery performance.'],
      ['Dashboards and widgets', 'Azure DevOps dashboards show charts, query results, build and test status for a team.'],
      ['Wiki', 'Project wiki in Markdown, with Mermaid syntax for diagrams. Can be a provisioned wiki or code published as wiki from a repo.'],
      ['Service hooks', 'Send Azure DevOps events to other services, such as Teams, Slack or a webhook, when a build finishes or a work item changes.'],
      ['Release notes and documentation', 'Generate from work items and commits linked to a pipeline run, or from conventional commit messages.']
    ]
  },
  {
    area: 'Design and implement a source control strategy',
    notes: [
      ['Trunk-based development', 'Everyone commits small changes to main (or short-lived branches merged within a day). Feature flags hide unfinished work.'],
      ['Feature branch', 'A branch per feature or fix, merged into main through a pull request.'],
      ['Release branch', 'A branch cut from main for a release, so fixes can be made to that release while main moves on.'],
      ['Git Flow', 'Long-lived main and develop branches plus feature, release and hotfix branches. Heavier than trunk-based or GitHub Flow.'],
      ['Pull request', 'Proposes merging a branch, with reviewers, comments, required checks and linked work items.'],
      ['Branch policies', 'Azure Repos rules on a branch: minimum reviewers, linked work items, comment resolution, build validation and merge types.'],
      ['Branch protection rules', 'GitHub equivalent: required reviews, required status checks, signed commits and linear history.'],
      ['CODEOWNERS', 'A GitHub file that assigns owners to paths and automatically requests their review on pull requests.'],
      ['Merge strategies', 'Merge commit keeps all history; squash combines a branch into one commit; rebase replays commits on top of the target for a linear history.'],
      ['Git LFS', 'Large File Storage: stores large binaries outside the repo and keeps small pointer files in Git.'],
      ['Scalar and partial clone', 'Ways to work with very large repositories by downloading only what you need.'],
      ['Monorepo vs multiple repos', 'One repository for many projects simplifies shared changes; many repositories give independent permissions and release cycles.'],
      ['Removing secrets from history', 'Use git filter-repo or BFG Repo-Cleaner to rewrite history, then rotate the leaked secret. Deleting the file in a new commit is not enough.'],
      ['Recovering data', 'git reflog finds lost commits; deleted Azure Repos branches can be restored from the branches page.'],
      ['Tags', 'Lightweight or annotated tags mark release points in Git.']
    ]
  },
  {
    area: 'Design and implement build and release pipelines',
    notes: [
      ['YAML pipeline structure', 'Pipeline > stages > jobs > steps (tasks or scripts). Jobs run on an agent; stages are usually environments.'],
      ['Triggers', 'CI trigger on push, PR trigger for pull requests, scheduled triggers (cron) and pipeline completion triggers.'],
      ['Microsoft-hosted vs self-hosted agents', 'Hosted agents are fresh VMs managed by Microsoft; self-hosted agents run on your machines, keep caches and can reach private networks.'],
      ['Agent pools and parallel jobs', 'Agents are grouped into pools; the number of parallel jobs you buy limits how many run at once.'],
      ['Templates', 'Reusable YAML for steps, jobs, stages or variables. extends templates can enforce a required structure.'],
      ['Variable groups', 'Shared variables in the Library, optionally linked to Azure Key Vault secrets.'],
      ['Environments', 'Deployment targets in Azure Pipelines with approvals and checks, and history of what was deployed where.'],
      ['Deployment jobs', 'Special jobs with strategies: runOnce, rolling and canary.'],
      ['Blue-green deployment', 'Two identical environments; deploy to the idle one, then switch traffic. Quick rollback by switching back.'],
      ['Canary release', 'Send a small share of users to the new version first, then increase if healthy.'],
      ['Ring deployment', 'Roll out to progressively larger groups of users (rings), such as internal, early adopters, everyone.'],
      ['Feature flags', 'Turn features on or off at run time without deploying, separating deploy from release. Azure App Configuration has feature management.'],
      ['Azure Artifacts', 'Package feeds for NuGet, npm, Maven, Python and universal packages, with upstream sources for public registries.'],
      ['Feed views', 'Local, @Prerelease and @Release views to promote package versions as they mature.'],
      ['Semantic versioning', 'MAJOR.MINOR.PATCH: breaking changes, new features, bug fixes.'],
      ['Testing pyramid', 'Many fast unit tests, fewer integration tests and few slow UI tests. Run them in the pipeline and publish results and code coverage.'],
      ['Flaky tests', 'Tests that pass and fail without code changes. Azure Pipelines can detect and report them.'],
      ['Infrastructure as code', 'Define infrastructure in ARM templates, Bicep or Terraform, stored in Git and deployed by pipelines.'],
      ['Desired State Configuration', 'Tools like Azure Automation State Configuration, Azure Machine Configuration, Ansible or Chef keep server configuration as declared.'],
      ['Azure Deployment Environments', 'Self-service, pre-approved infrastructure templates for developers.'],
      ['Pipeline caching', 'The Cache task reuses dependencies (such as node_modules or NuGet packages) between runs to speed up builds.'],
      ['Retention policies', 'Control how long runs, artifacts and test results are kept.'],
      ['Classic to YAML migration', 'Move classic build and release pipelines to YAML so they live in source control and get reviewed like code.'],
      ['GitHub Actions', 'Workflows in .github/workflows, triggered by events, made of jobs and steps that use actions. Runners can be GitHub-hosted or self-hosted.']
    ]
  },
  {
    area: 'Develop a security and compliance plan',
    notes: [
      ['Service connection', 'Stored credentials that let Azure Pipelines reach Azure, GitHub or other services. Prefer workload identity federation over secrets.'],
      ['Workload identity federation (OIDC)', 'The pipeline or GitHub workflow gets a short-lived token from Entra ID with no stored secret.'],
      ['Managed identity and service principal', 'Non-human identities for automation. Managed identities need no secrets; service principals use secrets or certificates.'],
      ['PAT', 'Personal access token: a scoped, expiring credential for Azure DevOps or GitHub. Give the minimum scope and shortest lifetime.'],
      ['GitHub App vs PAT', 'A GitHub App has fine-grained permissions and short-lived tokens, better than a personal token for automation.'],
      ['Azure DevOps permissions', 'Security groups such as Project Administrators, Contributors and Readers; Stakeholder access level is free and limited.'],
      ['Secrets in pipelines', 'Use secret variables, Key Vault-linked variable groups or GitHub secrets. Secrets are masked in logs and not passed to forks.'],
      ['Secure files', 'Library files such as certificates or provisioning profiles used in a pipeline without storing them in the repo.'],
      ['Dependency scanning', 'Finds known vulnerabilities in open-source packages (Dependabot, GitHub Advanced Security dependency review).'],
      ['Code scanning', 'Static analysis (SAST) of your code, such as CodeQL, run on pull requests.'],
      ['Secret scanning', 'Detects committed secrets; push protection blocks them before they reach the repo.'],
      ['License scanning', 'Checks open-source licenses of dependencies against your policy.'],
      ['Container scanning', 'Microsoft Defender for Containers scans images in registries for vulnerabilities.'],
      ['Microsoft Defender for Cloud DevOps security', 'Connects Azure DevOps and GitHub to show code, secret and dependency findings in one place.'],
      ['Azure Policy in pipelines', 'Compliance checks as a pipeline gate or in IaC deployments, so non-compliant resources are blocked.']
    ]
  },
  {
    area: 'Implement an instrumentation strategy',
    notes: [
      ['Azure Monitor', 'The platform for metrics, logs, alerts and workbooks across Azure resources and apps.'],
      ['Application Insights', 'Application performance monitoring: requests, dependencies, exceptions, traces and availability tests.'],
      ['Log Analytics and KQL', 'Logs are stored in a workspace and queried with Kusto Query Language: table | where | summarize | render.'],
      ['Distributed tracing', 'Correlates one request across services with an operation ID; Application Map shows the dependencies.'],
      ['Container insights and VM insights', 'Monitoring for AKS clusters and virtual machines, including performance and dependency maps.'],
      ['Alerts and action groups', 'Alert rules on metrics or log queries notify people or run automation through action groups.'],
      ['Smart detection', 'Application Insights automatically flags unusual failure rates and performance changes.'],
      ['Pipeline health', 'Track pipeline failure rate, duration and flaky tests with Analytics views and reports.'],
      ['Workbooks', 'Interactive reports that combine text, KQL queries, metrics and parameters.']
    ]
  }
];
