import { differenceInDays, parseISO } from 'date-fns'; // To handle date calculations

type UserIdentifier = {
  platform: string; // e.g., "Google", "Facebook"
  id: string; // Platform-specific identifier
  timestamp: string; // ISO format date when the identifier was generated
};

type VirtualID = {
  vid: string; // Unique Virtual ID
  identifiers: UserIdentifier[]; // Linked user identifiers
};

class VIDModel {
  private virtualIdMap: Map<string, VirtualID>; // Map of platform-specific IDs to Virtual IDs
  private vidCounter: number;

  constructor() {
    this.virtualIdMap = new Map();
    this.vidCounter = 1;
  }

  // Generate a new Virtual ID
  private generateVirtualID(): string {
    return `VID-${this.vidCounter++}`;
  }

  // Calculate cosine similarity (basic ML-inspired logic)
  private calculateSimilarity(id1: string, id2: string): number {
    const commonChars = [...id1].filter((char) => id2.includes(char)).length;
    const maxLength = Math.max(id1.length, id2.length);
    return commonChars / maxLength; // Simple ratio of common characters
  }

  // Probabilistic and time-based matching
  private matchIdentifier(identifier: UserIdentifier): string | null {
    for (const vid of this.virtualIdMap.values()) {
      for (const id of vid.identifiers) {
        // Check if platforms match
        if (id.platform !== identifier.platform) continue;

        // Calculate similarity score (threshold set at 0.7 for matching)
        const similarity = this.calculateSimilarity(id.id, identifier.id);
        if (similarity < 0.7) continue;

        // Check if timestamps are within 30 days
        const daysDifference = differenceInDays(
          parseISO(identifier.timestamp),
          parseISO(id.timestamp)
        );
        if (Math.abs(daysDifference) > 30) continue;

        // If both conditions match, return the VID
        return vid.vid;
      }
    }
    return null;
  }

  // Add a new user identifier to the model
  public addIdentifier(identifier: UserIdentifier): VirtualID {
    let vid = this.matchIdentifier(identifier);

    if (!vid) {
      // No match found, create a new Virtual ID
      vid = this.generateVirtualID();
      this.virtualIdMap.set(vid, { vid, identifiers: [identifier] });
    } else {
      // Match found, add identifier to the existing Virtual ID
      const existingVID = this.virtualIdMap.get(vid);
      existingVID?.identifiers.push(identifier);
    }

    return this.virtualIdMap.get(vid)!;
  }

  // Get all Virtual IDs
  public getAllVirtualIDs(): VirtualID[] {
    return Array.from(this.virtualIdMap.values());
  }
}

// Example Usage
const vidModel = new VIDModel();

// Simulating user identifiers with timestamps
const userIdentifiers: UserIdentifier[] = [
  { platform: 'Google', id: 'user1234', timestamp: '2025-02-01' },
  { platform: 'Facebook', id: 'user5678', timestamp: '2025-02-05' },
  { platform: 'Google', id: 'user1235', timestamp: '2025-01-20' }, // Slightly different, may map to same VID
  { platform: 'Facebook', id: 'user5679', timestamp: '2025-01-10' },
];

// Add identifiers to the VID model
for (const identifier of userIdentifiers) {
  const vid = vidModel.addIdentifier(identifier);
  console.log(`Mapped to VID: ${vid.vid}`);
}

// Output all Virtual IDs and their associated identifiers
console.log('All Virtual IDs:');
console.log(JSON.stringify(vidModel.getAllVirtualIDs(), null, 2));
