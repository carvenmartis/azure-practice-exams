import type { ExamNotes } from './types';

export const ai901Notes: ExamNotes = [
  {
    area: 'Identify AI concepts and capabilities',
    notes: [
      ['Fairness', 'Responsible AI principle: treat all people fairly and do not affect similar groups differently.'],
      ['Reliability and safety', 'Responsible AI principle: perform consistently and respond safely to unexpected conditions.'],
      ['Privacy and security', 'Responsible AI principle: protect personal and business data, for example with data minimization, encryption and deletion.'],
      ['Inclusiveness', 'Responsible AI principle: empower everyone, including people with disabilities (accessibility).'],
      ['Transparency', 'Responsible AI principle: people understand how the system works, and are told when they talk to AI or see AI-generated content.'],
      ['Accountability', 'Responsible AI principle: the people who build and deploy AI answer for it and keep human control, for example through a review board.'],
      ['Token', 'A unit of text a model reads and writes: a word, part of a word or punctuation. Input and output tokens share the context window.'],
      ['Embedding', 'A vector of numbers that captures meaning, so similar text has similar vectors. Compared with cosine similarity.'],
      ['Transformer and attention', 'Transformers use attention to weigh how each token relates to the others, capturing context across the whole input.'],
      ['How generation works', 'The model predicts a likely next token, appends it and repeats until the answer is complete.'],
      ['Temperature', 'Low (0 to 0.2) gives focused, repeatable output for extraction; higher gives more varied, creative output.'],
      ['top_p', 'Nucleus sampling: choose only from the smallest set of tokens whose probabilities add up to top_p. Change temperature or top_p, not both.'],
      ['finish_reason length', 'The answer stopped at the token limit; raise the maximum output tokens.'],
      ['Reasoning models', 'Think step by step for math, code and planning, at higher token cost and latency. No temperature or top_p; use max_completion_tokens.'],
      ['Small models', 'Mini variants are faster and cheaper, good for simple high-volume tasks.'],
      ['Deployment types', 'Global Standard (any region, highest quota), Data Zone Standard (EU or US zone), Standard (one geography), Provisioned (reserved capacity) and Global Batch (24-hour, cheaper).'],
      ['Grounding (RAG)', 'Retrieve relevant content and add it to the prompt so answers use current company data without retraining.'],
      ['Hallucination', 'Fluent but wrong or unsupported output. Grounding reduces it.'],
      ['Agentic AI', 'A model plus instructions and tools that reasons about a goal and takes actions, such as checking stock and placing an order.'],
      ['Content filter categories', 'Hate and fairness, sexual, violence and self-harm, each at severity safe, low, medium or high. A blocked prompt returns HTTP 400 content_filter.'],
      ['Chat Completions vs Responses API', 'Chat Completions is stateless: resend earlier messages each time. The Responses API is stateful (previous_response_id) and supports tools; set store to false to keep nothing.'],
      ['NLP workloads', 'Key phrase extraction, named entity recognition, sentiment analysis (with opinion mining), language detection, PII detection and summarization.'],
      ['Extractive vs abstractive summarization', 'Extractive picks the most important original sentences; abstractive writes new text.'],
      ['Speech workloads', 'Speech recognition (speech to text), speech synthesis (text to speech) and speech translation.'],
      ['Vision workloads', 'Image classification, object detection (bounding boxes), semantic segmentation (per-pixel masks), OCR and image generation.'],
      ['Images in prompts', 'Send a public URL or a base64 data URL. Detail low uses fewer tokens; high reads fine detail.']
    ]
  },
  {
    area: 'Implement AI solutions by using Microsoft Foundry',
    notes: [
      ['Foundry project endpoint', 'https://<resource>.services.ai.azure.com/api/projects/<project>, used with AIProjectClient and DefaultAzureCredential.'],
      ['SDK packages', 'azure-ai-projects for AIProjectClient and azure-identity for DefaultAzureCredential. project.get_openai_client() returns an OpenAI client.'],
      ['responses.create', 'Pass the deployment name as model and the prompt as input; read response.output_text.'],
      ['Deployment name', 'Requests use the deployment name you chose (such as support-bot-prod), not the base model name.'],
      ['Message roles', 'system sets behavior and rules, user holds the user input, assistant holds earlier model replies.'],
      ['Playground', 'The fastest way to test a deployed model and edit its system message and parameters.'],
      ['Safety system messages', 'Editable templates added to the system message that steer the model away from harmful or ungrounded answers.'],
      ['Prompt Shields', 'Detect jailbreaks (user prompt attacks) and indirect attacks hidden in documents.'],
      ['Protected material detection', 'Flags known text such as song lyrics or articles in completions.'],
      ['Agent', 'A model, instructions and tools. A prompt agent can be built in the portal with no code; the instructions live in the agent definition.'],
      ['Agent tools', 'File search (vector store over uploaded files), code interpreter (runs Python in a sandbox), web search or Grounding with Bing, Azure AI Search and function calling.'],
      ['File search', 'Uploaded files are chunked, embedded and stored in a vector store; answers include citations to the files.'],
      ['Function calling', 'The model picks a function and its arguments; your client code runs it and returns the result.'],
      ['Conversations with agents', 'get_openai_client(agent_name=...), create a conversation, then call responses.create so history carries over.'],
      ['Audio models', 'Audio-capable models take input_audio; set modalities to text and audio for spoken replies. The Realtime API (gpt-realtime) is for live voice.'],
      ['Batch vs fast transcription', 'Batch transcription handles large stored audio asynchronously; fast transcription returns one file quickly and synchronously.'],
      ['Custom speech', 'Train recognition with your domain words and pronunciations.'],
      ['SSML elements', 'speak (root), voice, break (pause), prosody (pitch, rate, volume), say-as (dates, numbers) and mstts:express-as (speaking style).'],
      ['Custom voice', 'A brand-specific neural voice, subject to responsible AI approval.'],
      ['Vision prompts', 'One user message can contain text parts and several image_url parts.'],
      ['gpt-image-1', 'Returns base64 in b64_json (no URLs). Sizes 1024x1024, 1024x1536 and 1536x1024; quality low, medium or high; transparent background needs PNG.'],
      ['Image edits', 'Send the image, a prompt and a mask that marks the area to change.'],
      ['Content Understanding analyzer', 'Extraction settings, field schema and models applied to documents, images, audio or video. Base analyzers: prebuilt-document, -image, -audio and -video.'],
      ['Prebuilt analyzers', 'prebuilt-invoice for invoices, prebuilt-documentSearch for RAG ingestion, prebuilt-callCenter for call recordings.'],
      ['Field methods', 'extract copies values from the content (needs source and confidence), classify picks from categories, generate creates new values.'],
      ['estimateFieldSourceAndConfidence', 'Returns a confidence score and source location (page and bounding box) for each field.'],
      ['Text analytics for health', 'Extracts medications, dosages and diagnoses from clinical text.']
    ]
  }
];
