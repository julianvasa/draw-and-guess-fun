const ATLASSIAN_TERMS = [
  "jira", "confluence", "trello", "bitbucket", "statuspage",
  "bamboo", "opsgenie", "jiraservicedesk", "portfolio",
  "team", "project", "board", "sprint", "backlog",
  "issue", "ticket", "wiki", "page", "space",
  "repository", "branch", "merge", "pipeline", "deployment",
  "dashboard", "report", "kanban", "scrum", "agile",
  "workflow", "notification", "comment", "attachment", "mention",
  "filter", "search", "label", "tag", "version"
];

const SKIP_VALIDATION_TERMS = new Set([
  "jira", "confluence", "trello", "bitbucket", "opsgenie",
  "jiraservicedesk", "statuspage", "bamboo"
]);

export const getRandomWord = async (): Promise<string> => {
  console.log("Fetching random Atlassian word");
  const randomIndex = Math.floor(Math.random() * ATLASSIAN_TERMS.length);
  const word = ATLASSIAN_TERMS[randomIndex];
  
  // Skip dictionary validation for Atlassian-specific terms
  if (SKIP_VALIDATION_TERMS.has(word.toLowerCase())) {
    console.log("Skipping dictionary validation for Atlassian term:", word);
    return word;
  }
  
  try {
    // Remove spaces and validate with dictionary API
    const searchWord = word.replace(/\s+/g, '');
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`);
    
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