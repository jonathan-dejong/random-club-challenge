"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAllBags, getAllClubs, getClubsForBag, getRandomClubFromBag } from "../data";
import ClubIcon from "@/components/ui/ClubIcon";
import CaddieIcon from "@/components/ui/CaddieIcon";
import { getRandomPlaceholderText } from "./placeholderTexts";

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
  const [showClubsDialog, setShowClubsDialog] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const [clubAnimationPhase, setClubAnimationPhase] = useState<'initial' | 'drop-in' | 'bounce' | null>(null);

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
      setRandomClub(null); // Reset selected club when bag changes
      setClubAnimationPhase(null); // Reset animation phase
    })();
  }, [selectedBagId]);

  const handleHitMe = async () => {
    setAnimating(true);
    setRandomClub(null);
    setClubAnimationPhase(null);
    setPlaceholderText(getRandomPlaceholderText());
    setTimeout(async () => {
      const club = await getRandomClubFromBag(Number(selectedBagId));
      setRandomClub(club);
      setAnimating(false);
      // Start the animation sequence
      setClubAnimationPhase('initial');
      setTimeout(() => setClubAnimationPhase('drop-in'), 50);
      setTimeout(() => setClubAnimationPhase('bounce'), 800);
    }, 1200);
  };

  return (
    <main id="main-content" className="pt-5 pb-5 px-2 max-w-2xl mx-auto">
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-foreground mb-4">Let&apos;s play!</h2>
				<div className="flex flex-col sm:flex-row justify-center items-center gap-0">
					<div className="flex items-center">
						<label className="block text-foreground font-bold mb-0 mr-2">Using Bag:</label>
						<select className="border-input bg-background text-foreground rounded px-2 py-2" value={selectedBagId} onChange={e => setSelectedBagId(e.target.value)}>
							<option value="">Select a bag...</option>
							{bags.map((bag) => (
								<option key={bag.id} value={bag.id}>{bag.name}</option>
							))}
						</select>
					</div>
					{selectedBagId && (
						<Button
							variant="link"
							onClick={() => setShowClubsDialog(true)}
							className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto underline"
						>
							Show clubs ({clubs.length})
						</Button>
					)}
				</div>
			</div>
      {selectedBagId && (
        <div>
					 <div className="flex flex-col items-center mt-12 mb-2">
            <Button onClick={handleHitMe} className="bg-green-600 text-white hover:bg-green-700 text-2xl px-12 py-8 rounded-xl shadow-sm transition-transform hover:scale-105 focus:scale-105 active:scale-95 flex items-center gap-3 get-club-button" disabled={clubs.length === 0 || animating}>
              {"Ask the caddie for a club"}
              <CaddieIcon className="w-24 h-24 ml-2" />
            </Button>
          </div>
          {animating && (
            <div className="mt-8 flex flex-col items-center">
              <div className="text-lg text-muted-foreground text-center">{placeholderText}</div>
            </div>
          )}
          {randomClub && (
                        <div className={`mt-8 flex flex-col items-center transition-all duration-500 ${
              clubAnimationPhase === 'initial'
                ? 'opacity-0 -translate-y-12 scale-70'
                : clubAnimationPhase === 'drop-in'
                ? 'opacity-100 translate-y-0 scale-100'
                : clubAnimationPhase === 'bounce'
                ? 'opacity-100 translate-y-0 scale-100 animate-bounce-from-bottom'
                : 'opacity-0 -translate-y-12 scale-70'
            }`}>
              <ClubIcon clubType={randomClub.name} iconName={randomClub.icon || ''} className="w-16 h-16" />
              <div className="text-2xl font-bold text-foreground">{randomClub.name}</div>
              <div className="text-muted-foreground text-base">{randomClub.description}</div>
            </div>
          )}
        </div>
      )}

      <Dialog open={showClubsDialog} onOpenChange={setShowClubsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Clubs in bag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {clubs.length === 0 ? (
              <div className="text-muted-foreground text-base">No clubs in this bag.</div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {clubs.map((rel) => {
                  const club = allClubs.find((c) => c.id === rel.clubId);
                  return (
                    <div key={rel.id} className="flex flex-col items-center gap-2 p-3 rounded-lg border text-center">
                      <ClubIcon clubType={club?.name || ''} iconName={club?.icon || ''} className="w-8 h-8" />
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-foreground text-sm">{club?.name}</span>
                        {club?.description && (
                          <span className="text-xs text-muted-foreground">{club.description}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
