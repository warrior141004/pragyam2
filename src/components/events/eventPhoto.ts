/** Free-licence photos from unsplash.com (photo id, alt text). Premium "Unsplash+" images are deliberately excluded. */
export type Photo = [id: string, alt: string];

const PHOTOS = {
  rangoli: [
    ["1700993714468-408700d3599e", "Hand drawing a colourful sand rangoli"],
    ["1635192592106-77a5aacbe1a3", "Flower rangoli lit with diyas"],
    ["1716714620140-9ed26b67e900", "Colourful rangoli of a Kathakali face"],
    ["1605302977140-6572a4421aef", "Mandala rangoli with a lit diya"],
  ],
  skit: [
    ["1503095396549-807759245b35", "Silhouettes of performers against a red curtain"],
    ["1740867650660-e1a0a677e666", "Actors performing a scene on stage"],
    ["1585699324551-f6c309eedeca", "Stage play in front of an audience"],
  ],
  cyber: [
    ["1614064641938-3bbee52942c7", "Red padlock on a computer keyboard"],
    ["1526374965328-7f61d4dc18c5", "Green code streaming down a screen"],
    ["1550751827-4bd374c3f58b", "Glowing teal circuit panel"],
    ["1633265486064-086b219458ec", "Golden padlock on a keyboard"],
  ],
  stalls: [
    ["1599033183537-54ff77f58f75", "People at an outdoor food stall"],
    ["1768162126091-3190821908dd", "Vendors at a bustling market"],
    ["1744748208682-f05eb59915f5", "Visitor browsing an outdoor book stall"],
    ["1732798068339-4a686b74589f", "Busy stall full of items and people"],
  ],
  mobileGaming: [
    ["1564049489314-60d154ff107d", "Player in a battle royale on a phone"],
    ["1639656333010-b6a054423b63", "Playing a video game on a phone"],
    ["1645109870868-e1b6f909e444", "Gamer playing on a phone"],
    ["1646950887163-25b5bff58eed", "Phone showing a video game"],
  ],
  gaming: [
    ["1542751371-adc38448a05e", "Player on a gaming chair playing a video game"],
    ["1511512578047-dfb367046420", "Gaming room with arcade machines"],
    ["1612287230202-1ff1d85d1bdf", "Game controller in cyan and magenta neon light"],
    ["1493711662062-fa541adb3fc8", "Two people playing on a game console"],
    ["1552820728-8b83bb6b773f", "Game controller under blue and orange light"],
    ["1640955014216-75201056c829", "Person playing a video game on a laptop"],
  ],
  coding: [
    ["1504384308090-c894fdcc538d", "People working together on laptops"],
    ["1563461660947-507ef49e9c47", "Participants using laptops at an event"],
    ["1631350397792-8e0c2de5b637", "Group working on laptops at desks"],
    ["1504384764586-bb4cdc1707b0", "Developer typing on a laptop in a dim workspace"],
    ["1756273343749-63f7d6ea0cda", "Students working on laptops at a shared desk"],
  ],
  ideas: [
    ["1503551723145-6c040742065b-v2", "Colourful sticky notes pinned to a board"],
    ["1586936893354-362ad6ae47ba", "Team collaborating with sticky notes"],
    ["1588856122867-363b0aa7f598", "Person looking at a wall of sticky notes"],
    ["1623652554515-91c833e3080e", "Hand holding yellow sticky notes"],
  ],
  quiz: [
    ["1599508704512-2f19efd1e35f", "Red neon question mark on a wall"],
    ["1652077859695-de2851a95620", "Orange question mark lit from below"],
    ["1606326608690-4e0281b1e588", "Pencil on a multiple-choice answer sheet"],
    ["1633613286848-e6f43bbafb8d", "Blue question mark on a pink background"],
  ],
  cultural: [
    ["1463592177119-bab2a00f3ccb", "Three women performing a traditional dance"],
    ["1756370256926-e48ca54c5efe", "Dancers in colourful traditional Indian attire"],
    ["1645264090488-a019de493023", "Two women in traditional Indian dress dancing"],
    ["1593408995262-1d8933c37afc", "Dancer performing on stage"],
  ],
  trophy: [
    ["1578269174936-2709b6aeb913", "Gold trophy"],
    ["1527871369852-eb58cb2b54e2", "Person holding a gold trophy"],
    ["1514820720301-4c4790309f46", "Silver and gold trophies"],
    ["1706374503312-7a4a4c030d2d", "Row of gold medals"],
  ],
  fun: [
    ["1549057446-9f5c6ac91a04", "Friends laughing while walking together"],
    ["1758270705657-f28eec1a5694", "Students taking a selfie in a classroom"],
    ["1484712401471-05c7215830eb", "Friends jumping outdoors"],
    ["1629760946220-5693ee4c46ac", "Board game pieces and dice"],
  ],
  campus: [
    ["1758270705654-bd043ed13d5d", "Students in a lecture hall"],
    ["1569292567777-e5d61a759322", "Group photo of students"],
    ["1513151233558-d860c5398176", "Colourful confetti"],
  ],
  chess: [["1667983088885-226788e18a6e", "Chess board with pieces"]],
} satisfies Record<string, Photo[]>;

export type Pool = keyof typeof PHOTOS;

/**
 * Checked top to bottom against the title and description; the first hit wins.
 * Specific themes come first, because many events also mention "AI" or "tech"
 * (e.g. "Rang-e-AI" is a rangoli event, "Mr. AI" is a skit).
 */
const RULES: [RegExp, Pool][] = [
  [/rangoli/i, "rangoli"],
  [/\bskits?\b|drama|theatre|theater|nukkad|\bmime\b|\bacting\b|\bactors?\b/i, "skit"],
  // before "cyber": hackathon write-ups often mention security tracks
  [/hackathon|hackforge/i, "coding"],
  [/cyber|hacked|security|phishing|malware|ethical hack/i, "cyber"],
  [/\bstalls?\b|stallex|food court|\bfair\b|exhibition/i, "stalls"],
  [/\bchess\b/i, "chess"],
  [/bgmi|pubg|\bmobile gam/i, "mobileGaming"],
  [/free ?fire|valorant|\bcod\b|e-?sports?|gaming|\bgame\b|fifa|minecraft/i, "gaming"],
  [/\bquiz|trivia/i, "quiz"],
  [/hackathon|hackforge|\bhack\b|web ?dev|\bcoding\b|programm/i, "coding"],
  [/ideathon|\bideas?\b|pitch|startup|innovat|entrepreneur|brainstorm|design thinking/i, "ideas"],
  [/danc|music|sing|cultur|fashion/i, "cultural"],
  [/develop|\bai\b|open ?ai|machine learning|\bml\b|\bapps?\b|robot|\btech/i, "coding"],
];

const BY_CATEGORY: Record<string, Pool> = {
  Technical: "coding",
  Gaming: "gaming",
  Creative: "ideas",
  Cultural: "cultural",
  Quiz: "quiz",
  Competition: "trophy",
  "Fun Activity": "fun",
  Other: "campus",
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function poolFor(category: string, title: string, description: string): Pool {
  const text = `${title} ${description}`;
  return RULES.find(([re]) => re.test(text))?.[1] ?? BY_CATEGORY[category] ?? "campus";
}

/** Same event always gets the same photo; different events in one pool spread across it. */
export function pickPhoto(category: string, seed: string, title = "", description = ""): Photo {
  const list: Photo[] = PHOTOS[poolFor(category, title, description)];
  return list[hash(seed) % list.length];
}

export const photoSrc = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${Math.round(w * 0.5)}&q=70`;
