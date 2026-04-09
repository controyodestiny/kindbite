# OmniGraph System Architecture: A Formal Schema

This diagram delineates the multi-tiered architecture of the OmniGraph platform, illustrating the interaction between the semantic ingestion pipeline, the graph-based retrieval layer, and the multi-tenant orchestration framework.

```mermaid
graph TD
    %% Actor Definition
    USER[Authenticated Entity / Tenant Context]:::user

    %% Presentation Layer
    subgraph "Presentation Layer (Web-based Interface)"
        DASHBOARD[Analytical Dashboard Interface]:::frontend
        GVE[Stochastic Force-Directed Graph Engine]:::frontend
        AC[Conversational Reasoning & Discourse Panel]:::frontend
    end

    %% Application & Logic Layer
    subgraph "Application Logic Layer (Asynchronous API)"
        GW[Orchestration Gateway & Multi-Tenant Middleware]:::backend
        OAUTH[Identity Provider / JWT Verification]:::backend
        
        subgraph "Ingestion Microservice: Semantic Decomposition"
            PARSE[LlamaIndex: Document Normalization]:::brain
            EXTRACT[DynamicTripletExtractor: Stochastic NER]:::brain
            RESOLVE[Entity Resolution & Disambiguation Agent]:::brain
        end
    
        subgraph "Retrieval Microservice: GraphRAG Synthesis"
            TRAVERSE[Cypher Query Orchestrator]:::brain
            GRAPH_RAG[Contextual RAG Synthesizer]:::brain
        end
    end

    %% Persistence Layer
    subgraph "Data Persistence Layer"
        NEO[(Neo4j AuraDB: Relational Property Graph)]:::database
        VEC[(Vector Database: High-Dimensional Embeddings)]:::database
        BLOB[Object Storage: Source Data Persistence]:::database
    end

    %% Inference Layer
    subgraph "Cognitive Inference Layer (LLM)"
        GEMINI[Large Language Model: Gemini 1.5 Flash]:::model
        EMBED[Embedding Model: text-embedding-004]:::model
    end

    %% Communication Protocols
    USER -->|TLS/HTTPS| DASHBOARD
    DASHBOARD --> GVE
    DASHBOARD --> AC

    DASHBOARD -->|RESTful API with Tenant Context| GW
    GW -->|Auth Validation| OAUTH
    
    %% Ingestion Workflow
    GW --> PARSE
    PARSE --> BLOB
    PARSE --> EXTRACT
    EXTRACT -->|Inference Call| GEMINI
    EXTRACT --> RESOLVE
    RESOLVE -->|ACID Transaction| NEO
    PARSE -->|Tokenization| EMBED
    EMBED --> VEC

    %% Retrieval & Synthesis Workflow
    AC --> GW
    GW --> GRAPH_RAG
    GRAPH_RAG -->|K-Nearest Neighbors Search| VEC
    GRAPH_RAG -->|Recursive Path Traversal| TRAVERSE
    TRAVERSE --> NEO
    
    %% Cognitive Feedback Loop
    GRAPH_RAG -->|Augmented Prompt Context| GEMINI
    GEMINI -->|Synthesized Discourse Response| AC
    
    %% Telemetry & Visualization Data
    NEO -->|Graph Serialization JSON| GVE

    %% Architectural Styles
    classDef frontend fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef backend fill:#0f172a,stroke:#334155,color:#fff;
    classDef database fill:#0c4a6e,stroke:#0ea5e9,color:#fff;
    classDef model fill:#1e1b4b,stroke:#8b5cf6,color:#fff;
    classDef brain fill:#581c87,stroke:#c084fc,color:#fff;
    classDef user fill:#444,stroke:#fff,color:#fff;

    %% Terminal Labels
    USER(Authenticated User)
    GEMINI(Inference Engine)
    NEO(Graph Database)
    VEC(Vector Store)
    EXTRACT(Triplet Extraction)
