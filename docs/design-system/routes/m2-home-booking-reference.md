# M2 home + booking reference pair

Status: implementation reference in PR — pending product-owner approval.

## What this establishes

- The home route remains the atmosphere and editorial anchor.
- The new `/booking` route proves the same mineral-green, earth, ink and controlled-gold grammar under a form-heavy flow.
- Guest and account paths are explicit and use the same service, time and contact structure.
- The booking surface is deliberately read-only: it does not reserve a slot, write to Supabase, collect payment, issue credit, send WhatsApp/SMS or claim a refund.

## Responsive evidence checklist

Run the application and inspect both routes at:

| Viewport | Required evidence |
| --- | --- |
| 390px | Header/menu, readable type, stacked panels, keyboard focus, touch targets and no horizontal overflow |
| 1440px | Shared shell, editorial hierarchy, composed two-column booking workspace and sticky summary |

## State coverage

The reference summary includes explicit preview controls for ready, loading, empty, conflict and error states. The primary action demonstrates a success acknowledgement without pretending that a booking was created. Production booking logic must replace these previews only after #97, #98, #103, #104 and #105 are complete.

## Cultural provenance boundary

This implementation uses colour, proportion, textile-like rhythm and restrained botanical language only. It does not introduce a recognisable cultural symbol, copied textile motif, sacred reference, animal print or decorative “African” pattern. No provenance record is therefore claimed for a specific cultural artefact.

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm run test:run`
- `npm run build`
- Manual responsive review at 390px and 1440px
- Accessibility review: labels, visible focus, semantic headings, tab roles, keyboard operation and reduced-motion handling

## Scope guard

No payment, cart, order, webhook, credit or refund behaviour is included.
