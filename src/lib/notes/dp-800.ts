import type { ExamNotes } from './types';

export const dp800Notes: ExamNotes = [
  {
    area: 'Design and develop database solutions',
    notes: [
      ['Temporal tables', 'System-versioned tables keep row history. FOR SYSTEM_TIME AS OF returns rows as they were at one moment; HISTORY_RETENTION_PERIOD cleans up old history.'],
      ['Ledger tables', 'Tamper-evident tables. Append-only ledger tables allow only INSERT, good for audit logs.'],
      ['Memory-optimized tables', 'In-memory OLTP. DURABILITY = SCHEMA_ONLY skips logging for maximum speed when losing data on restart is fine. Nonclustered (range) indexes support range queries; hash indexes do not.'],
      ['SQL Graph', 'CREATE TABLE ... AS NODE and AS EDGE; query with MATCH(p1-(f1)->p2). Edge constraints (CONNECTION) limit which node tables an edge links.'],
      ['Columnstore', 'A nonclustered columnstore index adds fast analytics on an OLTP table. Bulk loads of 102,400 rows or more compress directly into rowgroups.'],
      ['Native json type', 'Stores JSON in a parsed binary format; the modify method updates in place. JSON indexes need a clustered primary key and speed up JSON_VALUE, JSON_PATH_EXISTS and JSON_CONTAINS.'],
      ['JSON functions', 'OPENJSON ... WITH turns arrays into rows (AS JSON for nested parts); FOR JSON PATH turns rows into JSON. JSON_ARRAYAGG skips NULLs; JSON_OBJECT keeps them as null.'],
      ['Regular expressions', 'REGEXP_LIKE (needs compatibility level 170, usable in CHECK constraints), REGEXP_REPLACE (\\1 back-references), REGEXP_SUBSTR, REGEXP_INSTR and REGEXP_MATCHES (table-valued).'],
      ['Fuzzy matching', 'EDIT_DISTANCE_SIMILARITY returns 0 to 100; JARO_WINKLER_DISTANCE weighs matching starts, good for names.'],
      ['SEQUENCE', 'A number generator independent of tables; several tables can use NEXT VALUE FOR.'],
      ['Partition switching', 'ALTER TABLE ... SWITCH moves a whole partition to an empty table with the same structure almost instantly.'],
      ['External tables', 'Need an external data source and an external file format (such as Parquet), usually with a database scoped credential.'],
      ['Functions and performance', 'Inline table-valued functions are expanded like views; multi-statement TVFs have fixed estimates. Scalar UDFs calling GETDATE() cannot be inlined.'],
      ['Triggers', 'Fire once per statement, so use set-based logic over the inserted and deleted tables.'],
      ['Indexed views', 'Need WITH SCHEMABINDING, and COUNT_BIG(*) when using GROUP BY.'],
      ['Dynamic SQL', 'Use sp_executesql with typed parameters to prevent SQL injection and reuse plans.'],
      ['Recursive CTE', 'Default limit is 100 levels; OPTION (MAXRECURSION n) raises it (0 means no limit).'],
      ['Window frames', 'With ORDER BY and no frame, the default is RANGE UNBOUNDED PRECEDING to CURRENT ROW. Use ROWS for a running total that ignores ties, and UNBOUNDED FOLLOWING for LAST_VALUE.'],
      ['Removing duplicates', 'ROW_NUMBER() OVER (PARTITION BY key ORDER BY date DESC) in a CTE, then delete rows numbered above 1.'],
      ['NOT IN and NULL', 'If the subquery returns a NULL, NOT IN returns no rows. Use NOT EXISTS.'],
      ['Error handling', 'TRY...CATCH with THROW; to re-raise. XACT_STATE() is 1 (committable), -1 (must roll back) or 0 (no transaction).'],
      ['Full-text search', 'CONTAINSTABLE returns KEY and RANK columns for relevance ordering and supports NEAR.'],
      ['GitHub Copilot instructions', '.github/copilot-instructions.md for the repo; .github/instructions/*.instructions.md with applyTo for matching files. Agent mode runs MSSQL tools with approval.'],
      ['Data API builder', 'REST and GraphQL over SQL. Views need declared key fields; many-to-many uses linking.object. SQL MCP Server exposes only configured entities.'],
      ['Azure SQL trigger for Functions', 'Needs Change Tracking enabled on the database and the table.']
    ]
  },
  {
    area: 'Secure, optimize, and deploy database solutions',
    notes: [
      ['Always Encrypted', 'Deterministic encryption allows equality lookups, joins and grouping; randomized is stronger. Secure enclaves allow LIKE and range queries on encrypted data.'],
      ['Cell-level encryption', 'OPEN SYMMETRIC KEY before DECRYPTBYKEY, or it returns NULL.'],
      ['Dynamic data masking', 'Masks query results only, such as partial(0, "XXX-XXX-", 4). Users can still infer values with WHERE clauses.'],
      ['Row-level security', 'A security policy with filter predicates (hide rows on read) and block predicates (stop writes, such as AFTER INSERT). Often uses SESSION_CONTEXT set read-only.'],
      ['Managed identity login', 'CREATE USER [app-name] FROM EXTERNAL PROVIDER, then grant least-privilege roles. EXECUTE on a schema lets users run its procedures through ownership chaining.'],
      ['Auditing destinations', 'Storage, Log Analytics (KQL and alerts) or Event Hubs.'],
      ['Data API builder security', 'Turn off GraphQL introspection; database policies such as @item.OwnerId eq @claims.oid filter rows per user.'],
      ['XACT_ABORT ON', 'Any run-time error or client timeout rolls back the whole transaction.'],
      ['RCSI', 'Read committed snapshot isolation: readers use row versions instead of shared locks, with statement-level consistency.'],
      ['SNAPSHOT isolation', 'Transaction-level consistency; an update conflict means retry the transaction.'],
      ['Optimized locking', 'Needs accelerated database recovery; lock after qualification works only with RCSI.'],
      ['Blocking and deadlocks', 'sys.dm_exec_requests.blocking_session_id shows the blocker. Avoid deadlocks by accessing tables in the same order and keeping transactions short.'],
      ['Query Store', 'Keeps plan history. Force a good plan with sp_query_store_force_plan or add hints like RECOMPILE with Query Store hints. Query Performance Insight depends on it.'],
      ['Covering index', 'Add needed columns with INCLUDE to remove key lookups.'],
      ['MAXDOP in Azure SQL', 'Set with ALTER DATABASE SCOPED CONFIGURATION.'],
      ['SQL Database Projects', 'SDK-style projects (Microsoft.Build.Sql) build a .dacpac with dotnet build. All .sql files are included unless removed with Build Remove.'],
      ['SqlPackage', '/Action:DeployReport lists changes before publishing; BlockOnPossibleDataLoss is true by default. Post-deployment scripts run every time, so make them idempotent.'],
      ['CI/CD security', 'Use OIDC federation for pipeline sign-in, environment approvals for production and branch policies with build validation.'],
      ['Data API builder REST', 'OData-style $filter, $orderby and $select; keyset paging with $first and $after (follow nextLink). Caching needs runtime.cache.enabled.'],
      ['CDC vs change event streaming', 'Change data capture writes changes to change tables from the log; change event streaming sends changes as CloudEvents to Event Hubs or Fabric Eventstream.']
    ]
  },
  {
    area: 'Implement AI capabilities in database solutions',
    notes: [
      ['CREATE EXTERNAL MODEL', 'Registers an embeddings endpoint (MODEL_TYPE = EMBEDDINGS) for Azure OpenAI, OpenAI, Ollama or ONNX Runtime. Use a managed identity credential; callers need EXECUTE on the model.'],
      ['AI_GENERATE_EMBEDDINGS', 'AI_GENERATE_EMBEDDINGS(text USE MODEL name) returns a vector. Generate embeddings asynchronously in batches, not in the write path.'],
      ['AI_GENERATE_CHUNKS', 'Table-valued function used with CROSS APPLY; CHUNK_TYPE = FIXED, OVERLAP is 0 to 50 percent of CHUNK_SIZE.'],
      ['VECTOR type', 'VECTOR(n) must match the model dimensions. float32 supports up to 1,998 dimensions, float16 up to 3,996.'],
      ['What to embed', 'Descriptive text such as name and description; keep price and SKU as normal filter columns.'],
      ['Changing models', 'Vectors from different models are not comparable, so re-embed all content.'],
      ['VECTOR_DISTANCE', 'Always exact k-nearest-neighbor search; ignores vector indexes. Fine for small tables.'],
      ['Distance metrics', 'Cosine ranges from 0 (same direction) to 2 (opposite); dot returns the negative dot product, so smaller is more similar.'],
      ['Vector index', 'CREATE VECTOR INDEX needs at least 100 non-NULL vectors and a clustered int primary key, and is not deployed by dacpac.'],
      ['VECTOR_SEARCH', 'Approximate search: SELECT TOP (N) WITH APPROXIMATE ... ORDER BY distance ascending. Without a matching index it falls back to exact search with a warning.'],
      ['Measuring ANN quality', 'Compare approximate results with exact kNN to compute recall, together with latency.'],
      ['VECTOR_NORMALIZE and VECTORPROPERTY', 'VECTOR_NORMALIZE(v, norm2) gives length 1; VECTORPROPERTY(v, Dimensions) returns the dimension count.'],
      ['Hybrid search', 'Full-text for exact identifiers plus vector search for meaning, merged with Reciprocal Rank Fusion: sum of 1 / (k + rank), k usually 60.'],
      ['RAG in SQL', 'Retrieve chunks with vector search, format them with FOR JSON, call the model with sp_invoke_external_rest_endpoint and read $.result.choices[0].message.content. Return value 0 means success.'],
      ['Grounding instructions', 'Tell the model to answer only from the supplied context or say it does not know.'],
      ['Copilot in Fabric SQL', 'Grounded in the schema, not the data; it does not run queries by itself and data changes need user approval.']
    ]
  }
];
