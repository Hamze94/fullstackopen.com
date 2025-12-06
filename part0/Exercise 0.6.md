## Exercise 0.6

```mermaid
sequenceDiagram
    participant Browser
    participant Server

    Note right of Browser: User writes a new note in SPA text field

    Browser->>Server: POST /notes { content: "New SPA note" }
    activate Server
    Server-->>Browser: JSON { content: "New SPA note", date: "2025-11-16" }
    deactivate Server

    Note right of Browser: Browser dynamically adds the new note without reloading
