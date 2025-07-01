const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

// Initialize database
const db = new sqlite3.Database('./leetcode_tracker.db');

// Sample problems data
const sampleProblems = [
  {
    leetcode_id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"]
  },
  {
    leetcode_id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math", "Recursion"]
  },
  {
    leetcode_id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["Hash Table", "String", "Sliding Window"]
  },
  {
    leetcode_id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"]
  },
  {
    leetcode_id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming"]
  },
  {
    leetcode_id: 15,
    title: "3Sum",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Sorting"]
  },
  {
    leetcode_id: 20,
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["String", "Stack"]
  },
  {
    leetcode_id: 21,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    tags: ["Linked List", "Recursion"]
  },
  {
    leetcode_id: 53,
    title: "Maximum Subarray",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming", "Divide and Conquer"]
  },
  {
    leetcode_id: 70,
    title: "Climbing Stairs",
    difficulty: "Easy",
    tags: ["Math", "Dynamic Programming", "Memoization"]
  },
  {
    leetcode_id: 121,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"]
  },
  {
    leetcode_id: 200,
    title: "Number of Islands",
    difficulty: "Medium",
    tags: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"]
  }
];

// Sample attempts data (will be created after problems are inserted)
const sampleAttempts = [
  { problem_index: 0, status: "solved", time_taken: 25, notes: "Used hash map approach, solved in one pass" },
  { problem_index: 0, status: "attempted", time_taken: 45, notes: "First attempt - got stuck on optimization" },
  { problem_index: 1, status: "solved", time_taken: 35, notes: "Linked list manipulation, careful with carry" },
  { problem_index: 2, status: "solved", time_taken: 30, notes: "Sliding window technique worked well" },
  { problem_index: 2, status: "attempted", time_taken: 60, notes: "First try - didn't think of sliding window" },
  { problem_index: 3, status: "stuck", time_taken: 90, notes: "Binary search is tricky, need more practice" },
  { problem_index: 4, status: "solved", time_taken: 40, notes: "DP approach, expand around centers" },
  { problem_index: 5, status: "attempted", time_taken: 55, notes: "Two pointers approach, almost got it" },
  { problem_index: 6, status: "solved", time_taken: 15, notes: "Stack implementation, straightforward" },
  { problem_index: 7, status: "solved", time_taken: 20, notes: "Recursive approach was clean" },
  { problem_index: 8, status: "solved", time_taken: 30, notes: "Kadane's algorithm - classic DP" },
  { problem_index: 9, status: "solved", time_taken: 18, notes: "Fibonacci pattern, easy DP" },
  { problem_index: 10, status: "solved", time_taken: 12, notes: "Track minimum and maximum profit" },
  { problem_index: 11, status: "attempted", time_taken: 75, notes: "DFS approach, got confused with implementation" }
];

function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  db.serialize(() => {
    let problemIds = [];

    // Insert problems
    console.log('📝 Inserting sample problems...');
    const problemStmt = db.prepare(`
      INSERT INTO problems (leetcode_id, title, difficulty, tags) 
      VALUES (?, ?, ?, ?)
    `);

    sampleProblems.forEach((problem, index) => {
      problemStmt.run([
        problem.leetcode_id,
        problem.title,
        problem.difficulty,
        JSON.stringify(problem.tags)
      ], function(err) {
        if (err) {
          console.error(`Error inserting problem ${problem.title}:`, err);
        } else {
          problemIds[index] = this.lastID;
          console.log(`✅ Added: ${problem.title} (ID: ${this.lastID})`);
        }
      });
    });

    problemStmt.finalize(() => {
      // Insert attempts after problems are inserted
      console.log('🎯 Inserting sample attempts...');
      const attemptStmt = db.prepare(`
        INSERT INTO attempts (id, problem_id, status, time_taken, notes, attempt_date) 
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      sampleAttempts.forEach((attempt, index) => {
        const problemId = problemIds[attempt.problem_index];
        if (problemId) {
          // Create attempts with different dates for better analytics
          const daysAgo = Math.floor(Math.random() * 30); // Random date within last 30 days
          const attemptDate = new Date();
          attemptDate.setDate(attemptDate.getDate() - daysAgo);

          attemptStmt.run([
            uuidv4(),
            problemId,
            attempt.status,
            attempt.time_taken,
            attempt.notes,
            attemptDate.toISOString()
          ], function(err) {
            if (err) {
              console.error(`Error inserting attempt:`, err);
            } else {
              console.log(`✅ Added attempt for problem ID ${problemId}: ${attempt.status} (${attempt.time_taken}m)`);
            }
          });
        }
      });

      attemptStmt.finalize(() => {
        console.log('🎉 Database seeding completed!');
        console.log('\n📊 Summary:');
        console.log(`- ${sampleProblems.length} problems added`);
        console.log(`- ${sampleAttempts.length} attempts added`);
        console.log('- Topic skills will be automatically calculated');
        console.log('\n🚀 You can now start the application with: npm run dev');
        
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('Database connection closed.');
          }
        });
      });
    });
  });
}

// Run the seeder
seedDatabase();