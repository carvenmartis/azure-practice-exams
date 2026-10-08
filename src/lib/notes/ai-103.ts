import type { ExamNotes } from './types';

export const ai103Notes: ExamNotes = [
  {
    area: 'Plan and manage an Azure AI solution',
    notes: [
      ['Microsoft Foundry', 'The Azure platform for models, agents and evaluations. A Foundry resource holds projects; apps connect to a project endpoint with the Azure AI Projects SDK.'],
      ['Standard deployment', 'Pay per token with shared capacity. Global standard routes to any region for the most capacity.'],
      ['Provisioned throughput (PTU)', 'Reserved model capacity in provisioned throughput units for predictable latency at steady high volume. Spill over extra load to standard.'],
      ['Global batch', 'Asynchronous jobs for large volumes, completed within a target window (24 hours) at a lower price than real-time calls.'],
      ['Data Zone deployment', 'Keeps processing inside a geographic zone such as the EU, with more capacity than a single region.'],
      ['HTTP 429', 'Too many requests: the deployment hit its tokens-per-minute (TPM) or requests-per-minute (RPM) limit. Retry with backoff, raise quota or add capacity.'],
      ['Keyless authentication', 'Use Microsoft Entra ID with a managed identity and a data-plane role (such as Azure AI User or Cognitive Services OpenAI User) instead of API keys.'],
      ['Private endpoint', 'Gives the Foundry resource a private IP in your VNet; then disable public network access.'],
      ['Content filters', 'Built on Azure AI Content Safety. Classify prompts and completions for hate, sexual, violence and self-harm at configurable severity thresholds.'],
      ['Filtered prompt vs completion', 'A filtered prompt returns HTTP 400 with code content_filter; a filtered completion ends with finish_reason content_filter.'],
      ['Prompt Shields', 'Detects user prompt attacks (jailbreaks) and document attacks (indirect prompt injection hidden in documents, emails or images).'],
      ['Indirect prompt injection', 'Instructions hidden in content the model reads, such as a web page, document or text in an image. Treat that content as untrusted.'],
      ['Spotlighting', 'Marks documents as lower-trust content so the model is less likely to follow instructions inside them.'],
      ['Protected material detection', 'Flags output that matches known copyrighted text or public code.'],
      ['Groundedness detection', 'Checks whether a response is supported by the source material you provided.'],
      ['AI red teaming agent', 'Automated adversarial testing in Foundry (built on PyRIT) that measures how often the app produces harmful content.'],
      ['Responsible AI principles', 'Fairness, reliability and safety, privacy and security, inclusiveness, transparency and accountability.']
    ]
  },
  {
    area: 'Implement generative AI and agentic solutions',
    notes: [
      ['System message', 'Instructions that set the model role, rules and output format. Reasoning models use a developer message for the same purpose.'],
      ['Few-shot prompting', 'Include a few worked examples in the prompt so the model copies their format and style.'],
      ['Temperature and top_p', 'Lower values make output more focused and consistent; higher values more varied. Reasoning models do not support them: use reasoning_effort.'],
      ['max_completion_tokens', 'Caps output tokens for reasoning models and includes hidden reasoning tokens, so set it high enough.'],
      ['Prompt caching', 'Reuses identical prompt prefixes for lower cost and latency. Keep static content first and the variable question last.'],
      ['Streaming', 'Returns tokens as they are generated so users see the answer sooner.'],
      ['Structured outputs', 'Forces JSON that matches your schema. In strict mode every field is required (use a union with null for optional ones) and keywords like minLength are not supported.'],
      ['Function (tool) calling', 'You describe tools with a name, description and JSON schema; the model returns a tool call, your code runs it and sends back a tool message with the tool_call_id.'],
      ['tool_choice', 'auto (model decides), none, required, or a specific function to force.'],
      ['Foundry Agent Service', 'Hosts agents with instructions, tools and knowledge, keeps conversation state and runs the tool-calling loop for you.'],
      ['Prompt, workflow and hosted agents', 'Prompt agents are configured declaratively; workflow agents orchestrate several agents with branching and approvals; hosted agents run your own container code.'],
      ['Multi-agent orchestration', 'Split work across specialized agents coordinated by an orchestrator or handoffs.'],
      ['MCP', 'Model Context Protocol: a standard way for agents to call tools on an MCP server. You can allow only some of its tools.'],
      ['Agent identity', 'A Microsoft Entra identity for an agent, scoped by RBAC. On-behalf-of passthrough uses the user identity so the agent sees only what the user may see.'],
      ['Human in the loop', 'Require approval before high-impact tool actions such as refunds or sending emails.'],
      ['Tracing', 'Records every step of a run (model calls, retrieval, tool calls and arguments) for debugging and audit.'],
      ['Reflection', 'The model or a second model reviews and improves an answer, at the cost of extra calls.'],
      ['Model router', 'Sends each request to the cheapest model that can handle it, balancing cost and quality.'],
      ['Conversation history', 'Summarize or trim older turns (keep the system message) to stay inside the context window and control cost.'],
      ['Quality evaluators', 'Groundedness, relevance, coherence and fluency for answers; tool call accuracy, intent resolution and task adherence for agents.'],
      ['Fabrication (hallucination)', 'A confident statement not supported by sources. Reduce it with grounding, citations and lower temperature.']
    ]
  },
  {
    area: 'Implement computer vision solutions',
    notes: [
      ['Multimodal model', 'A chat model that accepts images with text and answers in text: captions, alt text and visual question answering.'],
      ['Image detail parameter', 'low, high or auto. Low uses fewer tokens per image, enough for simple questions.'],
      ['Image generation', 'Models such as gpt-image-1 create images from prompts and edit them with reference images.'],
      ['Inpainting', 'Edit only part of an image: send the source image and a mask whose transparent area marks what to change.'],
      ['Content credentials (C2PA)', 'A provenance manifest attached to generated images that marks them as AI-generated.'],
      ['Content Safety image moderation', 'Scores images per harm category with severity levels so you can block unsafe content.'],
      ['Content Understanding video', 'Analyzers split video into segments and extract descriptions, transcripts and fields per segment.'],
      ['Text in images', 'A channel for indirect prompt injection: apply Prompt Shields and check outputs.'],
      ['Azure AI Vision', 'Prebuilt image analysis: captions, tags, objects, people and OCR (Read).']
    ]
  },
  {
    area: 'Implement text analysis solutions',
    notes: [
      ['Azure Language', 'Prebuilt NLP: sentiment analysis, key phrases, named entity recognition, PII detection, language detection and summarization.'],
      ['Sentiment analysis', 'Labels text as positive, negative, neutral or mixed, with confidence scores and opinion mining.'],
      ['PII detection', 'Finds personal data and returns each entity with category, offset and length, plus redacted text.'],
      ['Small language model', 'Cheaper and faster than a frontier model, good for narrow high-volume tasks such as classification.'],
      ['Azure Translator', 'Text and document translation. Document translation keeps file formatting; glossaries and Custom Translator enforce domain terms.'],
      ['Speech to text', 'Transcribes audio. Phrase lists boost specific words at run time; custom speech models are trained for domain vocabulary.'],
      ['Speaker diarization', 'Labels which speaker said each phrase in a transcript.'],
      ['Text to speech and SSML', 'Speech Synthesis Markup Language controls voice, pronunciation (phoneme), pauses (break), rate and style.'],
      ['Speech translation', 'Translates spoken audio into text or speech in another language in real time.'],
      ['Custom neural voice', 'A limited access feature that requires approval and the speaker consent.'],
      ['Voice agent', 'Speech to text, then the model, then text to speech. The Voice Live API combines them with low latency.']
    ]
  },
  {
    area: 'Implement information extraction solutions',
    notes: [
      ['RAG', 'Retrieval-augmented generation: retrieve relevant passages from an index at query time and give them to the model, so answers use current data without retraining.'],
      ['Embeddings', 'Numeric vectors that represent meaning, so similar text is close together for vector search. Query and documents must use the same model.'],
      ['Chunking', 'Split documents into passages, with overlap, and keep the title and headings with each chunk.'],
      ['Azure AI Search index, indexer and skillset', 'The index holds searchable fields; an indexer pulls from a data source; a skillset enriches content (OCR, embeddings, custom Web API skill).'],
      ['Integrated vectorization', 'Text Split and embedding skills chunk and vectorize during indexing; a vectorizer on the vector profile embeds query text.'],
      ['Hybrid search', 'Runs keyword (BM25) and vector queries together and merges them with Reciprocal Rank Fusion (RRF). Best default for RAG.'],
      ['Semantic ranker', 'Reranks the top 50 results with a language model and can return captions and answers. Use k of 50 for vector queries.'],
      ['HNSW vs exhaustive KNN', 'HNSW is fast approximate nearest neighbor search; exhaustive KNN scans every vector for exact results, used as a baseline.'],
      ['Vector filter mode', 'preFilter filters before the vector search so neighbors come only from allowed documents.'],
      ['Quantization', 'Scalar (int8) or binary compression shrinks vector indexes. Oversampling and rescoring with the original vectors recover quality.'],
      ['Matryoshka (MRL)', 'text-embedding-3 models allow truncating dimensions (truncationDimension) while keeping most of the meaning.'],
      ['Azure Content Understanding', 'Analyzers for documents, images, audio and video that return fields, markdown and descriptions, with confidence and source grounding.'],
      ['Field methods', 'Extract copies values from the content, Classify picks from categories, Generate creates new values such as summaries.'],
      ['Document Intelligence', 'OCR, layout (tables and structure as markdown) and prebuilt or custom models for invoices, receipts and forms.'],
      ['Groundedness vs retrieval relevance', 'Low relevance means search found the wrong content; high relevance but low groundedness points to the generation step.'],
      ['Citations', 'Pass source IDs with each chunk and ask the model to cite them so answers can be checked.']
    ]
  }
];
