export class CourseDetail {
	generalInfo: {
		major: string; // cs (or CS)
		courseNumber: string; // 1331
		credit: string; // 3 and up
		prerequisite: string; // Tricky one, can skip for now. (example: require (MATH1100 and MATH1101) or (MATH2010) => (MATH1100&&MATH1101)||(MATH2010))
	}

	// List of sections of the course (Ex: CS1331 have different section like A1 A2 A3 B1 B2)
	sectionInfo: 
	[
		{
			sectionName: string; // A1;
			professor: string;
			crn: string; // 12345

			// Some classes have more than 1 location and time (like CS 2050)
			classInfo: 
			[
				{
					time: string // MWF|11001200
					location: string // Clough 152
				}
			];
		}
	];
}