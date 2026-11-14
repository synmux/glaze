---
name: "create-issue"
description: "Create a Linear ticket with context supplied."
---

Create the requested issue **in Linear** using the existing General issue template, not General Form. Retrieve the current template before using it; preserve its headings, formatting, section order and separators.

> [!NOTE]
> Apply the template when creating the issue rather than changing the template itself.
> Ensure that you open and close triple-quote blocks correctly - often the first heading is inside one.

- Use the user's explicit issue title verbatim. Otherwise, write a concise, specific title describing the requested work.
- Replace the template's <Enter text> blanks using information from the full conversation:
  - 🩻 Summary
    - Explain what needs doing or what is wrong, and the intended outcome. Keep this short and self-contained.
  - 📦 Links and Related Material
    - Include relevant supplied links, related issues and supporting material.
    - Use descriptive link labels and explain relevance briefly where needed.
  - 🫧 Further Detail
    - Add the available supporting detail, such as reproduction steps, expected versus actual behaviour, constraints, dependencies or acceptance criteria.
    - Include only details supplied or clearly established by the context; do not invent implementation decisions.
- Keep every template section. Where no information is available, replace the blank with Not provided; never leave `<Enter text>` in the created issue.
  - Ask one concise question covering all essential missing information only when it prevents meaningful issue creation.
- Follow explicit issue-property instructions.
  - You may infer the team from the current directory and/or active GitHub repository.
  - Otherwise use the user's configured issue-creation defaults:
    - Myriad team
    - Medium priority
    - Assigned to syn
    - Triage status
- Set an appropriate complexity estimate based on the content and the team's supported estimate scale; do not estimate elapsed days.
  - Do not add unrelated properties or start implementation.
- Write the issue in UK English and create it with the completed template description.