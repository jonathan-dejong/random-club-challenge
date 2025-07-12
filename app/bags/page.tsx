"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import {
  getAllBags,
  createBag,
  updateBag,
  deleteBag,
  getAllClubs,
  addClubToBag,
  getClubsForBag,
  removeClubFromBag,
} from "../data";
import { Pencil, Trash2 } from "lucide-react";
import ClubIcon from "@/components/ui/ClubIcon";

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
  icon: string;
}

export default function BagsPage() {
  const [bags, setBags] = useState<Bag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editBag, setEditBag] = useState<Bag | null>(null);
  const [bagName, setBagName] = useState("");
  const [bagDescription, setBagDescription] = useState("");
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [selectedClubIds, setSelectedClubIds] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const loadedBags = await getAllBags();
      console.log('Loaded bags:', loadedBags as Bag[]);
      setBags(loadedBags as Bag[]);
      setLoading(false);
      setAllClubs(await getAllClubs());
    })();
  }, []);

  const handleEdit = async (bag: Bag) => {
    setEditBag(bag);
    setBagName(bag.name);
    setBagDescription(bag.description || "");
    // Pre-select clubs already in the bag
    const rels = await getClubsForBag(bag.id);
    setSelectedClubIds(rels.map(r => r.clubId));
    setShowDialog(true);
  };

  const handleDelete = async (bag: Bag) => {
    if (window.confirm("Delete this bag?")) {
      await deleteBag(bag.id);
      setBags(await getAllBags());
    }
  };

  const handleClubCheckbox = (clubId: number) => {
    setSelectedClubIds((prev) =>
      prev.includes(clubId) ? prev.filter(id => id !== clubId) : [...prev, clubId]
    );
  };

  const handleDialogSave = async () => {
    let bagId = editBag?.id;
    if (editBag) {
      await updateBag(editBag.id, { name: bagName, description: bagDescription });
    } else {
      await createBag({ name: bagName, description: bagDescription });
      // Get the new bag's ID
      const allBags = await getAllBags();
      bagId = allBags[allBags.length - 1]?.id;
    }
    // Assign selected clubs to the bag
    if (bagId) {
      // Remove all existing relations first (for edit)
      const existing = await getClubsForBag(bagId);
      for (const rel of existing) {
        await removeClubFromBag(bagId, rel.clubId);
      }
      // Add selected clubs
      for (const clubId of selectedClubIds) {
        await addClubToBag(bagId, clubId);
      }
    }
    setShowDialog(false);
    const updatedBags = await getAllBags();
    console.log('Bags after save:', updatedBags as Bag[]);
    setBags(updatedBags as Bag[]);
  };

  return (
    <div className="pt-5 pb-5 px-2 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Golf bags</h2>
        <div className="flex justify-center">
          <Dialog
            open={showDialog}
            onOpenChange={(open) => {
              setShowDialog(open);
              if (!open) {
                // Reset state when dialog closes
                setEditBag(null);
                setBagName("");
                setBagDescription("");
                setSelectedClubIds([]);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-xl shadow-sm flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                onClick={() => {
                  setEditBag(null);
                  setBagName("");
                  setBagDescription("");
                  setSelectedClubIds([]);
                }}
              >
                <span className="text-xl">+</span> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="animate-fade-in">
              <DialogTitle>{editBag ? "Edit Bag" : "Add Bag"}</DialogTitle>
              <DialogDescription>
                {editBag ? "Update the details of your golf bag." : "Enter details for your new golf bag."}
              </DialogDescription>
              <div className="mb-2">
                <label className="block mb-1 text-foreground">Name</label>
                <Input value={bagName} onChange={e => setBagName(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-foreground">Description</label>
                <Input value={bagDescription} onChange={e => setBagDescription(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-foreground">Assign Clubs</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {allClubs.map(club => (
                    <label key={club.id} className="flex items-center gap-2 p-2 rounded border-input border cursor-pointer bg-background text-foreground hover:bg-muted transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedClubIds.includes(club.id)}
                        onChange={() => handleClubCheckbox(club.id)}
                        className="accent-primary"
                      />
                      <ClubIcon clubType={club.name} iconName={club.icon} className="w-6 h-6" />
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate">{club.name}</span>
                        {club.description && (
                          <span className="text-xs text-muted-foreground truncate">{club.description}</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="transition-transform hover:scale-105 active:scale-95">Cancel</Button>
                <Button type="button" onClick={handleDialogSave} className="transition-transform hover:scale-105 active:scale-95">{editBag ? "Save" : "Add"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card className="bg-card rounded-2xl shadow-lg py-0">
        {loading ? (
          <div className="p-4 text-center text-foreground">Loading...</div>
        ) : bags.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No bags yet.</div>
        ) : (
          <div className="rounded-2xl overflow-hidden py-0">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="font-semibold text-sm">Name</TableHead>
                  <TableHead className="font-semibold text-sm">Description</TableHead>
                  <TableHead className="font-semibold text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bags.map((bag) => (
                  <TableRow key={bag.id} className="hover:animate-fade-in">
                    <TableCell className="text-sm">{bag.name}</TableCell>
                    <TableCell className="text-sm">{bag.description}</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex gap-0">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(bag)} aria-label="Edit" className="transition-transform hover:scale-105 active:scale-95">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(bag)} aria-label="Delete" className="transition-transform hover:scale-105 active:scale-95">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
