import { Concern } from "@/types/concern";

export const mockConcerns: Concern[] = [
  {
    id: "1",
    type: "both",
    title: "Increase bike lane safety in downtown area",
    description:
      "The current bike lanes downtown lack proper barriers from vehicle traffic, creating dangerous situations especially during rush hours. I propose adding physical barriers or bollards along major corridors to protect cyclists.",
    votes: 47,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    replies: [
      {
        id: "1-1",
        category: "pro-argument",
        text: "This is urgently needed. I've witnessed multiple near-accidents at the 5th Avenue intersection. Physical barriers would make a huge difference for cyclist confidence and safety.",
        votes: 23,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        replies: [
          {
            id: "1-1-1",
            category: "variant",
            text: "In addition to barriers, we could add smart traffic signals that detect cyclists and adjust timing accordingly.",
            votes: 12,
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            replies: [],
          },
        ],
      },
      {
        id: "1-2",
        category: "objection",
        text: "While I support bike safety, removing parking spaces for barriers will hurt local businesses that depend on street parking for customers.",
        votes: 8,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        replies: [
          {
            id: "1-2-1",
            category: "proposal",
            text: "We could implement a pilot program on select streets first, measure business impact, and adjust based on data before full rollout.",
            votes: 15,
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    type: "problem",
    title: "Public park maintenance is inadequate",
    description:
      "Many of our neighborhood parks have broken equipment, overgrown vegetation, and litter problems. Families with children are avoiding these spaces due to safety concerns.",
    votes: 34,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    replies: [
      {
        id: "2-1",
        category: "proposal",
        text: "We could establish a community volunteer program for weekly park cleanups, combined with increased city funding for equipment repairs.",
        votes: 19,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        replies: [],
      },
    ],
  },
  {
    id: "3",
    type: "proposal",
    title: "Implement participatory budgeting for community projects",
    description:
      "Allow residents to directly vote on how to spend a portion of the municipal budget. This would increase civic engagement and ensure projects reflect actual community priorities.",
    votes: 56,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    replies: [
      {
        id: "3-1",
        category: "pro-argument",
        text: "This has worked successfully in over 3,000 cities worldwide. It empowers communities and leads to more equitable resource distribution.",
        votes: 31,
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        replies: [],
      },
      {
        id: "3-2",
        category: "objection",
        text: "Without proper education about budget constraints and trade-offs, this could lead to unrealistic expectations and populist decisions.",
        votes: 14,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        replies: [],
      },
    ],
  },
];
