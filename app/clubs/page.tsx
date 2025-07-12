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
  getAllClubs,
  createClub,
  updateClub,
  deleteClub,
  clearAllClubs,
} from "../data";
import { Pencil, Trash2, AlertTriangle, Lock } from "lucide-react";
import ClubIcon from "@/components/ui/ClubIcon";
import { defaultClubs } from "../clubSeeds";

interface Club {
  id: number;
  name: string;
  description?: string;
  icon: string;
  createdAt?: string;
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [editClub, setEditClub] = useState<Club | null>(null);
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [clubIcon, setClubIcon] = useState("");

  // Helper function to check if a club is a seeded club
  const isSeededClub = (club: Club): boolean => {
    return defaultClubs.some(defaultClub =>
      defaultClub.name === club.name &&
      defaultClub.icon === club.icon &&
      defaultClub.description == club.description
    );
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const loadedClubs = await getAllClubs();
      console.log('Loaded clubs:', loadedClubs as Club[]);
      setClubs(loadedClubs as Club[]);
      setLoading(false);
    })();
  }, []);

  const handleEdit = async (club: Club) => {
    // Prevent editing seeded clubs
    if (isSeededClub(club)) {
      alert("Cannot edit default clubs. You can only edit custom clubs.");
      return;
    }

    setEditClub(club);
    setClubName(club.name);
    setClubDescription(club.description || "");
    setClubIcon(club.icon);
    setShowDialog(true);
  };

  const handleDelete = async (club: Club) => {
    // Prevent deleting seeded clubs
    if (isSeededClub(club)) {
      alert("Cannot delete default clubs. You can only delete custom clubs.");
      return;
    }

    if (window.confirm(`Delete "${club.name}"?`)) {
      await deleteClub(club.id);
      setClubs(await getAllClubs());
    }
  };

  const handleClearCustom = async () => {
    if (window.confirm("Are you sure you want to delete all custom clubs? This action cannot be undone.")) {
      await clearAllClubs();
      setClubs(await getAllClubs());
      setShowClearDialog(false);
    }
  };

  const handleDialogSave = async () => {
    if (editClub) {
      await updateClub(editClub.id, {
        name: clubName,
        description: clubDescription,
        icon: clubIcon
      });
    } else {
      await createClub({
        name: clubName,
        description: clubDescription,
        icon: clubIcon
      });
    }
    setShowDialog(false);
    const updatedClubs = await getAllClubs();
    console.log('Clubs after save:', updatedClubs as Club[]);
    setClubs(updatedClubs as Club[]);
  };

  const resetDialog = () => {
    setEditClub(null);
    setClubName("");
    setClubDescription("");
    setClubIcon("");
  };

  const customClubsCount = clubs.filter(club => !isSeededClub(club)).length;

  return (
    <div className="pt-5 pb-5 px-2 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Golf clubs</h2>
        <div className="flex sm:flex-row justify-center items-center gap-2">
          <Dialog
            open={showDialog}
            onOpenChange={(open: boolean) => {
              setShowDialog(open);
              if (!open) {
                resetDialog();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-xl shadow-sm flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
                onClick={resetDialog}
              >
                <span className="text-xl">+</span> Add Club
              </Button>
            </DialogTrigger>
            <DialogContent className="animate-fade-in">
              <DialogTitle>{editClub ? "Edit Club" : "Add Club"}</DialogTitle>
              <DialogDescription>
                {editClub ? "Update the details of your golf club." : "Enter details for your new golf club."}
              </DialogDescription>
              <div className="mb-2">
                <label className="block mb-1 text-foreground">Name</label>
                <Input value={clubName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClubName(e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="block mb-1 text-foreground">Description</label>
                <Input value={clubDescription} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClubDescription(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-foreground">Icon Type</label>
                <select
                  value={clubIcon}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setClubIcon(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="">Select an icon type</option>
                  <option value="DriverIcon">Driver</option>
                  <option value="WoodIcon">Wood</option>
                  <option value="HybridIcon">Hybrid</option>
                  <option value="IronIcon">Iron</option>
                  <option value="WedgeIcon">Wedge</option>
                  <option value="PutterIcon">Putter</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="transition-transform hover:scale-105 active:scale-95">Cancel</Button>
                <Button type="button" onClick={handleDialogSave} className="transition-transform hover:scale-105 active:scale-95">{editClub ? "Save" : "Add"}</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="rounded-xl shadow-sm flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
                disabled={customClubsCount === 0}
              >
                <AlertTriangle className="w-4 h-4" />
                Delete Custom ({customClubsCount})
              </Button>
            </DialogTrigger>
            <DialogContent className="animate-fade-in">
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Delete Custom Clubs
              </DialogTitle>
              <DialogDescription>
                This will permanently delete all custom clubs you have added. Default clubs will remain untouched.
                <br /><br />
                <strong>Warning:</strong> This will also remove custom clubs from all golf bags.
              </DialogDescription>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowClearDialog(false)} className="transition-transform hover:scale-105 active:scale-95">Cancel</Button>
                <Button type="button" variant="destructive" onClick={handleClearCustom} className="transition-transform hover:scale-105 active:scale-95">Delete Custom Clubs</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-card rounded-2xl shadow-lg py-0">
        {loading ? (
          <div className="p-4 text-center text-foreground">Loading...</div>
        ) : clubs.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No clubs yet.</div>
        ) : (
          <div className="rounded-2xl overflow-hidden py-0">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="font-semibold text-sm">Icon</TableHead>
                  <TableHead className="font-semibold text-sm">Name</TableHead>
                  <TableHead className="font-semibold text-sm">Description</TableHead>
                  <TableHead className="font-semibold text-sm hidden sm:table-cell">Type</TableHead>
                  <TableHead className="font-semibold text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clubs.map((club) => {
                  const isSeeded = isSeededClub(club);
                  return (
                    <TableRow key={club.id} className="hover:animate-fade-in">
                      <TableCell className="text-sm">
                        <ClubIcon clubType={club.name} iconName={club.icon} className="w-8 h-8" />
                      </TableCell>
                      <TableCell className="text-sm font-medium">{club.name}</TableCell>
                      <TableCell className="text-sm">{club.description}</TableCell>
                      <TableCell className="text-sm hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          {isSeeded ? (
                            <>
                              <Lock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Default</span>
                            </>
                          ) : (
                            <span className="text-xs text-primary">Custom</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex gap-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(club)}
                            aria-label="Edit"
                            className={`transition-transform hover:scale-105 active:scale-95 ${isSeeded ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSeeded}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(club)}
                            aria-label="Delete"
                            className={`transition-transform hover:scale-105 active:scale-95 ${isSeeded ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSeeded}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
