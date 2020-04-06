const core = require('@actions/core')
const github = require('@actions/github')
const process = require('process')

const customRepo = repoPath => {
  const segments = repoPath.split('/', 2)

  if (segments.length < 2) {
    core.setFailed("Please provide a `repo_path` in the format `owner/repo_name`")
  }

  return segments
}

const [owner, repo] = core.getInput('repo_path')
  ? customRepo(core.getInput('repo_path'))
  : process.env['GITHUB_REPOSITORY'].split('/', 2)

const octokit = new github.GitHub(
  core.getInput('github_token', { required: true })
)

async function run() {
  let latestRelease

  try {
    latestRelease = await octokit.repos.getLatestRelease({
      owner,
      repo,
    })
  } catch (error) {
    core.setFailed(error)
  }

  const latestReleaseTag = latestRelease.tagName

  core.info(`Fetched latest release tag: ${latestReleaseTag}`)

  core.setOutput('url', latestRelease.url)
  core.setOutput('assets_url', latestRelease.assetsUrl)
  core.setOutput('upload_url', latestRelease.uploadUrl)
  core.setOutput('html_url', latestRelease.htmlUrl)
  core.setOutput('id', latestRelease.id)
  core.setOutput('node_id', latestRelease.nodeId)
  core.setOutput('tag_name', latestReleaseTag)
  core.setOutput('target_commitish', latestRelease.targetCommitish)
  core.setOutput('name', latestRelease.name)
  core.setOutput('draft', latestRelease.draft)
  core.setOutput('author_id', latestRelease.author.id)
  core.setOutput('author_node_id', latestRelease.author.nodeId)
  core.setOutput('author_url', latestRelease.author.url)
  core.setOutput('author_login', latestRelease.author.login)
  core.setOutput('author_html_url', latestRelease.author.htmlUrl)
  core.setOutput('author_type', latestRelease.author.type)
  core.setOutput('author_site_admin', latestRelease.author.siteAdmin)
}

try {
  run()
} catch (error) {
  core.setFailed(`Action failed with error ${error}`)
}

