import { Concern, Reply } from "@/types/concern";

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

// Helper to create replies with references
const createReply = (
  id: string,
  category: "objection" | "proposal" | "pro-argument" | "variant" | "question",
  text: string,
  votes: number,
  daysAgo: number,
  replies: Reply[] = [],
  referencedReplies?: { id: string; text: string; category: "objection" | "proposal" | "pro-argument" | "variant" | "question" }[],
  counterProposal?: { text: string; postedAsConcern?: boolean; solutionLevel?: "school" | "ministries" },
  aspects?: ("problem" | "proposal")[]
): Reply => ({
  id,
  category,
  text,
  votes,
  replies,
  timestamp: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000),
  referencedReplies,
  counterProposal,
  aspects,
});

export const mockConcerns: Concern[] = [
  // Class Phase Concerns (Days 1-30 of the timeline, which is 88-58 days ago)
  {
    id: "1",
    type: "problem",
    title: "Cafeteria Food Quality Issues",
    description: "The food served in our cafeteria is often cold and lacks variety. Students are frequently complaining about limited healthy options.",
    votes: 34,
    timestamp: daysAgo(85),
    phase: "class",
    group: "Class 10A",
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
      createReply("r1", "objection", "I think the main issue is timing, not quality. Food is hot when served.", 8, 84.5),
      createReply("r2", "pro-argument", "Absolutely agree! I've noticed many students skip lunch because of this.", 12, 84.2),
      createReply("r3", "proposal", "We could propose a student feedback system where we vote on menu items weekly.", 15, 83.8, [], undefined, {
        text: "Create a monthly rotating menu based on student preferences collected through surveys.",
        solutionLevel: "school"
      }),
      createReply("r4", "variant", "The food served in our cafeteria is often cold and lacks variety, but we should also consider extending lunch break times to reduce crowding. This synthesis addresses both timing and variety concerns.", 10, 83.5, [], [
        { id: "r1", text: "I think the main issue is timing, not quality.", category: "objection" },
        { id: "r2", text: "Absolutely agree! I've noticed many students skip lunch.", category: "pro-argument" }
      ]),
      createReply("r4a", "question", "How many students actually eat in the cafeteria versus bringing their own lunch? Maybe the issue isn't as widespread as we think?", 5, 83.2, [
        createReply("r4a1", "pro-argument", "Good point! According to the student council survey, about 75% of students regularly use the cafeteria, so this affects most of us.", 3, 82.8)
      ]),
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
    group: "Class 9B",
    solutionLevel: "school",
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
      createReply("r5", "pro-argument", "This would help the environment and make it easier to keep track of deadlines.", 9, 81.5),
      createReply("r6", "objection", "Not all students have reliable internet access at home. This could be unfair.", 14, 81, [], undefined, {
        text: "Implement a hybrid system where students can use school computers during extended library hours for digital submissions.",
        postedAsConcern: true,
        solutionLevel: "school"
      }),
      createReply("r7", "pro-argument", "Digital submissions also allow teachers to provide faster feedback.", 7, 80.5),
      createReply("r8", "variant", "We should move to a fully digital assignment submission system with offline access capabilities, combining digital efficiency with accessibility for all students.", 11, 80, [], [
        { id: "r6", text: "Not all students have reliable internet access.", category: "objection" },
        { id: "r5", text: "This would help the environment.", category: "pro-argument" }
      ]),
      createReply("r8a", "question", "What platform would we use for this? Are there any free options that work well for schools?", 4, 79.5, [
        createReply("r8a1", "proposal", "Google Classroom is free and most students already have accounts. It integrates with Google Drive for easy file management.", 6, 79)
      ]),
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
    group: "Class 8C",
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
      createReply("r9", "pro-argument", "Yes! Half the class just stands around waiting for their turn.", 8, 77.5),
      createReply("r10", "proposal", "We could create a rotation system and extend PE class time.", 6, 77, [], undefined, {
        text: "Apply for school budget allocation to purchase additional sports equipment and storage facilities.",
        solutionLevel: "school"
      }),
      createReply("r11", "objection", "The real issue is that PE classes are too large. We need smaller groups.", 10, 76.5),
      createReply("r12", "variant", "Our class doesn't have enough sports equipment for PE lessons, but organizing equipment-sharing schedules between classes and purchasing multi-use items could help maximize what we have.", 7, 76, [], [
        { id: "r10", text: "We could create a rotation system.", category: "proposal" },
        { id: "r11", text: "PE classes are too large.", category: "objection" }
      ]),
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
    replies: [
      createReply("r12a", "pro-argument", "This would make everyone feel more involved in class decisions.", 6, 73.5),
      createReply("r12b", "objection", "Taking time from lessons might affect our curriculum coverage.", 4, 73),
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
    group: "Class 9B",
    replies: [
      createReply("r12c", "pro-argument", "It's hard to concentrate when you're freezing or sweating.", 7, 69.5),
      createReply("r12d", "proposal", "Request maintenance to fix the thermostat and check the HVAC system.", 5, 69),
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
    group: "Class 8C",
    solutionLevel: "school",
    replies: [
      createReply("r12e", "pro-argument", "This would encourage more reading during free time.", 5, 65.5),
      createReply("r12f", "proposal", "We could do a book drive where everyone brings books from home.", 6, 65),
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
    replies: [
      createReply("r12g", "pro-argument", "I always end up doing everything while others get the same grade.", 4, 61.5),
      createReply("r12h", "proposal", "Teachers should require individual contribution logs for group projects.", 7, 61),
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
    group: "Class 9B",
    replies: [
      createReply("r12i", "pro-argument", "Our bags are piled up and things get lost or damaged.", 3, 58.5),
      createReply("r12j", "proposal", "Install additional hooks and shelves along the classroom walls.", 4, 58),
    ],
  },

  // Grade Phase Concerns (Days 31-60 of the timeline, which is 58-28 days ago)
  {
    id: "4",
    type: "problem",
    title: "Homework Overload Across Subjects",
    description: "Students are receiving excessive homework from multiple subjects with overlapping deadlines, causing stress and burnout.",
    votes: 56,
    timestamp: daysAgo(56),
    phase: "grade",
    group: "Grade 10",
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
      createReply("r13", "pro-argument", "Definitely! Sometimes I have 4 major assignments due the same week.", 18, 55.5),
      createReply("r14", "objection", "Teachers don't coordinate because they have their own curriculum requirements.", 12, 55, [], undefined, {
        text: "Establish a shared digital calendar where teachers can see all assignment deadlines and coordinate better.",
        solutionLevel: "school"
      }),
      createReply("r15", "proposal", "Create a homework cap policy - maximum 2 hours per night across all subjects.", 22, 54.5, [], undefined, {
        text: "Implement a homework coordination system with grade-level teacher meetings monthly.",
        solutionLevel: "ministries"
      }),
      createReply("r16", "pro-argument", "My grades are suffering because I can't give enough attention to each subject.", 14, 54),
      createReply("r17", "variant", "Students are receiving excessive homework from multiple subjects with overlapping deadlines. We need both a homework cap policy AND teacher coordination through a shared calendar system.", 20, 53.5, [], [
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
    timestamp: daysAgo(52),
    phase: "grade",
    group: "Grade 11",
    solutionLevel: "school",
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
      createReply("r18", "pro-argument", "This is so important! Many students struggle silently.", 16, 51.5),
      createReply("r19", "pro-argument", "Mental health should be treated as seriously as physical health.", 19, 51),
      createReply("r20", "objection", "We only have one counselor for 400 students. We need more staff first.", 13, 50.5, [], undefined, {
        text: "Partner with local mental health organizations to provide weekly group sessions and train peer support students.",
        solutionLevel: "school"
      }),
      createReply("r21", "proposal", "Add mental health education to the curriculum so everyone understands it better.", 11, 50),
      createReply("r22", "variant", "Establish regular access to school counselors and mental health resources, while also implementing peer support training and partnerships with external organizations to scale our capacity.", 17, 49.5, [], [
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
    timestamp: daysAgo(48),
    phase: "grade",
    group: "Grade 9",
    variants: [
      {
        id: "v6-1",
        title: "Outdated Computer Lab Equipment",
        text: "Computer lab machines are 8+ years old, frequently crash, and can't run modern software needed for coursework.",
        votes: 10,
      },
      {
        id: "v6-2",
        title: "Computer Lab Equipment and BYOD Solution",
        text: "Computer lab machines are 8+ years old and frequently crash. We should apply for technology grants and also implement a BYOD (Bring Your Own Device) policy for students who have laptops.",
        votes: 18,
      },
      {
        id: "v6-3",
        title: "Multi-Phase Computer Lab Modernization",
        text: "Computer lab machines are outdated and can't run modern software. We propose applying for government grants, partnering with tech companies for donations, implementing BYOD policy, and using cloud-based software solutions as alternatives.",
        votes: 25,
      },
    ],
    replies: [
      createReply("r23", "pro-argument", "We can't even run basic design software for our projects.", 12, 47.5),
      createReply("r24", "objection", "New computers are expensive. School budget may not allow it.", 8, 47, [], undefined, {
        text: "Apply for government education technology grants and partner with tech companies for donations.",
        solutionLevel: "ministries"
      }),
      createReply("r25", "proposal", "We could fundraise or seek corporate sponsorships for upgrades.", 15, 46.5),
      createReply("r26", "pro-argument", "This affects our ability to learn essential tech skills.", 10, 46),
      createReply("r27", "variant", "Computer lab machines are 8+ years old and can't run modern software. A phased upgrade approach combining fundraising, sponsorships, and grant applications would be most realistic.", 14, 45.5, [], [
        { id: "r25", text: "We could fundraise or seek corporate sponsorships.", category: "proposal" },
        { id: "r24", text: "Apply for government technology grants.", category: "objection" }
      ]),
    ],
  },
  {
    id: "6a",
    type: "proposal",
    title: "Grade-Wide Study Groups",
    description: "Organize optional study groups for different subjects where students from all classes can help each other.",
    votes: 38,
    timestamp: daysAgo(44),
    phase: "grade",
    group: "Grade 10",
    solutionLevel: "school",
    replies: [
      createReply("r27a", "pro-argument", "I learn better when studying with peers from other classes.", 11, 43.5),
      createReply("r27b", "proposal", "Use empty classrooms after school for these study sessions.", 8, 43),
    ],
  },
  {
    id: "6b",
    type: "problem",
    title: "Inconsistent Grading Standards Across Classes",
    description: "Different teachers in our grade seem to have different grading standards for the same subject, making it unfair.",
    votes: 35,
    timestamp: daysAgo(40),
    phase: "grade",
    group: "Grade 11",
    replies: [
      createReply("r27c", "pro-argument", "My friend in another class gets better grades for similar work.", 9, 39.5),
      createReply("r27d", "objection", "Teachers should have flexibility in their assessment methods.", 6, 39),
      createReply("r27e", "proposal", "Create standardized rubrics that all teachers agree to use.", 12, 38.5, [], undefined, {
        text: "Implement grade-level teacher collaboration meetings to align grading standards.",
        solutionLevel: "school"
      }),
    ],
  },
  {
    id: "6c",
    type: "proposal",
    title: "Grade Assembly Once Per Month",
    description: "Hold monthly grade-wide assemblies where students can celebrate achievements and discuss grade-level concerns.",
    votes: 29,
    timestamp: daysAgo(36),
    phase: "grade",
    group: "Grade 9",
    solutionLevel: "school",
    replies: [
      createReply("r27f", "pro-argument", "This would help build grade unity and school spirit.", 8, 35.5),
      createReply("r27g", "objection", "Organizing 300+ students for an assembly takes a lot of time.", 5, 35),
    ],
  },
  {
    id: "6d",
    type: "problem",
    title: "Limited Access to Career Counseling",
    description: "Our grade has only brief career counseling sessions once a year. We need more guidance for future planning.",
    votes: 26,
    timestamp: daysAgo(33),
    phase: "grade",
    group: "Grade 11",
    replies: [
      createReply("r27h", "pro-argument", "I have no idea what I want to study and need more help exploring options.", 7, 32.5),
      createReply("r27i", "proposal", "Invite professionals from different fields to speak about their careers.", 9, 32),
    ],
  },
  {
    id: "6e",
    type: "problem",
    title: "Textbook Availability for All Subjects",
    description: "Some students don't have access to all required textbooks due to costs, creating learning disadvantages.",
    votes: 23,
    timestamp: daysAgo(30),
    phase: "grade",
    group: "Grade 10",
    replies: [
      createReply("r27j", "pro-argument", "I can't do homework properly without having the textbook at home.", 6, 29.5),
      createReply("r27k", "proposal", "Create a textbook lending library where students can check out books for the semester.", 8, 29, [], undefined, {
        text: "Partner with publishers for discounted digital textbook subscriptions for all students.",
        solutionLevel: "ministries"
      }),
    ],
  },

  // School Phase Concerns (Days 61-90 of the timeline, which is 28 days ago to now)
  {
    id: "7",
    type: "problem",
    title: "Inadequate Bike Parking and Security",
    description: "There isn't enough covered bike parking, and multiple bikes have been stolen this semester. Students feel unsafe leaving their bikes.",
    votes: 73,
    timestamp: daysAgo(27),
    phase: "school",
    group: "Whole School",
    replies: [
      createReply("r28", "pro-argument", "Three bikes from my grade were stolen last month alone!", 22, 26.5, [
        createReply("r28a", "pro-argument", "My bike was stolen and it was my only way to get to school. Now I have to take the bus.", 8, 26.3, [
          createReply("r28a1", "proposal", "Maybe we could start a bike-sharing program for students who lost theirs?", 5, 26.1)
        ]),
        createReply("r28b", "objection", "Are we sure it's theft and not just students forgetting where they parked?", 3, 26.2, [
          createReply("r28b1", "pro-argument", "The school office has received 12 official theft reports this semester alone.", 6, 26)
        ])
      ]),
      createReply("r29", "objection", "Installing proper security costs money and requires construction permits.", 15, 26, [
        createReply("r29a", "proposal", "We could apply for a safety grant from the district to cover the camera costs.", 9, 25.8),
        createReply("r29b", "objection", "Even with funding, construction permits take months to approve.", 4, 25.7)
      ], undefined, {
        text: "Install CCTV cameras in bike areas and implement a registered lock system with student ID verification.",
        solutionLevel: "school"
      }),
      createReply("r30", "proposal", "Add more bike racks in well-lit areas near main entrances with camera coverage.", 28, 25.5, [
        createReply("r30a", "pro-argument", "The front entrance has excellent lighting and is visible from the main office.", 11, 25.3),
        createReply("r30b", "objection", "That area is already crowded with student drop-offs in the morning.", 6, 25.2, [
          createReply("r30b1", "proposal", "We could designate specific times for bike parking vs car drop-off.", 7, 25)
        ])
      ]),
      createReply("r31", "pro-argument", "Some students stopped biking to school because of theft concerns.", 19, 25),
      createReply("r32", "variant", "There isn't enough covered bike parking and bikes are being stolen. We need both expanded parking infrastructure AND security measures like cameras and better lighting.", 25, 24.5, [], [
        { id: "r30", text: "Add more bike racks in well-lit areas.", category: "proposal" },
        { id: "r29", text: "Install CCTV cameras in bike areas.", category: "objection" }
      ]),
      createReply("r33", "proposal", "Create a bike registration system with engraved IDs to deter theft.", 17, 24, [
        createReply("r33a", "pro-argument", "Many universities use this system successfully.", 8, 23.8),
        createReply("r33b", "question", "Who would manage the registration database?", 4, 23.7, [
          createReply("r33b1", "proposal", "The student council could handle registrations during lunch breaks.", 6, 23.5)
        ])
      ]),
    ],
  },
  {
    id: "8",
    type: "proposal",
    title: "Extended Library Hours",
    description: "Open the library until 6 PM on weekdays and Saturday mornings to give students more study time and resource access.",
    votes: 67,
    timestamp: daysAgo(24),
    phase: "school",
    group: "Whole School",
    solutionLevel: "school",
    aspects: ["problem", "proposal"],
    variants: [
      {
        id: "v8-1",
        title: "Extended Library Hours (Weekday Focus)",
        text: "Open the library until 6 PM on weekdays only, focusing resources on consistent daily access.",
        votes: 28,
        aspects: ["problem", "proposal"],
      },
      {
        id: "v8-2",
        title: "Extended Library Hours with Weekend Priority",
        text: "Open the library until 6 PM on weekdays and all day Saturday (8 AM to 5 PM) to maximize weekend study opportunities.",
        votes: 39,
        aspects: ["problem", "proposal"],
      },
    ],
    replies: [
      createReply("r34", "pro-argument", "This would really help students who can't study well at home.", 24, 23.5, [
        createReply("r34a", "pro-argument", "My house is too noisy with my siblings. The library is the only quiet place I can focus.", 12, 23.3, [
          createReply("r34a1", "pro-argument", "Same here. I get so much more done when I can stay at school longer.", 7, 23.2)
        ]),
        createReply("r34b", "question", "How many students would actually use extended hours?", 5, 23.1, [
          createReply("r34b1", "proposal", "We could run a survey to gauge interest before implementing.", 9, 23)
        ])
      ]),
      createReply("r35", "objection", "This requires hiring additional staff which might not be feasible budget-wise.", 18, 23, [
        createReply("r35a", "objection", "Librarians also need work-life balance. We can't expect them to work 10-hour days.", 8, 22.8),
        createReply("r35b", "proposal", "What if we hire part-time staff specifically for evening shifts?", 6, 22.7)
      ], undefined, {
        text: "Implement a volunteer senior student program where upperclassmen can supervise in exchange for community service credits.",
        solutionLevel: "school"
      }),
      createReply("r36", "pro-argument", "Many students commute and could use the extra time before heading home.", 21, 22.5, [
        createReply("r36a", "pro-argument", "My bus doesn't leave until 6:30 anyway, so I just sit around waiting.", 10, 22.3)
      ]),
      createReply("r37", "proposal", "Start with extending hours just two days per week as a trial.", 16, 22, [
        createReply("r37a", "pro-argument", "A trial period would help us work out any issues before full implementation.", 9, 21.8),
        createReply("r37b", "proposal", "Make it Tuesdays and Thursdays when most students have heavy homework loads.", 7, 21.7)
      ], undefined, undefined, ["problem", "proposal"]),
      createReply("r38", "variant", "Open the library until 6 PM on weekdays with a hybrid staffing model using both paid staff and trained student volunteers to manage costs while meeting student needs.", 23, 21.5, [], [
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
    timestamp: daysAgo(21),
    phase: "school",
    group: "Whole School",
    replies: [
      createReply("r39", "pro-argument", "I'm interested in coding but there's no computer science club.", 19, 20.5),
      createReply("r40", "objection", "Teachers are already overworked and can't supervise more clubs.", 14, 20, [], undefined, {
        text: "Allow student-led clubs with faculty advisors in rotating supervision roles, reducing individual teacher burden.",
        solutionLevel: "school"
      }),
      createReply("r41", "proposal", "Survey students to find interests and create clubs based on demand.", 25, 19.5),
      createReply("r42", "pro-argument", "College applications look for diverse activities. We're at a disadvantage.", 17, 19),
      createReply("r43", "variant", "School mainly offers sports and music. By surveying student interests and implementing a student-led club model with rotating faculty supervision, we can expand activities without overwhelming teachers.", 22, 18.5, [], [
        { id: "r41", text: "Survey students to find interests.", category: "proposal" },
        { id: "r40", text: "Allow student-led clubs with rotating supervision.", category: "objection" }
      ]),
      createReply("r44", "proposal", "Partner with local organizations and professionals to mentor specialized clubs.", 20, 18),
    ],
  },
  {
    id: "10",
    type: "proposal",
    title: "Flexible Seating in Classrooms",
    description: "Implement flexible seating options including standing desks, bean bags, and collaborative tables to improve engagement and accommodate different learning styles.",
    votes: 54,
    timestamp: daysAgo(18),
    phase: "school",
    group: "Whole School",
    solutionLevel: "ministries",
    replies: [
      createReply("r45", "pro-argument", "Different seating helps me focus better during long classes.", 16, 17.5),
      createReply("r46", "objection", "This is expensive and some students might abuse the privilege.", 11, 17, [], undefined, {
        text: "Start with a pilot program in 2-3 classrooms with clear usage guidelines and student feedback.",
        solutionLevel: "school"
      }),
      createReply("r47", "pro-argument", "Research shows flexible seating improves student engagement.", 18, 16.5),
      createReply("r48", "objection", "Teachers need training on managing flexible classrooms effectively.", 9, 16),
      createReply("r49", "variant", "Implement flexible seating options through a phased pilot program with teacher training and clear guidelines to ensure success before school-wide rollout.", 20, 15.5, [], [
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
    timestamp: daysAgo(15),
    phase: "school",
    group: "Whole School",
    referencedProblemId: "2",
    referencedObjectionId: "r6",
    referencedOriginalPostId: "2",
    solutionLevel: "school",
    replies: [
      createReply("r50", "pro-argument", "This addresses both innovation and accessibility concerns.", 15, 14.5),
      createReply("r51", "pro-argument", "Hybrid approaches are more realistic for our school's resources.", 13, 14),
      createReply("r52", "objection", "Managing two systems might be more complicated for teachers.", 8, 13.5),
      createReply("r53", "variant", "Implement a hybrid model with streamlined processes and teacher support tools to reduce complexity while maintaining accessibility benefits.", 12, 13, [], [
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
    timestamp: daysAgo(12),
    phase: "school",
    group: "Whole School",
    replies: [
      createReply("r54", "pro-argument", "I'm late to class at least twice a week because of bathroom lines.", 17, 11.5),
      createReply("r55", "proposal", "Stagger break times by grade to reduce peak usage.", 21, 11),
      createReply("r56", "objection", "The real problem is we need more bathrooms, which requires construction.", 14, 10.5, [], undefined, {
        text: "Convert underutilized spaces into additional bathroom facilities and renovate existing ones for better flow.",
        solutionLevel: "ministries"
      }),
      createReply("r57", "pro-argument", "Some students skip using bathrooms entirely to avoid being late.", 12, 10),
      createReply("r58", "variant", "Long bathroom queues could be addressed through both staggered break schedules AND converting available spaces into additional facilities for a comprehensive solution.", 19, 9.5, [], [
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
    timestamp: daysAgo(9),
    phase: "school",
    group: "Whole School",
    solutionLevel: "school",
    replies: [
      createReply("r59", "pro-argument", "We should be teaching environmental responsibility through action.", 23, 8.5, [
        createReply("r59a", "pro-argument", "Climate change education is pointless if we don't practice what we preach.", 11, 8.3, [
          createReply("r59a1", "pro-argument", "Students will be more engaged in science class when they see real-world applications.", 6, 8.2)
        ]),
        createReply("r59b", "proposal", "We could partner with local environmental organizations for guidance.", 8, 8.1)
      ]),
      createReply("r60", "pro-argument", "Other schools have successful programs we could model ours after.", 20, 8, [
        createReply("r60a", "question", "Which schools should we look at as examples?", 7, 7.8, [
          createReply("r60a1", "proposal", "Lincoln High reduced their waste by 60% in two years with a similar program.", 10, 7.7)
        ])
      ]),
      createReply("r61", "objection", "Initial setup costs and ongoing maintenance require dedicated resources.", 15, 7.5, [
        createReply("r61a", "objection", "Someone needs to empty recycling bins daily and transport materials. That's labor costs.", 6, 7.3),
        createReply("r61b", "proposal", "Students could volunteer for recycling duty as part of a school service requirement.", 9, 7.2, [
          createReply("r61b1", "pro-argument", "This teaches responsibility and gives students ownership of the program.", 7, 7.1)
        ])
      ], undefined, {
        text: "Apply for environmental grants and create a student sustainability committee to manage the program.",
        solutionLevel: "school"
      }),
      createReply("r62", "proposal", "Start small with recycling bins in cafeteria and expand from there.", 18, 7, [
        createReply("r62a", "pro-argument", "Testing in one area lets us fix problems before scaling up.", 8, 6.8)
      ]),
      createReply("r63", "variant", "Create a comprehensive sustainability program by starting with cafeteria recycling and progressively expanding while securing grant funding and building a student management committee.", 26, 6.5, [], [
        { id: "r62", text: "Start small with recycling bins in cafeteria.", category: "proposal" },
        { id: "r61", text: "Apply for environmental grants and create student committee.", category: "objection" }
      ]),
      createReply("r64", "pro-argument", "This could save the school money on energy bills long-term.", 16, 6, [
        createReply("r64a", "proposal", "LED bulb replacements alone could save thousands per year.", 7, 5.8)
      ]),
    ],
  },
  {
    id: "14",
    type: "problem",
    title: "Ineffective Communication Between School and Parents",
    description: "Important information often reaches parents late or not at all. Current systems (email, printed notices) are inconsistent.",
    votes: 49,
    timestamp: daysAgo(6),
    phase: "school",
    group: "Whole School",
    replies: [
      createReply("r65", "pro-argument", "My parents miss important dates because emails get buried.", 14, 5.5),
      createReply("r66", "proposal", "Implement a dedicated school app with push notifications for important updates.", 22, 5, [], undefined, {
        text: "Create a centralized communication platform with SMS backup for critical announcements.",
        solutionLevel: "ministries"
      }),
      createReply("r67", "objection", "Not all parents are comfortable with technology or have smartphones.", 10, 4.5),
      createReply("r68", "pro-argument", "Teachers spend too much time on communication instead of teaching.", 12, 4),
      createReply("r69", "variant", "Important information reaches parents inconsistently. A multi-channel approach combining a school app, SMS notifications, and traditional notices ensures all parents stay informed regardless of tech comfort.", 18, 3.5, [], [
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
    timestamp: daysAgo(3),
    phase: "school",
    group: "Whole School",
    solutionLevel: "school",
    replies: [
      createReply("r70", "pro-argument", "Peer tutoring helped me improve my math grade last year.", 15, 2.5),
      createReply("r71", "pro-argument", "Students often understand concepts better when explained by peers.", 17, 2),
      createReply("r72", "objection", "Tutors need training and incentives to commit to helping others.", 11, 1.5, [], undefined, {
        text: "Offer community service credits and certificates for tutors, with monthly training sessions by teachers.",
        solutionLevel: "school"
      }),
      createReply("r73", "proposal", "Match tutors and students based on learning styles and subjects.", 13, 1),
      createReply("r74", "variant", "Establish a structured peer tutoring system with tutor training, community service incentives, and strategic matching based on learning styles to ensure program effectiveness.", 19, 0.5, [], [
        { id: "r72", text: "Offer community service credits with training sessions.", category: "objection" },
        { id: "r73", text: "Match tutors and students based on learning styles.", category: "proposal" }
      ]),
      createReply("r75", "pro-argument", "This builds both academic and social skills for everyone involved.", 14, 0.3),
    ],
  },
];
