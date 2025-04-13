// Sample writing prompts
export const WRITING_PROMPTS = [
  "He realized the child had seen him and he couldn't let him get away.",
  "The door creaked open, revealing a room that hadn't been touched in decades.",
  "She found the map exactly where they said it would be, but something wasn't right.",
  "The last train was leaving in five minutes, and the station was still miles away.",
  "The letter contained three words that changed everything.",
];

// Sophisticated words with definitions
export const SOPHISTICATED_WORDS = [
  { word: "Ephemeral", definition: "Lasting for a very short time" },
  {
    word: "Surreptitious",
    definition: "Kept secret, especially because it would not be approved",
  },
  { word: "Mellifluous", definition: "Sweet or musical; pleasant to hear" },
  { word: "Ubiquitous", definition: "Present, appearing, or found everywhere" },
  {
    word: "Pernicious",
    definition:
      "Having a harmful effect, especially in a gradual or subtle way",
  },
  {
    word: "Eloquent",
    definition: "Fluent or persuasive in speaking or writing",
  },
  {
    word: "Fastidious",
    definition: "Very attentive to and concerned about accuracy and detail",
  },
  {
    word: "Capricious",
    definition: "Given to sudden and unaccountable changes of mood or behavior",
  },
  { word: "Diaphanous", definition: "Light, delicate, and translucent" },
  {
    word: "Serendipity",
    definition:
      "The occurrence of events by chance in a happy or beneficial way",
  },
  {
    word: "Quintessential",
    definition: "Representing the most perfect example of a quality or class",
  },
  {
    word: "Perspicacious",
    definition: "Having a ready insight into and understanding of things",
  },
  {
    word: "Sycophant",
    definition:
      "A person who acts obsequiously toward someone to gain advantage",
  },
  { word: "Obfuscate", definition: "Make obscure, unclear, or unintelligible" },
  {
    word: "Recalcitrant",
    definition: "Having an obstinately uncooperative attitude",
  },
  {
    word: "Perfunctory",
    definition: "Carried out with minimal effort or reflection",
  },
  {
    word: "Insidious",
    definition: "Proceeding in a gradual, subtle way, but with harmful effects",
  },
  {
    word: "Esoteric",
    definition:
      "Intended for or likely to be understood by only a small number of people",
  },
  {
    word: "Equivocal",
    definition: "Open to more than one interpretation; ambiguous",
  },
  {
    word: "Ineffable",
    definition: "Too great or extreme to be expressed or described in words",
  },
];

export const generateExampleSentence = (
  word: string,
  definition: string,
): string => {
  const exampleSentences: Record<string, string> = {
    Ephemeral:
      "The beauty of cherry blossoms is ephemeral, lasting only a few days each spring.",
    Surreptitious:
      "She cast a surreptitious glance at the confidential document on his desk.",
    Mellifluous:
      "The singer's mellifluous voice captivated the entire audience.",
    Ubiquitous: "Smartphones have become ubiquitous in modern society.",
    Pernicious: "The pernicious rumors damaged his reputation beyond repair.",
    Eloquent: "Her eloquent speech moved many in the audience to tears.",
    Fastidious:
      "The fastidious chef inspected every plate before it left the kitchen.",
    Capricious:
      "The capricious weather changed from sunshine to thunderstorms within minutes.",
    Diaphanous:
      "She wore a diaphanous gown that floated around her as she walked.",
    Serendipity:
      "By serendipity, she bumped into her old friend at the airport.",
    Quintessential:
      "The small café with checkered tablecloths was the quintessential Parisian experience.",
    Perspicacious:
      "The perspicacious detective noticed the subtle clue everyone else had missed.",
    Sycophant:
      "The CEO surrounded himself with sycophants who never challenged his ideas.",
    Obfuscate:
      "The politician tried to obfuscate the truth with complicated jargon.",
    Recalcitrant:
      "The recalcitrant child refused to eat his vegetables despite his parents' pleas.",
    Perfunctory:
      "He gave a perfunctory nod without really listening to what was said.",
    Insidious:
      "The insidious disease had spread throughout his body before any symptoms appeared.",
    Esoteric:
      "The professor's lecture on quantum physics was too esoteric for most students to understand.",
    Equivocal:
      "His equivocal response left us unsure about whether he would attend the event.",
    Ineffable: "The beauty of the sunset over the ocean was almost ineffable.",
  };

  // Return the predefined example or generate a generic one
  return (
    exampleSentences[word] ||
    `The word "${word}" means "${definition.toLowerCase()}".`
  );
};
