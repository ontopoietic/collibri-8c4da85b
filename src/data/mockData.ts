import { Concern, Reply } from "@/types/concern";

const now = new Date();
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000);

// Helper to create replies with references
const createReply = (
  id: string,
  category: "objection" | "proposal" | "pro-argument" | "variant",
  text: string,
  votes: number,
  hoursAgo: number,
  replies: Reply[] = [],
  referencedReplies?: { id: string; text: string; category: "objection" | "proposal" | "pro-argument" | "variant" }[],
  counterProposal?: { text: string; postedAsConcern?: boolean; solutionLevel?: "school" | "ministries" }
): Reply => ({
  id,
  category,
  text,
  votes,
  replies,
  timestamp: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000),
  referencedReplies,
  counterProposal,
});

export const mockConcerns: Concern[] = [
  // Class Phase Concerns
  {
    id: "1",
    type: "problem",
    title: "Cafeteria Food Quality Issues",
    description: "The food served in our cafeteria is often cold and lacks variety. Students are frequently complaining about limited healthy options.",
    votes: 34,
    timestamp: hoursAgo(2),
    phase: "class",
    group: "Class 10A",
    replies: [
      createReply("r1", "objection", "I think the main issue is timing, not quality. Food is hot when served.", 8, 1.5),
      createReply("r2", "pro-argument", "Absolutely agree! I've noticed many students skip lunch because of this.", 12, 1.8),
      createReply("r3", "proposal", "We could propose a student feedback system where we vote on menu items weekly.", 15, 1.2, [], undefined, {
        text: "Create a monthly rotating menu based on student preferences collected through surveys.",
        solutionLevel: "school"
      }),
      createReply("r4", "variant", "The food served in our cafeteria is often cold and lacks variety, but we should also consider extending lunch break times to reduce crowding. This synthesis addresses both timing and variety concerns.", 10, 0.8, [], [
        { id: "r1", text: "I think the main issue is timing, not quality.", category: "objection" },
        { id: "r2", text: "Absolutely agree! I've noticed many students skip lunch.", category: "pro-argument" }
      ]),
    ],
  },
  {
    id: "2",
    type: "proposal",
    title: "Implement Digital Assignment Submission",
    description: "We should move to a fully digital assignment submission system to reduce paper waste and make tracking easier.",
    votes: 28,
    timestamp: hoursAgo(5),
    phase: "class",
    group: "Class 9B",
    solutionLevel: "school",
    replies: [
      createReply("r5", "pro-argument", "This would help the environment and make it easier to keep track of deadlines.", 9, 4),
      createReply("r6", "objection", "Not all students have reliable internet access at home. This could be unfair.", 14, 3.5, [], undefined, {
        text: "Implement a hybrid system where students can use school computers during extended library hours for digital submissions.",
        postedAsConcern: true,
        solutionLevel: "school"
      }),
      createReply("r7", "pro-argument", "Digital submissions also allow teachers to provide faster feedback.", 7, 3),
      createReply("r8", "variant", "We should move to a fully digital assignment submission system with offline access capabilities, combining digital efficiency with accessibility for all students.", 11, 2, [], [
        { id: "r6", text: "Not all students have reliable internet access.", category: "objection" },
        { id: "r5", text: "This would help the environment.", category: "pro-argument" }
      ]),
    ],
  },
  {
    id: "3",
    type: "problem",
    title: "Limited Access to Sports Equipment",
    description: "Our class doesn't have enough sports equipment for PE lessons, leading to long waiting times and reduced activity.",
    votes: 22,
    timestamp: hoursAgo(8),
    phase: "class",
    group: "Class 8C",
    replies: [
      createReply("r9", "pro-argument", "Yes! Half the class just stands around waiting for their turn.", 8, 7),
      createReply("r10", "proposal", "We could create a rotation system and extend PE class time.", 6, 6.5, [], undefined, {
        text: "Apply for school budget allocation to purchase additional sports equipment and storage facilities.",
        solutionLevel: "school"
      }),
      createReply("r11", "objection", "The real issue is that PE classes are too large. We need smaller groups.", 10, 6),
      createReply("r12", "variant", "Our class doesn't have enough sports equipment for PE lessons, but organizing equipment-sharing schedules between classes and purchasing multi-use items could help maximize what we have.", 7, 5, [], [
        { id: "r10", text: "We could create a rotation system.", category: "proposal" },
        { id: "r11", text: "PE classes are too large.", category: "objection" }
      ]),
    ],
  },

  // Grade Phase Concerns
  {
    id: "4",
    type: "problem",
    title: "Homework Overload Across Subjects",
    description: "Students are receiving excessive homework from multiple subjects with overlapping deadlines, causing stress and burnout.",
    votes: 56,
    timestamp: hoursAgo(12),
    phase: "grade",
    group: "Grade 10",
    replies: [
      createReply("r13", "pro-argument", "Definitely! Sometimes I have 4 major assignments due the same week.", 18, 11),
      createReply("r14", "objection", "Teachers don't coordinate because they have their own curriculum requirements.", 12, 10.5, [], undefined, {
        text: "Establish a shared digital calendar where teachers can see all assignment deadlines and coordinate better.",
        solutionLevel: "school"
      }),
      createReply("r15", "proposal", "Create a homework cap policy - maximum 2 hours per night across all subjects.", 22, 10, [], undefined, {
        text: "Implement a homework coordination system with grade-level teacher meetings monthly.",
        solutionLevel: "ministries"
      }),
      createReply("r16", "pro-argument", "My grades are suffering because I can't give enough attention to each subject.", 14, 9),
      createReply("r17", "variant", "Students are receiving excessive homework from multiple subjects with overlapping deadlines. We need both a homework cap policy AND teacher coordination through a shared calendar system.", 20, 8, [], [
        { id: "r15", text: "Create a homework cap policy.", category: "proposal" },
        { id: "r14", text: "Teachers don't coordinate deadlines.", category: "objection" }
      ]),
    ],
  },
  {
    id: "5",
    type: "proposal",
    title: "Mental Health Support Program",
    description: "Establish regular access to school counselors and mental health resources for all students in our grade.",
    votes: 48,
    timestamp: hoursAgo(18),
    phase: "grade",
    group: "Grade 11",
    solutionLevel: "school",
    replies: [
      createReply("r18", "pro-argument", "This is so important! Many students struggle silently.", 16, 17),
      createReply("r19", "pro-argument", "Mental health should be treated as seriously as physical health.", 19, 16),
      createReply("r20", "objection", "We only have one counselor for 400 students. We need more staff first.", 13, 15.5, [], undefined, {
        text: "Partner with local mental health organizations to provide weekly group sessions and train peer support students.",
        solutionLevel: "school"
      }),
      createReply("r21", "proposal", "Add mental health education to the curriculum so everyone understands it better.", 11, 14),
      createReply("r22", "variant", "Establish regular access to school counselors and mental health resources, while also implementing peer support training and partnerships with external organizations to scale our capacity.", 17, 13, [], [
        { id: "r20", text: "We need more staff first.", category: "objection" },
        { id: "r21", text: "Add mental health education to curriculum.", category: "proposal" }
      ]),
    ],
  },
  {
    id: "6",
    type: "problem",
    title: "Outdated Computer Lab Equipment",
    description: "Computer lab machines are 8+ years old, frequently crash, and can't run modern software needed for coursework.",
    votes: 41,
    timestamp: hoursAgo(24),
    phase: "grade",
    group: "Grade 9",
    replies: [
      createReply("r23", "pro-argument", "We can't even run basic design software for our projects.", 12, 23),
      createReply("r24", "objection", "New computers are expensive. School budget may not allow it.", 8, 22, [], undefined, {
        text: "Apply for government education technology grants and partner with tech companies for donations.",
        solutionLevel: "ministries"
      }),
      createReply("r25", "proposal", "We could fundraise or seek corporate sponsorships for upgrades.", 15, 21),
      createReply("r26", "pro-argument", "This affects our ability to learn essential tech skills.", 10, 20),
      createReply("r27", "variant", "Computer lab machines are 8+ years old and can't run modern software. A phased upgrade approach combining fundraising, sponsorships, and grant applications would be most realistic.", 14, 19, [], [
        { id: "r25", text: "We could fundraise or seek corporate sponsorships.", category: "proposal" },
        { id: "r24", text: "Apply for government technology grants.", category: "objection" }
      ]),
    ],
  },

  // School Phase Concerns
  {
    id: "7",
    type: "problem",
    title: "Inadequate Bike Parking and Security",
    description: "There isn't enough covered bike parking, and multiple bikes have been stolen this semester. Students feel unsafe leaving their bikes.",
    votes: 73,
    timestamp: hoursAgo(30),
    phase: "school",
    group: "Whole School",
    replies: [
      createReply("r28", "pro-argument", "Three bikes from my grade were stolen last month alone!", 22, 29),
      createReply("r29", "objection", "Installing proper security costs money and requires construction permits.", 15, 28, [], undefined, {
        text: "Install CCTV cameras in bike areas and implement a registered lock system with student ID verification.",
        solutionLevel: "school"
      }),
      createReply("r30", "proposal", "Add more bike racks in well-lit areas near main entrances with camera coverage.", 28, 27),
      createReply("r31", "pro-argument", "Some students stopped biking to school because of theft concerns.", 19, 26),
      createReply("r32", "variant", "There isn't enough covered bike parking and bikes are being stolen. We need both expanded parking infrastructure AND security measures like cameras and better lighting.", 25, 24, [], [
        { id: "r30", text: "Add more bike racks in well-lit areas.", category: "proposal" },
        { id: "r29", text: "Install CCTV cameras in bike areas.", category: "objection" }
      ]),
      createReply("r33", "proposal", "Create a bike registration system with engraved IDs to deter theft.", 17, 23),
    ],
  },
  {
    id: "8",
    type: "proposal",
    title: "Extended Library Hours",
    description: "Open the library until 6 PM on weekdays and Saturday mornings to give students more study time and resource access.",
    votes: 67,
    timestamp: hoursAgo(36),
    phase: "school",
    group: "Whole School",
    solutionLevel: "school",
    replies: [
      createReply("r34", "pro-argument", "This would really help students who can't study well at home.", 24, 35),
      createReply("r35", "objection", "This requires hiring additional staff which might not be feasible budget-wise.", 18, 34, [], undefined, {
        text: "Implement a volunteer senior student program where upperclassmen can supervise in exchange for community service credits.",
        solutionLevel: "school"
      }),
      createReply("r36", "pro-argument", "Many students commute and could use the extra time before heading home.", 21, 33),
      createReply("r37", "proposal", "Start with extending hours just two days per week as a trial.", 16, 32),
      createReply("r38", "variant", "Open the library until 6 PM on weekdays with a hybrid staffing model using both paid staff and trained student volunteers to manage costs while meeting student needs.", 23, 30, [], [
        { id: "r35", text: "Implement a volunteer senior student program.", category: "objection" },
        { id: "r37", text: "Start with extending hours two days per week.", category: "proposal" }
      ]),
    ],
  },
  {
    id: "9",
    type: "problem",
    title: "Lack of Diverse Extracurricular Activities",
    description: "School mainly offers sports and music. Students interested in debate, robotics, entrepreneurship, etc. have no organized options.",
    votes: 61,
    timestamp: hoursAgo(48),
    phase: "school",
    group: "Whole School",
    replies: [
      createReply("r39", "pro-argument", "I'm interested in coding but there's no computer science club.", 19, 47),
      createReply("r40", "objection", "Teachers are already overworked and can't supervise more clubs.", 14, 46, [], undefined, {
        text: "Allow student-led clubs with faculty advisors in rotating supervision roles, reducing individual teacher burden.",
        solutionLevel: "school"
      }),
      createReply("r41", "proposal", "Survey students to find interests and create clubs based on demand.", 25, 45),
      createReply("r42", "pro-argument", "College applications look for diverse activities. We're at a disadvantage.", 17, 44),
      createReply("r43", "variant", "School mainly offers sports and music. By surveying student interests and implementing a student-led club model with rotating faculty supervision, we can expand activities without overwhelming teachers.", 22, 42, [], [
        { id: "r41", text: "Survey students to find interests.", category: "proposal" },
        { id: "r40", text: "Allow student-led clubs with rotating supervision.", category: "objection" }
      ]),
      createReply("r44", "proposal", "Partner with local organizations and professionals to mentor specialized clubs.", 20, 40),
    ],
  },
  {
    id: "10",
    type: "proposal",
    title: "Flexible Seating in Classrooms",
    description: "Implement flexible seating options including standing desks, bean bags, and collaborative tables to improve engagement and accommodate different learning styles.",
    votes: 54,
    timestamp: hoursAgo(54),
    phase: "school",
    group: "Whole School",
    solutionLevel: "ministries",
    replies: [
      createReply("r45", "pro-argument", "Different seating helps me focus better during long classes.", 16, 53),
      createReply("r46", "objection", "This is expensive and some students might abuse the privilege.", 11, 52, [], undefined, {
        text: "Start with a pilot program in 2-3 classrooms with clear usage guidelines and student feedback.",
        solutionLevel: "school"
      }),
      createReply("r47", "pro-argument", "Research shows flexible seating improves student engagement.", 18, 51),
      createReply("r48", "objection", "Teachers need training on managing flexible classrooms effectively.", 9, 50),
      createReply("r49", "variant", "Implement flexible seating options through a phased pilot program with teacher training and clear guidelines to ensure success before school-wide rollout.", 20, 48, [], [
        { id: "r46", text: "Start with a pilot program in 2-3 classrooms.", category: "objection" },
        { id: "r48", text: "Teachers need training on managing flexible classrooms.", category: "objection" }
      ]),
    ],
  },
  {
    id: "11",
    type: "counter-proposal",
    title: "Hybrid Learning Model Instead of Full Digital",
    description: "Rather than going fully digital, implement a hybrid model that combines digital tools with traditional methods to ensure accessibility.",
    votes: 45,
    timestamp: hoursAgo(60),
    phase: "school",
    group: "Whole School",
    referencedProblemId: "2",
    referencedObjectionId: "r6",
    referencedOriginalPostId: "2",
    solutionLevel: "school",
    replies: [
      createReply("r50", "pro-argument", "This addresses both innovation and accessibility concerns.", 15, 59),
      createReply("r51", "pro-argument", "Hybrid approaches are more realistic for our school's resources.", 13, 58),
      createReply("r52", "objection", "Managing two systems might be more complicated for teachers.", 8, 57),
      createReply("r53", "variant", "Implement a hybrid model with streamlined processes and teacher support tools to reduce complexity while maintaining accessibility benefits.", 12, 55, [], [
        { id: "r50", text: "This addresses both innovation and accessibility.", category: "pro-argument" },
        { id: "r52", text: "Managing two systems might be complicated.", category: "objection" }
      ]),
    ],
  },
  {
    id: "12",
    type: "problem",
    title: "Insufficient Bathroom Facilities During Peak Times",
    description: "Long queues during breaks, especially for girls' bathrooms. Students often late returning to class.",
    votes: 58,
    timestamp: hoursAgo(66),
    phase: "school",
    group: "Whole School",
    replies: [
      createReply("r54", "pro-argument", "I'm late to class at least twice a week because of bathroom lines.", 17, 65),
      createReply("r55", "proposal", "Stagger break times by grade to reduce peak usage.", 21, 64),
      createReply("r56", "objection", "The real problem is we need more bathrooms, which requires construction.", 14, 63, [], undefined, {
        text: "Convert underutilized spaces into additional bathroom facilities and renovate existing ones for better flow.",
        solutionLevel: "ministries"
      }),
      createReply("r57", "pro-argument", "Some students skip using bathrooms entirely to avoid being late.", 12, 62),
      createReply("r58", "variant", "Long bathroom queues could be addressed through both staggered break schedules AND converting available spaces into additional facilities for a comprehensive solution.", 19, 60, [], [
        { id: "r55", text: "Stagger break times by grade.", category: "proposal" },
        { id: "r56", text: "Convert underutilized spaces into bathrooms.", category: "objection" }
      ]),
    ],
  },
  {
    id: "13",
    type: "proposal",
    title: "Student-Led Sustainability Initiative",
    description: "Create a comprehensive recycling program, reduce single-use plastics, and implement energy-saving measures throughout the school.",
    votes: 71,
    timestamp: hoursAgo(72),
    phase: "school",
    group: "Whole School",
    solutionLevel: "school",
    replies: [
      createReply("r59", "pro-argument", "We should be teaching environmental responsibility through action.", 23, 71),
      createReply("r60", "pro-argument", "Other schools have successful programs we could model ours after.", 20, 70),
      createReply("r61", "objection", "Initial setup costs and ongoing maintenance require dedicated resources.", 15, 69, [], undefined, {
        text: "Apply for environmental grants and create a student sustainability committee to manage the program.",
        solutionLevel: "school"
      }),
      createReply("r62", "proposal", "Start small with recycling bins in cafeteria and expand from there.", 18, 68),
      createReply("r63", "variant", "Create a comprehensive sustainability program by starting with cafeteria recycling and progressively expanding while securing grant funding and building a student management committee.", 26, 66, [], [
        { id: "r62", text: "Start small with recycling bins in cafeteria.", category: "proposal" },
        { id: "r61", text: "Apply for environmental grants and create student committee.", category: "objection" }
      ]),
      createReply("r64", "pro-argument", "This could save the school money on energy bills long-term.", 16, 65),
    ],
  },
  {
    id: "14",
    type: "problem",
    title: "Ineffective Communication Between School and Parents",
    description: "Important information often reaches parents late or not at all. Current systems (email, printed notices) are inconsistent.",
    votes: 49,
    timestamp: hoursAgo(78),
    phase: "school",
    group: "Whole School",
    replies: [
      createReply("r65", "pro-argument", "My parents miss important dates because emails get buried.", 14, 77),
      createReply("r66", "proposal", "Implement a dedicated school app with push notifications for important updates.", 22, 76, [], undefined, {
        text: "Create a centralized communication platform with SMS backup for critical announcements.",
        solutionLevel: "ministries"
      }),
      createReply("r67", "objection", "Not all parents are comfortable with technology or have smartphones.", 10, 75),
      createReply("r68", "pro-argument", "Teachers spend too much time on communication instead of teaching.", 12, 74),
      createReply("r69", "variant", "Important information reaches parents inconsistently. A multi-channel approach combining a school app, SMS notifications, and traditional notices ensures all parents stay informed regardless of tech comfort.", 18, 72, [], [
        { id: "r66", text: "Implement a dedicated school app.", category: "proposal" },
        { id: "r67", text: "Not all parents are comfortable with technology.", category: "objection" }
      ]),
    ],
  },
  {
    id: "15",
    type: "proposal",
    title: "Peer Tutoring Program",
    description: "Establish a structured peer tutoring system where high-performing students help struggling classmates, supervised by teachers.",
    votes: 52,
    timestamp: hoursAgo(84),
    phase: "school",
    group: "Whole School",
    solutionLevel: "school",
    replies: [
      createReply("r70", "pro-argument", "Peer tutoring helped me improve my math grade last year.", 15, 83),
      createReply("r71", "pro-argument", "Students often understand concepts better when explained by peers.", 17, 82),
      createReply("r72", "objection", "Tutors need training and incentives to commit to helping others.", 11, 81, [], undefined, {
        text: "Offer community service credits and certificates for tutors, with monthly training sessions by teachers.",
        solutionLevel: "school"
      }),
      createReply("r73", "proposal", "Match tutors and students based on learning styles and subjects.", 13, 80),
      createReply("r74", "variant", "Establish a structured peer tutoring system with tutor training, community service incentives, and strategic matching based on learning styles to ensure program effectiveness.", 19, 78, [], [
        { id: "r72", text: "Offer community service credits with training sessions.", category: "objection" },
        { id: "r73", text: "Match tutors and students based on learning styles.", category: "proposal" }
      ]),
      createReply("r75", "pro-argument", "This builds both academic and social skills for everyone involved.", 14, 76),
    ],
  },
];
