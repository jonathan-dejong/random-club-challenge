

export interface Bag {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Club {
  id: number;
  name: string;
  description?: string;
  icon: string;
  createdAt?: string;
}

export interface ClubRelation {
  id: number;
  createdAt?: string;
  clubId: number;
  bagId: number;
}

// Golf Bags
export async function getAllBags(): Promise<Bag[]> {
  const response = await fetch('/api/bags');
  if (!response.ok) throw new Error('Failed to fetch bags');
  return response.json();
}

export async function getBagById(id: number): Promise<Bag | null> {
  const response = await fetch(`/api/bags/${id}`);
  if (!response.ok) return null;
  return response.json();
}

export async function createBag(data: { name: string; description?: string; icon?: string }) {
  const response = await fetch('/api/bags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create bag');
  return response.json();
}

export async function updateBag(id: number, data: { name?: string; description?: string; icon?: string }) {
  const response = await fetch(`/api/bags/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update bag');
  return response.json();
}

export async function deleteBag(id: number) {
  const response = await fetch(`/api/bags/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete bag');
  return response.json();
}

// Golf Clubs
export async function getAllClubs(): Promise<Club[]> {
  const response = await fetch('/api/clubs');
  if (!response.ok) throw new Error('Failed to fetch clubs');
  return response.json();
}

export async function getClubById(id: number): Promise<Club | null> {
  const response = await fetch(`/api/clubs/${id}`);
  if (!response.ok) return null;
  return response.json();
}

export async function createClub(data: { name: string; description?: string; icon?: string }) {
  const response = await fetch('/api/clubs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create club');
  return response.json();
}

export async function updateClub(id: number, data: { name?: string; description?: string; icon?: string }) {
  const response = await fetch(`/api/clubs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update club');
  return response.json();
}

export async function deleteClub(id: number) {
  const response = await fetch(`/api/clubs/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete club');
  return response.json();
}

export async function clearAllClubs() {
  const response = await fetch('/api/clubs', {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to clear all clubs');
  return response.json();
}

// Golf Club Relations
export async function getClubsForBag(bagId: number): Promise<ClubRelation[]> {
  const response = await fetch(`/api/bags/${bagId}/clubs`);
  if (!response.ok) throw new Error('Failed to fetch bag clubs');
  return response.json();
}

export async function addClubToBag(bagId: number, clubId: number) {
  const response = await fetch(`/api/bags/${bagId}/clubs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clubId }),
  });
  if (!response.ok) throw new Error('Failed to add club to bag');
  return response.json();
}

export async function removeClubFromBag(bagId: number, clubId: number) {
  const response = await fetch(`/api/bags/${bagId}/clubs?clubId=${clubId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to remove club from bag');
  return response.json();
}

// Random club from bag
export async function getRandomClubFromBag(bagId: number): Promise<Club | null> {
  const response = await fetch(`/api/bags/${bagId}/random`);
  if (!response.ok) throw new Error('Failed to get random club');
  return response.json();
}
