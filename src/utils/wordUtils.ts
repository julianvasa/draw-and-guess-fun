const ATLASSIAN_TERMS = [
  "jira", "confluence", "trello", "bitbucket", "statuspage",
  "bamboo", "opsgenie", "jira service desk", "portfolio",
  "team", "project", "board", "sprint", "backlog",
  "issue", "ticket", "wiki", "page", "space",
  "repository", "branch", "merge", "pipeline", "deployment",
  "dashboard", "report", "kanban", "scrum", "agile",
  "workflow", "notification", "comment", "attachment", "mention",
  "filter", "search", "label", "tag", "version"
];

export const getRandomWord = async (): Promise<string> => {
  console.log("Fetching random Atlassian word");
  // Get a random word from our Atlassian terms
  const randomIndex = Math.floor(Math.random() * ATLASSIAN_TERMS.length);
  const word = ATLASSIAN_TERMS[randomIndex];
  
  try {
    // Validate the word exists in dictionary
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) {
      console.log("Word not found in dictionary, trying another");
      return getRandomWord();
    }
    console.log("Successfully fetched word:", word);
    return word;
  } catch (error) {
    console.error("Error fetching word:", error);
    // Fallback to just returning the word if API fails
    return word;
  }
};