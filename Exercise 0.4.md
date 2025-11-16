
## Exercise 0.4
```mermaid
sequenceDiagram
    participant Browser
    participant Server

    Browser->>Server: GET /notes
    activate Server
    Server-->>Browser: HTML document
    deactivate Server

    Browser->>Server: GET /main.css
    activate Server
    Server-->>Browser: CSS file
    deactivate Server

    Browser->>Server: GET /main.js
    activate Server
    Server-->>Browser: JS file
    deactivate Server

    Note right of Browser: User writes a new note in the text field

    Browser->>Server: POST /notes { content: "New note" }
    activate Server
    Server-->>Browser: JSON { content: "New note", date: "2025-11-16" }
    deactivate Server

    Note right of Browser: Browser updates the page with the new note
