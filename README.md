# Detections table

Project: Detections table.

## Project description:

- Implement React project to fetch and store detections data, from an API.
- Display detections in a list.
- Implement search and filter.

## Project features:

- To customize the data displayed in the table, you can use the available filters and Search element.
  - Search feature: filter detections based in search term inside "EYED", "TITLE", "acknowledgedBy" and "resolvedBy".
  - Filter Usage: by default, all options may be selected. To refine the results, unselect the unwanted options in the filter.

## Comments

- Set API limit to 20 and API page to 0. These values can be updated using the constants: "API_LIMIT" and "API_PAGE".
- Set Mock API Detections when API is not working.
- Future implementation:
  - Add an input to filter and display data from the last 24 hours, last week, or last month.
  - Sort Values
  - Add Pagination component(API limit = 100)
  - If the API supports filtering, apply the selected filter parameters and return a table with a number of rows matching the API's response limit.

## Clone project.

Clone the project: `git clone https://github.com/manoovau/tech-frontend-assessment`.
It includes all dependencies.

## API Authentication.

- create "credentials.ts" file inside "src/authentication" folder.
- Paste information below inside "credentials.ts" file and save changes:

```
export const AUTHORIZATION = "<AUTHORIZATION>"

```

## Install package(s).

run `npm i` from the command line.

## Open project.

run script `npm run dev` in the command line.

## Run test. Starts the interactive UI mode.

1. Open new terminal.
2. run script `npx playwright test --ui` in the command line.
