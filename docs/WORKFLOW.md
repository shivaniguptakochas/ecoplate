# EcoPlate Workflow and Architecture

Copy these Mermaid diagrams into a Mermaid-compatible editor or use them as a basis for diagrams in your report. Verify the diagrams render correctly before submission.

## User workflow

```mermaid
flowchart TD
    A[Provider opens EcoPlate] --> B[Enter surplus food details]
    B --> C{Required fields and times valid?}
    C -- No --> D[Show validation message]
    D --> B
    C -- Yes --> E[Save listing in browser LocalStorage]
    E --> F[Display listing in food grid]
    F --> G[Visitor searches and views details]
    G --> H{Listing available?}
    H -- No --> I[Review current status]
    H -- Yes --> J[Reserve listing]
    J --> K{Food collected?}
    K -- No --> L[Release reservation or wait for deadline]
    K -- Yes --> M[Mark collected]
    M --> N[Refresh impact dashboard]
```

## Prototype architecture

```mermaid
flowchart LR
    U[Campus visitor / provider] --> UI[HTML interface]
    UI --> CSS[CSS styling]
    UI --> JS[JavaScript interactions]
    JS --> V[Form validation]
    JS --> F[Search and status filter]
    JS --> S[Listing status workflow]
    JS --> D[Dashboard metrics]
    JS --> L[(Browser LocalStorage)]
    L --> JS
    JS --> CSV[CSV export]
```

## Listing status lifecycle

```mermaid
stateDiagram-v2
    [*] --> Available
    Available --> Reserved: Reserve
    Reserved --> Available: Release reservation
    Reserved --> Collected: Confirm collection
    Available --> Expired: Deadline passes / mark expired
    Reserved --> Expired: Deadline passes / mark expired
    Collected --> [*]
    Expired --> [*]
```

## Architecture note

This diagram describes the current browser-only prototype. LocalStorage is not a shared server database. The application does not implement authentication, server APIs or cross-device synchronization.
