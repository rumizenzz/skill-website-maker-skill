export const siteConfig = {
  skillSlug: "__SKILL_SLUG__",
  skillDisplayName: "__SKILL_DISPLAY_NAME__",
  githubOwner: "__GITHUB_OWNER__",
  skillRepo: "__SKILL_REPO__",
} as const;

export const siteUrls = {
  skillRepo: `https://github.com/${siteConfig.githubOwner}/${siteConfig.skillRepo}`,
  releases: `https://github.com/${siteConfig.githubOwner}/${siteConfig.skillRepo}/releases`,
  issues: `https://github.com/${siteConfig.githubOwner}/${siteConfig.skillRepo}/issues`,
} as const;

