import { Concern, Reply, User } from "@/types/concern";

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

// Mock users for the system
export const mockUsers: User[] = [
  // Grade 6
  { id: "u1", name: "Emma Schmidt", class: "6a", role: "student" },
  { id: "u2", name: "Liam Müller", class: "6a", role: "student" },
  { id: "u3", name: "Sophie Weber", class: "6a", role: "student" },
  { id: "u4", name: "Noah Fischer", class: "6a", role: "student" },
  { id: "u5", name: "Mia Wagner", class: "6b", role: "student" },
  { id: "u6", name: "Elias Becker", class: "6b", role: "student" },
  { id: "u7", name: "Hannah Hoffmann", class: "6b", role: "student" },
  { id: "u8", name: "Felix Schulz", class: "6b", role: "student" },
  { id: "u9", name: "Lea Koch", class: "6c", role: "student" },
  { id: "u10", name: "Jonas Bauer", class: "6c", role: "student" },
  { id: "u11", name: "Anna Richter", class: "6c", role: "student" },
  { id: "u12", name: "Ben Klein", class: "6c", role: "student" },
  // Grade 7
  { id: "u13", name: "Laura Wolf", class: "7a", role: "student" },
  { id: "u14", name: "Maximilian Schröder", class: "7a", role: "student" },
  { id: "u15", name: "Julia Neumann", class: "7a", role: "student" },
  { id: "u16", name: "Paul Schwarz", class: "7a", role: "student" },
  { id: "u17", name: "Sarah Zimmermann", class: "7b", role: "student" },
  { id: "u18", name: "Tim Braun", class: "7b", role: "student" },
  { id: "u19", name: "Lisa Krüger", class: "7b", role: "student" },
  { id: "u20", name: "David Hartmann", class: "7b", role: "student" },
  { id: "u21", name: "Marie Lange", class: "7c", role: "student" },
  { id: "u22", name: "Leon Werner", class: "7c", role: "student" },
  { id: "u23", name: "Lena Schmitt", class: "7c", role: "student" },
  { id: "u24", name: "Jan Meier", class: "7c", role: "student" },
  // Admin
  { id: "admin1", name: "Dr. Thomas Berger", class: "admin", role: "admin" },
];

// Helper to get random user
const getRandomUser = () => mockUsers[Math.floor(Math.random() * (mockUsers.length - 1))]; // Exclude admin

// Helper to create replies with references and author info
const createReply = (
  id: string,
  category: "objection" | "proposal" | "pro-argument" | "variant" | "question",
  text: string,
  votes: number,
  daysAgoVal: number,
  replies: Reply[] = [],
  referencedReplies?: { id: string; text: string; category: "objection" | "proposal" | "pro-argument" | "variant" | "question" }[],
  counterProposal?: { text: string; postedAsConcern?: boolean; solutionLevel?: "school" | "ministries" },
  aspects?: ("problem" | "proposal")[],
  author?: User
): Reply => {
  const user = author || getRandomUser();
  return {
    id,
    category,
    text,
    votes,
    replies,
    timestamp: new Date(now.getTime() - daysAgoVal * 24 * 60 * 60 * 1000),
    referencedReplies,
    counterProposal,
    aspects,
    authorId: user.id,
    authorName: user.name,
    authorClass: user.class,
  };
};

// ============================================
// TIMELINE:
// - Class Phase: Days 65-95 (concerns created here)
// - Grade Phase: Days 30-65 (winners from class advance)
// - School Phase: Days 0-30 (winners from grade advance)
// 
// PROGRESSION:
// - All concerns START in class phase
// - 3 winners per class advance to grade phase
// - 2 winners per grade advance to school phase
// - 3 final winners selected school-wide
// 
// VOTES RESET each phase
// REPLIES ACCUMULATE throughout phases
// ============================================

