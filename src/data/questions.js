export const QUIZ_CATEGORIES = [
  {
    id: 'cs',
    name: 'Computer Science',
    icon: 'Terminal',
    color: '#8B5CF6',
    description: 'Data structures, web algorithms, programming concepts, and tech history.',
    questionCount: 5,
  },
  {
    id: 'science',
    name: 'Science & Space',
    icon: 'Atom',
    color: '#22D3EE',
    description: 'Cosmic phenomena, physics principles, quantum mechanics, and planetary discovery.',
    questionCount: 5,
  },
  {
    id: 'gk',
    name: 'General Knowledge',
    icon: 'Globe',
    color: '#22C55E',
    description: 'World history, geography, iconic inventions, and culture trivia.',
    questionCount: 5,
  },
  {
    id: 'daily',
    name: 'Daily Challenge',
    icon: 'Flame',
    color: '#F59E0B',
    description: 'Rotating mix of brain teasers and speed trivia for bonus ST points!',
    questionCount: 5,
  }
];

export const QUIZ_DATA = {
  cs: [
    {
      id: 'cs-1',
      question: 'Which data structure follows the Last-In, First-Out (LIFO) principle?',
      options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
      correctIndex: 1,
      explanation: 'A Stack stores elements where the last element added is the first one removed (LIFO), just like a stack of plates.'
    },
    {
      id: 'cs-2',
      question: 'In computer science, what does the time complexity O(1) signify?',
      options: ['Linear time', 'Logarithmic time', 'Constant time', 'Quadratic time'],
      correctIndex: 2,
      explanation: 'O(1) means constant time complexity: execution time stays the same regardless of input size.'
    },
    {
      id: 'cs-3',
      question: 'Which protocol is responsible for securely transmitting encrypted data across web browsers?',
      options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
      correctIndex: 2,
      explanation: 'HTTPS (Hypertext Transfer Protocol Secure) encrypts communication using TLS/SSL.'
    },
    {
      id: 'cs-4',
      question: 'What is the primary role of the Virtual DOM in React?',
      options: [
        'To bypass JavaScript execution',
        'To minimize direct manipulations of the actual browser DOM',
        'To store user authentication cookies',
        'To replace standard CSS styling'
      ],
      correctIndex: 1,
      explanation: 'React compares the Virtual DOM with previous snapshots (diffing) and updates only the necessary parts of the real DOM for high performance.'
    },
    {
      id: 'cs-5',
      question: 'Which programming language was created by Brendan Eich in just 10 days in 1995?',
      options: ['Python', 'Java', 'JavaScript', 'C++'],
      correctIndex: 2,
      explanation: 'JavaScript was created by Brendan Eich in May 1995 while working at Netscape Communications.'
    }
  ],
  science: [
    {
      id: 'sci-1',
      question: 'What is the approximate speed of light in a vacuum?',
      options: ['150,000 km/s', '300,000 km/s', '500,000 km/s', '1,000,000 km/s'],
      correctIndex: 1,
      explanation: 'Light travels at approximately 299,792 kilometers per second (~300,000 km/s) in vacuum.'
    },
    {
      id: 'sci-2',
      question: 'Which planet in our solar system has the most prominent and visible ring system?',
      options: ['Jupiter', 'Saturn', 'Neptune', 'Uranus'],
      correctIndex: 1,
      explanation: 'Saturn features the most extensive and visible planetary ring system, composed primarily of water ice particles and rocky debris.'
    },
    {
      id: 'sci-3',
      question: 'What is the most abundant chemical element in the observable universe?',
      options: ['Oxygen', 'Helium', 'Hydrogen', 'Carbon'],
      correctIndex: 2,
      explanation: 'Hydrogen makes up about 75% of the baryonic mass of the entire universe.'
    },
    {
      id: 'sci-4',
      question: 'What fundamental particle carries electromagnetic force in quantum physics?',
      options: ['Photon', 'Electron', 'Quark', 'Neutron'],
      correctIndex: 0,
      explanation: 'Photons are massless gauge bosons that mediate the electromagnetic interaction.'
    },
    {
      id: 'sci-5',
      question: 'What is the powerhouse organelle of eukaryotic biological cells?',
      options: ['Ribosome', 'Mitochondria', 'Golgi Apparatus', 'Endoplasmic Reticulum'],
      correctIndex: 1,
      explanation: 'Mitochondria produce adenosine triphosphate (ATP), the chemical energy currency of cells.'
    }
  ],
  gk: [
    {
      id: 'gk-1',
      question: 'Which is the largest ocean on Earth by surface area?',
      options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
      correctIndex: 3,
      explanation: 'The Pacific Ocean covers over 60 million square miles, comprising more than 30% of Earth’s surface.'
    },
    {
      id: 'gk-2',
      question: 'Who painted the famous Mona Lisa masterpiece?',
      options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Michelangelo'],
      correctIndex: 1,
      explanation: 'Leonardo da Vinci created the Mona Lisa in the early 16th century during the Italian Renaissance.'
    },
    {
      id: 'gk-3',
      question: 'Which continent is home to the Amazon Rainforest?',
      options: ['Africa', 'South America', 'Asia', 'North America'],
      correctIndex: 1,
      explanation: 'The Amazon Rainforest spans across 9 nations in South America, primarily within Brazil.'
    },
    {
      id: 'gk-4',
      question: 'In what year was the World Wide Web introduced to the public by Tim Berners-Lee?',
      options: ['1985', '1991', '1995', '2000'],
      correctIndex: 1,
      explanation: 'Tim Berners-Lee released the World Wide Web project to the public on the Internet in August 1991.'
    },
    {
      id: 'gk-5',
      question: 'Which metal is liquid at standard room temperature and pressure?',
      options: ['Mercury', 'Sodium', 'Lead', 'Titanium'],
      correctIndex: 0,
      explanation: 'Mercury (element symbol Hg) has a melting point of -38.83°C, remaining liquid at room temperature.'
    }
  ],
  daily: [
    {
      id: 'day-1',
      question: 'If you have a 3-liter bucket and a 5-liter bucket, how many steps does it take to measure exactly 4 liters?',
      options: ['4 steps', '6 steps', '8 steps', 'Impossible'],
      correctIndex: 1,
      explanation: 'Fill 5L -> pour into 3L (2L left in 5L). Empty 3L -> transfer 2L into 3L -> fill 5L -> fill 3L (leaving exactly 4L in 5L bucket!).'
    },
    {
      id: 'day-2',
      question: 'Which gaming character is renowned as the heroic "Blue Blur" collecting golden rings?',
      options: ['Mega Man', 'Sonic the Hedgehog', 'Sub-Zero', 'Crash Bandicoot'],
      correctIndex: 1,
      explanation: 'Sonic the Hedgehog was introduced by SEGA in 1991 as the supersonic Blue Blur.'
    },
    {
      id: 'day-3',
      question: 'What does AI stand for in modern technology and computer science?',
      options: ['Automated Interface', 'Artificial Intelligence', 'Algorithmic Integration', 'Applied Indexing'],
      correctIndex: 1,
      explanation: 'Artificial Intelligence (AI) refers to computer systems engineered to perform tasks requiring cognitive reasoning.'
    },
    {
      id: 'day-4',
      question: 'Which legendary game created by Alexey Pajitnov involves falling geometric tetromino blocks?',
      options: ['Pong', 'Tetris', 'Space Invaders', 'Breakout'],
      correctIndex: 1,
      explanation: 'Tetris was designed and programmed by Soviet software engineer Alexey Pajitnov in 1984.'
    },
    {
      id: 'day-5',
      question: 'In gaming terminology, what does FPS stand for?',
      options: ['Frames Per Second or First-Person Shooter', 'Fast Power Strike', 'Final Player System', 'Free Play Stage'],
      correctIndex: 0,
      explanation: 'FPS stands for either "Frames Per Second" (performance metric) or "First-Person Shooter" (game genre).'
    }
  ]
};
