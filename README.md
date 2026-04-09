# OmniGraph Physical Architecture

This diagram illustrates the technical stack, containerization, and data flows between the microservices, graph database, and reasoning models.

```mermaid
graph TD
    %% Define User
    USER[Fiscal Services User / Tenant]:::user

    %% Client Layer
    subgraph "Client Layer (React/Next.js)"
        DASHBOARD[OmniGraph Pro Dashboard]:::frontend
        GVE[Graph Viz Engine: react-force-graph]:::frontend
        AC[AI Chat & Discourse Analytics Panel]:::frontend
    end

    %% API Layer
    subgraph "API & Orchestration Layer (Python/FastAPI)"
        GW[FastAPI Gateway: Multi-Tenant Middleware]:::backend
        OAUTH[Clerk Auth / JWT Verification]:::backend
        
        subgraph "Ingestion Microservice"
            PARSE[LlamaIndex: PDF/Doc Ingest]:::brain
            EXTRACT[DynamicTripletExtractor: No-Schema NER]:::brain
            RESOLVE[Entity Resolution Agent]:::brain
        end
    
        subgraph "RAG Microservice"
            TRAVERSE[Cypher Query Builder]:::brain
            GRAPH_RAG[GraphRAG Context Synthesizer]:::brain
        end
    end

    %% Storage & Database Layer
    subgraph "Storage Layer"
        NEO[(Neo4j AuraDB: Property Graph)]:::database
        VEC[(Pinecone / Milvus: Vector DB)]:::database
        BLOB[S3: Original Source Docs]:::database
    end

    %% Reasoning Layer
    subgraph "Reasoning Layer (Foundational Models)"
        GEMINI[Gemini 1.5 Flash: Extraction & Summary]:::model
        EMBED[text-embedding-004: Vectorization]:::model
    end

    %% Connections
    USER -->|HTTPS| DASHBOARD
    DASHBOARD --> GVE
    DASHBOARD --> AC

    DASHBOARD -->|API Calls (tenant_id)| GW
    GW -->|Validate| OAUTH
    
    %% Ingestion Flow
    GW --> PARSE
    PARSE --> BLOB
    PARSE --> EXTRACT
    EXTRACT -->|Discover Entities| GEMINI
    EXTRACT --> RESOLVE
    RESOLVE -->|Merge Nodes| NEO
    PARSE -->|Chunk Text| EMBED
    EMBED --> VEC

    %% Retrieval Flow
    AC --> GW
    GW --> GRAPH_RAG
    GRAPH_RAG -->|Semantic Search| VEC
    GRAPH_RAG -->|Graph Walk (Pathways)| TRAVERSE
    TRAVERSE --> NEO
    
    %% AI Final Output
    GRAPH_RAG -->|Sub-Graph Context| GEMINI
    GEMINI -->|Discourse Summary| AC
    
    %% Vis Flow
    NEO -->|Graph Data JSON| GVE

    %% Styles
    classDef frontend fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef backend fill:#0f172a,stroke:#334155,color:#fff;
    classDef database fill:#0c4a6e,stroke:#0ea5e9,color:#fff;
    classDef model fill:#1e1b4b,stroke:#8b5cf6,color:#fff;
    classDef brain fill:#581c87,stroke:#c084fc,color:#fff;
    classDef user fill:#444,stroke:#fff,color:#fff;

    %% Add Icons (Unicode)
    USER(👤 Tenant)
    GEMINI(♊ Gemini 1.5)
    NEO(🕸️ Neo4j)
    VEC(📈 Vector DB)
    EXTRACT(🧠 Triplet Extraction)