export const mockConcerns: Concern[] = [
  // ============================================
  // CLASS PHASE CONCERNS - Class 10A
  // Created days 65-95, voted on, top 3 advance
  // Replies: 2-6 each (class-level discussion only)
  // ============================================
  {
    id: "c10a-1",
    type: "problem",
    title: "Weekly Class Meetings for Student Voice",
    description: "Hold regular 15-minute class meetings where students can discuss concerns and vote on class-level decisions together.",
    votes: 18,
    timestamp: daysAgo(90),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "class",
    isWinner: true,
    winnerRank: 1,
    authorId: "u1",
    authorName: "Emma Schmidt",
    authorClass: "6a",
    variants: [
      {
        id: "v-c10a-1-1",
        title: "Weekly Class Meetings for Student Voice (Original)",
        text: "Hold regular 15-minute class meetings where students can discuss concerns and vote on class-level decisions together.",
        votes: 8,
      },
      {
        id: "v-c10a-1-2",
        title: "Structured Class Meetings with Rotating Facilitators",
        text: "Students lack a regular forum to voice concerns and participate in class decisions. We propose holding weekly 15-minute class meetings with rotating student facilitators and a digital suggestion box for anonymous submissions, ensuring everyone has a voice in class matters.",
        votes: 14,
      },
    ],
    replies: [
      createReply("r-c10a-1-1", "pro-argument", "This would make everyone feel more involved in class decisions.", 6, 89, [], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-c10a-1-2", "objection", "Taking time from lessons might affect our curriculum coverage.", 4, 88, [], undefined, undefined, undefined, mockUsers[1]),
      createReply("r-c10a-1-3", "proposal", "We could do it during homeroom instead of cutting into lesson time.", 5, 87, [], undefined, undefined, undefined, mockUsers[2]),
    ],
  },
  {
    id: "c10a-2",
    type: "problem",
    title: "Classroom Temperature Control Issues",
    description: "Our classroom is too hot in summer and too cold in winter. The heating and AC systems don't work properly.",
    votes: 16,
    timestamp: daysAgo(88),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "school",
    isWinner: true,
    winnerRank: 2,
    authorId: "u2",
    authorName: "Liam Müller",
    authorClass: "6a",
    variants: [
      {
        id: "v-c10a-2-1",
        title: "Temperature Control Issues (Original)",
        text: "Our classroom is too hot in summer and too cold in winter. The heating and AC systems don't work properly.",
        votes: 6,
      },
      {
        id: "v-c10a-2-2",
        title: "Comprehensive Climate Control Fix",
        text: "Our classroom temperatures fluctuate between too hot in summer and too cold in winter due to faulty HVAC systems. We propose a maintenance audit, installing thermometers in each classroom, and creating a reporting system so issues can be tracked and resolved quickly.",
        votes: 12,
      },
    ],
    replies: [
      createReply("r-c10a-2-1", "pro-argument", "It's hard to concentrate when you're freezing or sweating.", 7, 87, [], undefined, undefined, undefined, mockUsers[2]),
      createReply("r-c10a-2-2", "proposal", "Request maintenance to fix the thermostat and check the HVAC system.", 5, 86, [], undefined, undefined, undefined, mockUsers[3]),
    ],
  },
  {
    id: "c10a-3",
    type: "proposal",
    title: "Class Library Corner",
    description: "Create a small library corner in our classroom with books students can borrow and exchange freely.",
    votes: 14,
    timestamp: daysAgo(85),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "class",
    isWinner: true,
    winnerRank: 3,
    authorId: "u3",
    authorName: "Sophie Weber",
    authorClass: "6a",
    variants: [
      {
        id: "v-c10a-3-1",
        title: "Class Library Corner (Original)",
        text: "Create a small library corner in our classroom with books students can borrow and exchange freely.",
        votes: 7,
      },
      {
        id: "v-c10a-3-2",
        title: "Community Book Exchange Program",
        text: "Our classroom lacks accessible reading materials for free time. We propose creating a classroom library corner with a book drive where students bring books from home, a digital catalog for tracking, and monthly reading recommendations from students.",
        votes: 10,
      },
    ],
    replies: [
      createReply("r-c10a-3-1", "pro-argument", "This would encourage more reading during free time.", 5, 84, [], undefined, undefined, undefined, mockUsers[4]),
      createReply("r-c10a-3-2", "proposal", "We could do a book drive where everyone brings books from home.", 6, 83, [], undefined, undefined, undefined, mockUsers[5]),
    ],
  },
  {
    id: "c10a-4",
    type: "problem",
    title: "Group Project Assignment Fairness",
    description: "Group projects often result in unequal workload distribution, with some students doing most of the work.",
    votes: 12,
    timestamp: daysAgo(82),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "class",
    authorId: "u4",
    authorName: "Noah Fischer",
    authorClass: "6a",
    replies: [
      createReply("r-c10a-4-1", "pro-argument", "I always end up doing everything while others get the same grade.", 4, 81, [], undefined, undefined, undefined, mockUsers[6]),
      createReply("r-c10a-4-2", "proposal", "Teachers should require individual contribution logs for group projects.", 7, 80, [], undefined, undefined, undefined, mockUsers[7]),
    ],
  },
  {
    id: "c10a-5",
    type: "problem",
    title: "Lack of Storage Space for Personal Items",
    description: "We don't have enough locker space or shelves for our bags and sports equipment during the day.",
    votes: 9,
    timestamp: daysAgo(78),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "class",
    authorId: "u5",
    authorName: "Mia Wagner",
    authorClass: "6b",
    replies: [
      createReply("r-c10a-5-1", "pro-argument", "Our bags are piled up and things get lost or damaged.", 3, 77, [], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-c10a-5-2", "proposal", "Install additional hooks and shelves along the classroom walls.", 4, 76, [], undefined, undefined, undefined, mockUsers[9]),
    ],
  },
  {
    id: "c10a-6",
    type: "problem",
    title: "Insufficient Time Between Classes",
    description: "Only 5 minutes between classes isn't enough to get to lockers, use bathroom, and reach the next classroom across campus.",
    votes: 8,
    timestamp: daysAgo(75),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "school",
    authorId: "u6",
    authorName: "Elias Becker",
    authorClass: "6b",
    replies: [
      createReply("r-c10a-6-1", "pro-argument", "I'm always late to my next class because my locker is far away.", 3, 74, [], undefined, undefined, undefined, mockUsers[10]),
      createReply("r-c10a-6-2", "proposal", "Extend breaks to 7-8 minutes or create a passing period schedule.", 5, 73, [], undefined, undefined, undefined, mockUsers[11]),
    ],
  },
  {
    id: "c10a-7",
    type: "proposal",
    title: "Student Tutoring Exchange Program",
    description: "Create a peer tutoring system where students who excel in a subject can help classmates who struggle, earning community service hours.",
    votes: 7,
    timestamp: daysAgo(72),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "school",
    authorId: "u7",
    authorName: "Hannah Hoffmann",
    authorClass: "6b",
    replies: [
      createReply("r-c10a-7-1", "pro-argument", "Learning from peers often feels less intimidating than asking teachers.", 4, 71, [], undefined, undefined, undefined, mockUsers[12]),
      createReply("r-c10a-7-2", "proposal", "Match students by learning style and schedule to make pairing effective.", 3, 70, [], undefined, undefined, undefined, mockUsers[13]),
    ],
  },

  // ============================================
  // CLASS PHASE CONCERNS - Class 10B
  // Created days 65-95
  // ============================================
  {
    id: "c10b-1",
    type: "problem",
    title: "Classroom Seating Arrangement Issues",
    description: "Our current row-by-row seating makes group work difficult and some students can't see the board well from back corners.",
    votes: 15,
    timestamp: daysAgo(91),
    phase: "class",
    group: "Class 10B",
    solutionLevel: "class",
    isWinner: true,
    winnerRank: 1,
    authorId: "u8",
    authorName: "Felix Schulz",
    authorClass: "6b",
    variants: [
      {
        id: "v-c10b-1-1",
        title: "Seating Arrangement Issues (Original)",
        text: "Our current row-by-row seating makes group work difficult and some students can't see the board well from back corners.",
        votes: 5,
      },
      {
        id: "v-c10b-1-2",
        title: "Flexible Seating with Rotation",
        text: "Our current row-by-row classroom seating creates difficulties: students in back corners can't see the board well, and group work is awkward. We propose implementing U-shaped seating for better visibility and weekly seat rotation so no one is stuck in disadvantaged positions.",
        votes: 11,
      },
    ],
    replies: [
      createReply("r-c10b-1-1", "pro-argument", "I sit in the back corner and literally can't read the board during math.", 5, 90, [], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-c10b-1-2", "proposal", "Try U-shaped seating so everyone can see each other and the board.", 7, 89, [], undefined, undefined, undefined, mockUsers[1]),
      createReply("r-c10b-1-3", "proposal", "Rotate seating weekly so no one is stuck in bad spots permanently.", 4, 88, [], undefined, undefined, undefined, mockUsers[3]),
    ],
  },
  {
    id: "c10b-2",
    type: "problem",
    title: "Class Noise During Independent Work",
    description: "When we have independent work time, some students chat loudly, making it hard for others to concentrate.",
    votes: 13,
    timestamp: daysAgo(87),
    phase: "class",
    group: "Class 10B",
    solutionLevel: "class",
    isWinner: true,
    winnerRank: 2,
    authorId: "u9",
    authorName: "Lea Koch",
    authorClass: "6c",
    variants: [
      {
        id: "v-c10b-2-1",
        title: "Class Noise Issues (Original)",
        text: "When we have independent work time, some students chat loudly, making it hard for others to concentrate.",
        votes: 4,
      },
      {
        id: "v-c10b-2-2",
        title: "Structured Work Time with Zones",
        text: "During independent work time, some students chat loudly, making it hard for others to concentrate. We propose creating designated quiet zones and discussion areas in the classroom, with clear time blocks for silent work and collaborative time.",
        votes: 9,
      },
    ],
    replies: [
      createReply("r-c10b-2-1", "pro-argument", "I need quiet to focus and the constant talking is really distracting.", 6, 86, [], undefined, undefined, undefined, mockUsers[4]),
      createReply("r-c10b-2-2", "proposal", "Create quiet zones in the classroom for students who need silence.", 5, 85, [], undefined, undefined, undefined, mockUsers[5]),
    ],
  },
  {
    id: "c10b-3",
    type: "proposal",
    title: "Digital Homework Calendar",
    description: "Create a shared digital calendar where all teachers post homework deadlines so we can plan better.",
    votes: 11,
    timestamp: daysAgo(83),
    phase: "class",
    group: "Class 10B",
    solutionLevel: "school",
    isWinner: true,
    winnerRank: 3,
    authorId: "u10",
    authorName: "Jonas Bauer",
    authorClass: "6c",
    variants: [
      {
        id: "v-c10b-3-1",
        title: "Digital Homework Calendar (Original)",
        text: "Create a shared digital calendar where all teachers post homework deadlines so we can plan better.",
        votes: 5,
      },
      {
        id: "v-c10b-3-2",
        title: "Integrated Assignment Management System",
        text: "Students struggle to track homework deadlines across multiple classes, often resulting in multiple assignments due the same day. We propose a school-wide digital calendar integrated with existing platforms, mandatory for all teachers, with notification options for students.",
        votes: 8,
      },
    ],
    replies: [
      createReply("r-c10b-3-1", "pro-argument", "This would help us avoid having 4 assignments due the same day.", 4, 82, [], undefined, undefined, undefined, mockUsers[6]),
      createReply("r-c10b-3-2", "objection", "Not all teachers will use it consistently.", 3, 81, [], undefined, undefined, undefined, mockUsers[7]),
    ],
  },
  {
    id: "c10b-4",
    type: "problem",
    title: "Late Bus Arrivals",
    description: "School buses frequently arrive late, causing students to miss the start of first period.",
    votes: 10,
    timestamp: daysAgo(79),
    phase: "class",
    group: "Class 10B",
    solutionLevel: "school",
    authorId: "u11",
    authorName: "Anna Richter",
    authorClass: "6c",
    replies: [
      createReply("r-c10b-4-1", "pro-argument", "I've been marked tardy 5 times this month because of the bus.", 5, 78, [], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-c10b-4-2", "proposal", "Request earlier departure times or additional routes.", 4, 77, [], undefined, undefined, undefined, mockUsers[9]),
    ],
  },
  {
    id: "c10b-5",
    type: "proposal",
    title: "Classroom Plant Initiative",
    description: "Add plants to our classroom to improve air quality and create a more pleasant learning environment.",
    votes: 8,
    timestamp: daysAgo(74),
    phase: "class",
    group: "Class 10B",
    solutionLevel: "class",
    authorId: "u12",
    authorName: "Ben Klein",
    authorClass: "6c",
    replies: [
      createReply("r-c10b-5-1", "pro-argument", "Studies show plants improve focus and reduce stress.", 4, 73, [], undefined, undefined, undefined, mockUsers[10]),
      createReply("r-c10b-5-2", "objection", "Who will take care of them during holidays?", 2, 72, [], undefined, undefined, undefined, mockUsers[11]),
    ],
  },

  // ============================================
  // CLASS PHASE CONCERNS - Class 10C
  // Created days 65-95
  // ============================================
  {
    id: "c10c-1",
    type: "problem",
    title: "Broken Lab Equipment",
    description: "Many science lab instruments are broken or missing parts, making experiments difficult to complete properly.",
    votes: 17,
    timestamp: daysAgo(92),
    phase: "class",
    group: "Class 10C",
    solutionLevel: "school",
    isWinner: true,
    winnerRank: 1,
    authorId: "u13",
    authorName: "Laura Wolf",
    authorClass: "7a",
    variants: [
      {
        id: "v-c10c-1-1",
        title: "Broken Lab Equipment (Original)",
        text: "Many science lab instruments are broken or missing parts, making experiments difficult to complete properly.",
        votes: 6,
      },
      {
        id: "v-c10c-1-2",
        title: "Lab Equipment Restoration Program",
        text: "Many science lab instruments are broken or missing parts, forcing students to share equipment excessively and making experiments difficult to complete. We propose requesting emergency funding for essential repairs, creating a prioritized equipment list, and exploring grant opportunities for science education.",
        votes: 13,
      },
    ],
    replies: [
      createReply("r-c10c-1-1", "pro-argument", "We had to share one microscope between 6 students last week.", 6, 91, [], undefined, undefined, undefined, mockUsers[12]),
      createReply("r-c10c-1-2", "proposal", "Request emergency funding for essential lab equipment repairs.", 8, 90, [], undefined, undefined, undefined, mockUsers[13]),
      createReply("r-c10c-1-3", "question", "Can we fundraise to supplement the school budget?", 3, 89, [], undefined, undefined, undefined, mockUsers[14]),
    ],
  },
  {
    id: "c10c-2",
    type: "proposal",
    title: "Flexible Deadline Policy",
    description: "Allow students to request 24-48 hour extensions on assignments without penalty, with teacher approval.",
    votes: 14,
    timestamp: daysAgo(88),
    phase: "class",
    group: "Class 10C",
    solutionLevel: "school",
    isWinner: true,
    winnerRank: 2,
    authorId: "u14",
    authorName: "Maximilian Schröder",
    authorClass: "7a",
    variants: [
      {
        id: "v-c10c-2-1",
        title: "Flexible Deadline Policy (Original)",
        text: "Allow students to request 24-48 hour extensions on assignments without penalty, with teacher approval.",
        votes: 5,
      },
      {
        id: "v-c10c-2-2",
        title: "Structured Extension System",
        text: "Students sometimes need extra time on assignments due to unexpected circumstances but face penalties for late submissions. We propose allowing 2 extensions per semester per student, with a 24-48 hour grace period for documented emergencies or teacher approval, balancing flexibility with accountability.",
        votes: 10,
      },
    ],
    replies: [
      createReply("r-c10c-2-1", "pro-argument", "Life happens - sometimes we need a little extra time.", 5, 87, [], undefined, undefined, undefined, mockUsers[15]),
      createReply("r-c10c-2-2", "objection", "This could be abused by procrastinators.", 4, 86, [], undefined, undefined, undefined, mockUsers[16]),
    ],
  },
  {
    id: "c10c-3",
    type: "problem",
    title: "Cafeteria Wait Times",
    description: "The lunch line is so long that we only have 10 minutes to actually eat before the next class.",
    votes: 12,
    timestamp: daysAgo(84),
    phase: "class",
    group: "Class 10C",
    solutionLevel: "school",
    isWinner: true,
    winnerRank: 3,
    authorId: "u15",
    authorName: "Julia Neumann",
    authorClass: "7a",
    variants: [
      {
        id: "v-c10c-3-1",
        title: "Cafeteria Wait Times (Original)",
        text: "The lunch line is so long that we only have 10 minutes to actually eat before the next class.",
        votes: 4,
      },
      {
        id: "v-c10c-3-2",
        title: "Cafeteria Efficiency Improvement",
        text: "The lunch line is so long that students only have 10 minutes to actually eat before the next class, causing many to skip meals. We propose staggering lunch times by grade, adding grab-and-go options, and considering a second serving line to reduce wait times.",
        votes: 9,
      },
    ],
    replies: [
      createReply("r-c10c-3-1", "pro-argument", "I often skip lunch because there's no point waiting 20 minutes.", 6, 83, [], undefined, undefined, undefined, mockUsers[17]),
      createReply("r-c10c-3-2", "proposal", "Stagger lunch times by grade to reduce crowding.", 5, 82, [], undefined, undefined, undefined, mockUsers[18]),
    ],
  },
  {
    id: "c10c-4",
    type: "problem",
    title: "Inconsistent Teacher Grading",
    description: "Different teachers grade the same quality of work differently. A B in one class might be an A in another.",
    votes: 10,
    timestamp: daysAgo(80),
    phase: "class",
    group: "Class 10C",
    solutionLevel: "school",
    authorId: "u16",
    authorName: "Paul Schwarz",
    authorClass: "7a",
    replies: [
      createReply("r-c10c-4-1", "pro-argument", "This makes GPA comparisons unfair between students.", 4, 79, [], undefined, undefined, undefined, mockUsers[19]),
      createReply("r-c10c-4-2", "proposal", "Create standardized rubrics that all teachers must follow.", 5, 78, [], undefined, undefined, undefined, mockUsers[20]),
    ],
  },
  {
    id: "c10c-5",
    type: "proposal",
    title: "Study Hall Period",
    description: "Add a dedicated study hall period where students can work on homework with teacher support available.",
    votes: 9,
    timestamp: daysAgo(76),
    phase: "class",
    group: "Class 10C",
    solutionLevel: "school",
    authorId: "u17",
    authorName: "Sarah Zimmermann",
    authorClass: "7b",
    replies: [
      createReply("r-c10c-5-1", "pro-argument", "This would reduce homework stress at home.", 3, 75, [], undefined, undefined, undefined, mockUsers[21]),
      createReply("r-c10c-5-2", "objection", "It might cut into valuable instruction time.", 2, 74, [], undefined, undefined, undefined, mockUsers[0]),
    ],
  },

  // ============================================
  // GRADE PHASE CONCERNS - Grade 10
  // Winners from Class 10A, 10B, 10C (3 each = 9 total)
  // Days 30-65, votes RESET, replies ACCUMULATE
  // Replies: 8-15 each (class + grade discussion)
  // ============================================
  
  // Winner 1 from Class 10A - Cafeteria Food Quality (now with grade-level discussion)
  {
    id: "g10-1",
    type: "problem",
    title: "Cafeteria Food Quality Issues",
    description: "The food served in our cafeteria is often cold and lacks variety. Students are frequently complaining about limited healthy options.",
    votes: 45, // Reset for grade phase voting
    timestamp: daysAgo(65), // Entered grade phase
    phase: "grade",
    group: "Grade 10",
    solutionLevel: "school",
    promotedFrom: "class",
    originalGroup: "Class 10A",
    isWinner: true,
    winnerRank: 1,
    authorId: "u1",
    authorName: "Emma Schmidt",
    authorClass: "6a",
    variants: [
      {
        id: "v-g10-1-1",
        title: "Cafeteria Food Quality Issues",
        text: "The food served in our cafeteria is often cold and lacks variety. Students are frequently complaining about limited healthy options.",
        votes: 12,
      },
      {
        id: "v-g10-1-2",
        title: "Comprehensive Cafeteria Improvement",
        text: "The cafeteria food is often cold and lacks variety, with limited healthy options causing many students to skip lunch. We propose implementing a student feedback system for menu choices, extending lunch breaks, adding fresh salad options, and installing better warming equipment to keep food hot.",
        votes: 28,
      },
    ],
    replies: [
      // Class phase replies (days 95-65)
      createReply("r-g10-1-1", "objection", "I think the main issue is timing, not quality. Food is hot when served.", 8, 92, [], undefined, undefined, undefined, mockUsers[1]),
      createReply("r-g10-1-2", "pro-argument", "Absolutely agree! I've noticed many students skip lunch because of this.", 12, 90, [
        createReply("r-g10-1-2a", "question", "Do we have data on how many students actually skip lunch?", 3, 88, [], undefined, undefined, undefined, mockUsers[2]),
      ], undefined, undefined, undefined, mockUsers[5]),
      createReply("r-g10-1-3", "proposal", "We could propose a student feedback system where we vote on menu items weekly.", 15, 85, [], undefined, {
        text: "Create a monthly rotating menu based on student preferences collected through surveys.",
        solutionLevel: "school"
      }, undefined, mockUsers[6]),
      // Grade phase replies (days 65-30)
      createReply("r-g10-1-4", "pro-argument", "Students from 10B have the same complaints - this is a grade-wide issue!", 18, 60, [], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-g10-1-5", "proposal", "Let's combine our ideas: student surveys + better heating equipment + healthier options.", 22, 55, [
        createReply("r-g10-1-5a", "pro-argument", "Class 10C supports this combined approach!", 14, 52, [], undefined, undefined, undefined, mockUsers[12]),
      ], undefined, undefined, undefined, mockUsers[10]),
      createReply("r-g10-1-6", "variant", "The combined proposal addresses all three classes' concerns about food quality, variety, and temperature.", 16, 48, [], undefined, undefined, undefined, mockUsers[14]),
      createReply("r-g10-1-7", "question", "Has anyone talked to the cafeteria staff about these issues?", 8, 45, [
        createReply("r-g10-1-7a", "pro-argument", "Yes! They said they need budget approval for better equipment.", 11, 42, [], undefined, undefined, undefined, mockUsers[16]),
      ], undefined, undefined, undefined, mockUsers[18]),
    ],
  },

  // Winner 2 from Class 10A - Digital Assignment Submission
  {
    id: "g10-2",
    type: "proposal",
    title: "Implement Digital Assignment Submission",
    description: "We should move to a fully digital assignment submission system to reduce paper waste and make tracking easier.",
    votes: 42,
    timestamp: daysAgo(65),
    phase: "grade",
    group: "Grade 10",
    solutionLevel: "school",
    promotedFrom: "class",
    originalGroup: "Class 10A",
    isWinner: true,
    winnerRank: 2,
    authorId: "u10",
    authorName: "Jonas Bauer",
    authorClass: "6c",
    variants: [
      {
        id: "v-g10-2-1",
        title: "Digital Assignment Submission",
        text: "Move to a fully digital assignment submission system to reduce paper waste and make tracking easier.",
        votes: 14,
      },
      {
        id: "v-g10-2-2",
        title: "Hybrid Digital System with School Support",
        text: "Paper-based assignment submission creates waste and makes tracking difficult, but not all students have reliable internet at home. We propose implementing digital submissions while extending library hours for students without home internet access, plus maintaining offline submission options for equity.",
        votes: 26,
      },
    ],
    replies: [
      // Class phase replies
      createReply("r-g10-2-1", "pro-argument", "This would help the environment and make it easier to keep track of deadlines.", 9, 90, [], undefined, undefined, undefined, mockUsers[11]),
      createReply("r-g10-2-2", "objection", "Not all students have reliable internet access at home.", 14, 88, [], undefined, undefined, undefined, mockUsers[12]),
      createReply("r-g10-2-3", "proposal", "Extend library hours so students can use school computers.", 11, 85, [], undefined, undefined, undefined, mockUsers[14]),
      // Grade phase replies
      createReply("r-g10-2-4", "pro-argument", "Class 10B already uses Google Classroom - it works great!", 16, 58, [], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-g10-2-5", "variant", "Combine digital submissions with extended library access for equity.", 19, 52, [
        createReply("r-g10-2-5a", "pro-argument", "This addresses the internet access concerns perfectly.", 12, 48, [], undefined, undefined, undefined, mockUsers[10]),
      ], undefined, undefined, undefined, mockUsers[16]),
      createReply("r-g10-2-6", "question", "What platform should we use? Google Classroom or something else?", 8, 45, [
        createReply("r-g10-2-6a", "proposal", "Google Classroom is free and most students already have accounts.", 15, 42, [], undefined, undefined, undefined, mockUsers[18]),
      ], undefined, undefined, undefined, mockUsers[20]),
      createReply("r-g10-2-7", "pro-argument", "Teachers can provide faster feedback digitally.", 10, 38, [], undefined, undefined, undefined, mockUsers[0]),
    ],
  },

  // Winner 3 from Class 10A - Sports Equipment
  {
    id: "g10-3",
    type: "problem",
    title: "Limited Access to Sports Equipment",
    description: "Our class doesn't have enough sports equipment for PE lessons, leading to long waiting times and reduced activity.",
    votes: 38,
    timestamp: daysAgo(65),
    phase: "grade",
    group: "Grade 10",
    solutionLevel: "school",
    promotedFrom: "class",
    originalGroup: "Class 10A",
    authorId: "u17",
    authorName: "Sarah Zimmermann",
    authorClass: "7b",
    replies: [
      // Class phase replies
      createReply("r-g10-3-1", "pro-argument", "Yes! Half the class just stands around waiting for their turn.", 8, 88, [], undefined, undefined, undefined, mockUsers[18]),
      createReply("r-g10-3-2", "proposal", "We could create a rotation system and extend PE class time.", 6, 85, [], undefined, undefined, undefined, mockUsers[19]),
      createReply("r-g10-3-3", "objection", "The real issue is that PE classes are too large.", 10, 82, [], undefined, undefined, undefined, mockUsers[20]),
      // Grade phase replies
      createReply("r-g10-3-4", "pro-argument", "10B and 10C have the same problem - it's grade-wide!", 14, 60, [], undefined, undefined, undefined, mockUsers[2]),
      createReply("r-g10-3-5", "proposal", "Request budget allocation for new equipment purchase.", 12, 55, [
        createReply("r-g10-3-5a", "question", "How much would new equipment cost?", 5, 52, [], undefined, undefined, undefined, mockUsers[4]),
      ], undefined, undefined, undefined, mockUsers[6]),
      createReply("r-g10-3-6", "variant", "Combine equipment sharing between classes with new purchases.", 9, 48, [], undefined, undefined, undefined, mockUsers[8]),
    ],
  },

  // Winner 1 from Class 10B - Seating Arrangement
  {
    id: "g10-4",
    type: "problem",
    title: "Classroom Seating Arrangement Issues",
    description: "Current row-by-row seating makes group work difficult and some students can't see the board well from back corners.",
    votes: 35,
    timestamp: daysAgo(65),
    phase: "grade",
    group: "Grade 10",
    solutionLevel: "school",
    promotedFrom: "class",
    originalGroup: "Class 10B",
    authorId: "u8",
    authorName: "Felix Schulz",
    authorClass: "6b",
    replies: [
      // Class phase replies
      createReply("r-g10-4-1", "pro-argument", "I sit in the back corner and literally can't read the board.", 5, 90, [], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-g10-4-2", "proposal", "Try U-shaped seating so everyone can see.", 7, 88, [], undefined, undefined, undefined, mockUsers[1]),
      // Grade phase replies
      createReply("r-g10-4-3", "pro-argument", "Class 10A tried rotating seats - it helped a lot!", 11, 58, [], undefined, undefined, undefined, mockUsers[3]),
      createReply("r-g10-4-4", "variant", "Combine U-shape with weekly rotation for fairness.", 14, 52, [
        createReply("r-g10-4-4a", "pro-argument", "This is a great compromise!", 8, 48, [], undefined, undefined, undefined, mockUsers[5]),
      ], undefined, undefined, undefined, mockUsers[7]),
      createReply("r-g10-4-5", "proposal", "Each class can choose their preferred arrangement.", 9, 45, [], undefined, undefined, undefined, mockUsers[9]),
    ],
  },

  // Winner 2 from Class 10B - Digital Calendar
  {
    id: "g10-5",
    type: "proposal",
    title: "Digital Homework Calendar",
    description: "Create a shared digital calendar where all teachers post homework deadlines so we can plan better.",
    votes: 32,
    timestamp: daysAgo(65),
    phase: "grade",
    group: "Grade 10",
    solutionLevel: "school",
    promotedFrom: "class",
    originalGroup: "Class 10B",
    authorId: "u10",
    authorName: "Jonas Bauer",
    authorClass: "6c",
    replies: [
      // Class phase replies
      createReply("r-g10-5-1", "pro-argument", "This would help us avoid having 4 assignments due the same day.", 4, 88, [], undefined, undefined, undefined, mockUsers[6]),
      createReply("r-g10-5-2", "objection", "Not all teachers will use it consistently.", 3, 85, [], undefined, undefined, undefined, mockUsers[7]),
      // Grade phase replies
      createReply("r-g10-5-3", "pro-argument", "If it's mandatory for teachers, it would work!", 12, 58, [], undefined, undefined, undefined, mockUsers[11]),
      createReply("r-g10-5-4", "proposal", "Integrate with existing school systems for easier adoption.", 10, 52, [
        createReply("r-g10-5-4a", "pro-argument", "Good idea - less work for teachers.", 7, 48, [], undefined, undefined, undefined, mockUsers[13]),
      ], undefined, undefined, undefined, mockUsers[15]),
      createReply("r-g10-5-5", "question", "Can students also add their extracurricular commitments?", 6, 42, [], undefined, undefined, undefined, mockUsers[17]),
    ],
  },

  // Winner 3 from Class 10B - Class Noise
  {
    id: "g10-6",
    type: "problem",
    title: "Class Noise During Independent Work",
    description: "When we have independent work time, some students chat loudly, making it hard for others to concentrate.",
    votes: 28,
    timestamp: daysAgo(65),
    phase: "grade",
    group: "Grade 10",
    solutionLevel: "school",
    promotedFrom: "class",
    originalGroup: "Class 10B",
    authorId: "u9",
    authorName: "Lea Koch",
    authorClass: "6c",
    replies: [
      // Class phase replies
      createReply("r-g10-6-1", "pro-argument", "I need quiet to focus and the constant talking is distracting.", 6, 86, [], undefined, undefined, undefined, mockUsers[4]),
      createReply("r-g10-6-2", "proposal", "Create quiet zones in the classroom.", 5, 84, [], undefined, undefined, undefined, mockUsers[5]),
      // Grade phase replies
      createReply("r-g10-6-3", "objection", "Some students learn better by discussing problems.", 8, 58, [], undefined, undefined, undefined, mockUsers[19]),
      createReply("r-g10-6-4", "variant", "Have designated discussion time and quiet time, not mixed.", 11, 52, [
        createReply("r-g10-6-4a", "pro-argument", "This respects both learning styles!", 7, 48, [], undefined, undefined, undefined, mockUsers[21]),
      ], undefined, undefined, undefined, mockUsers[1]),
    ],
  },

  // Winner 1 from Class 10C - Broken Lab Equipment
  {
    id: "g10-7",
    type: "problem",
    title: "Broken Lab Equipment",
    description: "Many science lab instruments are broken or missing parts, making experiments difficult to complete properly.",
    votes: 40,
    timestamp: daysAgo(65),
    phase: "grade",
    group: "Grade 10",
    solutionLevel: "school",
    promotedFrom: "class",
    originalGroup: "Class 10C",
    authorId: "u13",
    authorName: "Laura Wolf",
    authorClass: "7a",
    replies: [
      // Class phase replies
      createReply("r-g10-7-1", "pro-argument", "We had to share one microscope between 6 students last week.", 6, 91, [], undefined, undefined, undefined, mockUsers[12]),
      createReply("r-g10-7-2", "proposal", "Request emergency funding for lab equipment repairs.", 8, 88, [], undefined, undefined, undefined, mockUsers[13]),
      // Grade phase replies
      createReply("r-g10-7-3", "pro-argument", "All three classes share the same labs - this affects everyone!", 15, 60, [], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-g10-7-4", "proposal", "Create a prioritized list of essential equipment to repair first.", 12, 55, [
        createReply("r-g10-7-4a", "pro-argument", "Microscopes and scales should be top priority.", 9, 52, [], undefined, undefined, undefined, mockUsers[2]),
      ], undefined, undefined, undefined, mockUsers[4]),
      createReply("r-g10-7-5", "question", "Can we apply for science education grants?", 7, 48, [
        createReply("r-g10-7-5a", "proposal", "The science teacher mentioned there are state grants available.", 10, 45, [], undefined, undefined, undefined, mockUsers[6]),
      ], undefined, undefined, undefined, mockUsers[8]),
    ],
  },

  // Winner 2 from Class 10C - Flexible Deadlines
  {
    id: "g10-8",
    type: "proposal",
    title: "Flexible Deadline Policy",
    description: "Allow students to request 24-48 hour extensions on assignments without penalty, with teacher approval.",
    votes: 36,
    timestamp: daysAgo(65),
    phase: "grade",
    group: "Grade 10",
    solutionLevel: "school",
    promotedFrom: "class",
    originalGroup: "Class 10C",
    authorId: "u14",
    authorName: "Maximilian Schröder",
    authorClass: "7a",
    replies: [
      // Class phase replies
      createReply("r-g10-8-1", "pro-argument", "Life happens - sometimes we need a little extra time.", 5, 87, [], undefined, undefined, undefined, mockUsers[15]),
      createReply("r-g10-8-2", "objection", "This could be abused by procrastinators.", 4, 84, [], undefined, undefined, undefined, mockUsers[16]),
      // Grade phase replies
      createReply("r-g10-8-3", "proposal", "Limit extensions to 2 per semester per student.", 14, 58, [
        createReply("r-g10-8-3a", "pro-argument", "This prevents abuse while still helping when needed.", 10, 55, [], undefined, undefined, undefined, mockUsers[18]),
      ], undefined, undefined, undefined, mockUsers[17]),
      createReply("r-g10-8-4", "variant", "Allow extensions only for documented emergencies.", 8, 50, [], undefined, undefined, undefined, mockUsers[20]),
      createReply("r-g10-8-5", "question", "Would this apply to tests too, or just assignments?", 5, 45, [], undefined, undefined, undefined, mockUsers[0]),
    ],
  },

  // Winner 3 from Class 10C - Cafeteria Wait Times
  {
    id: "g10-9",
    type: "problem",
    title: "Cafeteria Wait Times",
    description: "The lunch line is so long that we only have 10 minutes to actually eat before the next class.",
    votes: 34,
    timestamp: daysAgo(65),
    phase: "grade",
    group: "Grade 10",
    solutionLevel: "school",
    promotedFrom: "class",
    originalGroup: "Class 10C",
    authorId: "u15",
    authorName: "Julia Neumann",
    authorClass: "7a",
    replies: [
      // Class phase replies
      createReply("r-g10-9-1", "pro-argument", "I often skip lunch because there's no point waiting 20 minutes.", 6, 83, [], undefined, undefined, undefined, mockUsers[17]),
      createReply("r-g10-9-2", "proposal", "Stagger lunch times by grade to reduce crowding.", 5, 80, [], undefined, undefined, undefined, mockUsers[18]),
      // Grade phase replies
      createReply("r-g10-9-3", "pro-argument", "This connects to the food quality issue - related problems!", 12, 58, [], undefined, undefined, undefined, mockUsers[1]),
      createReply("r-g10-9-4", "proposal", "Add a second serving line to speed things up.", 14, 52, [
        createReply("r-g10-9-4a", "question", "Is there physical space for another line?", 6, 48, [], undefined, undefined, undefined, mockUsers[3]),
      ], undefined, undefined, undefined, mockUsers[5]),
      createReply("r-g10-9-5", "variant", "Combine staggered times with a grab-and-go option for quick meals.", 10, 42, [], undefined, undefined, undefined, mockUsers[7]),
    ],
  },

  // ============================================
  // SCHOOL PHASE CONCERNS
  // Winners from Grade 10, 11, 12 (2 each = 6 total)
  // Days 0-30, votes RESET, replies ACCUMULATE
  // Replies: 20-40+ each (class + grade + school discussion)
  // ============================================

  // MINISTRY LEVEL CONCERN - Curriculum (progressed through ALL phases)
  {
    id: "s-1",
    type: "problem",
    title: "Curriculum Content Feels Outdated",
    description: "Much of what we learn in textbooks is outdated. Topics like digital literacy, climate science, and modern history are barely covered.",
    votes: 85, // School phase votes
    timestamp: daysAgo(30), // Entered school phase
    phase: "school",
    group: "Whole School",
    solutionLevel: "ministries",
    promotedFrom: "grade",
    originalGroup: "Class 10A",
    isWinner: true,
    winnerRank: 1,
    authorId: "u11",
    authorName: "Anna Richter",
    authorClass: "6c",
    variants: [
      {
        id: "v-s-1-1",
        title: "Curriculum Content Update Request",
        text: "Much of what we learn in textbooks is outdated. Topics like digital literacy, climate science, and modern history are barely covered.",
        votes: 25,
      },
      {
        id: "v-s-1-2",
        title: "Comprehensive Curriculum Modernization Proposal",
        text: "Create a student committee to formally petition the ministry for curriculum updates, focusing on digital literacy, climate science, modern history, and practical life skills.",
        votes: 52,
      },
    ],
    replies: [
      // Class phase replies (days 95-65)
      createReply("r-s-1-1", "pro-argument", "Our history book stops at 2005! So much has happened since then.", 8, 92, [], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-s-1-2", "pro-argument", "We learned nothing about coding or AI even though it affects every career now.", 9, 90, [], undefined, undefined, undefined, mockUsers[9]),
      createReply("r-s-1-3", "objection", "Teachers can only teach what the ministry approves.", 5, 88, [
        createReply("r-s-1-3a", "proposal", "That's why we should petition the ministry through student council.", 6, 86, [], undefined, undefined, undefined, mockUsers[11]),
      ], undefined, undefined, undefined, mockUsers[10]),
      createReply("r-s-1-4", "question", "How often does the ministry actually update the curriculum?", 4, 85, [
        createReply("r-s-1-4a", "pro-argument", "Only every 10-15 years for major updates. Way too slow!", 5, 83, [], undefined, undefined, undefined, mockUsers[13]),
      ], undefined, undefined, undefined, mockUsers[12]),
      // Grade phase replies (days 65-30)
      createReply("r-s-1-5", "pro-argument", "Students from all Grade 10 classes agree - our books are ancient!", 16, 60, [], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-s-1-6", "proposal", "Form a grade-level committee to document specific outdated content.", 14, 55, [
        createReply("r-s-1-6a", "pro-argument", "We can create a detailed report with examples.", 11, 52, [], undefined, undefined, undefined, mockUsers[2]),
        createReply("r-s-1-6b", "proposal", "Include teacher input to strengthen our case.", 9, 50, [], undefined, undefined, undefined, mockUsers[4]),
      ], undefined, undefined, undefined, mockUsers[1]),
      createReply("r-s-1-7", "variant", "Combine curriculum update request with teacher training proposal.", 12, 48, [], undefined, undefined, undefined, mockUsers[6]),
      createReply("r-s-1-8", "question", "Has any student petition ever successfully changed curriculum?", 8, 45, [
        createReply("r-s-1-8a", "pro-argument", "Yes! In 2019, student protests led to climate education being added.", 15, 42, [], undefined, undefined, undefined, mockUsers[8]),
      ], undefined, undefined, undefined, mockUsers[7]),
      // School phase replies (days 30-0)
      createReply("r-s-1-9", "pro-argument", "This affects ALL grades, not just 10th! We need school-wide support.", 28, 28, [
        createReply("r-s-1-9a", "pro-argument", "Grade 11 strongly supports this!", 22, 26, [], undefined, undefined, undefined, mockUsers[12]),
        createReply("r-s-1-9b", "pro-argument", "Grade 12 is in too - we wish we had modern curriculum!", 20, 24, [], undefined, undefined, undefined, mockUsers[14]),
      ], undefined, undefined, undefined, mockUsers[10]),
      createReply("r-s-1-10", "proposal", "Create a school-wide petition with signatures from all grades.", 32, 25, [
        createReply("r-s-1-10a", "pro-argument", "The more signatures, the more seriously the ministry will take it.", 18, 22, [], undefined, undefined, undefined, mockUsers[16]),
      ], undefined, undefined, undefined, mockUsers[15]),
      createReply("r-s-1-11", "proposal", "Draft a formal letter to the ministry with specific curriculum change requests.", 25, 22, [
        createReply("r-s-1-11a", "variant", "Include data showing what other countries teach that we don't.", 16, 20, [], undefined, undefined, undefined, mockUsers[18]),
        createReply("r-s-1-11b", "pro-argument", "Reference recent job market studies showing skill gaps.", 14, 18, [], undefined, undefined, undefined, mockUsers[20]),
      ], undefined, undefined, undefined, mockUsers[17]),
      createReply("r-s-1-12", "question", "Should we involve parent associations for more impact?", 12, 18, [
        createReply("r-s-1-12a", "pro-argument", "Parents' voices carry significant weight with the ministry!", 19, 15, [], undefined, undefined, undefined, mockUsers[0]),
      ], undefined, undefined, undefined, mockUsers[19]),
      createReply("r-s-1-13", "proposal", "Present our case at the next school board meeting.", 21, 15, [], undefined, undefined, undefined, mockUsers[21]),
      createReply("r-s-1-14", "pro-argument", "Media coverage could amplify our message significantly.", 15, 12, [], undefined, undefined, undefined, mockUsers[1]),
      createReply("r-s-1-15", "variant", "Create a comprehensive modernization package including curriculum, textbooks, and digital resources.", 24, 10, [
        createReply("r-s-1-15a", "pro-argument", "This holistic approach is more likely to succeed.", 17, 8, [], undefined, undefined, undefined, mockUsers[3]),
      ], undefined, undefined, undefined, mockUsers[2]),
      createReply("r-s-1-16", "question", "What's the timeline for ministry decisions on curriculum changes?", 9, 8, [
        createReply("r-s-1-16a", "pro-argument", "Usually 1-2 years, but urgent requests can be expedited.", 11, 6, [], undefined, undefined, undefined, mockUsers[5]),
      ], undefined, undefined, undefined, mockUsers[4]),
      createReply("r-s-1-17", "proposal", "Start with elective courses while waiting for core curriculum changes.", 18, 5, [], undefined, undefined, undefined, mockUsers[6]),
    ],
  },

  // Winner from Grade 10 - Cafeteria (school-level solution)
  {
    id: "s-2",
    type: "problem",
    title: "Cafeteria Food Quality Issues",
    description: "The food served in our cafeteria is often cold and lacks variety. Students are frequently complaining about limited healthy options.",
    votes: 78,
    timestamp: daysAgo(30),
    phase: "school",
    group: "Whole School",
    solutionLevel: "school",
    promotedFrom: "grade",
    originalGroup: "Grade 10",
    isWinner: true,
    winnerRank: 2,
    authorId: "u1",
    authorName: "Emma Schmidt",
    authorClass: "6a",
    variants: [
      {
        id: "v-s-2-1",
        title: "Cafeteria Food Quality Issues",
        text: "The food served in our cafeteria is often cold and lacks variety.",
        votes: 18,
      },
      {
        id: "v-s-2-2",
        title: "School-Wide Cafeteria Improvement Initiative",
        text: "Implement student feedback system, upgrade heating equipment, add healthy options, extend lunch period, and create a cafeteria improvement committee.",
        votes: 48,
      },
    ],
    replies: [
      // Accumulated from class and grade phases
      createReply("r-s-2-1", "objection", "Food is hot when served - timing is the issue.", 8, 92, [], undefined, undefined, undefined, mockUsers[1]),
      createReply("r-s-2-2", "pro-argument", "Many students skip lunch because of this.", 12, 90, [], undefined, undefined, undefined, mockUsers[5]),
      createReply("r-s-2-3", "proposal", "Student feedback system for menu voting.", 15, 85, [], undefined, undefined, undefined, mockUsers[6]),
      createReply("r-s-2-4", "pro-argument", "Grade-wide issue confirmed by all classes.", 18, 60, [], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-s-2-5", "proposal", "Combined approach: surveys + heating + healthy options.", 22, 55, [], undefined, undefined, undefined, mockUsers[10]),
      createReply("r-s-2-6", "variant", "Address food, variety, and temperature together.", 16, 48, [], undefined, undefined, undefined, mockUsers[14]),
      // School phase replies
      createReply("r-s-2-7", "pro-argument", "This is THE most common complaint across ALL grades!", 32, 28, [
        createReply("r-s-2-7a", "pro-argument", "Grade 11 agrees - cafeteria is a school-wide problem.", 24, 26, [], undefined, undefined, undefined, mockUsers[12]),
        createReply("r-s-2-7b", "pro-argument", "Grade 12 too - been dealing with this for years.", 22, 24, [], undefined, undefined, undefined, mockUsers[14]),
      ], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-s-2-8", "proposal", "Form a Cafeteria Improvement Committee with reps from each grade.", 28, 25, [
        createReply("r-s-2-8a", "pro-argument", "Direct student involvement will ensure changes happen.", 18, 22, [], undefined, undefined, undefined, mockUsers[2]),
      ], undefined, undefined, undefined, mockUsers[16]),
      createReply("r-s-2-9", "proposal", "Present cost-benefit analysis to administration.", 21, 22, [
        createReply("r-s-2-9a", "pro-argument", "Numbers speak louder than complaints.", 15, 20, [], undefined, undefined, undefined, mockUsers[4]),
      ], undefined, undefined, undefined, mockUsers[18]),
      createReply("r-s-2-10", "question", "Can we get a nutritionist involved?", 14, 18, [
        createReply("r-s-2-10a", "proposal", "The health department might provide one for free.", 17, 15, [], undefined, undefined, undefined, mockUsers[6]),
      ], undefined, undefined, undefined, mockUsers[20]),
      createReply("r-s-2-11", "variant", "Pilot program in one grade first, then expand.", 19, 15, [], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-s-2-12", "pro-argument", "Better food = better learning. It's scientifically proven.", 25, 12, [], undefined, undefined, undefined, mockUsers[10]),
      createReply("r-s-2-13", "proposal", "Partner with local restaurants for variety.", 16, 10, [
        createReply("r-s-2-13a", "objection", "This might be expensive.", 8, 8, [], undefined, undefined, undefined, mockUsers[12]),
        createReply("r-s-2-13b", "proposal", "Start with one healthy option per day.", 12, 6, [], undefined, undefined, undefined, mockUsers[14]),
      ], undefined, undefined, undefined, mockUsers[11]),
      createReply("r-s-2-14", "question", "What's the cafeteria budget currently?", 11, 8, [], undefined, undefined, undefined, mockUsers[16]),
      createReply("r-s-2-15", "proposal", "Conduct school-wide survey to prioritize changes.", 20, 5, [], undefined, undefined, undefined, mockUsers[18]),
    ],
  },

  // Winner from Grade 11 - Mental Health Support
  {
    id: "s-3",
    type: "proposal",
    title: "Mental Health Support Program",
    description: "Establish regular access to school counselors and mental health resources for all students.",
    votes: 72,
    timestamp: daysAgo(30),
    phase: "school",
    group: "Whole School",
    solutionLevel: "school",
    promotedFrom: "grade",
    originalGroup: "Grade 11",
    isWinner: true,
    winnerRank: 3,
    authorId: "u21",
    authorName: "Marie Lange",
    authorClass: "7c",
    variants: [
      {
        id: "v-s-3-1",
        title: "Mental Health Support Program",
        text: "Establish regular access to school counselors and mental health resources for all students.",
        votes: 20,
      },
      {
        id: "v-s-3-2",
        title: "Comprehensive Mental Health Initiative",
        text: "Implement peer support training, partner with external mental health organizations, integrate mental health education into curriculum, and hire additional counselors.",
        votes: 42,
      },
    ],
    replies: [
      // Class phase replies
      createReply("r-s-3-1", "pro-argument", "This is so important! Many students struggle silently.", 10, 90, [], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-s-3-2", "pro-argument", "Mental health should be treated as seriously as physical health.", 12, 88, [], undefined, undefined, undefined, mockUsers[1]),
      createReply("r-s-3-3", "proposal", "Start with awareness campaigns.", 8, 85, [], undefined, undefined, undefined, mockUsers[2]),
      // Grade phase replies
      createReply("r-s-3-4", "pro-argument", "Grade 11 has high stress - we really need this.", 18, 58, [], undefined, undefined, undefined, mockUsers[3]),
      createReply("r-s-3-5", "proposal", "Train peer supporters from each class.", 15, 55, [
        createReply("r-s-3-5a", "pro-argument", "Peers are often first to notice when someone is struggling.", 12, 52, [], undefined, undefined, undefined, mockUsers[5]),
      ], undefined, undefined, undefined, mockUsers[4]),
      createReply("r-s-3-6", "question", "How many counselors do we currently have?", 7, 50, [
        createReply("r-s-3-6a", "pro-argument", "Only 2 for 800+ students. Way understaffed.", 14, 48, [], undefined, undefined, undefined, mockUsers[7]),
      ], undefined, undefined, undefined, mockUsers[6]),
      // School phase replies
      createReply("r-s-3-7", "pro-argument", "Every grade needs better mental health support!", 28, 28, [
        createReply("r-s-3-7a", "pro-argument", "Grade 10 supports this completely.", 20, 26, [], undefined, undefined, undefined, mockUsers[9]),
        createReply("r-s-3-7b", "pro-argument", "Grade 12 too - exam stress is real.", 22, 24, [], undefined, undefined, undefined, mockUsers[11]),
      ], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-s-3-8", "proposal", "Partner with local mental health organizations.", 24, 25, [
        createReply("r-s-3-8a", "pro-argument", "They often offer free school programs.", 16, 22, [], undefined, undefined, undefined, mockUsers[13]),
      ], undefined, undefined, undefined, mockUsers[12]),
      createReply("r-s-3-9", "proposal", "Create anonymous mental health helpline.", 21, 22, [
        createReply("r-s-3-9a", "pro-argument", "Anonymity removes stigma barriers.", 18, 20, [], undefined, undefined, undefined, mockUsers[15]),
      ], undefined, undefined, undefined, mockUsers[14]),
      createReply("r-s-3-10", "variant", "Combine counseling with mental health curriculum.", 19, 18, [], undefined, undefined, undefined, mockUsers[16]),
      createReply("r-s-3-11", "proposal", "Designate quiet spaces for stress relief.", 15, 15, [
        createReply("r-s-3-11a", "pro-argument", "A calm room would help during stressful days.", 12, 12, [], undefined, undefined, undefined, mockUsers[18]),
      ], undefined, undefined, undefined, mockUsers[17]),
      createReply("r-s-3-12", "question", "Can teachers receive mental health first aid training?", 14, 12, [
        createReply("r-s-3-12a", "proposal", "Many programs offer this training for free.", 16, 10, [], undefined, undefined, undefined, mockUsers[20]),
      ], undefined, undefined, undefined, mockUsers[19]),
      createReply("r-s-3-13", "pro-argument", "Investment in mental health saves money on crisis intervention.", 17, 8, [], undefined, undefined, undefined, mockUsers[21]),
      createReply("r-s-3-14", "proposal", "Start with stress management workshops.", 13, 5, [], undefined, undefined, undefined, mockUsers[0]),
    ],
  },

  // Winner from Grade 11 - WiFi Issues
  {
    id: "s-4",
    type: "problem",
    title: "WiFi Connectivity Issues",
    description: "School wifi is unreliable and slow, making it difficult to complete online assignments and research during school hours.",
    votes: 68,
    timestamp: daysAgo(30),
    phase: "school",
    group: "Whole School",
    solutionLevel: "school",
    promotedFrom: "grade",
    originalGroup: "Grade 11",
    authorId: "u15",
    authorName: "Julia Neumann",
    authorClass: "7a",
    replies: [
      // Class phase replies
      createReply("r-s-4-1", "pro-argument", "I can never load videos for class presentations.", 8, 88, [], undefined, undefined, undefined, mockUsers[7]),
      createReply("r-s-4-2", "proposal", "Upgrade network infrastructure with more access points.", 10, 85, [], undefined, undefined, undefined, mockUsers[8]),
      // Grade phase replies
      createReply("r-s-4-3", "pro-argument", "This affects every online assignment.", 14, 58, [], undefined, undefined, undefined, mockUsers[9]),
      createReply("r-s-4-4", "proposal", "Add mesh WiFi system throughout building.", 12, 52, [
        createReply("r-s-4-4a", "question", "How much would this cost?", 6, 48, [], undefined, undefined, undefined, mockUsers[11]),
      ], undefined, undefined, undefined, mockUsers[10]),
      // School phase replies
      createReply("r-s-4-5", "pro-argument", "EVERY floor has dead zones!", 26, 28, [
        createReply("r-s-4-5a", "pro-argument", "The library is worst - where we need it most.", 20, 26, [], undefined, undefined, undefined, mockUsers[13]),
      ], undefined, undefined, undefined, mockUsers[12]),
      createReply("r-s-4-6", "proposal", "Prioritize educational traffic over recreational.", 18, 25, [], undefined, undefined, undefined, mockUsers[14]),
      createReply("r-s-4-7", "variant", "Install wired connections in classrooms as backup.", 15, 22, [
        createReply("r-s-4-7a", "pro-argument", "Wired is more reliable for important work.", 12, 20, [], undefined, undefined, undefined, mockUsers[16]),
      ], undefined, undefined, undefined, mockUsers[15]),
      createReply("r-s-4-8", "proposal", "Apply for technology infrastructure grants.", 22, 18, [
        createReply("r-s-4-8a", "pro-argument", "Federal programs fund school technology.", 16, 15, [], undefined, undefined, undefined, mockUsers[18]),
      ], undefined, undefined, undefined, mockUsers[17]),
      createReply("r-s-4-9", "question", "When was the last network upgrade?", 10, 15, [
        createReply("r-s-4-9a", "pro-argument", "Over 5 years ago - technology has changed!", 14, 12, [], undefined, undefined, undefined, mockUsers[20]),
      ], undefined, undefined, undefined, mockUsers[19]),
      createReply("r-s-4-10", "proposal", "Student tech team could help identify weak spots.", 16, 10, [], undefined, undefined, undefined, mockUsers[21]),
      createReply("r-s-4-11", "pro-argument", "Digital learning requires reliable internet.", 19, 8, [], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-s-4-12", "variant", "Phase upgrade starting with high-priority areas.", 13, 5, [], undefined, undefined, undefined, mockUsers[1]),
    ],
  },

  // Winner from Grade 12 - School Security (ministry level)
  {
    id: "s-5",
    type: "problem",
    title: "Inadequate School Security Measures",
    description: "Current security protocols are outdated. We need better systems to ensure student safety without creating an oppressive atmosphere.",
    votes: 65,
    timestamp: daysAgo(30),
    phase: "school",
    group: "Whole School",
    solutionLevel: "ministries",
    promotedFrom: "grade",
    originalGroup: "Grade 12",
    authorId: "u13",
    authorName: "Laura Wolf",
    authorClass: "7a",
    replies: [
      // Class phase replies
      createReply("r-s-5-1", "pro-argument", "Safety should be top priority, but balanced.", 8, 90, [], undefined, undefined, undefined, mockUsers[3]),
      createReply("r-s-5-2", "objection", "Too much security can make school feel like a prison.", 10, 88, [], undefined, undefined, undefined, mockUsers[4]),
      // Grade phase replies
      createReply("r-s-5-3", "proposal", "Implement visitor management system.", 12, 55, [], undefined, undefined, undefined, mockUsers[5]),
      createReply("r-s-5-4", "variant", "Focus on emergency communication, not surveillance.", 14, 50, [
        createReply("r-s-5-4a", "pro-argument", "Emergency apps are non-invasive.", 10, 48, [], undefined, undefined, undefined, mockUsers[7]),
      ], undefined, undefined, undefined, mockUsers[6]),
      // School phase replies
      createReply("r-s-5-5", "pro-argument", "Recent incidents in other schools show we need updates.", 24, 28, [
        createReply("r-s-5-5a", "pro-argument", "Prevention is better than response.", 18, 26, [], undefined, undefined, undefined, mockUsers[9]),
      ], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-s-5-6", "proposal", "Regular safety drills with proper training.", 20, 25, [], undefined, undefined, undefined, mockUsers[10]),
      createReply("r-s-5-7", "objection", "Don't want metal detectors or bag searches.", 16, 22, [
        createReply("r-s-5-7a", "variant", "ID badge system is less invasive.", 14, 20, [], undefined, undefined, undefined, mockUsers[12]),
      ], undefined, undefined, undefined, mockUsers[11]),
      createReply("r-s-5-8", "proposal", "Student input on what feels safe vs. oppressive.", 18, 18, [
        createReply("r-s-5-8a", "pro-argument", "We should have a say in security measures.", 15, 15, [], undefined, undefined, undefined, mockUsers[14]),
      ], undefined, undefined, undefined, mockUsers[13]),
      createReply("r-s-5-9", "question", "What security measures do successful schools use?", 12, 15, [
        createReply("r-s-5-9a", "pro-argument", "Positive school culture is the best security.", 17, 12, [], undefined, undefined, undefined, mockUsers[16]),
      ], undefined, undefined, undefined, mockUsers[15]),
      createReply("r-s-5-10", "proposal", "Train staff in threat assessment.", 16, 10, [], undefined, undefined, undefined, mockUsers[17]),
      createReply("r-s-5-11", "variant", "Community approach: staff, students, parents together.", 19, 8, [], undefined, undefined, undefined, mockUsers[18]),
      createReply("r-s-5-12", "pro-argument", "Ministry funding needed for proper security.", 14, 5, [], undefined, undefined, undefined, mockUsers[19]),
    ],
  },

  // Winner from Grade 12 - Standardized Testing (ministry level)
  {
    id: "s-6",
    type: "problem",
    title: "Standardized Testing Pressure",
    description: "The focus on standardized tests means teachers rush through material and we don't actually learn deeply - just memorize for the test.",
    votes: 62,
    timestamp: daysAgo(30),
    phase: "school",
    group: "Whole School",
    solutionLevel: "ministries",
    promotedFrom: "grade",
    originalGroup: "Grade 12",
    authorId: "u14",
    authorName: "Maximilian Schröder",
    authorClass: "7a",
    replies: [
      // Class phase replies
      createReply("r-s-6-1", "pro-argument", "I forget everything right after the test.", 7, 88, [], undefined, undefined, undefined, mockUsers[14]),
      createReply("r-s-6-2", "pro-argument", "Teachers say 'this won't be on the test' and we skip important topics.", 8, 85, [], undefined, undefined, undefined, mockUsers[15]),
      createReply("r-s-6-3", "objection", "Tests are needed to compare students fairly.", 4, 82, [], undefined, undefined, undefined, mockUsers[16]),
      // Grade phase replies
      createReply("r-s-6-4", "proposal", "Advocate for portfolio-based assessment.", 12, 55, [], undefined, undefined, undefined, mockUsers[18]),
      createReply("r-s-6-5", "variant", "Combine standardized tests with project assessments.", 14, 50, [
        createReply("r-s-6-5a", "pro-argument", "Shows both knowledge and application.", 10, 48, [], undefined, undefined, undefined, mockUsers[20]),
      ], undefined, undefined, undefined, mockUsers[19]),
      // School phase replies
      createReply("r-s-6-6", "pro-argument", "Grade 12 feels this most acutely - our future depends on test scores.", 22, 28, [
        createReply("r-s-6-6a", "pro-argument", "University admission is all test-based.", 18, 26, [], undefined, undefined, undefined, mockUsers[0]),
      ], undefined, undefined, undefined, mockUsers[21]),
      createReply("r-s-6-7", "proposal", "Petition ministry for assessment reform.", 20, 25, [], undefined, undefined, undefined, mockUsers[1]),
      createReply("r-s-6-8", "variant", "Request pilot program for alternative assessment.", 16, 22, [
        createReply("r-s-6-8a", "pro-argument", "Other countries have moved away from standardized tests.", 14, 20, [], undefined, undefined, undefined, mockUsers[3]),
      ], undefined, undefined, undefined, mockUsers[2]),
      createReply("r-s-6-9", "question", "How do other countries assess students?", 12, 18, [
        createReply("r-s-6-9a", "pro-argument", "Finland uses continuous assessment - they rank #1 in education.", 17, 15, [], undefined, undefined, undefined, mockUsers[5]),
      ], undefined, undefined, undefined, mockUsers[4]),
      createReply("r-s-6-10", "proposal", "Research shows project-based learning is more effective.", 15, 15, [], undefined, undefined, undefined, mockUsers[6]),
      createReply("r-s-6-11", "objection", "Universities need some standardized measure.", 10, 12, [
        createReply("r-s-6-11a", "variant", "Multiple measures are better than one test.", 13, 10, [], undefined, undefined, undefined, mockUsers[8]),
      ], undefined, undefined, undefined, mockUsers[7]),
      createReply("r-s-6-12", "pro-argument", "Mental health suffers from test anxiety.", 18, 8, [], undefined, undefined, undefined, mockUsers[9]),
      createReply("r-s-6-13", "proposal", "Include student voices in ministry education committees.", 14, 5, [], undefined, undefined, undefined, mockUsers[10]),
    ],
  },

  // Additional school phase concern - Sustainability
  {
    id: "s-7",
    type: "proposal",
    title: "School-Wide Sustainability Initiative",
    description: "Our school lacks comprehensive recycling programs and environmental awareness. We need systematic changes to reduce our ecological footprint.",
    votes: 58,
    timestamp: daysAgo(30),
    phase: "school",
    group: "Whole School",
    solutionLevel: "school",
    promotedFrom: "grade",
    originalGroup: "Grade 11",
    authorId: "u11",
    authorName: "Anna Richter",
    authorClass: "6c",
    replies: [
      // Class phase replies
      createReply("r-s-7-1", "pro-argument", "Climate change affects all of us.", 8, 88, [], undefined, undefined, undefined, mockUsers[19]),
      createReply("r-s-7-2", "proposal", "Start with better recycling bins.", 6, 85, [], undefined, undefined, undefined, mockUsers[18]),
      // Grade phase replies
      createReply("r-s-7-3", "proposal", "Create student Green Team.", 14, 55, [], undefined, undefined, undefined, mockUsers[20]),
      createReply("r-s-7-4", "variant", "Energy audit to find savings.", 12, 50, [], undefined, undefined, undefined, mockUsers[21]),
      // School phase replies
      createReply("r-s-7-5", "pro-argument", "Schools should lead by example!", 22, 28, [
        createReply("r-s-7-5a", "pro-argument", "Students care deeply about the environment.", 18, 26, [], undefined, undefined, undefined, mockUsers[1]),
      ], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-s-7-6", "proposal", "Apply for environmental grants.", 18, 25, [], undefined, undefined, undefined, mockUsers[2]),
      createReply("r-s-7-7", "question", "What have other schools done successfully?", 10, 22, [
        createReply("r-s-7-7a", "pro-argument", "Many schools have reduced energy costs 30% with simple changes.", 16, 20, [], undefined, undefined, undefined, mockUsers[4]),
      ], undefined, undefined, undefined, mockUsers[3]),
      createReply("r-s-7-8", "variant", "Start with LED lighting - quick payback.", 14, 18, [], undefined, undefined, undefined, mockUsers[5]),
      createReply("r-s-7-9", "proposal", "Partner with local environmental groups.", 12, 15, [], undefined, undefined, undefined, mockUsers[6]),
      createReply("r-s-7-10", "pro-argument", "Sustainability education is future-proofing.", 15, 10, [], undefined, undefined, undefined, mockUsers[7]),
      createReply("r-s-7-11", "proposal", "Composting program for cafeteria waste.", 11, 8, [], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-s-7-12", "variant", "Make sustainability part of school culture.", 13, 5, [], undefined, undefined, undefined, mockUsers[9]),
    ],
  },

  // Additional school phase concern - Extracurricular
  {
    id: "s-8",
    type: "proposal",
    title: "Inclusive Extra-Curricular Programs",
    description: "Expand after-school programs to include more diverse activities that cater to different interests and abilities.",
    votes: 55,
    timestamp: daysAgo(30),
    phase: "school",
    group: "Whole School",
    solutionLevel: "school",
    promotedFrom: "grade",
    originalGroup: "Grade 10",
    authorId: "u12",
    authorName: "Ben Klein",
    authorClass: "6c",
    replies: [
      // Class phase replies
      createReply("r-s-8-1", "pro-argument", "Not everyone likes traditional sports.", 7, 88, [], undefined, undefined, undefined, mockUsers[1]),
      createReply("r-s-8-2", "proposal", "Survey students about interests.", 8, 85, [], undefined, undefined, undefined, mockUsers[2]),
      // Grade phase replies
      createReply("r-s-8-3", "pro-argument", "More options = more participation.", 12, 55, [], undefined, undefined, undefined, mockUsers[3]),
      createReply("r-s-8-4", "proposal", "Student-led clubs are low cost.", 10, 50, [], undefined, undefined, undefined, mockUsers[4]),
      // School phase replies
      createReply("r-s-8-5", "pro-argument", "Every grade wants more variety!", 20, 28, [
        createReply("r-s-8-5a", "pro-argument", "Clubs help students find their passion.", 16, 26, [], undefined, undefined, undefined, mockUsers[6]),
      ], undefined, undefined, undefined, mockUsers[5]),
      createReply("r-s-8-6", "proposal", "Technology club for coding and robotics.", 18, 25, [], undefined, undefined, undefined, mockUsers[7]),
      createReply("r-s-8-7", "proposal", "Arts and music programs need expansion.", 15, 22, [
        createReply("r-s-8-7a", "pro-argument", "Creative activities reduce stress.", 12, 20, [], undefined, undefined, undefined, mockUsers[9]),
      ], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-s-8-8", "variant", "Partnership with community centers.", 13, 18, [], undefined, undefined, undefined, mockUsers[10]),
      createReply("r-s-8-9", "question", "How do we find volunteer advisors?", 9, 15, [
        createReply("r-s-8-9a", "proposal", "Parents and community members often volunteer.", 14, 12, [], undefined, undefined, undefined, mockUsers[12]),
      ], undefined, undefined, undefined, mockUsers[11]),
      createReply("r-s-8-10", "proposal", "Rotating activities each semester.", 11, 10, [], undefined, undefined, undefined, mockUsers[13]),
      createReply("r-s-8-11", "pro-argument", "Extracurriculars boost college applications.", 16, 8, [], undefined, undefined, undefined, mockUsers[14]),
      createReply("r-s-8-12", "variant", "Virtual clubs for accessibility.", 10, 5, [], undefined, undefined, undefined, mockUsers[15]),
    ],
  },

  // ============================================
  // COUNTER-PROPOSALS (referencing problems)
  // ============================================
  {
    id: "cp-1",
    type: "counter-proposal",
    title: "Flexible Lunch Timing System",
    description: "Instead of just improving food quality, implement a flexible lunch schedule with multiple serving windows to reduce crowding and ensure food stays hot.",
    votes: 18,
    timestamp: daysAgo(88),
    phase: "class",
    group: "Class 10A",
    referencedProblemId: "g10-1",
    referencedObjectionId: "r-g10-1-1",
    referencedOriginalPostId: "g10-1",
    solutionLevel: "school",
    authorId: "u21",
    authorName: "Marie Lange",
    authorClass: "7c",
    replies: [
      createReply("r-cp-1-1", "pro-argument", "This addresses both food quality and timing issues!", 7, 87, [], undefined, undefined, undefined, mockUsers[19]),
      createReply("r-cp-1-2", "objection", "Multiple lunch periods might complicate teacher schedules.", 4, 86, [], undefined, undefined, undefined, mockUsers[20]),
    ],
  },
  {
    id: "cp-2",
    type: "counter-proposal",
    title: "Hybrid PE Classes with Equipment Rotation",
    description: "Address equipment shortage by splitting PE into stations that rotate, so smaller groups use equipment while others do equipment-free exercises.",
    votes: 15,
    timestamp: daysAgo(85),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "class",
    referencedProblemId: "g10-3",
    referencedObjectionId: "r-g10-3-3",
    referencedOriginalPostId: "g10-3",
    aspects: ["problem", "proposal"],
    authorId: "u22",
    authorName: "Leon Werner",
    authorClass: "7c",
    replies: [
      createReply("r-cp-2-1", "pro-argument", "Stations would keep everyone active instead of just waiting.", 6, 84, [], undefined, undefined, undefined, mockUsers[21]),
      createReply("r-cp-2-2", "proposal", "We could have fitness stations, skill stations, and game stations rotating every 15 minutes.", 8, 83, [], undefined, undefined, undefined, mockUsers[0]),
    ],
  },
];
