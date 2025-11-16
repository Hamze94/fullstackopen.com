## Exercise 0.5

```mermaid
sequenceDiagram
    participant Browser
    participant Server

    Browser->>Server: GET /spa
    activate Server
    Server-->>Browser: HTML + CSS + JS
    deactivate Server

    Note right of Browser: Browser executes JavaScript

    Browser->>Server: GET /data.json
    activate Server
    Server-->>Browser: JSON array of notes
    deactivate Server

    Note right of Browser: Browser renders notes dynamically
