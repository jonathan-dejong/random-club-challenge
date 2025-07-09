"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllBags, getAllClubs, getClubsForBag, getRandomClubFromBag } from "../data";

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

export default function PlayPage() {
  const [bags, setBags] = useState<Bag[]>([]);
  const [selectedBagId, setSelectedBagId] = useState<string>("");
  const [clubs, setClubs] = useState<ClubRelation[]>([]);
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [randomClub, setRandomClub] = useState<Club | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    (async () => {
      const bags = await getAllBags();
      setBags(bags);
      setAllClubs(await getAllClubs());
      if (bags.length > 0) {
        setSelectedBagId(bags[0].id.toString());
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedBagId) return;
      setClubs(await getClubsForBag(Number(selectedBagId)));
    })();
  }, [selectedBagId]);

  const handleHitMe = async () => {
    setAnimating(true);
    setRandomClub(null);
    setTimeout(async () => {
      const club = await getRandomClubFromBag(Number(selectedBagId));
      setRandomClub(club);
      setAnimating(false);
    }, 1200);
  };

  return (
    <div className="pt-20 px-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Random Club Challenge</h2>
      <div className="mb-4">
        <label className="block mb-1">Select Bag</label>
        <select className="w-full border rounded px-2 py-2" value={selectedBagId} onChange={e => setSelectedBagId(e.target.value)}>
          {bags.map((bag) => (
            <option key={bag.id} value={bag.id}>{bag.name}</option>
          ))}
        </select>
      </div>
      <Card>
        <div className="mb-4">
          <div className="font-semibold mb-2">Clubs in Bag:</div>
          {clubs.length === 0 ? (
            <div className="text-gray-500">No clubs in this bag.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {clubs.map((rel) => {
                const club = allClubs.find((c) => c.id === rel.clubId);
                return (
                  <span key={rel.id} className="px-3 py-1 rounded bg-green-100 text-green-900 flex items-center gap-1">
                    <span>{club?.icon}</span>
                    <span>{club?.name}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center mt-6 mb-2">
          <Button onClick={handleHitMe} className="text-2xl px-8 py-4" disabled={clubs.length === 0 || animating}>
            {animating ? "Spinning..." : "Hit me!"}
          </Button>
        </div>
        {randomClub && (
          <div className="mt-6 flex flex-col items-center animate-bounce">
            <div className="text-5xl mb-2">{randomClub.icon}</div>
            <div className="text-2xl font-bold">{randomClub.name}</div>
            <div className="text-gray-600">{randomClub.description}</div>
          </div>
        )}
      </Card>
    </div>
  );
}
