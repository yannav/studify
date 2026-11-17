/*
  Every string on the marketing pages and the seed data for the demo app.
  Images go through IMAGES so you can swap in your own photography in one place.
*/

export const BRAND = {
  name: 'Cramly',
  tagline: 'AI study assistant',
  email: 'hello@cramly.app',
}

export const IMAGES = {
  hero: '/images/hero.webp',
  upload: '/images/feature-upload.webp',
  cards: '/images/feature-cards.webp',
  quiz: '/images/feature-quiz.webp',
  about: '/images/about.webp',
  cta: '/images/cta.webp',
  mascot: '/images/mascot.webp',
}

export const NAV = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
]

export const HERO = {
  titleTop: 'Cramly AI',
  titleBottom: 'Study Assistant',
  lede: 'Cramly is your study partner that turns your notes into answers, flashcards and practice tests.',
  cta: 'Upload File',
  sample: 'Try a sample file',
  caption: 'Upload your file to Cramly and it will help you prepare for the exam quickly and painlessly.',
  files: [
    { kind: 'png', label: 'PNG File', lead: 'Snap a whiteboard', body: 'or a page of handwritten notes and Cramly reads it like text.' },
    { kind: 'doc', label: 'DOC File', lead: 'Drop in your essay drafts', body: 'and lecture notes to get a summary and key terms.' },
    { kind: 'pdf', label: 'PDF File', lead: 'Easily upload', body: 'your PDF file to begin analysing, quizzing or storing it securely in seconds.' },
  ] as const,
}

export const FEATURES = {
  eyebrow: 'Features',
  title: 'Everything between your notes and a passing grade',
  lede: 'One upload gives you a tutor that has read the material, a deck of flashcards and a practice test.',
  items: [
    { image: 'upload' as const, title: 'Reads anything you study from', body: 'PDFs, slides, Word documents and photos of handwritten notes. Cramly keeps page numbers, so every answer points back to the source.' },
    { image: 'cards' as const, title: 'Flashcards that know when to come back', body: 'Spaced repetition schedules each card for the moment you are about to forget it. Ten minutes a day beats a night of cramming.' },
    { image: 'quiz' as const, title: 'Practice tests with explanations', body: 'Multiple-choice questions written from your material, with a short reason for every answer so mistakes turn into understanding.' },
  ],
  extras: [
    { icon: 'message' as const, title: 'Ask the tutor', body: 'Questions in plain language, answers with citations.' },
    { icon: 'lock' as const, title: 'Private by default', body: 'Your files are never used to train models.' },
    { icon: 'languages' as const, title: '30 languages', body: 'Study in the language your course is taught in.' },
    { icon: 'timer' as const, title: 'Exam countdown', body: 'Daily goals sized to the days you have left.' },
  ],
}

export const STEPS = {
  eyebrow: 'How it works',
  title: 'From upload to exam-ready in three steps',
  items: [
    { n: '01', title: 'Upload your material', body: 'Lecture slides, a textbook chapter or a photo of the board. Up to 25 MB per file on the free plan.' },
    { n: '02', title: 'Cramly builds your study pack', body: 'A summary, key points, a flashcard deck and a practice quiz, in about ten seconds.' },
    { n: '03', title: 'Study with a tutor beside you', body: 'Ask questions, review cards when they are due and track your score as the exam gets closer.' },
  ],
  demo: [
    { from: 'you' as const, text: 'What is the difference between mitosis and meiosis?' },
    { from: 'cramly' as const, text: 'Mitosis makes two identical cells for growth and repair. Meiosis makes four different sex cells, with crossing over adding variation.', cite: 'p. 3, table 1.2' },
    { from: 'you' as const, text: 'Make me 5 flashcards on that' },
  ],
}

export const STATS = [
  { value: 2.4, suffix: 'M', label: 'files studied', decimals: 1 },
  { value: 38, suffix: '%', label: 'average score lift after two weeks', decimals: 0 },
  { value: 11, suffix: ' min', label: 'median daily study time', decimals: 0 },
  { value: 4.8, suffix: '/5', label: 'rating from 19,000 students', decimals: 1 },
]

export const TESTIMONIALS = [
  { quote: 'I uploaded three weeks of organic chemistry slides the night before the midterm. The quiz caught every gap I had.', name: 'Amara O.', role: 'Pharmacy, second year' },
  { quote: 'The citations are the reason I trust it. Every answer says which page it came from, so I can check.', name: 'Jonas W.', role: 'Law, final year' },
  { quote: 'Flashcards used to take me longer to make than to learn. Now the deck is ready before I finish my coffee.', name: 'Priya S.', role: 'A-level biology' },
]

export type Plan = {
  id: 'free' | 'plus' | 'team'
  name: string
  monthly: number
  yearly: number
  blurb: string
  cta: string
  featured?: boolean
  features: string[]
}

