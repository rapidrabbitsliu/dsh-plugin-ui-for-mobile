param([ValidateSet('check','publish')][string]$Action = 'check')
$ErrorActionPreference = 'Stop'
if (-not $env:NPM_TOKEN) { $env:NPM_TOKEN = [Environment]::GetEnvironmentVariable('NPM_TOKEN', 'User') }
if (-not $env:NPM_TOKEN) { throw 'NPM_TOKEN is not available in process or user environment.' }
# The file contains a variable reference, never the token itself.
$config = Join-Path $env:TEMP ('dsh-mobile-npm-' + [guid]::NewGuid().ToString('N') + '.npmrc')
try {
  Set-Content -LiteralPath $config -Value '//registry.npmjs.org/:_authToken=${NPM_TOKEN}'
  $env:NPM_CONFIG_USERCONFIG = $config
  if ($Action -eq 'check') {
    npm whoami --registry=https://registry.npmjs.org --fetch-timeout=15000 --fetch-retries=0 --cache .npm-cache
    if ($LASTEXITCODE -ne 0) { throw 'npm authentication check failed.' }
    npm view dsh-plugin-ui-for-mobile name version --registry=https://registry.npmjs.org --fetch-timeout=15000 --fetch-retries=0 --cache .npm-cache
    # E404 is expected before first publication; inspect the output.
  } else {
    npm publish ./dsh-plugin-ui-for-mobile-0.1.1.tgz --access public --registry=https://registry.npmjs.org --fetch-timeout=30000 --fetch-retries=0 --cache .npm-cache
    if ($LASTEXITCODE -ne 0) { throw 'npm publish failed.' }
  }
} finally {
  # Absolute path was created above exclusively for this invocation.
  if (Test-Path -LiteralPath $config) { Remove-Item -LiteralPath $config }
}
