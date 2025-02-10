# README: Virtual ID (VID) Modelling with Machine Learning and Dates

This repository provides a simple implementation of **Virtual ID (VID)** modelling in TypeScript. The code demonstrates how to map user identifiers from different platforms (e.g., Google, Facebook) to a common **Virtual ID** using machine learning-inspired techniques and date-based logic. This approach is essential for projects requiring **cross-media measurement** and **deduplication**.

---

## Features

1. **Virtual ID Management**:

   - Dynamically generates unique Virtual IDs (`VID-1`, `VID-2`, etc.) for unmatched identifiers.
   - Maps multiple user identifiers to a single Virtual ID based on matching criteria.

2. **Machine Learning-Inspired Matching**:

   - Uses **cosine similarity** to evaluate the similarity between user identifiers.
   - A similarity threshold (`0.7`) determines whether two IDs should be grouped under the same Virtual ID.

3. **Date-Based Validation**:
   - Ensures that user identifiers are matched only if their timestamps are within **30 days** of each other.
   - Uses the `date-fns` library for date calculations.

---

## Code Overview

### 1️⃣ Data Types

- **`UserIdentifier`**:

  ```typescript
  type UserIdentifier = {
    platform: string; // Platform name (e.g., Google, Facebook)
    id: string; // Unique identifier from the platform
    timestamp: string; // ISO date when the identifier was created
  };
  ```

- **`VirtualID`**:
  ```typescript
  type VirtualID = {
    vid: string; // Virtual ID assigned to the group
    identifiers: UserIdentifier[]; // List of associated identifiers
  };
  ```

### 2️⃣ Core Class: `VIDModel`

- **Responsibilities**:
  - Manages Virtual ID creation and mapping.
  - Matches identifiers using similarity scores and date-based rules.

#### Key Methods:

1. **`generateVirtualID`**:
   Generates unique Virtual IDs sequentially (e.g., `VID-1`, `VID-2`).

2. **`calculateSimilarity`**:

   ```typescript
   private calculateSimilarity(id1: string, id2: string): number;
   ```

   - Calculates a similarity score between two identifiers based on shared characters.
   - Returns a value between `0` and `1`. Higher values indicate greater similarity.

3. **`matchIdentifier`**:

   ```typescript
   private matchIdentifier(identifier: UserIdentifier): string | null;
   ```

   - Finds an existing Virtual ID for a given identifier if:
     - Similarity score >= `0.7`.
     - Timestamps are within **30 days**.

4. **`addIdentifier`**:

   ```typescript
   public addIdentifier(identifier: UserIdentifier): VirtualID;
   ```

   - Adds a new user identifier to the model.
   - Creates a new Virtual ID if no matches are found.

5. **`getAllVirtualIDs`**:
   ```typescript
   public getAllVirtualIDs(): VirtualID[];
   ```
   - Retrieves all Virtual IDs and their associated identifiers.

### 3️⃣ Example Usage

Here’s a simple example of how to use the `VIDModel` class:

#### Input Data:

```typescript
const userIdentifiers: UserIdentifier[] = [
  { platform: 'Google', id: 'user1234', timestamp: '2025-02-01' },
  { platform: 'Facebook', id: 'user5678', timestamp: '2025-02-05' },
  { platform: 'Google', id: 'user1235', timestamp: '2025-01-20' },
  { platform: 'Facebook', id: 'user5679', timestamp: '2025-01-10' },
];
```

#### Processing:

```typescript
const vidModel = new VIDModel();

// Add identifiers to the VID model
for (const identifier of userIdentifiers) {
  const vid = vidModel.addIdentifier(identifier);
  console.log(`Mapped to VID: ${vid.vid}`);
}

// Output all Virtual IDs
console.log('All Virtual IDs:');
console.log(vidModel.getAllVirtualIDs());
```

#### Output:

- Example Virtual ID mappings:
  ```json
  [
    {
      "vid": "VID-1",
      "identifiers": [
        { "platform": "Google", "id": "user1234", "timestamp": "2025-02-01" },
        { "platform": "Google", "id": "user1235", "timestamp": "2025-01-20" }
      ]
    },
    {
      "vid": "VID-2",
      "identifiers": [
        { "platform": "Facebook", "id": "user5678", "timestamp": "2025-02-05" },
        { "platform": "Facebook", "id": "user5679", "timestamp": "2025-01-10" }
      ]
    }
  ]
  ```

---

## How It Works

1. **Add Identifiers**:

   - Each identifier is compared to existing Virtual IDs.
   - If no match is found, a new Virtual ID is created.

2. **Match Criteria**:

   - Identifiers must share at least 70% similarity in their IDs.
   - Timestamps must be within 30 days.

3. **View Results**:
   - The `getAllVirtualIDs` method retrieves the complete mapping of Virtual IDs to their associated identifiers.

---

## Libraries Used

- **`date-fns`**: For date calculations (e.g., checking if timestamps are within 30 days).

Install it using:

```bash
npm install date-fns
```
