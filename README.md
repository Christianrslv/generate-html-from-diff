# Generate html from diff
Action to generate html output for a diff string input

## Inputs

## `git-diff`

**Required** The result of the git diff command. Default `"diff"`.

## Outputs

## `diff2html`

The html file genereted

## Example usage

uses: Christianrslv/generate-html-from-diff@v1.0.0  
with:  
git-diff: ${{ env.DIFF }}
