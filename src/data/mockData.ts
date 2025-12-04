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

export const mockConcerns: Concern[] = [
  // ============================================
  // CLASS PHASE CONCERNS (10 total)
  // Top 3 by votes will advance to grade phase
  // ============================================
  {
    id: "1",
    type: "problem",
    title: "Cafeteria Food Quality Issues",
    description: "The food served in our cafeteria is often cold and lacks variety. Students are frequently complaining about limited healthy options.",
    votes: 34,
    timestamp: daysAgo(85),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "school",
    isWinner: true,
    winnerRank: 1,
    authorId: "u1",
    authorName: "Emma Schmidt",
    authorClass: "6a",
    variants: [
      {
        id: "v1-1",
        title: "Cafeteria Food Quality Issues",
        text: "The food served in our cafeteria is often cold and lacks variety. Students are frequently complaining about limited healthy options.",
        votes: 12,
      },
      {
        id: "v1-2",
        title: "Cafeteria Food Quality and Timing Concerns",
        text: "The food served in our cafeteria is often cold and lacks variety, but we should also consider extending lunch break times to reduce crowding. This addresses both timing and variety concerns.",
        votes: 18,
      },
      {
        id: "v1-3",
        title: "Comprehensive Cafeteria Service Improvement",
        text: "The food served in our cafeteria is often cold and lacks variety. We propose a student feedback system for menu items and extended lunch breaks to improve both quality and timing issues.",
        votes: 24,
      },
    ],
    replies: [
      createReply("r1", "objection", "I think the main issue is timing, not quality. Food is hot when served.", 8, 84.5, [], undefined, undefined, undefined, mockUsers[1]),
      createReply("r2", "pro-argument", "Absolutely agree! I've noticed many students skip lunch because of this.", 12, 84.2, [
        createReply("r2a", "question", "Do we have data on how many students actually skip lunch?", 3, 84, [
          createReply("r2a1", "pro-argument", "The student council did a survey - about 30% regularly skip cafeteria meals.", 5, 83.8, [], undefined, undefined, undefined, mockUsers[3])
        ], undefined, undefined, undefined, mockUsers[2]),
        createReply("r2b", "proposal", "We could propose bringing healthier options like fresh salads and sandwiches.", 4, 83.9, [], undefined, undefined, undefined, mockUsers[4])
      ], undefined, undefined, undefined, mockUsers[5]),
      createReply("r3", "proposal", "We could propose a student feedback system where we vote on menu items weekly.", 15, 83.8, [], undefined, {
        text: "Create a monthly rotating menu based on student preferences collected through surveys.",
        solutionLevel: "school"
      }, undefined, mockUsers[6]),
      createReply("r4", "variant", "The food served in our cafeteria is often cold and lacks variety, but we should also consider extending lunch break times to reduce crowding. This synthesis addresses both timing and variety concerns.", 10, 83.5, [], [
        { id: "r1", text: "I think the main issue is timing, not quality.", category: "objection" },
        { id: "r2", text: "Absolutely agree! I've noticed many students skip lunch.", category: "pro-argument" }
      ], undefined, undefined, mockUsers[7]),
      createReply("r4a", "question", "How many students actually eat in the cafeteria versus bringing their own lunch? Maybe the issue isn't as widespread as we think?", 5, 83.2, [
        createReply("r4a1", "pro-argument", "Good point! According to the student council survey, about 75% of students regularly use the cafeteria, so this affects most of us.", 3, 82.8, [], undefined, undefined, undefined, mockUsers[8])
      ], undefined, undefined, undefined, mockUsers[9]),
    ],
  },
  {
    id: "2",
    type: "proposal",
    title: "Implement Digital Assignment Submission",
    description: "We should move to a fully digital assignment submission system to reduce paper waste and make tracking easier.",
    votes: 28,
    timestamp: daysAgo(82),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "school",
    isWinner: true,
    winnerRank: 2,
    authorId: "u10",
    authorName: "Jonas Bauer",
    authorClass: "6c",
    variants: [
      {
        id: "v2-1",
        title: "Implement Digital Assignment Submission",
        text: "We should move to a fully digital assignment submission system to reduce paper waste and make tracking easier.",
        votes: 8,
      },
      {
        id: "v2-2",
        title: "Hybrid Digital and Physical Assignment System",
        text: "We should move to a hybrid assignment submission system with offline access capabilities, combining digital efficiency with accessibility for all students who may not have reliable internet.",
        votes: 14,
      },
      {
        id: "v2-3",
        title: "Digital Assignment System with Extended Access",
        text: "Implement a fully digital assignment submission system using free platforms like Google Classroom, with extended library hours for students who need school computers for submissions.",
        votes: 22,
      },
    ],
    replies: [
      createReply("r5", "pro-argument", "This would help the environment and make it easier to keep track of deadlines.", 9, 81.5, [], undefined, undefined, undefined, mockUsers[11]),
      createReply("r6", "objection", "Not all students have reliable internet access at home. This could be unfair.", 14, 81, [], undefined, {
        text: "Implement a hybrid system where students can use school computers during extended library hours for digital submissions.",
        postedAsConcern: true,
        solutionLevel: "school"
      }, undefined, mockUsers[12]),
      createReply("r7", "pro-argument", "Digital submissions also allow teachers to provide faster feedback.", 7, 80.5, [], undefined, undefined, undefined, mockUsers[13]),
      createReply("r8", "variant", "We should move to a fully digital assignment submission system with offline access capabilities, combining digital efficiency with accessibility for all students.", 11, 80, [], [
        { id: "r6", text: "Not all students have reliable internet access.", category: "objection" },
        { id: "r5", text: "This would help the environment.", category: "pro-argument" }
      ], undefined, undefined, mockUsers[14]),
      createReply("r8a", "question", "What platform would we use for this? Are there any free options that work well for schools?", 4, 79.5, [
        createReply("r8a1", "proposal", "Google Classroom is free and most students already have accounts. It integrates with Google Drive for easy file management.", 6, 79, [], undefined, undefined, undefined, mockUsers[15])
      ], undefined, undefined, undefined, mockUsers[16]),
    ],
  },
  {
    id: "3",
    type: "problem",
    title: "Limited Access to Sports Equipment",
    description: "Our class doesn't have enough sports equipment for PE lessons, leading to long waiting times and reduced activity.",
    votes: 22,
    timestamp: daysAgo(78),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "school",
    isWinner: true,
    winnerRank: 3,
    authorId: "u17",
    authorName: "Sarah Zimmermann",
    authorClass: "7b",
    variants: [
      {
        id: "v3-1",
        title: "Limited Access to Sports Equipment",
        text: "Our class doesn't have enough sports equipment for PE lessons, leading to long waiting times and reduced activity.",
        votes: 7,
      },
      {
        id: "v3-2",
        title: "Sports Equipment and Class Size Issues",
        text: "Our class doesn't have enough sports equipment for PE lessons, but the real issue is that PE classes are too large. We need smaller groups and better equipment distribution.",
        votes: 11,
      },
      {
        id: "v3-3",
        title: "Comprehensive PE Equipment Solution",
        text: "Our class doesn't have enough sports equipment for PE lessons. We propose organizing equipment-sharing schedules between classes, purchasing multi-use items, and applying for budget allocation for additional equipment.",
        votes: 16,
      },
    ],
    replies: [
      createReply("r9", "pro-argument", "Yes! Half the class just stands around waiting for their turn.", 8, 77.5, [], undefined, undefined, undefined, mockUsers[18]),
      createReply("r10", "proposal", "We could create a rotation system and extend PE class time.", 6, 77, [], undefined, {
        text: "Apply for school budget allocation to purchase additional sports equipment and storage facilities.",
        solutionLevel: "school"
      }, undefined, mockUsers[19]),
      createReply("r11", "objection", "The real issue is that PE classes are too large. We need smaller groups.", 10, 76.5, [], undefined, undefined, undefined, mockUsers[20]),
      createReply("r12", "variant", "Our class doesn't have enough sports equipment for PE lessons, but organizing equipment-sharing schedules between classes and purchasing multi-use items could help maximize what we have.", 7, 76, [], [
        { id: "r10", text: "We could create a rotation system.", category: "proposal" },
        { id: "r11", text: "PE classes are too large.", category: "objection" }
      ], undefined, undefined, mockUsers[21]),
    ],
  },
  {
    id: "3a",
    type: "proposal",
    title: "Weekly Class Meetings for Student Voice",
    description: "Hold regular 15-minute class meetings where students can discuss concerns and vote on class-level decisions together.",
    votes: 18,
    timestamp: daysAgo(74),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "school",
    authorId: "u22",
    authorName: "Leon Werner",
    authorClass: "7c",
    replies: [
      createReply("r12a", "pro-argument", "This would make everyone feel more involved in class decisions.", 6, 73.5, [], undefined, undefined, undefined, mockUsers[0]),
      createReply("r12b", "objection", "Taking time from lessons might affect our curriculum coverage.", 4, 73, [], undefined, undefined, undefined, mockUsers[1]),
    ],
  },
  {
    id: "3b",
    type: "problem",
    title: "Classroom Temperature Control Issues",
    description: "Our classroom is too hot in summer and too cold in winter. The heating and AC systems don't work properly.",
    votes: 16,
    timestamp: daysAgo(70),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "school",
    authorId: "u2",
    authorName: "Liam Müller",
    authorClass: "6a",
    replies: [
      createReply("r12c", "pro-argument", "It's hard to concentrate when you're freezing or sweating.", 7, 69.5, [], undefined, undefined, undefined, mockUsers[2]),
      createReply("r12d", "proposal", "Request maintenance to fix the thermostat and check the HVAC system.", 5, 69, [], undefined, undefined, undefined, mockUsers[3]),
    ],
  },
  {
    id: "3c",
    type: "proposal",
    title: "Class Library Corner",
    description: "Create a small library corner in our classroom with books students can borrow and exchange freely.",
    votes: 14,
    timestamp: daysAgo(66),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "class",
    authorId: "u3",
    authorName: "Sophie Weber",
    authorClass: "6a",
    replies: [
      createReply("r12e", "pro-argument", "This would encourage more reading during free time.", 5, 65.5, [], undefined, undefined, undefined, mockUsers[4]),
      createReply("r12f", "proposal", "We could do a book drive where everyone brings books from home.", 6, 65, [], undefined, undefined, undefined, mockUsers[5]),
    ],
  },
  {
    id: "3d",
    type: "problem",
    title: "Group Project Assignment Fairness",
    description: "Group projects often result in unequal workload distribution, with some students doing most of the work.",
    votes: 12,
    timestamp: daysAgo(62),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "class",
    authorId: "u4",
    authorName: "Noah Fischer",
    authorClass: "6a",
    replies: [
      createReply("r12g", "pro-argument", "I always end up doing everything while others get the same grade.", 4, 61.5, [], undefined, undefined, undefined, mockUsers[6]),
      createReply("r12h", "proposal", "Teachers should require individual contribution logs for group projects.", 7, 61, [], undefined, undefined, undefined, mockUsers[7]),
    ],
  },
  {
    id: "3e",
    type: "problem",
    title: "Lack of Storage Space for Personal Items",
    description: "We don't have enough locker space or shelves for our bags and sports equipment during the day.",
    votes: 9,
    timestamp: daysAgo(59),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "class",
    authorId: "u5",
    authorName: "Mia Wagner",
    authorClass: "6b",
    replies: [
      createReply("r12i", "pro-argument", "Our bags are piled up and things get lost or damaged.", 3, 58.5, [], undefined, undefined, undefined, mockUsers[8]),
      createReply("r12j", "proposal", "Install additional hooks and shelves along the classroom walls.", 4, 58, [], undefined, undefined, undefined, mockUsers[9]),
    ],
  },
  {
    id: "3f",
    type: "problem",
    title: "Insufficient Time Between Classes",
    description: "Only 5 minutes between classes isn't enough to get to lockers, use bathroom, and reach the next classroom across campus.",
    votes: 8,
    timestamp: daysAgo(56),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "school",
    authorId: "u6",
    authorName: "Elias Becker",
    authorClass: "6b",
    replies: [
      createReply("r12k", "pro-argument", "I'm always late to my next class because my locker is far away.", 3, 55.5, [], undefined, undefined, undefined, mockUsers[10]),
      createReply("r12l", "proposal", "Extend breaks to 7-8 minutes or create a passing period schedule.", 5, 55, [], undefined, undefined, undefined, mockUsers[11]),
    ],
  },
  {
    id: "3g",
    type: "proposal",
    title: "Student Tutoring Exchange Program",
    description: "Create a peer tutoring system where students who excel in a subject can help classmates who struggle, earning community service hours.",
    votes: 7,
    timestamp: daysAgo(53),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "school",
    authorId: "u7",
    authorName: "Hannah Hoffmann",
    authorClass: "6b",
    replies: [
      createReply("r12m", "pro-argument", "Learning from peers often feels less intimidating than asking teachers.", 4, 52.5, [], undefined, undefined, undefined, mockUsers[12]),
      createReply("r12n", "proposal", "Match students by learning style and schedule to make pairing effective.", 3, 52, [], undefined, undefined, undefined, mockUsers[13]),
    ],
  },

  // ============================================
  // GRADE PHASE CONCERNS (10 total)
  // 3 winners from class + 7 from other classes
  // Top 2 will advance to school phase
  // ============================================
  {
    id: "4",
    type: "problem",
    title: "Homework Overload Across Subjects",
    description: "Students are receiving excessive homework from multiple subjects with overlapping deadlines, causing stress and burnout.",
    votes: 56,
    timestamp: daysAgo(56),
    phase: "grade",
    group: "Grade 10",
    promotedFrom: "class",
    originalGroup: "Class 10A",
    isWinner: true,
    winnerRank: 1,
    authorId: "u13",
    authorName: "Laura Wolf",
    authorClass: "7a",
    variants: [
      {
        id: "v4-1",
        title: "Homework Overload Across Subjects",
        text: "Students are receiving excessive homework from multiple subjects with overlapping deadlines, causing stress and burnout.",
        votes: 15,
      },
      {
        id: "v4-2",
        title: "Homework Coordination and Cap Policy",
        text: "Students are receiving excessive homework from multiple subjects with overlapping deadlines. We need a homework cap policy of maximum 2 hours per night and a shared calendar for teachers to coordinate.",
        votes: 28,
      },
      {
        id: "v4-3",
        title: "Comprehensive Homework Management System",
        text: "Students are receiving excessive homework from multiple subjects with overlapping deadlines. We propose a 2-hour homework cap, monthly grade-level teacher coordination meetings, and a shared digital calendar for assignment tracking.",
        votes: 34,
      },
    ],
    replies: [
      createReply("r13", "pro-argument", "Definitely! Sometimes I have 4 major assignments due the same week.", 18, 55.5, [
        createReply("r13a", "objection", "But some subjects genuinely require more practice to master.", 5, 55.2, [
          createReply("r13a1", "variant", "Maybe we need smarter homework, not less homework - quality over quantity.", 8, 55, [], undefined, undefined, undefined, mockUsers[14])
        ], undefined, undefined, undefined, mockUsers[15])
      ], undefined, undefined, undefined, mockUsers[16]),
      createReply("r14", "objection", "Teachers don't coordinate because they have their own curriculum requirements.", 12, 55, [], undefined, {
        text: "Establish a shared digital calendar where teachers can see all assignment deadlines and coordinate better.",
        solutionLevel: "school"
      }, undefined, mockUsers[17]),
      createReply("r14a", "question", "How would a homework cap actually be enforced? Would teachers be penalized for exceeding it?", 9, 54.8, [
        createReply("r14a1", "proposal", "Teachers would self-report assignments in the shared system, and grade coordinators review it monthly. No penalties, just collaborative adjustments.", 11, 54.6, [], undefined, undefined, undefined, mockUsers[18])
      ], undefined, undefined, undefined, mockUsers[19]),
      createReply("r15", "proposal", "Create a homework cap policy - maximum 2 hours per night across all subjects.", 22, 54.5, [], undefined, {
        text: "Implement a homework coordination system with grade-level teacher meetings monthly.",
        solutionLevel: "ministries"
      }, undefined, mockUsers[20]),
    ],
  },
  {
    id: "5",
    type: "proposal",
    title: "Mental Health Support Program",
    description: "Establish regular access to school counselors and mental health resources for all students in our grade.",
    votes: 48,
    timestamp: daysAgo(52),
    phase: "grade",
    group: "Grade 10",
    solutionLevel: "school",
    promotedFrom: "class",
    originalGroup: "Class 10A",
    isWinner: true,
    winnerRank: 2,
    authorId: "u21",
    authorName: "Marie Lange",
    authorClass: "7c",
    variants: [
      {
        id: "v5-1",
        title: "Mental Health Support Program",
        text: "Establish regular access to school counselors and mental health resources for all students in our grade.",
        votes: 12,
      },
      {
        id: "v5-2",
        title: "Mental Health Support with Curriculum Integration",
        text: "Establish regular access to school counselors and mental health resources, while adding mental health education to the curriculum so everyone understands it better.",
        votes: 20,
      },
      {
        id: "v5-3",
        title: "Comprehensive Mental Health Initiative",
        text: "Establish regular access to school counselors and mental health resources, implement peer support training, partner with external mental health organizations, and integrate mental health education into the curriculum.",
        votes: 31,
      },
    ],
    replies: [
      createReply("r18", "pro-argument", "This is so important! Many students struggle silently.", 16, 51.5, [], undefined, undefined, undefined, mockUsers[0]),
      createReply("r19", "pro-argument", "Mental health should be treated as seriously as physical health.", 19, 51, [], undefined, undefined, undefined, mockUsers[1]),
    ],
  },
  {
    id: "6",
    type: "problem",
    title: "Outdated Computer Lab Equipment",
    description: "Computer lab machines are 8+ years old, frequently crash, and can't run modern software needed for coursework.",
    votes: 41,
    timestamp: daysAgo(48),
    phase: "grade",
    group: "Grade 10",
    promotedFrom: "class",
    originalGroup: "Class 10A",
    authorId: "u2",
    authorName: "Liam Müller",
    authorClass: "6a",
    variants: [
      {
        id: "v6-1",
        title: "Outdated Computer Lab Equipment",
        text: "Computer lab machines are 8+ years old, frequently crash, and can't run modern software needed for coursework.",
        votes: 10,
      },
      {
        id: "v6-2",
        title: "Computer Lab Modernization Plan",
        text: "Computer lab machines are 8+ years old, frequently crash, and can't run modern software needed for coursework. We propose a phased replacement plan starting with the most critical machines.",
        votes: 18,
      },
    ],
    replies: [
      createReply("r20", "pro-argument", "I lost my entire project last week because the computer crashed.", 14, 47.5, [], undefined, undefined, undefined, mockUsers[2]),
      createReply("r21", "proposal", "Request a budget allocation for new computers in next year's school budget.", 11, 47, [], undefined, {
        text: "Apply for district technology grants to fund new computer equipment.",
        solutionLevel: "ministries"
      }, undefined, mockUsers[3]),
    ],
  },
  {
    id: "6a",
    type: "proposal",
    title: "Grade-Wide Study Groups",
    description: "Organize cross-class study groups where students from different classes can collaborate on subjects they find challenging.",
    votes: 35,
    timestamp: daysAgo(44),
    phase: "grade",
    group: "Grade 10",
    solutionLevel: "school",
    authorId: "u4",
    authorName: "Noah Fischer",
    authorClass: "6a",
    replies: [
      createReply("r21a", "pro-argument", "This would help us learn from students with different perspectives.", 8, 43.5, [], undefined, undefined, undefined, mockUsers[4]),
      createReply("r21b", "objection", "Scheduling might be difficult with different class timetables.", 6, 43, [], undefined, undefined, undefined, mockUsers[5]),
    ],
  },
  {
    id: "6b",
    type: "problem",
    title: "Inconsistent Grading Standards",
    description: "Different teachers grade the same quality of work differently. A B in one class might be an A in another.",
    votes: 32,
    timestamp: daysAgo(40),
    phase: "grade",
    group: "Grade 10",
    authorId: "u5",
    authorName: "Mia Wagner",
    authorClass: "6b",
    replies: [
      createReply("r21c", "pro-argument", "This makes GPA comparisons unfair between students.", 10, 39.5, [], undefined, undefined, undefined, mockUsers[6]),
      createReply("r21d", "proposal", "Create grade-level rubrics that all teachers in a subject must follow.", 12, 39, [], undefined, undefined, undefined, mockUsers[7]),
    ],
  },
  {
    id: "6c",
    type: "problem",
    title: "Lack of Extracurricular Variety",
    description: "Our grade has limited extracurricular options. Most clubs are focused on academics, with few creative or recreational choices.",
    votes: 28,
    timestamp: daysAgo(36),
    phase: "grade",
    group: "Grade 10",
    authorId: "u6",
    authorName: "Elias Becker",
    authorClass: "6b",
    replies: [
      createReply("r21e", "pro-argument", "Not everyone is interested in academic clubs. We need more diversity.", 7, 35.5, [], undefined, undefined, undefined, mockUsers[8]),
      createReply("r21f", "proposal", "Survey students about what clubs they'd like and try to find volunteer advisors.", 9, 35, [], undefined, undefined, undefined, mockUsers[9]),
    ],
  },
  {
    id: "6d",
    type: "proposal",
    title: "Extended Library Hours",
    description: "Keep the school library open until 6 PM on weekdays so students can study after extracurricular activities.",
    votes: 26,
    timestamp: daysAgo(32),
    phase: "grade",
    group: "Grade 10",
    solutionLevel: "school",
    authorId: "u7",
    authorName: "Hannah Hoffmann",
    authorClass: "6b",
    replies: [
      createReply("r21g", "pro-argument", "This would really help students who have sports practice after school.", 8, 31.5, [], undefined, undefined, undefined, mockUsers[10]),
      createReply("r21h", "objection", "The library staff might not be able to work extended hours.", 5, 31, [], undefined, undefined, undefined, mockUsers[11]),
    ],
  },
  {
    id: "6e",
    type: "problem",
    title: "Crowded Hallways During Passing Periods",
    description: "Hallways are extremely crowded between classes, causing pushing, delays, and safety concerns.",
    votes: 24,
    timestamp: daysAgo(28),
    phase: "grade",
    group: "Grade 10",
    authorId: "u8",
    authorName: "Felix Schulz",
    authorClass: "6b",
    replies: [
      createReply("r21i", "pro-argument", "I've been pushed into lockers multiple times this year.", 6, 27.5, [], undefined, undefined, undefined, mockUsers[12]),
      createReply("r21j", "proposal", "Implement one-way hallway traffic flow during passing periods.", 8, 27, [], undefined, undefined, undefined, mockUsers[13]),
    ],
  },
  {
    id: "6f",
    type: "proposal",
    title: "Monthly Grade Assemblies",
    description: "Hold monthly assemblies where grade-level achievements are celebrated and important information is shared.",
    votes: 21,
    timestamp: daysAgo(25),
    phase: "grade",
    group: "Grade 10",
    solutionLevel: "school",
    authorId: "u9",
    authorName: "Lea Koch",
    authorClass: "6c",
    replies: [
      createReply("r21k", "pro-argument", "This would build more community within our grade.", 5, 24.5, [], undefined, undefined, undefined, mockUsers[14]),
      createReply("r21l", "objection", "Taking time out of classes for assemblies might not be worth it.", 4, 24, [], undefined, undefined, undefined, mockUsers[15]),
    ],
  },
  {
    id: "6g",
    type: "problem",
    title: "Limited Access to Teachers for Help",
    description: "Teachers are often unavailable outside of class time. Office hours are limited and usually crowded.",
    votes: 19,
    timestamp: daysAgo(22),
    phase: "grade",
    group: "Grade 10",
    authorId: "u10",
    authorName: "Jonas Bauer",
    authorClass: "6c",
    replies: [
      createReply("r21m", "pro-argument", "I've waited in line for 20 minutes during office hours and still didn't get help.", 7, 21.5, [], undefined, undefined, undefined, mockUsers[16]),
      createReply("r21n", "proposal", "Create an online Q&A forum where teachers can answer questions asynchronously.", 6, 21, [], undefined, undefined, undefined, mockUsers[17]),
    ],
  },

  // ============================================
  // SCHOOL PHASE CONCERNS (10 total)
  // 2 winners from grade + 8 from other grades
  // Top 3 will be implemented
  // ============================================
  {
    id: "7",
    type: "problem",
    title: "School-Wide Sustainability Initiative",
    description: "Our school lacks comprehensive recycling programs and environmental awareness. We need systematic changes to reduce our ecological footprint.",
    votes: 89,
    timestamp: daysAgo(25),
    phase: "school",
    group: "Whole School",
    promotedFrom: "grade",
    originalGroup: "Grade 10",
    isWinner: true,
    winnerRank: 1,
    authorId: "u11",
    authorName: "Anna Richter",
    authorClass: "6c",
    variants: [
      {
        id: "v7-1",
        title: "School-Wide Sustainability Initiative",
        text: "Our school lacks comprehensive recycling programs and environmental awareness. We need systematic changes to reduce our ecological footprint.",
        votes: 20,
      },
      {
        id: "v7-2",
        title: "Comprehensive Green School Program",
        text: "Our school lacks comprehensive recycling programs and environmental awareness. We propose a Green School Program including recycling stations, energy-saving measures, and environmental education curriculum.",
        votes: 35,
      },
      {
        id: "v7-3",
        title: "Sustainability Initiative with Student Leadership",
        text: "Our school lacks comprehensive recycling programs and environmental awareness. We propose creating a student-led Sustainability Committee, installing recycling stations, implementing energy audits, and partnering with local environmental organizations.",
        votes: 48,
      },
    ],
    replies: [
      createReply("r22", "pro-argument", "Climate change affects all of us. Schools should lead by example.", 28, 24.5, [
        createReply("r22a", "proposal", "Start with simple changes: better recycling bins, energy-efficient lighting.", 15, 24, [], undefined, undefined, undefined, mockUsers[18])
      ], undefined, undefined, undefined, mockUsers[19]),
      createReply("r23", "proposal", "Create a student-led 'Green Team' to implement and monitor sustainability initiatives.", 32, 24, [], undefined, {
        text: "Apply for environmental grants to fund solar panels and water conservation systems.",
        solutionLevel: "ministries"
      }, undefined, mockUsers[20]),
      createReply("r23a", "question", "What specific sustainability measures have other schools successfully implemented? Can we learn from their experience?", 12, 23.5, [
        createReply("r23a1", "pro-argument", "I researched this - many schools have reduced energy costs by 30% with simple LED lighting upgrades and better thermostat management.", 18, 23, [], undefined, undefined, undefined, mockUsers[21])
      ], undefined, undefined, undefined, mockUsers[0]),
    ],
  },
  {
    id: "8",
    type: "proposal",
    title: "Inclusive Extra-Curricular Programs",
    description: "Expand after-school programs to include more diverse activities that cater to different interests and abilities.",
    votes: 72,
    timestamp: daysAgo(22),
    phase: "school",
    group: "Whole School",
    solutionLevel: "school",
    promotedFrom: "grade",
    originalGroup: "Grade 10",
    isWinner: true,
    winnerRank: 2,
    authorId: "u12",
    authorName: "Ben Klein",
    authorClass: "6c",
    variants: [
      {
        id: "v8-1",
        title: "Inclusive Extra-Curricular Programs",
        text: "Expand after-school programs to include more diverse activities that cater to different interests and abilities.",
        votes: 18,
      },
      {
        id: "v8-2",
        title: "Diverse After-School Program Expansion",
        text: "Expand after-school programs to include more diverse activities that cater to different interests and abilities, including arts, technology, sports, and community service options.",
        votes: 28,
      },
    ],
    replies: [
      createReply("r24", "pro-argument", "Not everyone is interested in traditional sports. We need more options.", 21, 21.5, [], undefined, undefined, undefined, mockUsers[1]),
      createReply("r25", "proposal", "Survey all students to identify what programs they would actually attend.", 17, 21, [], undefined, undefined, undefined, mockUsers[2]),
    ],
  },
  {
    id: "9",
    type: "problem",
    title: "Inadequate School Security Measures",
    description: "Current security protocols are outdated. We need better systems to ensure student safety without creating an oppressive atmosphere.",
    votes: 65,
    timestamp: daysAgo(18),
    phase: "school",
    group: "Whole School",
    isWinner: true,
    winnerRank: 3,
    authorId: "u13",
    authorName: "Laura Wolf",
    authorClass: "7a",
    replies: [
      createReply("r26", "pro-argument", "Safety should be a top priority, but we need balanced solutions.", 19, 17.5, [], undefined, undefined, undefined, mockUsers[3]),
      createReply("r27", "objection", "Too much security can make school feel like a prison.", 14, 17, [], undefined, {
        text: "Implement a visitor management system and emergency communication app without adding oppressive measures.",
        solutionLevel: "school"
      }, undefined, mockUsers[4]),
    ],
  },
  {
    id: "9a",
    type: "proposal",
    title: "School-Wide Mental Health Days",
    description: "Implement designated mental health days each semester where students can take a break without academic penalty.",
    votes: 58,
    timestamp: daysAgo(15),
    phase: "school",
    group: "Whole School",
    solutionLevel: "ministries",
    authorId: "u14",
    authorName: "Maximilian Schröder",
    authorClass: "7a",
    replies: [
      createReply("r27a", "pro-argument", "Mental health is just as important as physical health. We have sick days, why not mental health days?", 22, 14.5, [], undefined, undefined, undefined, mockUsers[5]),
      createReply("r27b", "objection", "This could be abused by students who just want to skip school.", 11, 14, [], undefined, undefined, undefined, mockUsers[6]),
    ],
  },
  {
    id: "9b",
    type: "problem",
    title: "Wifi Connectivity Issues",
    description: "School wifi is unreliable and slow, making it difficult to complete online assignments and research during school hours.",
    votes: 52,
    timestamp: daysAgo(12),
    phase: "school",
    group: "Whole School",
    authorId: "u15",
    authorName: "Julia Neumann",
    authorClass: "7a",
    replies: [
      createReply("r27c", "pro-argument", "I can never load videos for class presentations because the wifi is too slow.", 15, 11.5, [], undefined, undefined, undefined, mockUsers[7]),
      createReply("r27d", "proposal", "Upgrade network infrastructure and add more access points throughout the building.", 18, 11, [], undefined, undefined, undefined, mockUsers[8]),
    ],
  },
  {
    id: "9c",
    type: "proposal",
    title: "Student Government Transparency",
    description: "Make student government meetings open to all students and publish meeting minutes online for transparency.",
    votes: 45,
    timestamp: daysAgo(10),
    phase: "school",
    group: "Whole School",
    solutionLevel: "school",
    authorId: "u16",
    authorName: "Paul Schwarz",
    authorClass: "7a",
    replies: [
      createReply("r27e", "pro-argument", "We should know what our representatives are discussing and deciding.", 12, 9.5, [], undefined, undefined, undefined, mockUsers[9]),
      createReply("r27f", "proposal", "Create a dedicated website section for student government with live meeting streams.", 9, 9, [], undefined, undefined, undefined, mockUsers[10]),
    ],
  },
  {
    id: "9d",
    type: "problem",
    title: "Lack of Healthy Food Options",
    description: "The cafeteria primarily serves processed food. Students need access to fresh, nutritious meals for better health and concentration.",
    votes: 42,
    timestamp: daysAgo(8),
    phase: "school",
    group: "Whole School",
    authorId: "u17",
    authorName: "Sarah Zimmermann",
    authorClass: "7b",
    replies: [
      createReply("r27g", "pro-argument", "Good nutrition directly impacts our ability to learn and focus.", 14, 7.5, [], undefined, undefined, undefined, mockUsers[11]),
      createReply("r27h", "proposal", "Partner with local farms for fresh produce and create a salad bar option.", 11, 7, [], undefined, undefined, undefined, mockUsers[12]),
    ],
  },
  {
    id: "9e",
    type: "proposal",
    title: "Inter-School Academic Competitions",
    description: "Organize regular academic competitions between schools to motivate students and foster healthy competition.",
    votes: 38,
    timestamp: daysAgo(6),
    phase: "school",
    group: "Whole School",
    solutionLevel: "ministries",
    authorId: "u18",
    authorName: "Tim Braun",
    authorClass: "7b",
    replies: [
      createReply("r27i", "pro-argument", "Competition can be a great motivator for academic excellence.", 10, 5.5, [], undefined, undefined, undefined, mockUsers[13]),
      createReply("r27j", "objection", "This might increase pressure on students who already feel stressed.", 7, 5, [], undefined, undefined, undefined, mockUsers[14]),
    ],
  },
  {
    id: "9f",
    type: "problem",
    title: "Insufficient Parking for Staff and Students",
    description: "The school parking lot is always full, causing teachers and driving-age students to park far away or arrive very early.",
    votes: 35,
    timestamp: daysAgo(4),
    phase: "school",
    group: "Whole School",
    authorId: "u19",
    authorName: "Lisa Krüger",
    authorClass: "7b",
    replies: [
      createReply("r27k", "pro-argument", "Teachers sometimes arrive 30 minutes early just to find parking.", 8, 3.5, [], undefined, undefined, undefined, mockUsers[15]),
      createReply("r27l", "proposal", "Create a carpool incentive program and designated carpool parking spaces.", 10, 3, [], undefined, undefined, undefined, mockUsers[16]),
    ],
  },
  {
    id: "9g",
    type: "proposal",
    title: "School Podcast and Media Center",
    description: "Create a student-run media center with equipment for podcasts, videos, and journalism to develop communication skills.",
    votes: 31,
    timestamp: daysAgo(2),
    phase: "school",
    group: "Whole School",
    solutionLevel: "school",
    authorId: "u20",
    authorName: "David Hartmann",
    authorClass: "7b",
    replies: [
      createReply("r27m", "pro-argument", "Media skills are essential in today's world. This would be great career preparation.", 9, 1.5, [], undefined, undefined, undefined, mockUsers[17]),
      createReply("r27n", "proposal", "Start with basic equipment and expand as interest grows. Partner with local media for mentorship.", 7, 1, [], undefined, undefined, undefined, mockUsers[18]),
    ],
  },

  // ============================================
  // COUNTER-PROPOSALS (referencing problems)
  // ============================================
  {
    id: "10",
    type: "counter-proposal",
    title: "Flexible Lunch Timing System",
    description: "Instead of just improving food quality, implement a flexible lunch schedule with multiple serving windows to reduce crowding and ensure food stays hot.",
    votes: 18,
    timestamp: daysAgo(80),
    phase: "class",
    group: "Class 10A",
    referencedProblemId: "1",
    referencedObjectionId: "r1",
    referencedOriginalPostId: "1",
    solutionLevel: "school",
    authorId: "u21",
    authorName: "Marie Lange",
    authorClass: "7c",
    replies: [
      createReply("r28", "pro-argument", "This addresses both the food quality and timing issues!", 7, 79.5, [], undefined, undefined, undefined, mockUsers[19]),
      createReply("r29", "objection", "Multiple lunch periods might complicate teacher schedules.", 4, 79, [], undefined, undefined, undefined, mockUsers[20]),
    ],
  },
  {
    id: "11",
    type: "counter-proposal",
    title: "Hybrid PE Classes with Equipment Rotation",
    description: "Address equipment shortage by splitting PE into stations that rotate, so smaller groups use equipment while others do equipment-free exercises.",
    votes: 15,
    timestamp: daysAgo(73),
    phase: "class",
    group: "Class 10A",
    referencedProblemId: "3",
    referencedObjectionId: "r11",
    referencedOriginalPostId: "3",
    aspects: ["problem", "proposal"],
    authorId: "u22",
    authorName: "Leon Werner",
    authorClass: "7c",
    replies: [
      createReply("r30", "pro-argument", "Stations would keep everyone active instead of just waiting.", 6, 72.5, [], undefined, undefined, undefined, mockUsers[21]),
      createReply("r31", "proposal", "We could have fitness stations, skill stations, and game stations rotating every 15 minutes.", 8, 72, [], undefined, undefined, undefined, mockUsers[0]),
    ],
  },
];
