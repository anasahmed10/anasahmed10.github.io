import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubRepository = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const repositoryName = githubRepository[1] ?? "";
const isUserSite = repositoryName === `${githubRepository[0]}.github.io`;
const pagesBasePath =
  isGitHubPages && repositoryName && !isUserSite ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: pagesBasePath,
  assetPrefix: pagesBasePath || undefined,
  images: { unoptimized: true },
  trailingSlash: isGitHubPages,
};

export default nextConfig;
