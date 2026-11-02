import { z } from 'zod';

export const APPROVED_CATEGORIES = [
  '',
  'Agentic Threats',
  'Identity & Authorization',
  'Infrastructure & Architecture',
  'Capabilities & Interfaces',
  'Governance & Compliance',
];

const nonEmptyString = z.string().trim().min(1);

export const TaxonomyEntrySchema = z.strictObject({
  term: nonEmptyString,
  category: z.enum(APPROVED_CATEGORIES),
  aliases: z.array(z.string()),
  broaderTerm: z.string().nullable(),
  definition: nonEmptyString,
  scopeNote: z.string().optional(),
  relatedTerms: z.array(z.string()).optional().default([]),
  contrastsWith: z.array(z.string()).optional().default([]),
  workgroups: z.array(z.string()),
});

export const TaxonomySchema = z.array(TaxonomyEntrySchema).superRefine((entries, ctx) => {
  const seenTerms = new Map();

  entries.forEach((entry, index) => {
    const firstIndex = seenTerms.get(entry.term);
    if (firstIndex !== undefined) {
      ctx.addIssue({
        code: 'custom',
        path: [index, 'term'],
        message: `Duplicate term "${entry.term}" (first defined at entry #${firstIndex}).`,
      });
    } else {
      seenTerms.set(entry.term, index);
    }

    if (entry.workgroups.includes('Universal')) {
      ctx.addIssue({
        code: 'custom',
        path: [index, 'workgroups'],
        message: '"Universal" is not a valid workgroup value; use [] instead.',
      });
    }
  });
});
