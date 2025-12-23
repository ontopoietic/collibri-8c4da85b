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
    aspects: ["problem", "proposal"],
    title: "Weekly Class Meetings for Student Voice",
    description: "Students currently lack a regular forum to voice concerns and participate in class decisions. We propose holding **regular 15-minute class meetings** where students can discuss concerns and vote on class-level decisions together.",
    problemText: "Our school has **no structured way** for students to regularly communicate their concerns, ideas, and feedback to teachers and administration.\n\nThis has led to:\n- A growing sense of *disconnection* between students and decision-making processes\n- Students feeling unheard when changes are made to schedules, rules, or policies\n- Small issues escalating into bigger problems before anyone becomes aware\n\nStudents have expressed frustration that their perspectives are not valued, which negatively impacts school morale and engagement.",
    proposalText: "We propose implementing **weekly 15-minute class meetings** at the start of each Monday during homeroom.\n\nThe meeting structure would be:\n1. **5 minutes** → Announcements\n2. **5 minutes** → Student concerns and suggestions\n3. **5 minutes** → Quick votes on class-level decisions\n\nKey features:\n- A *rotating student facilitator* would lead each meeting\n- Teacher present to guide and support\n- All decisions documented in a shared digital notebook\n\nThis system creates a predictable and democratic space for student voice while teaching valuable skills in civic participation.",
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
        text: "We propose implementing **weekly 15-minute class meetings** during Monday homeroom to address the lack of structured student voice.\n\nThe meeting format would include:\n- A *rotating student facilitator* to lead discussions\n- 5-minute open floor for raising new concerns\n- 5 minutes for discussing ongoing issues\n- 5 minutes for quick votes on class matters\n\nAll decisions documented in a shared digital notebook accessible to students and teachers.",
        votes: 8,
      },
      {
        id: "v-c10a-1-2",
        title: "Structured Class Meetings with Rotating Facilitators and Digital Submission",
        text: "Students currently lack any structured way to voice concerns, leading to *disconnection* from school governance.\n\nWe propose **weekly 20-minute class meetings** with key innovations:\n1. Rotating student facilitator chosen by **lottery** each week\n2. Digital suggestion box for *anonymous* submissions\n3. Voting app to prioritize discussion topics\n\nThe facilitator compiles submissions, leads discussion, and documents outcomes. Teachers attend as advisors but *students drive the agenda*.\n\nThis ensures quieter students can participate through anonymous submissions while building leadership skills.",
        votes: 14,
      },
    ],
    replies: [
      createReply("r-c10a-1-1", "pro-argument", "This would make everyone feel **more involved** in class decisions.\n\nWhen students have a voice in rules and procedures:\n- They're more likely to *follow* those rules\n- They understand the reasoning behind decisions\n- They feel *ownership* over outcomes\n\nResearch shows that schools with strong student participation programs have better attendance, fewer disciplinary issues, and higher academic achievement.", 6, 89, [], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-c10a-1-2", "objection", "While I appreciate the intention behind this proposal, I'm concerned about **practical implementation**.\n\nTaking 15 minutes from lessons weekly:\n- Adds up to nearly **10 hours** of lost instruction time per year\n- Our curriculum is already packed\n- Not all students feel comfortable speaking up in groups\n\nThis could lead to the same few voices dominating while quieter students remain unheard.", 4, 88, [], undefined, {
        text: "Instead of weekly class meetings, we should implement a **digital suggestion system**:\n\n1. Students submit concerns *anonymously* at any time\n2. Teachers review submissions weekly\n3. Address pressing issues during natural breaks\n\nThis preserves instruction time while still giving students a voice → anonymity encourages participation from students who might not speak up publicly.",
        solutionLevel: "school"
      }, undefined, mockUsers[1]),
      createReply("r-c10a-1-3", "proposal", "We could do it during **homeroom** instead of cutting into lesson time.", 5, 87, [], undefined, undefined, undefined, mockUsers[2]),
      createReply("r-c10a-1-4", "variant", "Instead of weekly meetings, try **bi-weekly** with a longer *30-minute* format for deeper discussions.", 4, 86, [], undefined, undefined, undefined, mockUsers[3]),
    ],
  },
  {
    id: "c10a-2",
    type: "problem",
    aspects: ["problem", "proposal"],
    title: "Classroom Temperature Control Issues",
    description: "Our classroom is **too hot** in summer and **too cold** in winter. The heating and AC systems don't work properly.",
    problemText: "The climate control systems have been malfunctioning for **over two years**, creating an uncomfortable learning environment.\n\nDuring summer months:\n- Classroom temperatures regularly exceed **30°C**\n- Students become drowsy, dehydrated, and unable to concentrate\n\nDuring winter:\n- Heating often fails entirely or *overcompensates*\n- Some rooms freezing while others become stifling\n\nStudents have reported headaches, difficulty focusing, and increased absenteeism during extreme temperature periods.",
    proposalText: "We propose a **comprehensive four-phase approach**:\n\n1. **Immediate** → Request professional HVAC audit\n2. **Within 1 month** → Install digital thermometers connected to central monitoring\n3. **Within 2 months** → Deploy temperature complaint reporting app\n4. **Budget dependent** → Systematic repair of failing equipment\n\nShort-term emergency protocol:\n- Portable fans and space heaters\n- Option to relocate classes during extreme conditions\n\nStudent safety should not wait for bureaucratic approval processes.",
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
        title: "Temperature Control Issues - Emergency Protocol Focus",
        text: "Climate control has been a problem for **over two years**.\n\nWe propose an **emergency protocol** as the first step:\n- Immediate procurement of portable fans and space heaters\n- Teacher authority to relocate classes during extreme temperatures\n- Relaxed dress code during heat waves\n- Simple paper-based temperature log in each classroom\n\nThese measures can be implemented *within days* while longer-term HVAC repairs are planned.\n\n**Student safety should not wait for bureaucratic approval processes.**",
        votes: 6,
      },
      {
        id: "v-c10a-2-2",
        title: "Comprehensive Climate Control with Digital Monitoring",
        text: "Our climate control problems have persisted for **over two years**, with temperatures ranging from *freezing* in winter to over **30°C** in summer.\n\nWe propose a **comprehensive four-phase approach**:\n1. **Phase 1** (immediate) → Request professional HVAC audit\n2. **Phase 2** (within 1 month) → Install digital thermometers with central monitoring\n3. **Phase 3** (within 2 months) → Deploy mobile app for temperature complaints\n4. **Phase 4** (budget dependent) → Systematic equipment repair prioritized by severity data",
        votes: 12,
      },
    ],
    replies: [
      createReply("r-c10a-2-1", "pro-argument", "It's **hard to concentrate** when you're freezing or sweating.\n\nLast week during the math exam:\n- Half the class was fanning themselves with papers\n- Several students had to leave for water *multiple times*\n- The noise and heat made focus impossible\n\nThis directly impacts our academic performance. It's not fair that grades might suffer because of building maintenance issues.", 7, 87, [], undefined, undefined, undefined, mockUsers[2]),
      createReply("r-c10a-2-2", "objection", "While the temperature issues are real, the proposed solution is **too expensive and complex** to implement quickly.\n\nConcerns:\n- Full HVAC audit, monitoring system, and app → *tens of thousands of euros*\n- Would take *months* to complete\n\nWe need solutions that can help us **now**, not next year.", 5, 86, [], undefined, {
        text: "As an **immediate and cost-effective solution**, I propose:\n\n1. Request portable AC units for hottest classrooms during summer\n2. Ensure all radiators are properly bled before winter\n3. Allow teachers flexibility to move classes as needed\n4. Relax dress code during extreme temperatures\n\n→ These measures can be implemented within *weeks* rather than months.",
        solutionLevel: "school"
      }, undefined, mockUsers[3]),
      createReply("r-c10a-2-3", "variant", "Add **portable fans and space heaters** as a temporary solution until HVAC is fixed.", 3, 84, [], undefined, undefined, undefined, mockUsers[4]),
    ],
  },
  {
    id: "c10a-3",
    type: "proposal",
    title: "Class Library Corner",
    description: "Create a small **library corner** in our classroom with books students can borrow and exchange freely.",
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
        title: "Class Library Corner with Honor System",
        text: "Our classroom currently has **no accessible reading materials** for free time, lunch breaks, or when assignments finish early.\n\nWe propose creating a dedicated library corner with:\n- A comfortable reading chair\n- A small bookshelf with **50+ books** covering various genres\n- An *honor-system* checkout log\n\nStudents would:\n1. Donate books from home to build the collection\n2. Volunteer as monthly 'librarian' to organize books\n3. Borrow books for up to *two weeks*\n\nThis creates a culture of reading and sharing while teaching responsibility.",
        votes: 7,
      },
      {
        id: "v-c10a-3-2",
        title: "Digital-Integrated Community Book Exchange",
        text: "Students often have free moments during school but **no accessible reading materials** — the main library requires passes and has limited hours.\n\nWe propose a classroom library with *modern tracking*:\n- Students donate books during a class book drive\n- Each book receives a **QR code** linked to a Google Sheets catalog\n- Monthly 'book talks' for student recommendations\n\nThe system includes:\n- Genre labels and difficulty ratings\n- Student reviews\n- A rotating **Book Committee** of three students\n\nThis combines the warmth of a classroom library with digital organization skills.",
        votes: 10,
      },
    ],
    replies: [
      createReply("r-c10a-3-1", "pro-argument", "This would encourage **more reading** during free time → students could explore new genres and share favorites with classmates.", 5, 84, [], undefined, undefined, undefined, mockUsers[4]),
      createReply("r-c10a-3-2", "proposal", "We could do a **book drive** where everyone brings books from home to build the initial collection.", 6, 83, [], undefined, undefined, undefined, mockUsers[5]),
      createReply("r-c10a-3-3", "variant", "Create a *rotating book cart* that moves between classrooms each week for variety.", 4, 81, [], undefined, undefined, undefined, mockUsers[6]),
      createReply("r-c10a-3-4", "variant", "Combine physical books with a **digital e-reader station** for more variety.", 3, 79, [], undefined, undefined, undefined, mockUsers[7]),
    ],
  },
  {
    id: "c10a-4",
    type: "problem",
    aspects: ["problem", "proposal"],
    title: "Group Project Assignment Fairness",
    description: "Group projects often result in **unequal workload distribution**, with some students doing most of the work. We propose implementing *peer evaluation forms*.",
    problemText: "Group projects often result in **unequal workload** distribution:\n- Some students do *most* of the work\n- Others contribute little but receive the same grade\n- This creates frustration and resentment",
    proposalText: "Implement **peer evaluation forms** where group members rate each other's contributions → individual grades adjusted accordingly.",
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
      createReply("r-c10a-4-3", "variant", "Use peer evaluation forms where group members rate each other's contributions.", 5, 78, [], undefined, undefined, undefined, mockUsers[8]),
    ],
  },
  {
    id: "c10a-5",
    type: "problem",
    title: "Lack of Storage Space for Personal Items",
    description: "We don't have enough locker space or shelves for our bags and sports equipment during the day → this creates **chaos** and *frustration*.",
    votes: 9,
    timestamp: daysAgo(78),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "class",
    authorId: "u5",
    authorName: "Mia Wagner",
    authorClass: "6b",
    replies: [
      createReply("r-c10a-5-1", "pro-argument", "Our bags are **piled up** creating several problems:\n- Items get *lost* in the chaos\n- Personal belongings get **damaged**\n- Finding your bag wastes time between classes\n\nLast week, two students had items stolen from the unorganized pile.", 3, 77, [], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-c10a-5-2", "proposal", "Install additional **hooks and shelves** along the classroom walls:\n1. Wall-mounted hooks near the door\n2. Low shelves under windows for bags\n3. Designated sports equipment corner\n\n→ This costs *under €100* and solves the problem permanently.", 4, 76, [], undefined, undefined, undefined, mockUsers[9]),
    ],
  },
  {
    id: "c10a-6",
    type: "problem",
    title: "Insufficient Time Between Classes",
    description: "Only **5 minutes** between classes isn't enough to get to lockers, use bathroom, and reach the next classroom across campus.",
    votes: 8,
    timestamp: daysAgo(75),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "school",
    authorId: "u6",
    authorName: "Elias Becker",
    authorClass: "6b",
    replies: [
      createReply("r-c10a-6-1", "pro-argument", "I'm **always late** to my next class because:\n- My locker is on the *opposite side* of campus\n- Bathroom lines are **10+ students** long\n- Teachers start exactly on time with no grace period\n\nI've been marked tardy **8 times** this semester through no fault of my own.", 3, 74, [], undefined, undefined, undefined, mockUsers[10]),
      createReply("r-c10a-6-2", "proposal", "We propose a **two-part solution**:\n\n1. Extend breaks to *7-8 minutes* (just 2-3 more minutes makes a huge difference)\n2. Create a staggered passing schedule:\n   - Even-numbered rooms dismiss 1 minute early\n   - Reduces hallway congestion\n\n→ This small change would eliminate most tardiness issues.", 5, 73, [], undefined, undefined, undefined, mockUsers[11]),
    ],
  },
  {
    id: "c10a-7",
    type: "proposal",
    title: "Student Tutoring Exchange Program",
    description: "Create a **peer tutoring system** where students who excel in a subject can help classmates who struggle → earning *community service hours* in return.",
    votes: 7,
    timestamp: daysAgo(72),
    phase: "class",
    group: "Class 10A",
    solutionLevel: "school",
    authorId: "u7",
    authorName: "Hannah Hoffmann",
    authorClass: "6b",
    replies: [
      createReply("r-c10a-7-1", "pro-argument", "Learning from peers has **proven benefits**:\n- *Less intimidating* than asking teachers\n- Tutors explain things in student-friendly language\n- Both tutor and tutee benefit academically\n\nStudies show peer tutoring improves grades for *both* participants by an average of **15%**.", 4, 71, [], undefined, undefined, undefined, mockUsers[12]),
      createReply("r-c10a-7-2", "proposal", "For **effective matching**, we should:\n1. Survey students on their *strengths and needs*\n2. Match by learning style and schedule compatibility\n3. Provide tutor training on **how to explain concepts**\n4. Track progress with simple feedback forms\n\n→ This creates a sustainable system that helps everyone.", 3, 70, [], undefined, undefined, undefined, mockUsers[13]),
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
    description: "Our current **row-by-row seating** makes group work difficult and some students *can't see the board well* from back corners.",
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
        title: "Seating Arrangement - Flexible Zones Approach",
        text: "Our current row-by-row seating arrangement creates several problems: students in back corners cannot see the board clearly (especially during math when small numbers are written), group work requires awkward desk rearrangement that wastes class time, and students feel trapped in the same spot all year. We propose implementing a flexible zoning system with three areas: a traditional desk area near the board for direct instruction, a collaborative cluster area with grouped desks for project work, and a quiet corner with individual desks for focused independent study. Students would rotate through zones based on the day's activities. This requires no additional furniture, just reorganization, and teaches students to adapt to different work environments.",
        votes: 5,
      },
      {
        id: "v-c10b-1-2",
        title: "U-Shape Seating with Weekly Rotation and Standing Options",
        text: "Students in our class struggle with visibility and collaboration due to traditional row seating. Some students in back corners literally cannot read the board during math and science, while group work requires disruptive desk-moving that wastes 5-10 minutes per class. We propose a comprehensive seating redesign: arrange desks in a U-shape so all students face the board and can see each other for discussions, implement weekly seat rotation so no student is permanently disadvantaged, and add 2-3 standing desk stations for students who focus better when standing. The rotation lottery would be managed by students themselves, teaching fairness and organization. This creates an equitable, engaging classroom environment that supports multiple learning styles.",
        votes: 11,
      },
    ],
    replies: [
      createReply("r-c10b-1-1", "pro-argument", "I sit in the **back corner** and literally *can't read the board* during math.\n\nThe problems I face daily:\n- Numbers look blurry from my seat\n- I have to constantly ask neighbors what's written\n- My grades in math have **dropped 10%** this semester\n\nMoving closer isn't an option because seats are assigned.", 5, 90, [], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-c10b-1-2", "proposal", "Try **U-shaped seating** so everyone can see each other and the board:\n\n1. All students face toward center\n2. No one more than *3 rows* from board\n3. Eye contact with classmates improves discussion\n\n→ Many classrooms already use this successfully.", 7, 89, [], undefined, undefined, undefined, mockUsers[1]),
      createReply("r-c10b-1-3", "proposal", "Rotate seating **weekly** so no one is stuck in bad spots permanently.\n\n- *Fair distribution* of prime spots\n- Students meet different classmates\n- Lottery system keeps it unbiased", 4, 88, [], undefined, undefined, undefined, mockUsers[3]),
      createReply("r-c10b-1-4", "variant", "Combine U-shape with **standing desks** option:\n- 2-3 standing stations for students who prefer it\n- Improves focus for some learners\n- Easy to implement with *adjustable desk risers*", 3, 85, [], undefined, undefined, undefined, mockUsers[2]),
    ],
  },
  {
    id: "c10b-2",
    type: "problem",
    title: "Class Noise During Independent Work",
    description: "When we have independent work time, some students chat **loudly** → making it *impossible* for others to concentrate.",
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
        title: "Class Noise - Traffic Light System",
        text: "During independent work time, some students chat loudly while others need silence to concentrate. This creates tension and affects learning outcomes for students who require quiet focus. We propose implementing a simple 'traffic light' noise system: when the teacher displays a red card, complete silence is required; yellow allows whispered collaboration with immediate neighbors; green indicates open discussion time. This visual system is easy to understand, requires no technology, and gives teachers flexibility to adjust noise levels based on the task. Students would participate in creating the rules and consequences, increasing buy-in. The system respects both social learners and those who need quiet.",
        votes: 4,
      },
      {
        id: "v-c10b-2-2",
        title: "Structured Work Time with Designated Zones and Equipment",
        text: "Our classroom experiences a recurring conflict: during independent work time, social students chat while focused students cannot concentrate, leading to frustration on both sides. We propose creating designated zones within the classroom: a 'silence zone' in one area with noise-canceling headphones available for checkout, and a 'collaboration zone' where quiet discussion is permitted. Work periods would also include structured time blocks - the first 15 minutes always silent, followed by 10 minutes of optional collaborative time. A student-managed noise monitor would track disruptions using a simple tally system. This approach respects different learning styles while maintaining productivity for everyone.",
        votes: 9,
      },
    ],
    replies: [
      createReply("r-c10b-2-1", "pro-argument", "I *need quiet* to focus and the constant talking is **really distracting**.\n\nWhat happens during 'independent work':\n- Can't hear myself think\n- Make **more mistakes** on assignments\n- Finish work slower than I should\n\nStudents who need quiet shouldn't be forced to suffer.", 6, 86, [], undefined, undefined, undefined, mockUsers[4]),
      createReply("r-c10b-2-2", "proposal", "Create **designated quiet zones** in the classroom:\n1. One corner marked as *silent area*\n2. Rest of room allows whispered discussion\n3. Simple visual boundary (tape on floor)\n\n→ Respects **both** learning styles without conflict.", 5, 85, [], undefined, undefined, undefined, mockUsers[5]),
      createReply("r-c10b-2-3", "variant", "Provide **noise-canceling headphones** for checkout:\n- Library has them → we should too\n- Students who need focus can *block out* distractions\n- Low cost solution (€50-100 for 5 pairs)", 4, 82, [], undefined, undefined, undefined, mockUsers[6]),
    ],
  },
  {
    id: "c10b-3",
    type: "proposal",
    title: "Digital Homework Calendar",
    description: "Create a **shared digital calendar** where all teachers post homework deadlines → so we can *plan better* and avoid pile-ups.",
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
        title: "Digital Homework Calendar - Simple Shared Solution",
        text: "Students frequently experience assignment pile-ups where 4-5 deadlines fall on the same day, causing unnecessary stress and lower quality work. Currently, each teacher announces homework independently with no coordination. We propose creating a simple shared Google Calendar visible to all students and teachers in our class. Teachers would spend 30 seconds entering each assignment with subject name, brief description, and due date. Students could subscribe to receive notifications and see the week's workload at a glance. A student volunteer would maintain the calendar and send weekly summary emails. This low-tech solution requires minimal effort from teachers while dramatically improving student organization and stress levels.",
        votes: 5,
      },
      {
        id: "v-c10b-3-2",
        title: "Integrated Assignment Management System with Workload Balancing",
        text: "Students struggle to manage homework deadlines across 8 different subjects, often resulting in multiple major assignments due simultaneously. This leads to all-night study sessions, lower quality work, and increased stress. We propose implementing a school-wide digital assignment calendar integrated with our existing school portal. The system would be mandatory for all teachers and include: automatic notifications to students 3 days and 1 day before deadlines, a color-coded workload view showing assignment density, and - most importantly - a 'load balancing' feature that alerts teachers when they're scheduling deadlines on already-heavy days. Students could export calendars to their phones. This promotes coordination between teachers and gives students visibility to plan their time effectively.",
        votes: 8,
      },
    ],
    replies: [
      createReply("r-c10b-3-1", "pro-argument", "This would help us avoid **4 assignments due the same day**.\n\nLast week I had:\n- Math test\n- History essay\n- Science project\n- English presentation\n\nAll on *Thursday*. I literally didn't sleep.", 4, 82, [], undefined, undefined, undefined, mockUsers[6]),
      createReply("r-c10b-3-2", "objection", "Not all teachers will use it *consistently*.\n\nConcerns:\n- Some teachers are **not tech-savvy**\n- Extra workload for already busy staff\n- What if they forget to update it?\n\nThe system only works if *everyone* participates.", 3, 81, [], undefined, undefined, undefined, mockUsers[7]),
    ],
  },
  {
    id: "c10b-4",
    type: "problem",
    aspects: ["problem", "proposal"],
    title: "Late Bus Arrivals",
    description: "School buses frequently arrive late, causing students to miss the start of first period. We propose implementing GPS tracking and earlier departure times.",
    problemText: "School buses frequently arrive **10-15 minutes late**, causing students to miss the start of first period and get marked *tardy* → affecting our attendance records unfairly.",
    proposalText: "Implement **GPS tracking** for buses so students can monitor arrival times, and schedule *earlier departure times* to account for traffic.",
    votes: 10,
    timestamp: daysAgo(79),
    phase: "class",
    group: "Class 10B",
    solutionLevel: "school",
    authorId: "u11",
    authorName: "Anna Richter",
    authorClass: "6c",
    replies: [
      createReply("r-c10b-4-1", "pro-argument", "I've been marked **tardy 5 times** this month because of the bus → this affects my attendance record *unfairly*.\n\nThe real problems:\n- Bus arrives 10-15 minutes late *regularly*\n- No way to notify the school we're on route\n- Tardies count against us for privileges\n\nStudents shouldn't be punished for transportation issues outside their control.", 5, 78, [], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-c10b-4-2", "proposal", "We need a **two-part solution**:\n\n1. Request *earlier departure times* (just 10 minutes earlier)\n2. Add **bus tracker app** so school knows when we're delayed\n\nAlternatively:\n- Additional routes to reduce load\n- Grace period for bus riders on late days", 4, 77, [], undefined, undefined, undefined, mockUsers[9]),
    ],
  },
  {
    id: "c10b-5",
    type: "proposal",
    title: "Classroom Plant Initiative",
    description: "Add **plants** to our classroom to improve *air quality* and create a more pleasant learning environment.",
    votes: 8,
    timestamp: daysAgo(74),
    phase: "class",
    group: "Class 10B",
    solutionLevel: "class",
    authorId: "u12",
    authorName: "Ben Klein",
    authorClass: "6c",
    replies: [
      createReply("r-c10b-5-1", "pro-argument", "Studies show plants have **proven benefits**:\n- *Improve focus* by up to 15%\n- Reduce stress and anxiety\n- Filter air pollutants\n- Make spaces feel more *welcoming*\n\nNASA research shows certain plants can remove **87% of air toxins** in 24 hours.", 4, 73, [], undefined, undefined, undefined, mockUsers[10]),
      createReply("r-c10b-5-2", "objection", "Who will take care of them during **holidays**?\n\nConcerns:\n- Plants need *water* every few days\n- Summer break is 6+ weeks\n- Could die and waste money\n\nWe need a care schedule before committing to this.", 2, 72, [], undefined, undefined, undefined, mockUsers[11]),
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
    description: "Many science lab instruments are **broken or missing parts** → making experiments *difficult to complete* properly.",
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
        title: "Broken Lab Equipment - Emergency Repair Priority",
        text: "Our science labs have deteriorated to the point where meaningful experiments are nearly impossible. During last week's biology class, only 2 of 6 microscopes were functional, forcing groups of 8 students to share a single working unit - each student got less than 2 minutes of actual viewing time during the entire 45-minute lab. The chemistry equipment is equally problematic: several Bunsen burners have gas leaks that teachers have flagged as potential safety hazards, half the beakers have chips that could cause cuts, and we're missing basic items like test tube holders and graduated cylinders. This equipment shortage directly undermines the hands-on learning that science education requires. We propose creating a prioritized repair/replacement list starting with safety hazards, then essential instructional equipment.",
        votes: 6,
      },
      {
        id: "v-c10c-1-2",
        title: "Lab Equipment Restoration Program with Multiple Funding Sources",
        text: "The state of our science lab equipment has reached a crisis point that's compromising both education quality and student safety. Students must share one working microscope among 6-8 people, gas equipment has documented leaks, and essential tools are broken or missing. We propose a comprehensive Lab Equipment Restoration Program: Phase 1 - immediate safety audit and retirement of hazardous equipment; Phase 2 - submit prioritized funding request to administration (estimated €3,000 for essential items); Phase 3 - simultaneously apply for STEM education grants (our science teacher has identified 3 opportunities); Phase 4 - organize a community fundraiser and reach out to local businesses for equipment donations. Many companies upgrade lab equipment annually and donate their older-but-functional units. This multi-pronged approach maximizes our chances of restoring functional labs within this school year.",
        votes: 13,
      },
    ],
    replies: [
      createReply("r-c10c-1-1", "pro-argument", "We had to share **one microscope** between *6 students* last week.\n\nCurrent broken equipment:\n- 4 of 6 microscopes **non-functional**\n- Bunsen burners with *gas leaks*\n- Chipped beakers (safety hazard)\n- Missing test tube holders\n\nEach student got less than **2 minutes** of actual viewing time.", 6, 91, [], undefined, undefined, undefined, mockUsers[12]),
      createReply("r-c10c-1-2", "proposal", "Request **emergency funding** for essential lab equipment:\n\n1. *Immediate* → Replace safety hazards (burners, beakers)\n2. *This semester* → New microscopes (estimated €1,500)\n3. *Ongoing* → Equipment maintenance budget\n\nScience education requires **hands-on learning** - we can't do that without working equipment.", 8, 90, [], undefined, undefined, undefined, mockUsers[13]),
      createReply("r-c10c-1-3", "question", "Can we **fundraise** to supplement the school budget?\n\n- Bake sales and car washes\n- Local business sponsorships\n- *Parent donations*\n\nMany companies donate equipment when approached properly.", 3, 89, [], undefined, undefined, undefined, mockUsers[14]),
    ],
  },
  {
    id: "c10c-2",
    type: "proposal",
    title: "Flexible Deadline Policy",
    description: "Allow students to request **24-48 hour extensions** on assignments *without penalty*, with teacher approval.",
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
        title: "Flexible Deadline Policy - Limited Extensions",
        text: "Current school policy treats all late submissions the same way - immediate grade penalties - regardless of circumstances. This ignores the reality that students face unexpected challenges: family emergencies, illness, technology failures, or simply overwhelming workload when multiple deadlines coincide. We propose allowing each student 2 'extension tokens' per semester that can be used for any assignment without questions or penalties. Using a token grants an automatic 24-hour extension. Students would request extensions through a simple online form that automatically notifies the teacher. Unused tokens don't carry over, preventing hoarding. This system provides necessary flexibility while maintaining structure and accountability - students must budget their extensions wisely across the semester.",
        votes: 5,
      },
      {
        id: "v-c10c-2-2",
        title: "Structured Extension System with Teacher Flexibility",
        text: "Students sometimes face legitimate obstacles to meeting deadlines - illness, family emergencies, technology failures, or multiple tests on the same day - but our current system applies identical penalties regardless of circumstances. This causes unnecessary stress and doesn't reflect real-world professional environments where deadline negotiation is normal. We propose a structured extension policy: students may request up to 2 extensions per semester per class through a simple form citing the reason (no documentation required for the first request). Teachers have discretion to approve 24-48 hour extensions. For documented emergencies (verified illness, family crisis), unlimited extensions apply. Requests must be submitted at least 6 hours before the deadline to prevent last-minute abuse. This balances flexibility with accountability while teaching students to communicate proactively about obstacles.",
        votes: 10,
      },
    ],
    replies: [
      createReply("r-c10c-2-1", "pro-argument", "**Life happens** - sometimes we need extra time:\n\n- Family emergencies\n- *Illness* (mental and physical)\n- Technology failures\n- Multiple deadlines colliding\n\nReal-world workplaces negotiate deadlines all the time. This teaches valuable communication skills.", 5, 87, [], undefined, undefined, undefined, mockUsers[15]),
      createReply("r-c10c-2-2", "objection", "This could be **abused by procrastinators**.\n\nConcerns:\n- Students might *always* request extensions\n- Unfair to those who submit on time\n- Creates extra work for teachers\n\nWe need limits - maybe **2 tokens per semester** that can't be abused.", 4, 86, [], undefined, undefined, undefined, mockUsers[16]),
    ],
  },
  {
    id: "c10c-3",
    type: "problem",
    title: "Cafeteria Wait Times",
    description: "The lunch line is **so long** that we only have *10 minutes* to actually eat before the next class.",
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
        title: "Cafeteria Wait Times - Staggered Scheduling",
        text: "Our 30-minute lunch period is effectively reduced to 10-12 minutes of actual eating time due to extreme cafeteria lines. Students at the end of the line regularly have to choose between eating quickly and unhealthily or skipping lunch entirely to make their next class on time. The bottleneck occurs because all 400+ students in our lunch block try to get food simultaneously. We propose staggering lunch times by grade or building wing: Group A enters at 12:00, Group B at 12:10, Group C at 12:20. Each group would still have 30 minutes, but the serving line would handle smaller waves of students. This requires no additional staff or equipment - just schedule coordination. The result would be reasonable wait times and enough time for students to actually eat a proper meal.",
        votes: 4,
      },
      {
        id: "v-c10c-3-2",
        title: "Cafeteria Efficiency - Multi-Pronged Improvement Plan",
        text: "The cafeteria bottleneck has reached a point where many students skip lunch rather than wait. With 400+ students in a single lunch period, average wait times exceed 15 minutes, leaving only 10 minutes to eat before the next class. This affects nutrition, energy levels, and afternoon academic performance. We propose a comprehensive efficiency plan: First, implement staggered lunch entry by grade (5-minute intervals) to smooth the flow. Second, add a second serving line or grab-and-go station with pre-packaged healthy options like sandwiches, salads, and fruit that bypass the main line. Third, extend lunch period by 5 minutes by shortening the preceding passing period (students can eat slightly later but with adequate time). Fourth, install a digital menu display so students can decide what they want before reaching the front. These combined measures could reduce average wait time to under 5 minutes.",
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
        title: "Cafeteria Food Quality - Basic Improvements",
        text: "The cafeteria food quality has been a consistent complaint across all Grade 10 classes, with students reporting cold meals, limited variety, and few healthy options. Many students have started bringing lunch from home or skipping meals entirely, which affects afternoon concentration and academic performance. We propose starting with achievable improvements: install a food thermometer system to ensure serving temperatures meet standards, survey students monthly about menu preferences, and add at least one fresh salad option daily. These changes require minimal budget but would significantly improve the dining experience. Students are willing to participate in menu planning committees to ensure realistic suggestions that work within existing constraints.",
        votes: 12,
      },
      {
        id: "v-g10-1-2",
        title: "Comprehensive Cafeteria Overhaul with Student Partnership",
        text: "The cafeteria food situation has become a grade-wide crisis - students from Classes 10A, 10B, and 10C all report identical complaints: cold food (even items that should be hot), repetitive weekly menus with minimal variation, and a near-complete absence of healthy options. A student survey showed 65% have reduced cafeteria purchases and 30% regularly skip lunch. We propose a comprehensive improvement plan developed in partnership between students and cafeteria management: First, establish a Student Cafeteria Committee with 2 representatives per class meeting monthly with kitchen staff. Second, implement a digital feedback system where students rate meals daily (takes 10 seconds). Third, request budget allocation for proper warming equipment - the current steamers are over 15 years old. Fourth, introduce a 'healthy corner' with fresh fruits, vegetables, and salads. Fifth, publish weekly menus in advance so students can plan. This collaborative approach ensures changes reflect actual student preferences while respecting kitchen constraints.",
        votes: 28,
      },
    ],
    replies: [
      // Class phase replies (days 95-65)
      createReply("r-g10-1-1", "objection", "I think the main issue is **timing, not quality**. Food is hot when served → the problem is students arriving late.", 8, 92, [], undefined, undefined, undefined, mockUsers[1]),
      createReply("r-g10-1-2", "pro-argument", "**Absolutely agree!** I've noticed many students skip lunch because of this.\n\nThe consequences:\n- *Low energy* in afternoon classes\n- Students buy junk food instead\n- **Wasted food** that goes uneaten", 12, 90, [
        createReply("r-g10-1-2a", "question", "Do we have **data** on how many students actually skip lunch?\n\n> A survey would strengthen our case significantly.", 3, 88, [], undefined, undefined, undefined, mockUsers[2]),
      ], undefined, undefined, undefined, mockUsers[5]),
      createReply("r-g10-1-3", "proposal", "We could propose a **student feedback system** where we vote on menu items weekly:\n\n1. Digital survey each Monday\n2. Top choices served that week\n3. *Track satisfaction* over time", 15, 85, [], undefined, {
        text: "Create a **monthly rotating menu** based on student preferences collected through surveys → ensuring variety and satisfaction.",
        solutionLevel: "school"
      }, undefined, mockUsers[6]),
      // Grade phase replies (days 65-30)
      createReply("r-g10-1-4", "pro-argument", "Students from **10B** have the *same complaints* - this is a grade-wide issue!\n\n> When all three classes report identical problems, it's clearly systemic.", 18, 60, [], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-g10-1-5", "proposal", "Let's **combine our ideas**:\n\n1. Student surveys → know what we want\n2. Better heating equipment → *food stays hot*\n3. Healthier options → salad bar\n\n> A comprehensive approach addresses all concerns.", 22, 55, [
        createReply("r-g10-1-5a", "pro-argument", "Class **10C supports** this combined approach!\n\n→ Unity across classes makes our voice stronger.", 14, 52, [], undefined, undefined, undefined, mockUsers[12]),
      ], undefined, undefined, undefined, mockUsers[10]),
      createReply("r-g10-1-6", "variant", "The combined proposal addresses **all three classes' concerns**:\n- Food quality\n- Menu variety\n- Temperature issues\n\n> This is how grade-level collaboration should work.", 16, 48, [], undefined, undefined, undefined, mockUsers[14]),
      createReply("r-g10-1-7", "question", "Has anyone **talked to the cafeteria staff** about these issues?\n\n> Understanding their constraints would help us propose *realistic* solutions.", 8, 45, [
        createReply("r-g10-1-7a", "pro-argument", "Yes! They said they need **budget approval** for better equipment.\n\n- Current steamers are *15+ years old*\n- Repairs keep failing\n- Need new investment", 11, 42, [], undefined, undefined, undefined, mockUsers[16]),
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
        title: "Digital Assignment Submission - Gradual Transition",
        text: "Our current paper-based assignment submission system is inefficient, environmentally wasteful, and makes it difficult for students to track their work. Papers get lost, teachers struggle to organize stacks of submissions, and students have no way to verify their work was received. We propose transitioning to digital submissions using Google Classroom, which most students already have accounts for through the school. The transition would be gradual: start with one subject this semester as a pilot, gather feedback, then expand next semester. Teachers would receive training sessions, and the school library would extend hours for students without home internet access. Digital submission allows automatic timestamps (no more 'I submitted it!' disputes), easier feedback through comments, and environmental benefits - our grade alone uses an estimated 5,000 sheets of paper per semester on assignments.",
        votes: 14,
      },
      {
        id: "v-g10-2-2",
        title: "Hybrid Digital System with Equity Safeguards",
        text: "Paper-based assignment submission creates problems for everyone: environmental waste, lost assignments, difficulty tracking deadlines, and delayed feedback. However, moving fully digital raises equity concerns since not all students have reliable internet at home. We propose a thoughtful hybrid approach: implement Google Classroom as the primary submission platform with several equity safeguards built in. First, maintain paper submission as a backup option - no student should be penalized for lack of technology access. Second, extend library hours until 6 PM on weekdays so students can use school computers. Third, identify students with technology barriers and provide targeted support (the school has unused Chromebooks that could be loaned). Fourth, teachers must allow at least 48-hour submission windows so students can access school computers during the next school day if needed. This maximizes the benefits of digital submission while ensuring no student is disadvantaged by their circumstances.",
        votes: 26,
      },
    ],
    replies: [
      // Class phase replies
      createReply("r-g10-2-1", "pro-argument", "This would help the **environment** and make it easier to track deadlines:\n\n- Less paper waste → *eco-friendly*\n- Automatic timestamps\n- Never lose an assignment again\n\n> We use 5,000+ sheets per semester on assignments alone.", 9, 90, [], undefined, undefined, undefined, mockUsers[11]),
      createReply("r-g10-2-2", "objection", "Not all students have **reliable internet** access at home.\n\n> This could *disadvantage* students from lower-income families.", 14, 88, [], undefined, undefined, undefined, mockUsers[12]),
      createReply("r-g10-2-3", "proposal", "**Extend library hours** so students can use school computers:\n\n- Open until *6 PM* on weekdays\n- Morning access before classes\n- Saturday hours for major deadlines", 11, 85, [], undefined, undefined, undefined, mockUsers[14]),
      // Grade phase replies
      createReply("r-g10-2-4", "pro-argument", "Class **10B** already uses Google Classroom - it works great!\n\n- Easy to submit\n- *Instant confirmation*\n- Teachers respond faster\n\n> Proof that digital works when implemented properly.", 16, 58, [], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-g10-2-5", "variant", "Combine digital submissions with **extended library access** for equity:\n\n1. Digital-first approach\n2. Paper backup always available\n3. Extended computer access\n\n→ No student left behind.", 19, 52, [
        createReply("r-g10-2-5a", "pro-argument", "This addresses the internet access concerns **perfectly**.\n\n> Equity and efficiency can coexist.", 12, 48, [], undefined, undefined, undefined, mockUsers[10]),
      ], undefined, undefined, undefined, mockUsers[16]),
      createReply("r-g10-2-6", "question", "What **platform** should we use? Google Classroom or something else?", 8, 45, [
        createReply("r-g10-2-6a", "proposal", "**Google Classroom** is best because:\n- *Free* for schools\n- Most students already have accounts\n- Teachers know how to use it", 15, 42, [], undefined, undefined, undefined, mockUsers[18]),
      ], undefined, undefined, undefined, mockUsers[20]),
      createReply("r-g10-2-7", "pro-argument", "Teachers can provide **faster feedback** digitally:\n\n- Comments inline on documents\n- Track changes visible\n- *No waiting* for paper return\n\n> Digital grading can cut feedback time by 50%.", 10, 38, [], undefined, undefined, undefined, mockUsers[0]),
    ],
  },

  // Winner 3 from Class 10A - Sports Equipment
  {
    id: "g10-3",
    type: "problem",
    aspects: ["problem", "proposal"],
    title: "Limited Access to Sports Equipment",
    description: "PE equipment shortage causing reduced physical activity.",
    problemText: "Our physical education program is severely hampered by a critical shortage of sports equipment. In a typical 45-minute PE class with 30 students, we have only 8 basketballs, 4 working badminton rackets, and 6 soccer balls that aren't deflated or damaged. This means students spend more time waiting than actually exercising. During our last basketball unit, some students only touched the ball twice during the entire class period. The volleyball nets are torn and unsafe, the gymnastics mats are cracked and don't provide adequate cushioning, and half the jump ropes are missing handles. This equipment shortage directly contradicts the school's stated commitment to student health and physical development. Students who need physical activity most are often the ones who end up standing on the sidelines because they're less assertive about claiming equipment.",
    proposalText: "We propose a three-phase equipment renewal plan: Phase 1 (immediate) - conduct a complete inventory of all PE equipment and immediately retire anything damaged or unsafe. Phase 2 (within one month) - submit a prioritized equipment request to administration including costs (we've estimated €2,500 for essential items like balls, rackets, and safety equipment). Phase 3 (ongoing) - implement an equipment care program where students learn proper storage and maintenance, extending equipment lifespan. Additionally, we suggest partnering with local sports clubs who often have gently used equipment they're willing to donate. Our PE teacher supports this proposal and has offered to help coordinate with administration.",
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
      createReply("r-g10-3-1", "pro-argument", "Yes! **Half the class** just stands around waiting for their turn.\n\nIt's frustrating because:\n- We *want* to be active\n- Only **1 basketball** for every 4 students\n- Standing around isn't exercise\n\n> We're being graded on PE but can't actually participate.", 8, 88, [], undefined, undefined, undefined, mockUsers[18]),
      createReply("r-g10-3-2", "proposal", "We could create a **rotation system** and extend PE class time:\n\n1. Stations for different activities\n2. Everyone rotates every 15 minutes\n3. *Maximize active time* for all students", 6, 85, [], undefined, undefined, undefined, mockUsers[19]),
      createReply("r-g10-3-3", "objection", "While I agree equipment is an issue, the **real problem is class size**.\n\n- 30 students with *one teacher*\n- Even with more equipment, supervision is difficult\n- Quality of instruction suffers\n\n> Perhaps we should advocate for smaller classes or PE assistants.", 10, 82, [], undefined, {
        text: "Request that PE classes be split into **smaller groups of 15 students maximum**, with staggered scheduling → allows existing equipment to be adequate while improving instruction quality.",
        solutionLevel: "school"
      }, undefined, mockUsers[20]),
      // Grade phase replies
      createReply("r-g10-3-4", "pro-argument", "**10B and 10C** have the *same problem* - it's grade-wide!\n\n> We compared notes and every Grade 10 class reports identical equipment issues.", 14, 60, [], undefined, undefined, undefined, mockUsers[2]),
      createReply("r-g10-3-5", "proposal", "Request **budget allocation** for new equipment purchase:\n\n- Prioritized list of needs\n- Cost estimates included\n- *Phased approach* for affordability", 12, 55, [
        createReply("r-g10-3-5a", "question", "How much would new equipment **cost**?\n\n> We need concrete numbers to present to administration.", 5, 52, [], undefined, undefined, undefined, mockUsers[4]),
      ], undefined, undefined, undefined, mockUsers[6]),
      createReply("r-g10-3-6", "variant", "Combine **equipment sharing** between classes with new purchases:\n\n1. Coordinate PE schedules\n2. Share equipment across timeslots\n3. Buy only what's truly needed\n\n→ More efficient use of resources.", 9, 48, [], undefined, undefined, undefined, mockUsers[8]),
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
      createReply("r-g10-4-1", "pro-argument", "I sit in the **back corner** and literally *can't read* the board.\n\n> My grades are suffering because I miss important information.", 5, 90, [], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-g10-4-2", "proposal", "Try **U-shaped seating** so everyone can see:\n\n- All students face center\n- Better for discussions\n- *No bad seats*", 7, 88, [], undefined, undefined, undefined, mockUsers[1]),
      // Grade phase replies
      createReply("r-g10-4-3", "pro-argument", "Class **10A tried rotating seats** - it helped a lot!\n\n- Fair distribution of good spots\n- Students meet new classmates\n- *Weekly lottery* keeps it random", 11, 58, [], undefined, undefined, undefined, mockUsers[3]),
      createReply("r-g10-4-4", "variant", "Combine **U-shape with weekly rotation** for maximum fairness:\n\n1. U-shape layout for visibility\n2. Rotate positions each Monday\n3. Everyone gets front-row experience\n\n> Best of both approaches.", 14, 52, [
        createReply("r-g10-4-4a", "pro-argument", "This is a **great compromise!**\n\n→ Addresses visibility *and* fairness concerns.", 8, 48, [], undefined, undefined, undefined, mockUsers[5]),
      ], undefined, undefined, undefined, mockUsers[7]),
      createReply("r-g10-4-5", "proposal", "Each class can choose their **preferred arrangement**:\n\n- Vote on layout options\n- *Experiment* for one month\n- Keep what works best", 9, 45, [], undefined, undefined, undefined, mockUsers[9]),
      createReply("r-g10-4-6", "objection", "Some teachers **won't allow** rearranging their classroom.\n\nConcerns:\n- 'Their room, their rules'\n- *Time wasted* moving desks\n- Disruption concerns", 6, 55, [], undefined, undefined, undefined, mockUsers[11]),
      createReply("r-g10-4-7", "proposal", "Get **principal approval** for classroom flexibility:\n\n> Administrative backing would override individual teacher resistance.", 8, 50, [], undefined, undefined, undefined, mockUsers[13]),
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
      createReply("r-g10-5-1", "pro-argument", "This would help us avoid having **4 assignments due the same day**.\n\n> Last week I had to pull an *all-nighter* because of poor coordination.", 4, 88, [], undefined, undefined, undefined, mockUsers[6]),
      createReply("r-g10-5-2", "objection", "Not all teachers will use it **consistently**.\n\nRisks:\n- Incomplete information\n- Students can't trust it\n- *Defeats the purpose*", 3, 85, [], undefined, undefined, undefined, mockUsers[7]),
      // Grade phase replies
      createReply("r-g10-5-3", "pro-argument", "If it's **mandatory for teachers**, it would work!\n\n→ Administration must require participation, not just suggest it.", 12, 58, [], undefined, undefined, undefined, mockUsers[11]),
      createReply("r-g10-5-4", "proposal", "Integrate with **existing school systems** for easier adoption:\n\n- Use current portal\n- *Auto-sync* with gradebook\n- Less extra work for teachers", 10, 52, [
        createReply("r-g10-5-4a", "pro-argument", "Good idea - **less work** for teachers means more likely adoption.\n\n> Integration is key.", 7, 48, [], undefined, undefined, undefined, mockUsers[13]),
      ], undefined, undefined, undefined, mockUsers[15]),
      createReply("r-g10-5-5", "question", "Can students also add their **extracurricular commitments**?\n\n- Sports games\n- Music recitals\n- *Club activities*\n\n> Would help teachers understand our full schedules.", 6, 42, [], undefined, undefined, undefined, mockUsers[17]),
      createReply("r-g10-5-6", "objection", "This puts **extra workload** on already busy teachers.\n\n> We need to acknowledge their concerns too.", 5, 60, [], undefined, undefined, undefined, mockUsers[19]),
      createReply("r-g10-5-7", "proposal", "Use **automated reminders** so students don't miss deadlines:\n\n1. *3 days before* → first alert\n2. *1 day before* → urgent reminder\n3. Morning of → final notification", 7, 55, [], undefined, undefined, undefined, mockUsers[21]),
      createReply("r-g10-5-8", "objection", "Some students might **abuse** the system to request extensions.\n\n> Need safeguards against gaming the system.", 4, 48, [], undefined, undefined, undefined, mockUsers[1]),
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
      createReply("r-g10-6-1", "pro-argument", "I *need quiet* to focus and the constant talking is **distracting**.\n\n> Some of us literally *can't think* with background noise.", 6, 86, [], undefined, undefined, undefined, mockUsers[4]),
      createReply("r-g10-6-2", "proposal", "Create **quiet zones** in the classroom:\n\n- Designated silent corner\n- *Visual boundaries* (tape, signs)\n- Mutual respect for different needs", 5, 84, [], undefined, undefined, undefined, mockUsers[5]),
      // Grade phase replies
      createReply("r-g10-6-3", "objection", "Some students learn better by **discussing problems**.\n\n- Verbal processing helps understanding\n- Collaboration improves outcomes\n- *Both styles are valid*", 8, 58, [], undefined, undefined, undefined, mockUsers[19]),
      createReply("r-g10-6-4", "variant", "Have **designated time blocks** instead of mixed:\n\n1. First 15 min → *silence required*\n2. Next 10 min → quiet discussion OK\n3. Final 5 min → questions aloud\n\n> Respects both learning styles!", 11, 52, [
        createReply("r-g10-6-4a", "pro-argument", "This respects **both learning styles**!\n\n→ Time-based rather than space-based solution.", 7, 48, [], undefined, undefined, undefined, mockUsers[21]),
      ], undefined, undefined, undefined, mockUsers[1]),
      createReply("r-g10-6-5", "objection", "Enforcing quiet zones is **difficult** without constant monitoring.\n\n> Who polices the boundaries?", 6, 55, [], undefined, undefined, undefined, mockUsers[3]),
      createReply("r-g10-6-6", "proposal", "Provide **noise-canceling headphones** for students who need quiet:\n\n- Available for checkout\n- *Students self-manage*\n- Low cost solution (~€50)", 9, 50, [], undefined, undefined, undefined, mockUsers[5]),
    ],
  },

  // Winner 1 from Class 10C - Broken Lab Equipment
  {
    id: "g10-7",
    type: "problem",
    aspects: ["problem", "proposal"],
    title: "Broken Lab Equipment",
    description: "Science lab equipment requires urgent repairs and replacement.",
    problemText: "Our school's science laboratories are in a critical state of disrepair, significantly impacting the quality of science education for all students. During chemistry classes, we frequently encounter broken Bunsen burners with faulty gas connections, cracked beakers that pose safety risks, and scales that give inconsistent readings. In biology, our microscope situation is dire - of the 24 microscopes in Lab 2, only 8 function properly, and 3 of those have broken fine focus knobs. This means groups of 6-7 students must share a single working microscope, drastically reducing hands-on learning time. Physics equipment is equally neglected, with most voltmeters showing inaccurate readings and several missing probes entirely. Last week, a chemistry experiment had to be cancelled when we discovered that half the test tubes were etched and unsafe for heating. The science department has submitted repair requests for over two years, but budget constraints have prevented any meaningful action.",
    proposalText: "We propose an emergency science equipment restoration initiative: First, conduct a comprehensive safety audit of all lab equipment within two weeks, tagging items as 'safe,' 'needs repair,' or 'replace immediately.' Second, immediately quarantine unsafe equipment to prevent accidents. Third, apply for science education grants from the state - our science teacher has identified three programs we qualify for that together could provide up to €15,000. Fourth, establish a parent-teacher fundraising campaign specifically for lab equipment, with transparent reporting on how funds are used. Fifth, create a student lab assistant program where responsible students help maintain equipment, extending its lifespan and teaching valuable skills. We've already drafted a letter to the principal and school board outlining the safety concerns and educational impact.",
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
      createReply("r-g10-7-1", "pro-argument", "We had to share one microscope between 6 students last week. By the time it was my turn, we only had 3 minutes left in class. I barely got to look at the cell structure before we had to clean up. This isn't fair to students who want to learn!", 6, 91, [], undefined, undefined, undefined, mockUsers[12]),
      createReply("r-g10-7-2", "proposal", "Request emergency funding for lab equipment repairs.", 8, 88, [], undefined, undefined, undefined, mockUsers[13]),
      // Grade phase replies
      createReply("r-g10-7-3", "pro-argument", "All three classes share the same labs - this affects every single student in Grade 10, not just one class! We need to present this as a grade-wide priority.", 15, 60, [], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-g10-7-4", "proposal", "Create a prioritized list of essential equipment to repair first.", 12, 55, [
        createReply("r-g10-7-4a", "pro-argument", "Microscopes and scales should be top priority.", 9, 52, [], undefined, undefined, undefined, mockUsers[2]),
      ], undefined, undefined, undefined, mockUsers[4]),
      createReply("r-g10-7-5", "question", "Can we apply for science education grants?", 7, 48, [
        createReply("r-g10-7-5a", "proposal", "The science teacher mentioned there are state grants available.", 10, 45, [], undefined, undefined, undefined, mockUsers[6]),
      ], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-g10-7-6", "objection", "While I support fixing the equipment, I'm concerned that focusing only on repairs doesn't address the underlying issue: our school chronically underfunds the science department. Even if we fix everything now, without a sustainable maintenance budget, we'll be back in the same situation in two years. We need to advocate for ongoing science funding, not just one-time repairs.", 11, 42, [], undefined, {
        text: "Propose a recurring annual science equipment budget of €3,000 specifically allocated for maintenance and gradual replacement. This could be funded by redirecting a small portion of existing budgets or through a dedicated science equipment fee of €15 per student per year.",
        solutionLevel: "school"
      }, undefined, mockUsers[10]),
    ],
  },

  // Winner 2 from Class 10C - Flexible Deadlines
  {
    id: "g10-8",
    type: "proposal",
    aspects: ["problem", "proposal"],
    title: "Flexible Deadline Policy",
    description: "Implementing a fair extension system for assignments.",
    problemText: "The current rigid deadline system creates unnecessary stress and doesn't account for the complex realities of students' lives. Many of us juggle school with extracurricular activities, family responsibilities, part-time jobs, and mental health challenges. When multiple major assignments coincide - which happens frequently because teachers don't coordinate due dates - students face impossible choices. Last month, I had two essays, a lab report, and a math project all due within 48 hours. Despite starting early, I couldn't complete everything to my best ability. The all-or-nothing approach to deadlines means a student who submits mediocre work on time gets a better grade than one who could have submitted excellent work with just one extra day. This doesn't reflect real-world professional environments where reasonable deadline adjustments are normal. Furthermore, the stress of rigid deadlines contributes to anxiety, sleep deprivation, and in some cases, academic dishonesty as desperate students see no other option.",
    proposalText: "We propose a Flexible Deadline Policy with clear guidelines to prevent abuse while supporting students who genuinely need flexibility: Each student gets 3 'extension tokens' per semester, each worth a 24-hour extension that can be claimed through a simple online form without requiring justification. Additional extensions require teacher approval with a brief explanation. Extensions cannot be used for final exams or presentations scheduled in class. Teachers will have access to a shared calendar showing major due dates across all subjects for each class, encouraging them to coordinate and avoid deadline pile-ups. This system respects student autonomy, reduces stress, and teaches time management through limited resources rather than rigid rules.",
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
      createReply("r-g10-8-1", "pro-argument", "Life happens - sometimes we need a little extra time. Last week my grandmother was hospitalized and I couldn't focus on my essay at all. A small extension would have helped so much.", 5, 87, [], undefined, undefined, undefined, mockUsers[15]),
      createReply("r-g10-8-2", "objection", "I'm worried this could be heavily abused by procrastinators. Some students will just use all their tokens immediately and then complain they have none left when they actually need them. Plus, it creates an unfair advantage - students who use extensions get more time to improve their work compared to those who submit on time. In the real world, deadlines are deadlines.", 4, 84, [], undefined, {
        text: "Instead of free extensions, implement a 'deadline coordination week' at the start of each semester where students can see all major due dates and request schedule changes before the semester begins. Teachers would be required to spread out major assignments. This prevents last-minute extension requests while addressing the root cause of deadline conflicts.",
        solutionLevel: "school"
      }, undefined, mockUsers[16]),
      // Grade phase replies
      createReply("r-g10-8-3", "proposal", "Limit extensions to 2 per semester per student.", 14, 58, [
        createReply("r-g10-8-3a", "pro-argument", "This prevents abuse while still helping when needed.", 10, 55, [], undefined, undefined, undefined, mockUsers[18]),
      ], undefined, undefined, undefined, mockUsers[17]),
      createReply("r-g10-8-4", "variant", "Allow extensions only for documented emergencies.", 8, 50, [], undefined, undefined, undefined, mockUsers[20]),
      createReply("r-g10-8-5", "question", "Would this apply to tests too, or just assignments?", 5, 45, [], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-g10-8-6", "objection", "Teachers already have too much paperwork managing deadlines. This would add another administrative burden tracking who used how many tokens.", 6, 52, [], undefined, undefined, undefined, mockUsers[2]),
      createReply("r-g10-8-7", "proposal", "Create an automated system for extension requests so teachers don't have extra paperwork.", 8, 48, [], undefined, undefined, undefined, mockUsers[4]),
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
        title: "Curriculum Content Update - Focused Petition Approach",
        text: "Our textbooks and curriculum are severely outdated, with some materials unchanged since the early 2000s. Our history books stop at 2005, missing two decades of significant global events. There is virtually no coverage of digital literacy, artificial intelligence, or modern technology - skills every student will need regardless of career path. Climate science content is limited to a few paragraphs despite it being the defining issue of our generation. We propose creating a focused student petition specifically targeting the ministry's curriculum review board. The petition would document specific outdated content with page references, compare our curriculum to what students learn in neighboring countries, and include signatures from students across all grades. A single, well-documented petition with school-wide backing is more likely to succeed than scattered complaints. We'd request a meeting with ministry representatives to present our case directly.",
        votes: 25,
      },
      {
        id: "v-s-1-2",
        title: "Comprehensive Curriculum Modernization - Multi-Stakeholder Campaign",
        text: "Our curriculum is so outdated that it's failing to prepare students for the modern world. History stops at 2005, coding and AI are absent despite being essential for every career, climate science is barely mentioned, and practical life skills like financial literacy are completely ignored. The ministry only reviews curriculum every 10-15 years - far too slow given the pace of change. We propose a comprehensive modernization campaign involving multiple stakeholders: First, form a Student Curriculum Committee with representatives from every grade to document specific gaps. Second, conduct a comparative analysis showing what students in other European countries learn that we don't. Third, partner with the Parent Association (they've expressed support) to add adult voices to our petition. Fourth, reach out to local media - student education stories often get coverage. Fifth, request formal meetings with our local ministry representative and school board members. Sixth, propose a pilot program where a few 'modern topics' electives could be offered even before full curriculum revision. This multi-pronged approach maximizes pressure for change while showing we're proposing solutions, not just complaining.",
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
      // Additional school phase objections
      createReply("r-s-1-18", "objection", "The ministry moves too slowly - this will take years to implement.", 14, 20, [], undefined, undefined, undefined, mockUsers[7]),
      createReply("r-s-1-19", "objection", "New curriculum means new textbooks - who pays for that?", 11, 16, [], undefined, undefined, undefined, mockUsers[9]),
      createReply("r-s-1-20", "objection", "Teachers aren't trained for digital literacy topics.", 9, 14, [], undefined, undefined, undefined, mockUsers[11]),
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
        title: "Cafeteria Food Quality - Quick Wins Approach",
        text: "The cafeteria situation has reached a school-wide breaking point. Students across all grades report identical complaints: food served cold even when it should be hot, the same repetitive menu cycling weekly, and virtually no healthy options available. A recent informal poll showed over 40% of students now bring lunch from home or skip eating entirely, which impacts afternoon energy and learning. We propose focusing on achievable 'quick wins' that require minimal budget: enforce proper serving temperatures through staff monitoring, add a simple daily salad bar with basic vegetables (cost-effective and healthy), publish menus a week in advance so students can plan, and create a student feedback form to identify the most-wanted menu items. These changes can be implemented within weeks and would immediately improve student satisfaction while larger improvements are planned.",
        votes: 18,
      },
      {
        id: "v-s-2-2",
        title: "School-Wide Cafeteria Improvement Initiative - Full Transformation",
        text: "Cafeteria food quality has been the single most consistent complaint across every grade in our school for years. The issues are well-documented: cold food (warming equipment is outdated), repetitive menus, minimal healthy options, and inadequate lunch time due to long lines. This affects nutrition, academic performance, and school morale. We propose a comprehensive School-Wide Cafeteria Improvement Initiative with buy-in from administration: First, establish a permanent Cafeteria Advisory Committee with 2 student representatives per grade meeting monthly with kitchen management and administration. Second, implement a real-time digital feedback system where students rate meals daily, generating data to guide improvements. Third, request capital budget for modern warming equipment (current units are 15+ years old). Fourth, extend the lunch period by 10 minutes by adjusting the afternoon schedule. Fifth, create a 'Healthy Corner' with fresh fruits, vegetables, yogurt, and salads as alternatives to the hot line. Sixth, explore partnerships with local restaurants for occasional variety days. Seventh, conduct a school-wide satisfaction survey twice per year to measure progress. This comprehensive approach treats cafeteria improvement as the school-wide priority it deserves.",
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
      // Additional school phase objections
      createReply("r-s-2-16", "objection", "Changing food vendors is a long contract process.", 10, 20, [], undefined, undefined, undefined, mockUsers[19]),
      createReply("r-s-2-17", "objection", "Healthy food costs more and many students can't afford it.", 12, 17, [], undefined, undefined, undefined, mockUsers[21]),
      createReply("r-s-2-18", "objection", "The kitchen staff is already overworked.", 8, 14, [], undefined, undefined, undefined, mockUsers[1]),
      createReply("r-s-2-19", "objection", "Students often complain but then don't eat the healthy options.", 9, 11, [], undefined, undefined, undefined, mockUsers[3]),
    ],
  },

  // Winner from Grade 11 - Mental Health Support
  {
    id: "s-3",
    type: "proposal",
    aspects: ["problem", "proposal"],
    title: "Mental Health Support Program",
    description: "Comprehensive mental health support system for all students.",
    problemText: "Our school faces a mental health crisis that has been largely invisible until now. Based on anonymous surveys conducted by our student council, over 40% of students report experiencing significant stress or anxiety related to school, 25% have considered seeking professional mental health support but didn't know how, and 15% report symptoms consistent with depression. Currently, our school has only 2 counselors for over 800 students - a ratio of 1:400, far exceeding the recommended 1:250. The average wait time to see a counselor is 3 weeks, by which point many students have either struggled through alone or given up trying to get help. There's also significant stigma around mental health - students fear being labeled or having parents notified. The COVID-19 pandemic has made things worse, with increased isolation, uncertainty about the future, and academic pressure. Teachers report noticing more students struggling but feeling unequipped to help. We've had multiple students leave school temporarily due to mental health issues, and we know there are many more suffering in silence.",
    proposalText: "We propose a comprehensive Mental Health Support Initiative with multiple components working together: First, advocate for hiring one additional school counselor to improve our ratio to 1:270. Second, establish a trained Peer Support Network where student volunteers receive 20 hours of mental health first aid training and serve as first-point contacts for struggling peers. Third, partner with local mental health organizations (we've already contacted three who are interested) to provide free monthly workshops and crisis support. Fourth, create a dedicated Wellness Room - a quiet, calm space students can visit during free periods when feeling overwhelmed. Fifth, integrate mental health education into the existing health curriculum with age-appropriate content about stress management, recognizing warning signs, and seeking help. Sixth, implement anonymous mental health check-ins twice per semester through an app, with counselors following up on concerning responses. Seventh, provide teachers with basic mental health awareness training so they can better recognize and respond to students in distress. This multi-layered approach ensures support is accessible, reduces stigma, and catches problems early.",
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
        title: "Mental Health Support - Community Partnership Model",
        text: "Our school faces a mental health crisis largely invisible to administration. Student surveys reveal over 40% experience significant school-related stress, 25% have wanted professional help but didn't know how to access it, and wait times to see our overloaded counselors average 3 weeks. With only 2 counselors for 800+ students (1:400 ratio vs. recommended 1:250), the system cannot meet demand. We propose a Community Partnership Model as a cost-effective first step: partner with local mental health organizations (three have already expressed interest) to provide free monthly workshops on stress management, coping skills, and recognizing warning signs. Train a volunteer Peer Support Network of students who complete 20 hours of mental health first aid certification. Create simple awareness campaigns reducing stigma around seeking help. These initiatives require minimal school budget while immediately expanding support availability. Success can build the case for hiring additional counseling staff.",
        votes: 20,
      },
      {
        id: "v-s-3-2",
        title: "Comprehensive Mental Health Initiative - Full Support System",
        text: "Mental health has reached crisis levels in our school community. Anonymous surveys show 40% of students report significant anxiety or depression symptoms, 25% have wanted professional help but couldn't access it, and our 2 counselors for 800+ students creates a 3-week average wait time. Students are suffering in silence while small problems escalate into serious ones. We propose a comprehensive, multi-layered Mental Health Initiative addressing this crisis from every angle: First, advocate strongly for hiring one additional counselor to improve our ratio toward the recommended 1:250. Second, create a trained Peer Support Network with 20 volunteer students receiving certified mental health first aid training. Third, establish partnerships with local mental health organizations for free monthly workshops and crisis support (three have already expressed interest). Fourth, designate a Wellness Room - a quiet, calming space students can visit during free periods when feeling overwhelmed. Fifth, integrate mental health education into existing health curriculum covering stress management, warning sign recognition, and help-seeking. Sixth, implement anonymous wellness check-ins twice per semester through a simple app, with counselors following up on concerning responses. Seventh, provide teachers with basic mental health awareness training. This comprehensive system ensures support is accessible, reduces stigma through normalization, and catches problems before they become crises.",
        votes: 42,
      },
    ],
    replies: [
      // Class phase replies
      createReply("r-s-3-1", "pro-argument", "This is so important! Many students struggle silently because there's nowhere to turn. I've seen friends deteriorate over months with no support.", 10, 90, [], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-s-3-2", "pro-argument", "Mental health should be treated as seriously as physical health. If we had physical education, why not mental health education?", 12, 88, [], undefined, undefined, undefined, mockUsers[1]),
      createReply("r-s-3-3", "proposal", "Start with awareness campaigns.", 8, 85, [], undefined, undefined, undefined, mockUsers[2]),
      // Grade phase replies
      createReply("r-s-3-4", "pro-argument", "Grade 11 has particularly high stress with university preparation starting. We really need this support system.", 18, 58, [], undefined, undefined, undefined, mockUsers[3]),
      createReply("r-s-3-5", "proposal", "Train peer supporters from each class.", 15, 55, [
        createReply("r-s-3-5a", "pro-argument", "Peers are often first to notice when someone is struggling.", 12, 52, [], undefined, undefined, undefined, mockUsers[5]),
      ], undefined, undefined, undefined, mockUsers[4]),
      createReply("r-s-3-6", "question", "How many counselors do we currently have?", 7, 50, [
        createReply("r-s-3-6a", "pro-argument", "Only 2 for 800+ students. Way understaffed compared to recommendations.", 14, 48, [], undefined, undefined, undefined, mockUsers[7]),
      ], undefined, undefined, undefined, mockUsers[6]),
      // School phase replies
      createReply("r-s-3-7", "pro-argument", "Every grade needs better mental health support! This isn't just a Grade 11 issue.", 28, 28, [
        createReply("r-s-3-7a", "pro-argument", "Grade 10 supports this completely.", 20, 26, [], undefined, undefined, undefined, mockUsers[9]),
        createReply("r-s-3-7b", "pro-argument", "Grade 12 too - exam stress is real and we have the least support.", 22, 24, [], undefined, undefined, undefined, mockUsers[11]),
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
      // Additional school phase objections with counter-proposals
      createReply("r-s-3-15", "objection", "Hiring additional counselors requires €45,000-60,000 per year in salary and benefits. Where exactly does the money come from? The school budget is already stretched thin with facilities maintenance and educational materials. This proposal sounds nice but ignores financial reality.", 10, 19, [], undefined, {
        text: "Focus on cost-free or low-cost solutions first: partner with university psychology departments for supervised counseling interns, apply for mental health grants from the state health department (3 programs currently accepting applications), and train volunteer peer supporters. Once we demonstrate need and impact with data, advocate for budget reallocation in next year's planning.",
        solutionLevel: "school"
      }, undefined, mockUsers[2]),
      createReply("r-s-3-16", "objection", "Some parents might strongly object to their children discussing mental health at school without parental involvement. This could create legal issues and parental backlash that damages the school's relationship with families.", 8, 16, [], undefined, {
        text: "Include a comprehensive parent communication component: informational sessions about the program, clear policies on when parents are notified versus when confidentiality is maintained (following legal guidelines), and an opt-out option for families who prefer to handle mental health privately. Transparency builds trust rather than conflict.",
        solutionLevel: "school"
      }, undefined, mockUsers[4]),
      createReply("r-s-3-17", "objection", "Peer support sounds good in theory, but untrained students giving mental health advice can actually make things worse. They might give harmful advice, break confidentiality, or become overwhelmed themselves. This could create more problems than it solves.", 7, 13, [], undefined, undefined, undefined, mockUsers[6]),
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
      // Additional school phase objections
      createReply("r-s-4-13", "objection", "Network upgrades require significant budget that we don't have.", 11, 21, [], undefined, undefined, undefined, mockUsers[2]),
      createReply("r-s-4-14", "objection", "Students will just use faster WiFi for gaming and streaming.", 9, 18, [], undefined, undefined, undefined, mockUsers[4]),
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
      // Additional school phase objections
      createReply("r-s-5-13", "objection", "Security measures often target certain student groups unfairly.", 11, 19, [], undefined, undefined, undefined, mockUsers[20]),
      createReply("r-s-5-14", "objection", "Cameras and surveillance create a culture of distrust.", 9, 16, [], undefined, undefined, undefined, mockUsers[21]),
      createReply("r-s-5-15", "objection", "Security staff can be intimidating to younger students.", 7, 12, [], undefined, undefined, undefined, mockUsers[0]),
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
      // Additional school phase objections
      createReply("r-s-6-14", "objection", "Without standardized tests, how do employers compare graduates?", 11, 20, [], undefined, undefined, undefined, mockUsers[11]),
      createReply("r-s-6-15", "objection", "Project-based assessment is harder to grade fairly.", 8, 17, [], undefined, undefined, undefined, mockUsers[12]),
      createReply("r-s-6-16", "objection", "Changing the assessment system takes years and affects current students.", 9, 14, [], undefined, undefined, undefined, mockUsers[13]),
    ],
  },

  // Additional school phase concern - Sustainability
  {
    id: "s-7",
    type: "proposal",
    aspects: ["problem", "proposal"],
    title: "School-Wide Sustainability Initiative",
    description: "Comprehensive environmental program to reduce our school's ecological footprint.",
    problemText: "Our school's environmental impact is significant and largely unaddressed. We have no functioning recycling program - the blue bins that exist are rarely emptied separately from regular trash, effectively making recycling theater rather than reality. Energy waste is rampant: lights are left on in empty classrooms, computers run 24/7, and the heating system operates at full capacity even during mild weather because there's no programmable thermostat. Single-use plastics are everywhere - from cafeteria utensils to water bottles sold in vending machines. Paper waste is enormous; teachers print hundreds of sheets daily for assignments that could be digital. The school has no environmental education component, leaving students unaware of their impact. Conservative estimates suggest our school produces 50+ tons of waste annually, uses 40% more energy than comparable modern schools, and has virtually no sustainability practices. This contradicts everything we're learning about climate change in science class and sends a message that environmental responsibility doesn't matter in practice.",
    proposalText: "We propose a phased School-Wide Sustainability Initiative: Phase 1 (immediate, no cost): Establish a student-led Green Team with representatives from each grade to lead initiatives and monitor progress. Implement proper recycling with clearly labeled bins and student monitors. Create 'energy patrol' to turn off lights and equipment in empty rooms. Phase 2 (within 3 months, low cost): Replace cafeteria single-use plastics with compostable alternatives (€500/year). Start a composting program for food waste, partnering with a local community garden. Launch digital-first policy to reduce printing. Phase 3 (within 1 year, investment required): Apply for government green school grants for LED lighting retrofit (typical payback: 2 years in energy savings). Install programmable thermostats (€2,000 investment, €3,000 annual savings). Create an outdoor environmental education area. We've researched similar programs at other schools and found that comprehensive sustainability initiatives typically save 25-35% on utility costs within 3 years, making this financially beneficial as well as environmentally responsible.",
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
      createReply("r-s-7-1", "pro-argument", "Climate change affects all of us and schools should be leading the way in teaching environmental responsibility through action, not just textbooks.", 8, 88, [], undefined, undefined, undefined, mockUsers[19]),
      createReply("r-s-7-2", "proposal", "Start with better recycling bins.", 6, 85, [], undefined, undefined, undefined, mockUsers[18]),
      // Grade phase replies
      createReply("r-s-7-3", "proposal", "Create student Green Team to coordinate all initiatives.", 14, 55, [], undefined, undefined, undefined, mockUsers[20]),
      createReply("r-s-7-4", "variant", "Conduct a professional energy audit to identify the biggest savings opportunities.", 12, 50, [], undefined, undefined, undefined, mockUsers[21]),
      // School phase replies
      createReply("r-s-7-5", "pro-argument", "Schools should lead by example! How can we teach students about environmental responsibility while running an environmentally irresponsible institution?", 22, 28, [
        createReply("r-s-7-5a", "pro-argument", "Students care deeply about the environment - this would boost school pride.", 18, 26, [], undefined, undefined, undefined, mockUsers[1]),
      ], undefined, undefined, undefined, mockUsers[0]),
      createReply("r-s-7-6", "proposal", "Apply for environmental grants - several are available specifically for schools.", 18, 25, [], undefined, undefined, undefined, mockUsers[2]),
      createReply("r-s-7-7", "question", "What have other schools done successfully?", 10, 22, [
        createReply("r-s-7-7a", "pro-argument", "Many schools have reduced energy costs 30% with simple changes like LED bulbs and programmable thermostats.", 16, 20, [], undefined, undefined, undefined, mockUsers[4]),
      ], undefined, undefined, undefined, mockUsers[3]),
      createReply("r-s-7-8", "variant", "Start with LED lighting replacement - it has the quickest payback period.", 14, 18, [], undefined, undefined, undefined, mockUsers[5]),
      createReply("r-s-7-9", "proposal", "Partner with local environmental groups who can provide expertise and volunteers.", 12, 15, [], undefined, undefined, undefined, mockUsers[6]),
      createReply("r-s-7-10", "pro-argument", "Sustainability education is future-proofing our students for green economy jobs.", 15, 10, [], undefined, undefined, undefined, mockUsers[7]),
      createReply("r-s-7-11", "proposal", "Start a composting program for cafeteria food waste.", 11, 8, [], undefined, undefined, undefined, mockUsers[8]),
      createReply("r-s-7-12", "variant", "Make sustainability part of school culture through competitions between classes.", 13, 5, [], undefined, undefined, undefined, mockUsers[9]),
      createReply("r-s-7-13", "objection", "This sounds like a lot of work with uncertain payoff. The recycling and composting will require ongoing student and staff effort that will decline over time. Previous 'green initiatives' at our school have fizzled out within a year. What makes this different?", 9, 15, [], undefined, {
        text: "Build sustainability into school structure, not just enthusiasm: make Green Team a formal student council committee with recognition and credits. Tie energy savings to visible benefits (e.g., savings fund class activities). Create automated systems where possible (programmable thermostats, motion-sensor lights). Focus on easy wins first to build momentum.",
        solutionLevel: "school"
      }, undefined, mockUsers[10]),
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
