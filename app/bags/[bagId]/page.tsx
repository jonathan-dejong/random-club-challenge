"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import {
  getBagById,
  getClubsForBag,
  getAllClubs,
  addClubToBag,
  removeClubFromBag,
} from "../../data";

interface Bag {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Club {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  createdAt?: string;
}

interface ClubRelation {
  id: number;
  createdAt?: string;
  clubId: number;
  bagId: number;
}

export default function BagDetailsPage() {
  const params = useParams();
  const bagId = params?.bagId ? Number(params.bagId) : undefined;
  const [bag, setBag] = useState<Bag | null>(null);
  const [clubs, setClubs] = useState<ClubRelation[]>([]);
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState("");

  useEffect(() => {
    (async () => {
      if (!bagId) return;
      setBag(await getBagById(bagId));
      setClubs(await getClubsForBag(bagId));
      setAllClubs(await getAllClubs());
    })();
  }, [bagId]);

  const handleAddClub = async () => {
    if (!selectedClubId || !bagId) return;
    await addClubToBag(bagId, Number(selectedClubId));
    setClubs(await getClubsForBag(bagId));
    setShowAddDialog(false);
    setSelectedClubId("");
  };

  const handleRemoveClub = async (clubId: number) => {
    if (!bagId) return;
    await removeClubFromBag(bagId, clubId);
    setClubs(await getClubsForBag(bagId));
  };

  return (
    <div className="pt-20 px-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{bag?.name || "Golf Bag"}</h2>
        <Button onClick={() => setShowAddDialog(true)}>Add Club</Button>
      </div>
      <Card>
        {clubs.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No clubs in this bag.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Club</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubs.map((rel) => {
                const club = allClubs.find((c) => c.id === rel.clubId);
                return (
                  <TableRow key={rel.id}>
                    <TableCell>{club ? club.name : "Unknown Club"}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleRemoveClub(rel.clubId)} className="bg-red-600 hover:bg-red-700">Remove</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <div className="mb-4 text-lg font-semibold">Add Club to Bag</div>
        <div className="mb-4">
          <label className="block mb-1">Select Club</label>
          <select className="w-full border rounded px-2 py-2" value={selectedClubId} onChange={e => setSelectedClubId(e.target.value)}>
            <option value="">Select a club...</option>
            {allClubs.map((club) => (
              <option key={club.id} value={club.id}>{club.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 justify-end">
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddClub} disabled={!selectedClubId}>Add</Button>
        </div>
      </Dialog>
    </div>
  );
}
