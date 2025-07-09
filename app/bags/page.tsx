"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
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
} from "../data";

interface Bag {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function BagsPage() {
  const [bags, setBags] = useState<Bag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editBag, setEditBag] = useState<Bag | null>(null);
  const [bagName, setBagName] = useState("");
  const [bagDescription, setBagDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setBags(await getAllBags());
      setLoading(false);
    })();
  }, []);

  const handleAdd = () => {
    setEditBag(null);
    setBagName("");
    setBagDescription("");
    setShowDialog(true);
  };

  const handleEdit = (bag: Bag) => {
    setEditBag(bag);
    setBagName(bag.name);
    setBagDescription(bag.description || "");
    setShowDialog(true);
  };

  const handleDelete = async (bag: Bag) => {
    if (window.confirm("Delete this bag?")) {
      await deleteBag(bag.id);
      setBags(await getAllBags());
    }
  };

  const handleDialogSave = async () => {
    if (editBag) {
      await updateBag(editBag.id, { name: bagName, description: bagDescription });
    } else {
      await createBag({ name: bagName, description: bagDescription });
    }
    setShowDialog(false);
    setBags(await getAllBags());
  };

  const handleSelect = (bag: Bag) => {
    router.push(`/bags/${bag.id}`);
  };

  return (
    <div className="pt-20 px-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Your Golf Bags</h2>
        <Button onClick={handleAdd}>Add Bag</Button>
      </div>
      <Card>
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : bags.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No bags yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bags.map((bag) => (
                <TableRow key={bag.id}>
                  <TableCell>{bag.name}</TableCell>
                  <TableCell>{bag.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button onClick={() => handleSelect(bag)}>Select</Button>
                      <Button onClick={() => handleEdit(bag)}>Edit</Button>
                      <Button onClick={() => handleDelete(bag)} className="bg-red-600 hover:bg-red-700">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <div className="mb-4 text-lg font-semibold">{editBag ? "Edit Bag" : "Add Bag"}</div>
        <div className="mb-2">
          <label className="block mb-1">Name</label>
          <Input value={bagName} onChange={e => setBagName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <Input value={bagDescription} onChange={e => setBagDescription(e.target.value)} />
        </div>
        <div className="flex gap-2 justify-end">
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button onClick={handleDialogSave}>{editBag ? "Save" : "Add"}</Button>
        </div>
      </Dialog>
    </div>
  );
}
