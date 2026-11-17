/*
  Study packs: what Cramly "extracts" from a file. The browser and the Worker
  both import this module. A real product would build a pack from the
  uploaded file with a model; here every upload is matched to one of these
  hand-written packs (see `packForFile`), so the demo works offline and costs
  nothing. Replace `packForFile` and `answer` in src/worker/index.ts to wire
  in your own model.
*/

export type Card = { id: string; front: string; back: string }
export type Question = { id: string; prompt: string; options: string[]; answer: number; why: string }
export type Answer = { keywords: string[]; text: string; cite: string }

export type Pack = {
  id: string
  subject: string
  title: string
  pages: number
  summary: string
  keyPoints: string[]
  suggestions: string[]
  answers: Answer[]
  cards: Card[]
  quiz: Question[]
}

export const PACKS: Pack[] = [
  {
    id: 'cell-division',
    subject: 'Biology',
    title: 'Cell Division: Mitosis and Meiosis',
    pages: 14,
    summary:
      'How one cell becomes two identical cells (mitosis) or four genetically different sex cells (meiosis), the phases of each and why the difference matters for growth, repair and inheritance.',
    keyPoints: [
      'Mitosis gives 2 identical diploid cells; meiosis gives 4 different haploid cells.',
      'Phases of mitosis: prophase, metaphase, anaphase, telophase, then cytokinesis.',
      'Crossing over in prophase I is the main source of new allele combinations.',
      'Errors in chromosome separation (non-disjunction) cause conditions like trisomy 21.',
    ],
    suggestions: ['What is the difference between mitosis and meiosis?', 'Explain the phases of mitosis', 'Why does crossing over matter?'],
    answers: [
      {
        keywords: ['difference', 'compare', 'vs', 'versus', 'mitosis and meiosis'],
        text:
          'Mitosis makes **two identical diploid cells** and is used for growth and repair. Meiosis makes **four genetically different haploid cells** (gametes) through two divisions. The key differences: number of divisions (1 vs 2), chromosome number in the daughters (2n vs n), and genetic variation (none vs crossing over plus independent assortment).',
        cite: 'p. 3, table 1.2',
      },
      {
        keywords: ['phase', 'phases', 'stages', 'pmat', 'prophase', 'metaphase', 'anaphase', 'telophase'],
        text:
          'Remember **PMAT**. Prophase: chromosomes condense and the spindle forms. Metaphase: chromosomes line up on the cell equator. Anaphase: sister chromatids are pulled to opposite poles. Telophase: nuclear membranes re-form. Cytokinesis then splits the cytoplasm.',
        cite: 'p. 5, figure 2.1',
      },
      {
        keywords: ['crossing', 'over', 'variation', 'chiasma', 'recombination'],
        text:
          'During **prophase I** homologous chromosomes pair up and swap sections at points called chiasmata. That shuffles alleles, so each gamete carries a new combination. Together with independent assortment it explains why siblings differ.',
        cite: 'p. 9',
      },
      {
        keywords: ['nondisjunction', 'non-disjunction', 'error', 'down', 'trisomy'],
        text:
          'Non-disjunction is when chromosomes fail to separate in anaphase. A gamete ends up with an extra or missing chromosome. If an egg with two copies of chromosome 21 is fertilised, the result is **trisomy 21**.',
        cite: 'p. 12',
      },
      {
        keywords: ['summary', 'summarise', 'summarize', 'tldr', 'overview', 'explain'],
        text:
          'In one line: **mitosis copies, meiosis mixes.** Mitosis keeps the chromosome number and makes clones for growth and repair; meiosis halves it and creates variation for reproduction.',
        cite: 'p. 1',
      },
    ],
    cards: [
      { id: 'cd1', front: 'What does mitosis produce?', back: 'Two genetically identical diploid daughter cells.' },
      { id: 'cd2', front: 'What does meiosis produce?', back: 'Four genetically different haploid cells (gametes).' },
      { id: 'cd3', front: 'Order of the mitosis phases', back: 'Prophase, metaphase, anaphase, telophase (PMAT), then cytokinesis.' },
      { id: 'cd4', front: 'What happens in metaphase?', back: 'Chromosomes line up along the equator of the cell.' },
      { id: 'cd5', front: 'What happens in anaphase?', back: 'Sister chromatids are pulled to opposite poles by spindle fibres.' },
      { id: 'cd6', front: 'When does crossing over happen?', back: 'Prophase I of meiosis, between homologous chromosomes.' },
      { id: 'cd7', front: 'Define haploid', back: 'A cell with one set of chromosomes (n). Human gametes have 23.' },
      { id: 'cd8', front: 'What is non-disjunction?', back: 'Chromosomes failing to separate, leaving a cell with too many or too few.' },
    ],
    quiz: [
      { id: 'cq1', prompt: 'How many cells does one round of meiosis produce?', options: ['One', 'Two', 'Four', 'Eight'], answer: 2, why: 'Meiosis has two divisions, so one cell becomes four.' },
      { id: 'cq2', prompt: 'In which phase do chromosomes line up on the equator?', options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'], answer: 1, why: 'Metaphase: think "middle".' },
      { id: 'cq3', prompt: 'Crossing over takes place during…', options: ['Prophase I', 'Metaphase II', 'Anaphase of mitosis', 'Cytokinesis'], answer: 0, why: 'Homologous pairs exchange sections in prophase I.' },
      { id: 'cq4', prompt: 'Which process is used to repair damaged skin?', options: ['Meiosis', 'Mitosis', 'Fertilisation', 'Non-disjunction'], answer: 1, why: 'Repair needs identical cells, which mitosis makes.' },
      { id: 'cq5', prompt: 'A human gamete contains how many chromosomes?', options: ['46', '23', '92', '12'], answer: 1, why: 'Gametes are haploid: one set of 23.' },
    ],
  },
  {
    id: 'french-revolution',
    subject: 'History',
    title: 'The French Revolution, 1789 to 1799',
    pages: 22,
    summary:
      'Causes of the revolution, from debt and bread prices to Enlightenment ideas; the storming of the Bastille; the Terror under Robespierre; and how it ended with Napoleon taking power.',
    keyPoints: [
      'Long-term causes: royal debt, an unfair tax system and Enlightenment ideas.',
      'The Estates-General (May 1789) became the National Assembly and the Tennis Court Oath.',
      'The Terror (1793 to 1794) executed about 17,000 people officially.',
      'Napoleon’s coup of 18 Brumaire (1799) ended the revolutionary decade.',
    ],
    suggestions: ['What caused the French Revolution?', 'What was the Reign of Terror?', 'How did it end?'],
    answers: [
      {
        keywords: ['cause', 'causes', 'why', 'start', 'begin', 'reasons'],
        text:
          'Three groups of causes. **Financial**: war debts (including support for the American Revolution) left the crown nearly bankrupt. **Social**: the Third Estate paid most taxes while the clergy and nobility paid little. **Ideas**: Enlightenment writers like Rousseau questioned absolute monarchy. A poor harvest in 1788 pushed bread prices up and turned anger into action.',
        cite: 'p. 2 to 4',
      },
      {
        keywords: ['terror', 'robespierre', 'guillotine', 'reign'],
        text:
          'The **Reign of Terror** (September 1793 to July 1794) was run by the Committee of Public Safety, led by Robespierre. Suspected enemies of the revolution were tried quickly and executed; about 17,000 official executions. It ended when Robespierre himself was arrested and guillotined in Thermidor 1794.',
        cite: 'p. 15',
      },
      {
        keywords: ['end', 'ended', 'napoleon', 'brumaire', 'finish'],
        text:
          'After the Terror came the **Directory** (1795 to 1799), a weak five-man government. In November 1799 Napoleon Bonaparte led the coup of **18 Brumaire**, made himself First Consul, and the revolutionary decade was over.',
        cite: 'p. 20',
      },
      {
        keywords: ['bastille', '1789', 'july'],
        text:
          'On **14 July 1789** a Paris crowd stormed the Bastille, a royal fortress and prison, looking for gunpowder. It held only seven prisoners, but its fall became the symbol of the revolution and is now France’s national day.',
        cite: 'p. 7',
      },
      {
        keywords: ['summary', 'summarise', 'summarize', 'tldr', 'overview', 'explain'],
        text:
          'In short: a bankrupt monarchy called the Estates-General, the Third Estate declared itself the nation, Paris rose up, the king was executed in 1793, the Terror followed, and Napoleon took over in 1799.',
        cite: 'p. 1',
      },
    ],
    cards: [
      { id: 'fr1', front: 'Date of the storming of the Bastille', back: '14 July 1789.' },
      { id: 'fr2', front: 'What was the Tennis Court Oath?', back: 'The Third Estate’s promise (June 1789) not to disband until France had a constitution.' },
      { id: 'fr3', front: 'Who led the Committee of Public Safety?', back: 'Maximilien Robespierre.' },
      { id: 'fr4', front: 'When was Louis XVI executed?', back: 'January 1793.' },
      { id: 'fr5', front: 'What was the Directory?', back: 'The five-man executive that governed France from 1795 to 1799.' },
      { id: 'fr6', front: 'Name the three estates', back: 'Clergy (First), nobility (Second), everyone else (Third).' },
      { id: 'fr7', front: 'What was 18 Brumaire?', back: 'Napoleon’s coup of November 1799 that ended the Directory.' },
      { id: 'fr8', front: 'Declaration of the Rights of Man: year?', back: 'August 1789.' },
    ],
    quiz: [
      { id: 'fq1', prompt: 'Which estate paid most of the taxes?', options: ['The clergy', 'The nobility', 'The Third Estate', 'The king'], answer: 2, why: 'The first two estates were largely exempt.' },
      { id: 'fq2', prompt: 'The Bastille was stormed in…', options: ['1776', '1789', '1793', '1799'], answer: 1, why: '14 July 1789.' },
      { id: 'fq3', prompt: 'Who ended the revolutionary decade with a coup?', options: ['Robespierre', 'Danton', 'Louis XVI', 'Napoleon'], answer: 3, why: 'Napoleon, on 18 Brumaire 1799.' },
      { id: 'fq4', prompt: 'The Reign of Terror was run by the…', options: ['Directory', 'Committee of Public Safety', 'Estates-General', 'Senate'], answer: 1, why: 'Led by Robespierre, 1793 to 1794.' },
      { id: 'fq5', prompt: 'Which bad event of 1788 raised bread prices?', options: ['A poor harvest', 'A plague', 'A war with Spain', 'A flood in Paris'], answer: 0, why: 'The 1788 harvest failed, so bread prices soared.' },
    ],
  },
  {
    id: 'derivatives',
    subject: 'Maths',
    title: 'Introduction to Derivatives',
    pages: 9,
    summary:
      'What a derivative measures, the limit definition, and the rules you use every day: power, product, quotient and chain, with worked examples on rates of change and tangent lines.',
    keyPoints: [
      'A derivative is the instantaneous rate of change: the slope of the tangent.',
      'Power rule: d/dx xⁿ = n·xⁿ⁻¹.',
      'Chain rule: d/dx f(g(x)) = f′(g(x))·g′(x).',
      'At a maximum or minimum the derivative is zero.',
    ],
    suggestions: ['Explain the chain rule with an example', 'What is the power rule?', 'How do I find a tangent line?'],
    answers: [
      {
        keywords: ['chain'],
        text:
          'Differentiate the **outside**, keep the inside, then multiply by the derivative of the **inside**. Example: y = (3x + 1)⁵. Outside: 5(3x + 1)⁴. Inside derivative: 3. So y′ = **15(3x + 1)⁴**.',
        cite: 'p. 6, example 4',
      },
      {
        keywords: ['power'],
        text:
          'Bring the power down and reduce it by one: d/dx xⁿ = n·xⁿ⁻¹. So x⁴ becomes 4x³, and √x = x^½ becomes ½x^−½.',
        cite: 'p. 3',
      },
      {
        keywords: ['tangent', 'line', 'slope', 'gradient'],
        text:
          'Find f′(a) for the slope, then use the point (a, f(a)): **y − f(a) = f′(a)(x − a)**. For f(x) = x² at x = 3: slope 6, point (3, 9), so y = 6x − 9.',
        cite: 'p. 7',
      },
      {
        keywords: ['product', 'quotient'],
        text:
          'Product rule: (uv)′ = u′v + uv′. Quotient rule: (u/v)′ = (u′v − uv′) / v². Tip: "low d-high minus high d-low, over the square of what’s below".',
        cite: 'p. 5',
      },
      {
        keywords: ['what is', 'derivative', 'definition', 'limit', 'summary', 'explain', 'overview'],
        text:
          'A derivative tells you how fast something changes at one instant. Formally it is the limit of (f(x + h) − f(x)) / h as h → 0, which is the slope of the tangent line at x.',
        cite: 'p. 1 to 2',
      },
    ],
    cards: [
      { id: 'dv1', front: 'Power rule', back: 'd/dx xⁿ = n·xⁿ⁻¹' },
      { id: 'dv2', front: 'Derivative of sin x', back: 'cos x' },
      { id: 'dv3', front: 'Derivative of eˣ', back: 'eˣ' },
      { id: 'dv4', front: 'Chain rule', back: 'd/dx f(g(x)) = f′(g(x))·g′(x)' },
      { id: 'dv5', front: 'Product rule', back: '(uv)′ = u′v + uv′' },
      { id: 'dv6', front: 'Derivative of ln x', back: '1/x (for x > 0)' },
      { id: 'dv7', front: 'What is f′(x) at a turning point?', back: 'Zero.' },
      { id: 'dv8', front: 'Limit definition of f′(x)', back: 'lim h→0 of (f(x + h) − f(x)) / h' },
    ],
    quiz: [
      { id: 'dq1', prompt: 'd/dx of x⁵ is…', options: ['5x⁴', 'x⁴', '5x⁵', '4x⁵'], answer: 0, why: 'Power rule: bring down 5, reduce the power to 4.' },
      { id: 'dq2', prompt: 'd/dx of (2x + 1)³ is…', options: ['3(2x + 1)²', '6(2x + 1)²', '6x²', '(2x + 1)²'], answer: 1, why: 'Chain rule: 3(2x + 1)² times 2.' },
      { id: 'dq3', prompt: 'The derivative of cos x is…', options: ['sin x', '−sin x', '−cos x', 'tan x'], answer: 1, why: 'cos differentiates to −sin.' },
      { id: 'dq4', prompt: 'Slope of y = x² at x = 3?', options: ['3', '6', '9', '2'], answer: 1, why: 'y′ = 2x, so 2·3 = 6.' },
      { id: 'dq5', prompt: 'At a local minimum, f′(x) is…', options: ['Positive', 'Negative', 'Zero', 'Undefined always'], answer: 2, why: 'The tangent is horizontal.' },
    ],
  },
  {
    id: 'photosynthesis',
    subject: 'Biology',
    title: 'Photosynthesis',
    pages: 11,
    summary:
      'How plants turn light, water and carbon dioxide into glucose and oxygen: the light-dependent reactions in the thylakoids, the Calvin cycle in the stroma, and the factors that limit the rate.',
    keyPoints: [
      '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂, powered by light.',
      'Light-dependent reactions make ATP and NADPH in the thylakoid membranes.',
      'The Calvin cycle fixes CO₂ into sugar in the stroma.',
      'Light, CO₂ and temperature can each be the limiting factor.',
    ],
    suggestions: ['Give me the equation', 'What happens in the Calvin cycle?', 'What limits the rate?'],
    answers: [
      { keywords: ['equation', 'formula', 'word'], text: '**6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂**, using light energy absorbed by chlorophyll. In words: carbon dioxide plus water gives glucose plus oxygen.', cite: 'p. 2' },
      { keywords: ['calvin', 'stroma', 'dark', 'independent'], text: 'In the stroma, the enzyme **RuBisCO** fixes CO₂ onto RuBP. ATP and NADPH from the light reactions then reduce the product to G3P, some of which becomes glucose while the rest regenerates RuBP.', cite: 'p. 7' },
      { keywords: ['limit', 'limiting', 'rate', 'factor'], text: 'The rate is set by whichever factor is in shortest supply: **light intensity, CO₂ concentration or temperature**. Raise that one and the rate climbs until another factor becomes limiting.', cite: 'p. 9, graph 3' },
      { keywords: ['light', 'thylakoid', 'atp', 'dependent'], text: 'In the thylakoid membranes light splits water (photolysis), releasing O₂. The energy drives an electron chain that makes **ATP and NADPH** for the Calvin cycle.', cite: 'p. 5' },
      { keywords: ['summary', 'summarise', 'summarize', 'overview', 'explain'], text: 'Light reactions capture energy; the Calvin cycle spends it to build sugar from CO₂. Oxygen is the by-product.', cite: 'p. 1' },
    ],
    cards: [
      { id: 'ph1', front: 'Where do the light-dependent reactions happen?', back: 'Thylakoid membranes of the chloroplast.' },
      { id: 'ph2', front: 'Where does the Calvin cycle happen?', back: 'The stroma.' },
      { id: 'ph3', front: 'Which enzyme fixes CO₂?', back: 'RuBisCO.' },
      { id: 'ph4', front: 'Products of the light reactions', back: 'ATP, NADPH and oxygen.' },
      { id: 'ph5', front: 'What is photolysis?', back: 'Splitting water using light energy.' },
      { id: 'ph6', front: 'Three limiting factors', back: 'Light intensity, CO₂ concentration, temperature.' },
    ],
    quiz: [
      { id: 'pq1', prompt: 'Which gas is released by photosynthesis?', options: ['CO₂', 'O₂', 'N₂', 'H₂'], answer: 1, why: 'Oxygen comes from splitting water.' },
      { id: 'pq2', prompt: 'RuBisCO works in the…', options: ['Thylakoid', 'Stroma', 'Nucleus', 'Cell wall'], answer: 1, why: 'The Calvin cycle runs in the stroma.' },
      { id: 'pq3', prompt: 'Which is not a limiting factor?', options: ['Light', 'CO₂', 'Temperature', 'Soil colour'], answer: 3, why: 'The classic three are light, CO₂ and temperature.' },
      { id: 'pq4', prompt: 'The light reactions produce…', options: ['Glucose', 'ATP and NADPH', 'RuBP', 'Starch'], answer: 1, why: 'They make the energy carriers.' },
    ],
  },
  {
    id: 'supply-demand',
    subject: 'Economics',
    title: 'Supply, Demand and Market Equilibrium',
    pages: 12,
    summary:
      'Why demand curves slope down and supply curves slope up, how they meet at equilibrium, what shifts each curve, and how price elasticity predicts the effect of a price change on revenue.',
    keyPoints: [
      'Law of demand: price up, quantity demanded down.',
      'Equilibrium is where quantity supplied equals quantity demanded.',
      'A change in price moves along a curve; anything else shifts it.',
      'Elastic demand (PED > 1): a price cut raises total revenue.',
    ],
    suggestions: ['What shifts the demand curve?', 'Explain equilibrium', 'What is price elasticity?'],
    answers: [
      { keywords: ['shift', 'shifts', 'move', 'demand curve'], text: 'Demand shifts with anything **except the good’s own price**: income, tastes, prices of substitutes and complements, expectations, and the number of buyers. A price change only moves you along the curve.', cite: 'p. 4' },
      { keywords: ['equilibrium', 'clear', 'surplus', 'shortage'], text: 'Equilibrium is the price where **quantity demanded equals quantity supplied**. Above it there is a surplus, which pushes the price down; below it a shortage pushes the price up.', cite: 'p. 6' },
      { keywords: ['elastic', 'elasticity', 'ped', 'revenue'], text: 'PED = % change in quantity demanded ÷ % change in price. If |PED| > 1 demand is **elastic**: cutting the price raises revenue. If |PED| < 1 it is **inelastic**: raising the price raises revenue.', cite: 'p. 9' },
      { keywords: ['supply'], text: 'Supply slopes up because higher prices make production more profitable. It shifts with costs of production, technology, taxes and subsidies, and the number of sellers.', cite: 'p. 5' },
      { keywords: ['summary', 'summarise', 'summarize', 'overview', 'explain'], text: 'Buyers and sellers meet at a price where their plans match. Shifts in either curve change that price, and elasticity tells you by how much quantity reacts.', cite: 'p. 1' },
    ],
    cards: [
      { id: 'sd1', front: 'Law of demand', back: 'As price rises, quantity demanded falls (all else equal).' },
      { id: 'sd2', front: 'Define equilibrium price', back: 'The price at which quantity supplied equals quantity demanded.' },
      { id: 'sd3', front: 'PED formula', back: '% change in quantity demanded ÷ % change in price.' },
      { id: 'sd4', front: 'Complement goods', back: 'Goods used together; a price rise in one lowers demand for the other.' },
      { id: 'sd5', front: 'Effect of a subsidy on supply', back: 'Shifts supply to the right.' },
      { id: 'sd6', front: 'What causes a surplus?', back: 'A price above equilibrium.' },
    ],
    quiz: [
      { id: 'sq1', prompt: 'A rise in incomes for a normal good shifts demand…', options: ['Left', 'Right', 'Not at all', 'Along the curve'], answer: 1, why: 'More income, more demand at every price.' },
      { id: 'sq2', prompt: 'A price above equilibrium causes a…', options: ['Shortage', 'Surplus', 'Shift in demand', 'Subsidy'], answer: 1, why: 'Supply exceeds demand.' },
      { id: 'sq3', prompt: 'If PED is −2, a price cut will…', options: ['Raise revenue', 'Lower revenue', 'Leave revenue unchanged', 'Shift supply'], answer: 0, why: 'Elastic demand: quantity grows faster than price falls.' },
      { id: 'sq4', prompt: 'Which shifts the supply curve?', options: ['The good’s own price', 'A new technology', 'Consumer tastes', 'Income'], answer: 1, why: 'Better technology lowers costs, shifting supply right.' },
    ],
  },
]

export const PACK_BY_ID = Object.fromEntries(PACKS.map((p) => [p.id, p])) as Record<string, Pack>

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

const HINTS: { test: RegExp; id: string }[] = [
  { test: /mitos|meios|cell|divis|chromo|bio/i, id: 'cell-division' },
  { test: /french|revolution|napoleon|bastille|histor/i, id: 'french-revolution' },
  { test: /deriv|calc|differen|math|limit/i, id: 'derivatives' },
  { test: /photo|plant|chloro|calvin/i, id: 'photosynthesis' },
  { test: /supply|demand|econ|market|elastic/i, id: 'supply-demand' },
]

/** Pick the pack for an uploaded file name: a keyword match, else a stable hash. */
export function packForFile(name: string): Pack {
  const hint = HINTS.find((h) => h.test.test(name))
  if (hint) return PACK_BY_ID[hint.id]
  return PACKS[hash(name.toLowerCase()) % PACKS.length]
}

/** The scripted tutor: best keyword match in the pack, or a helpful fallback. */
export function answer(pack: Pack, question: string): { text: string; cite: string | null; suggestions: string[] } {
  const q = question.toLowerCase()
  let best: Answer | null = null
  let score = 0
  for (const a of pack.answers) {
    const s = a.keywords.reduce((n, k) => n + (q.includes(k) ? k.length : 0), 0)
    if (s > score) {
      best = a
      score = s
    }
  }
  const rest = pack.suggestions.filter((s) => s.toLowerCase() !== q)
  if (best) return { text: best.text, cite: best.cite, suggestions: rest.slice(0, 3) }
  return {
    text: `I couldn’t find that in **${pack.title}**. Try asking about one of the key ideas: ${pack.keyPoints[0].replace(/\.$/, '')}, or ask me to summarise a section.`,
    cite: null,
    suggestions: pack.suggestions.slice(0, 3),
  }
}
