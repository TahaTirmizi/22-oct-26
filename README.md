# Taha's Task Board

This repo is where tasks get assigned to Taha and where he does the work and reports progress.

## How it works

1. **Assigning a task:** open a GitHub Issue with the **Task** template (Issues → New issue → Task), or copy [templates/TASK_TEMPLATE.md](templates/TASK_TEMPLATE.md) into a new folder under `tasks/`.
2. **Doing the task:** Taha works inside that task's folder. Notes, drafts, and results go there.
3. **Reporting:** Taha ticks off the checklist in the task's README, adds a dated entry to its **Progress log**, and commits. Questions go in the linked issue.
4. **Closing:** when every deliverable is done, set the status to `Done` below and close the issue.

## Task index

| #   | Task                                                                | Status      | Due  |
| --- | ------------------------------------------------------------------- | ----------- | ---- |
| 001 | [GRE preparation](tasks/001-gre-prep/README.md)                     | Not started | TBD  |
| 002 | [Research paper: AI-resistant SE skills](tasks/002-research-paper/README.md) | Not started | TBD  |

Status values: `Not started` · `In progress` · `Blocked` · `In review` · `Done`

## Tools

- **[GRE Quant Diagnostic](https://tahatirmizi.github.io/22-oct-26/)**: a timed 24-question test that estimates your GRE Quant score range and how many weeks of prep you need to reach a target. The source is in [docs/](docs/). To enable it, go to Settings → Pages, choose **Deploy from a branch**, and pick branch `main`, folder `/docs`.

## Folder layout

```
docs/                    GRE Quant Diagnostic web app (served by GitHub Pages)
tasks/
  001-gre-prep/          GRE study plan, practice-test scores, error log
  002-research-paper/    paper shortlist, chosen paper, summary
templates/
  TASK_TEMPLATE.md       copy this to start a new task
.github/ISSUE_TEMPLATE/
  task.md                issue form for assigning tasks
```
