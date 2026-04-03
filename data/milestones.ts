export interface Milestone {
  id: number;
  icon: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  isOpenEnded?: boolean;
  aside?: string;
}

export const milestones: Milestone[] = [
  {
    id: 1,
    icon: "✨",
    date: "19 Feb 2026",
    title: "The Day the Universe Conspired",
    description:
      "My best friend's sister's wedding. I went there for the food and the dancing. I didn't know I was about to meet you. But there you were. And honestly? I was done for.",
    aside:
      "Somewhere between 'just talking' and 'falling hard,' I sent gajar ka halwa to her office. Because apparently that's how I flirt.",
  },
  {
    id: 2,
    icon: "🍸",
    date: "3 Mar 2026",
    title: "First Date — CyberHub, Gurgaon",
    description:
      "A bracelet for you. Chili's for us. And then that rooftop. We were standing outside Diablo, leaning on the railing. City below. Music floating up. I looked at you and thought — yeah, I'm completely screwed.",
  },
  {
    id: 3,
    icon: "💋",
    date: "19 Mar 2026",
    title: "Your Kitchen, My Heart",
    description:
      "You invited me over and cooked paneer and rice. Handmade. For me. It was the most delicious thing I've ever tasted — and not just because of the food. We had our first kiss that day. I replay it in my head more than I'll ever admit.",
  },
  {
    id: 4,
    icon: "🌹",
    date: "24 Mar 2026",
    title: "Officially Ours",
    description:
      "Rose bouquet. Your flat. A question I already knew the answer to. You said yes. And just like that — 'something special' became 'officially us.' I don't think I stopped smiling for two days.",
  },
  {
    id: 5,
    icon: "🚗",
    date: "28 Mar 2026",
    title: "The Office Surprise",
    description:
      "I called you and said, 'Come outside, I'm here.' The look on your face when you walked out. That right there? That's why I'll keep showing up.",
  },
  {
    id: 6,
    icon: "🎁",
    date: "2 Apr 2026",
    title: "Hot Wheels & a Love Letter",
    description:
      "You gave me a Hot Wheels collection in a lighted wooden case. A handwritten note. A cartoon of us — the shy calm guy and the chaotic girl — with a lipstick kiss on the paper. I didn't fall fast. I just slowly realised I was completely, irreversibly gone.",
  },
  {
    id: 7,
    icon: "✍️",
    date: "???",
    title: "And this story is still being written...",
    description:
      "This isn't where it ends. This is where it starts. The best parts haven't happened yet, Devi. And I want every single one of them to be with you.",
    isOpenEnded: true,
  },
];
