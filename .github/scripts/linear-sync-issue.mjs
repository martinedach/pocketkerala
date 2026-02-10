import { LinearClient } from "@linear/sdk";
import fs from "node:fs";

async function main() {
  const apiKey = process.env.LINEAR_API_KEY;
  const teamName = process.env.LINEAR_TEAM_NAME;
  const eventName = process.env.GITHUB_EVENT_NAME;
  const eventPath = process.env.GITHUB_EVENT_PATH;

  if (!apiKey) {
    console.error("Missing LINEAR_API_KEY");
    process.exit(1);
  }
  if (!teamName) {
    console.error("Missing LINEAR_TEAM_NAME");
    process.exit(1);
  }
  if (!eventPath || !eventName) {
    console.error("Missing GitHub event context");
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(eventPath, "utf8"));

  if (eventName !== "issues") {
    console.log(`Unsupported event: ${eventName}`);
    return;
  }

  const action = payload.action;
  const ghIssue = payload.issue;
  const repo = payload.repository;

  if (!ghIssue || !repo) {
    console.error("Missing issue or repository in event payload");
    process.exit(1);
  }

  if (action !== "opened") {
    console.log(`Skipping action ${action}, only handling 'opened'`);
    return;
  }

  const client = new LinearClient({ apiKey });

  // Find the PocketKerala team in Linear by name.
  const teams = await client.teams({
    filter: {
      name: { eq: teamName },
    },
    first: 1,
  });

  const team = teams.nodes[0];
  if (!team) {
    console.error(`No Linear team found with name '${teamName}'`);
    process.exit(1);
  }

  const githubUrl = ghIssue.html_url;
  const repoFullName = repo.full_name;

  const title = `GH #${ghIssue.number}: ${ghIssue.title}`;
  const descriptionLines = [
    `GitHub: ${githubUrl}`,
    `Repository: ${repoFullName}`,
    "",
    ghIssue.body || "",
  ];

  const result = await client.issueCreate({
    teamId: team.id,
    title,
    description: descriptionLines.join("\n"),
  });

  if (result.success && result.issue) {
    console.log(
      `Created Linear issue ${result.issue?.id} for GitHub issue #${ghIssue.number}`,
    );
  } else {
    console.error("Failed to create Linear issue", result.error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected error while syncing issue to Linear");
  console.error(err);
  process.exit(1);
});

