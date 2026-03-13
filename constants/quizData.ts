export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What does AMR stand for?",
    options: [
      "Antimicrobial Resistance",
      "Antibiotic Monitoring Report",
      "Advanced Medical Research",
      "Aquatic Microbial Response",
    ],
    correctIndex: 0,
    explanation:
      "AMR stands for Antimicrobial Resistance - when bacteria evolve to survive antibiotics and other antimicrobial treatments.",
  },
  {
    id: 2,
    question: "Which of these is an antibiotic resistance gene (ARG)?",
    options: ["blaTEM", "COVID-19", "Hemoglobin", "Chlorophyll"],
    correctIndex: 0,
    explanation:
      "blaTEM is a gene that gives bacteria resistance to beta-lactam antibiotics like penicillin.",
  },
  {
    id: 3,
    question: "How can ARGs spread in the environment?",
    options: [
      "Through water contaminated with antibiotics",
      "Through sunlight",
      "Through gravity",
      "Through magnetism",
    ],
    correctIndex: 0,
    explanation:
      "ARGs can spread through contaminated water, soil, and between bacteria through horizontal gene transfer.",
  },
  {
    id: 4,
    question: "Why is water quality monitoring important for AMR?",
    options: [
      "Waterways can carry resistant bacteria to communities",
      "Water makes bacteria grow bigger",
      "Water always kills bacteria",
      "Monitoring is not important",
    ],
    correctIndex: 0,
    explanation:
      "Waterways can transport resistant bacteria and ARGs from sources like farms and wastewater to communities downstream.",
  },
  {
    id: 5,
    question: "What does mcr-1 resistance mean?",
    options: [
      "Resistance to colistin, a last-resort antibiotic",
      "Resistance to common cold viruses",
      "Resistance to UV light",
      "Resistance to temperature changes",
    ],
    correctIndex: 0,
    explanation:
      "mcr-1 confers resistance to colistin, which is often the last antibiotic available for treating multi-drug resistant infections.",
  },
  {
    id: 6,
    question: "What machine learning algorithm does AMR-Scout use?",
    options: [
      "Random Forest",
      "Photosynthesis Algorithm",
      "Water Cycle Model",
      "Rock Paper Scissors AI",
    ],
    correctIndex: 0,
    explanation:
      "AMR-Scout uses Random Forest, which makes predictions by combining the votes of many decision trees.",
  },
  {
    id: 7,
    question: "What unit is used to measure bacterial count in water?",
    options: [
      "CFU/mL (Colony Forming Units per milliliter)",
      "Miles per hour",
      "Degrees Celsius",
      "Kilograms",
    ],
    correctIndex: 0,
    explanation:
      "CFU/mL measures the number of viable bacteria per milliliter of water sample.",
  },
  {
    id: 8,
    question: "What is the integron gene intI1 a marker for?",
    options: [
      "Anthropogenic (human-caused) pollution",
      "Clean pristine water",
      "High altitude locations",
      "Volcanic activity",
    ],
    correctIndex: 0,
    explanation:
      "intI1 (class 1 integron-integrase) is widely recognized as a marker for human-associated antibiotic resistance pollution.",
  },
  {
    id: 9,
    question: "What does dissolved oxygen tell us about water quality?",
    options: [
      "Higher levels usually indicate healthier water",
      "Oxygen is harmful to aquatic life",
      "It has no effect on water quality",
      "Lower oxygen means cleaner water",
    ],
    correctIndex: 0,
    explanation:
      "Higher dissolved oxygen generally indicates healthier water that can support aquatic life. Pollution often reduces oxygen levels.",
  },
  {
    id: 10,
    question: "How many people get sick from waterborne illness in the US each year?",
    options: [
      "Over 7 million",
      "About 100",
      "Exactly 1,000",
      "Nobody gets sick from water",
    ],
    correctIndex: 0,
    explanation:
      "Over 7 million Americans get sick from waterborne illnesses annually, leading to 600,000 ER visits and $3 billion in costs.",
  },
];

export const FUN_FACTS = [
  "Bacteria can share resistance genes with each other, even across different species!",
  "Alexander Fleming discovered penicillin in 1928 - the first antibiotic ever found.",
  "Some bacteria in soil are naturally resistant to antibiotics and have been for millions of years.",
  "The WHO calls AMR one of the top 10 global public health threats facing humanity.",
  "A single gram of soil can contain over 1 billion bacteria!",
  "Antibiotics in animal agriculture account for about 70% of all antibiotic use in the US.",
  "Rapid Creek flows through Rapid City for about 12 miles - that's a lot of water to monitor!",
  "Machine learning can analyze thousands of water samples faster than a human scientist.",
  "South Dakota has over 11,000 miles of rivers and streams that could contain ARGs.",
  "You can help fight AMR by only taking antibiotics when prescribed by a doctor!",
];

export const BADGES = [
  { name: "Beginner Scientist", description: "Complete your first quiz", threshold: 1 },
  { name: "AMR Explorer", description: "Score 50% or higher on a quiz", threshold: 5 },
  { name: "Resistance Fighter", description: "Score 80% or higher", threshold: 8 },
  { name: "AMR Champion", description: "Get a perfect score!", threshold: 10 },
];