export const PLANS: Plan[] = [
  { id: 'free', name: 'Free', monthly: 0, yearly: 0, blurb: 'For trying Cramly on one course.', cta: 'Start free', features: ['3 uploads a month', 'Files up to 25 MB', '50 tutor questions a day', 'Flashcards and quizzes'] },
  { id: 'plus', name: 'Plus', monthly: 9, yearly: 7, blurb: 'For a full timetable of courses.', cta: 'Start 7-day trial', featured: true, features: ['Unlimited uploads', 'Files up to 200 MB', 'Unlimited tutor questions', 'Exam countdown planner', 'Export decks to Anki'] },
  { id: 'team', name: 'Study group', monthly: 24, yearly: 19, blurb: 'For up to six classmates.', cta: 'Create a group', features: ['Everything in Plus', '6 members', 'Shared library and decks', 'Group quiz battles'] },
]

export const COMPARE: { label: string; values: [string | boolean, string | boolean, string | boolean] }[] = [
  { label: 'Uploads per month', values: ['3', 'Unlimited', 'Unlimited'] },
  { label: 'Largest file', values: ['25 MB', '200 MB', '200 MB'] },
  { label: 'Tutor questions', values: ['50 a day', 'Unlimited', 'Unlimited'] },
  { label: 'Flashcards with spaced repetition', values: [true, true, true] },
  { label: 'Practice quizzes', values: [true, true, true] },
  { label: 'Handwriting recognition', values: [false, true, true] },
  { label: 'Exam countdown planner', values: [false, true, true] },
  { label: 'Anki and CSV export', values: [false, true, true] },
  { label: 'Shared library', values: [false, false, true] },
  { label: 'Group quiz battles', values: [false, false, true] },
]

export const FAQ = [
  { q: 'Does Cramly make things up?', a: 'Cramly answers only from the files you upload and cites the page each answer came from. When something is not in your material, it says so instead of guessing.' },
  { q: 'Which files can I upload?', a: 'PDF, Word, PowerPoint, plain text and Markdown, plus PNG or JPG photos of notes and whiteboards. Free accounts can upload files up to 25 MB.' },
  { q: 'Are my notes private?', a: 'Yes. Files are encrypted at rest, visible only to you (or your study group), and never used to train any model. Delete a file and it is gone.' },
  { q: 'Is it allowed by my school?', a: 'Cramly is a study tool, like flashcards or a tutor. It does not write coursework for you. Check your course rules for exams and graded assignments.' },
  { q: 'Can I cancel any time?', a: 'Yes. Plans renew monthly or yearly and you can cancel from Settings. Your library stays readable on the free plan.' },
]

export const ABOUT = {
  eyebrow: 'About Cramly',
  title: 'We build the study partner we wanted at 2 a.m. before finals',
  lede: 'Cramly started in a university library in 2024, when three students got tired of rewriting slides into flashcards. Today it helps students in 140 countries prepare for exams with less stress and more sleep.',
  values: [
    { title: 'Your material, not the internet', body: 'Answers come from what you uploaded, with the page number. Studying should make you surer, not more confused.' },
    { title: 'Learning over shortcuts', body: 'We help you understand and remember. We do not write essays or sit exams for anyone.' },
    { title: 'Private by design', body: 'Notes are personal. We never sell data or train models on your files.' },
  ],
  numbers: [
    { value: '2024', label: 'founded' },
    { value: '140', label: 'countries' },
    { value: '31', label: 'people on the team' },
  ],
  contactTitle: 'Say hello',
  contactLede: 'Questions, school partnerships or press. We answer within two working days.',
}

export const CTA = {
  title: 'Your exam is closer than it looks',
  lede: 'Upload one file and see your study pack in ten seconds. No card needed.',
  primary: 'Get started free',
  newsletterTitle: 'Study tips, once a fortnight',
  newsletterLede: 'Short, research-backed techniques. Unsubscribe whenever you like.',
}

export const FOOTER = {
  blurb: 'The AI study assistant that turns your notes into answers, flashcards and practice tests.',
  columns: [
    { title: 'Product', links: [{ label: 'Features', href: '/#features' }, { label: 'How it works', href: '/#how-it-works' }, { label: 'Pricing', href: '/pricing' }, { label: 'Open the app', href: '/app' }] },
    { title: 'Company', links: [{ label: 'About', href: '/about' }, { label: 'Contact', href: '/about#contact' }, { label: 'Style guide', href: '/styleguide' }] },
    { title: 'Account', links: [{ label: 'Log in', href: '/login' }, { label: 'Sign up', href: '/signup' }] },
  ],
  legal: '© 2026 Cramly. Study responsibly.',
}

export const AUTH = {
  loginTitle: 'Welcome back',
  loginLede: 'Pick up where you left off. Your library is waiting.',
  signupTitle: 'Create your account',
  signupLede: 'Free forever for one course. Upgrade when your timetable fills up.',
  aside: 'Students who review with Cramly for 10 minutes a day remember twice as much a week later.',
}
