"use client";

export default function defaultPage() {
  return (
    <div className="bg-card text-foreground p-8 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to the Random Club Challenge! 🏌️‍♂️</h1>
      <p className="text-lg mb-6 text-center max-w-xl">
        Ready to let fate (and a slightly mischievous caddie) pick your next golf club? This app is here to add a little chaos and a lot of fun to your next round. Remember: the club you get is the club you must use—no takesies backsies!
      </p>
      <div className="bg-muted rounded-xl p-6 shadow-md mb-6 max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-2 text-center">Getting Started</h2>
        <ul className="list-disc list-inside text-left text-base space-y-1">
          <li>Head to <span className="font-semibold">Golf Bags</span> to create your bag and fill it with clubs.</li>
          <li>Visit <span className="font-semibold">Golf Clubs</span> to add, edit, or admire your club collection.</li>
          <li>When you're ready, go to <span className="font-semibold">Play</span> and let the caddie pick a club for you at random!</li>
        </ul>
      </div>
      <p className="text-muted-foreground text-center text-sm max-w-md">
        Pro tip: If you shank your shot, just blame the app. That's what it's here for!
      </p>
			<p className="pt-5 text-muted-foreground text-center text-sm max-w-md">
        Icons by <a href="https://www.flaticon.com/authors/iconixar" target="_blank">Iconixar</a>
      </p>
    </div>
  );
}
