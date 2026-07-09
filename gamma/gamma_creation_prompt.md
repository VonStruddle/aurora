Variables

- {{prospect_name}}
- {{prospect_job_title}}
- {{company_name}}
- {{company_context}}
- {{company_challenges}}
- {{relevant_polar_use_cases}}
- {{relevant_case_studies}}
- {{presentation_language}}
- {{presentation_objective}}
- {{gamma_theme_id}}
- {{gamma_api_key}}

Create a short, personalized Polar Analytics presentation using the Gamma API.

Variables

- Prospect name: {{prospect_name}}
- Prospect job title: {{prospect_job_title}}
- Company name: {{company_name}}
- Company context: {{company_context}}
- Main challenges or priorities: {{company_challenges}}
- Relevant Polar use cases: {{relevant_polar_use_cases}}
- Relevant Polar case studies: {{relevant_case_studies}}
- Presentation language: {{presentation_language}}
- Presentation objective: {{presentation_objective}}
- Gamma theme ID: {{gamma_theme_id}}
- Gamma API key: {{gamma_api_key}}

Instructions

Create a concise sales presentation of approximately 6 to 8 slides, customized for {{prospect_name}}, {{prospect_job_title}} at {{company_name}}.

Use the company context and challenges to select the most relevant Polar Analytics use cases and case studies.

The presentation should:

- Clearly reflect the prospect’s role and priorities.
- Show how Polar Analytics can address the company’s specific challenges.
- Focus on two or three relevant use cases.
- Include one strong and relevant customer case study or proof point.
- Stay simple, visual, and easy to scan.
- Avoid generic marketing language and excessive product details.
- Never invent company facts, metrics, customer results, or product capabilities.
- Use {{presentation_language}}.
- Follow the Polar Analytics design system through the Gamma theme {{gamma_theme_id}}.

Recommended structure

1. Personalized title slide
2. Company context and key priorities
3. Main challenges for the prospect
4. Relevant Polar use case
5. Second relevant Polar use case
6. Customer case study or proof point
7. Expected value for {{company_name}}
8. Suggested next step

Gamma API execution

Use the Gamma API to generate the presentation.

- Format: presentation
- Theme ID: {{gamma_theme_id}}
- Text amount: brief
- Style: minimalist, premium, analytical, and on-brand
- API key: {{gamma_api_key}}

After generating the presentation, return:

- The Gamma presentation URL
- The export URL, when available
- The number of slides created
- The use cases and case study selected
- Any missing information or assumptions
