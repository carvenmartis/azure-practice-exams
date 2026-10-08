import type { ExamNotes } from './types';

export const ai300Notes: ExamNotes = [
  {
    area: 'Design and implement an MLOps infrastructure',
    notes: [
      ['Azure Machine Learning workspace', 'The top-level resource for ML work. It depends on a storage account, a key vault and Application Insights; a container registry is created when first needed or attached.'],
      ['Workspace storage limits', 'The default storage account cannot be BlobStorage, premium or have hierarchical namespace enabled.'],
      ['Hub and project workspaces', 'A hub shares security, connections and compute with the project workspaces under it.'],
      ['Datastore', 'A saved connection to storage (Blob, ADLS Gen2, Files) so jobs read data without embedded credentials. Identity-based access uses RBAC such as Storage Blob Data Reader.'],
      ['Data asset', 'A versioned reference to data (uri_file, uri_folder or mltable) used as job input.'],
      ['Compute instance', 'A managed single-node workstation for notebooks and development.'],
      ['Compute cluster', 'Autoscaling multi-node compute for jobs. Min nodes 0 means no cost when idle. Low-priority (spot) VMs are cheaper but can be preempted.'],
      ['Serverless compute', 'Run jobs on managed on-demand compute without creating a cluster.'],
      ['Environment', 'A versioned Docker image plus conda or pip dependencies. Curated environments are prebuilt by Microsoft.'],
      ['Registry', 'Shares models, environments, components and data across workspaces, regions and subscriptions for promotion from dev to prod.'],
      ['Infrastructure as code', 'Deploy workspaces and Foundry resources with Bicep through Azure CLI or GitHub Actions.'],
      ['OIDC federation', 'GitHub Actions get Azure tokens through a federated credential, with no long-lived secrets.'],
      ['Network isolation', 'Managed virtual network or private endpoints with public access disabled. Model monitoring is not supported in AllowOnlyApprovedOutbound mode.'],
      ['Responsible AI dashboard', 'Error analysis, fairness, interpretability and counterfactual analysis for a model.']
    ]
  },
  {
    area: 'Implement machine learning model lifecycle and operations',
    notes: [
      ['Command job', 'Runs a script with an environment on compute. instance_count above 1 plus a distribution (PyTorch, TensorFlow, MPI) gives distributed training.'],
      ['Component and pipeline', 'Components are versioned, reusable steps; pipelines chain them, can run each on different compute and reuse unchanged step outputs.'],
      ['MLflow tracking', 'Workspaces are MLflow tracking servers: mlflow.log_metric, mlflow.autolog() and comparing runs in studio.'],
      ['Registering a model', 'mlflow.register_model with a runs:/<run_id>/<path> URI, or registered_model_name in log_model. MLflow format allows no-code deployment.'],
      ['AutoML', 'Tries algorithms and hyperparameters and ranks models by your primary metric.'],
      ['Sweep job', 'Hyperparameter tuning with random, grid (choice only) or Bayesian sampling (choice, uniform, quniform only).'],
      ['Bayesian sampling tips', 'Set max_total_trials to at least 20 times the number of hyperparameters and keep concurrency low so each trial learns from more results.'],
      ['Early termination', 'Bandit (slack factor or amount against the best run), Median stopping and Truncation selection policies stop weak trials.'],
      ['Managed online endpoint', 'Real-time HTTPS scoring with autoscaling. Several deployments (such as blue and green) share the endpoint.'],
      ['Traffic split', 'Percentages across deployments must add to 100 (or 0). A new deployment starts at 0% unless created with --all-traffic.'],
      ['Mirrored traffic', 'Copies up to 50% of requests to a shadow deployment; clients only get the live deployment responses. Not on Kubernetes endpoints.'],
      ['azureml-model-deployment header', 'Sends a request to a specific deployment, bypassing the traffic split, for testing.'],
      ['Batch endpoint', 'Asynchronous, parallel scoring of large datasets on compute clusters.'],
      ['Model monitoring signals', 'Data drift (input distribution), prediction drift (output distribution), data quality (nulls, types, out of bounds) and model performance (needs ground truth).'],
      ['Drift metrics', 'Jensen-Shannon distance, PSI, normalized Wasserstein distance, and the K-S or chi-squared tests.'],
      ['Retraining trigger', 'A monitoring alert or Event Grid event starts a retraining pipeline.'],
      ['Fine-tuning data', 'JSONL with one chat-format conversation per line. Use the same system message at inference; weight 0 skips an assistant message in training.'],
      ['Overfitting', 'Training loss keeps falling while validation loss rises. Use an earlier checkpoint or fewer epochs.'],
      ['Training types', 'Standard training stays in your region for data residency; Global is cheaper; Developer uses idle capacity, can be preempted and has no SLA.'],
      ['Synthetic data', 'Generated by a stronger model to expand training data. It copies the generator mistakes and bias, so review it.']
    ]
  },
  {
    area: 'Design and implement a GenAIOps infrastructure',
    notes: [
      ['Foundry resource and projects', 'A Foundry resource hosts projects where teams deploy models, build agents and run evaluations.'],
      ['Deployment types', 'Standard (serverless, pay per token), provisioned throughput (reserved PTUs for steady load) and managed compute (dedicated VMs billed by time).'],
      ['Model selection', 'Compare benchmarks and your own evaluations for quality against cost and latency.'],
      ['Prompt versioning', 'Keep prompts as files in Git, for example Prompty files (template, model settings and sample inputs in Markdown).'],
      ['Access control', 'Managed identities and Foundry RBAC roles at the narrowest scope. Deploying needs deployments/write, for example Foundry Owner.'],
      ['Quota and 429 errors', 'Rate limits are tokens per minute per deployment. Raise quota or add provisioned capacity; watch the provisioned-managed utilization metric.'],
      ['Fine-tuned deployments', 'Inactive fine-tuned deployments are deleted after 15 days; the model stays and can be redeployed.']
    ]
  },
  {
    area: 'Implement generative AI quality assurance and observability',
    notes: [
      ['Evaluation dataset', 'Queries with context and ground truth where needed, mapped to evaluator inputs. Version a golden set and rerun it on every change.'],
      ['Quality evaluators', 'Groundedness (supported by context), relevance, coherence (logical flow), fluency, similarity, and F1 or BLEU against ground truth.'],
      ['Agent evaluators', 'Intent resolution, task adherence and tool call accuracy.'],
      ['Risk and safety evaluators', 'Score harmful content and jailbreak success, often with an adversarial simulator generating attacks.'],
      ['Custom evaluator', 'Code-based or prompt-based (LLM judge) metric for needs the built-ins do not cover.'],
      ['Evaluations in CI/CD', 'Run the evaluation SDK in the pipeline and fail the build when quality or safety scores drop below the baseline.'],
      ['Tracing', 'OpenTelemetry spans for retrieval, tool calls and model calls in Application Insights, to find slow or failing steps.'],
      ['Continuous evaluation', 'Samples real production traffic and scores it over time with Application Insights connected to the project.'],
      ['Token monitoring', 'Track prompt and completion tokens per deployment, operation and prompt version to control cost.'],
      ['A/B testing', 'Compare a new configuration with the current one on live traffic using the same metrics.']
    ]
  },
  {
    area: 'Optimize generative AI systems and model performance',
    notes: [
      ['Chunk size and overlap', 'Strongly affect retrieval quality; overlap keeps context that would be split between chunks.'],
      ['Hybrid search', 'Keyword search finds exact codes and names; vector search finds meaning. Combine them for RAG.'],
      ['Reranking and thresholds', 'Rerank results and drop low scores so only relevant passages reach the model. Give the semantic ranker about 50 candidates.'],
      ['Changing embedding models', 'Query and document vectors must come from the same model, so re-embed and re-index everything.'],
      ['Quantization trade-offs', 'Binary quantization suits more than 1,024 dimensions; scalar (int8) is safer for smaller vectors. Oversampling and rescoring need HNSW and the original vectors (not with discardOriginals).'],
      ['When to fine-tune', 'For consistent style, format or task behavior that prompting cannot reach, with good training examples. Try prompting and RAG first.'],
      ['SFT', 'Supervised fine-tuning on example conversations.'],
      ['DPO', 'Direct preference optimization: learn from pairs of preferred and rejected answers.'],
      ['RFT', 'Reinforcement fine-tuning: reward signals from graders, for selected reasoning models.'],
      ['Distillation', 'Train a smaller, cheaper model on outputs of a larger one.']
    ]
  }
];
