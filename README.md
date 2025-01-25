[![deploy](https://github.com/tasmota/docs/actions/workflows/main.yml/badge.svg)](https://github.com/tasmota/docs/actions/workflows/main.yml)

# Tasmota Documentation
This is the repo for documentation of the Tasmota open source alternative firmware for ESP8266 available from https://github.com/arendst/Tasmota 

The build documentation can be found here: https://tasmota.github.io/docs/

Built on [MkDocs](https://www.mkdocs.org/) using [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) theme.

## Editing Articles

You can edit and suggest change by performing the steps below:
- clicking on the pencil button on the top right of the page.
That will help you create a fork of the doc repository into your own GitHub account where you will make the change.
- After finishing changes, press "Commit changes" at top right of page 
- submit your changes by creating a PR
  
expanded instruction with pictures are provided by GitHub [here](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files)

(pull request) to the original Tasmota/docs repository


Edit only articles in `/docs` folder. 

All paths are relative. 

Use strict markdown syntax. See [Markdown Cheatsheet](https://www.markdownguide.org/cheat-sheet/) for a quick reference.

### Markdown Enhancements

#### Admonitions

[Reference](https://squidfunk.github.io/mkdocs-material/reference/admonitions/) of all possibilities

#### Definition Lists

[Usage](https://squidfunk.github.io/mkdocs-material/reference/lists/#using-definition-lists) 

#### Marker Highlight

If you want higlight text with marker style yellow enclose it in `== ==`. [More details...](https://squidfunk.github.io/mkdocs-material/extensions/pymdown/#magiclink)

#### Tabs

Start each tab section with `=== "Tab title"` and indent the tab content by 4 spaces. [More information...](https://facelessuser.github.io/pymdown-extensions/extensions/tabbed/)

#### Superscript text
Enclose text in `^ ^` to superscript it. Example `H^2^0` renders H<sup>2</sup>O
