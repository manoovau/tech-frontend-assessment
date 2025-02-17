# Detections tablex

Project: Detections table.

## To Do:

- Add Pagination component
- Add date cell component
- Use day input in my request
- Add Category Ref filter (maybe SELECT?)

## Project features:

- To customize the data displayed in the table, you can use the available filters and Search element.
  - Search innput: display results based in term inside "ID", "EYED", "TITLE", "acknowledgedBy" and "resolvedBy".
  - Filter Usage: by default, all options may be selected. To refine the results, unselect the unwanted options in the filter.
- Maximum Days Limit: The input allows a maximum of 4 digits (up to 9,999 days, which is approximately 27 years and 4 months).

## Comments

- Set API limit to 20 and API page to 0. These values can be updated using the constants: "API_LIMIT" and "API_PAGE".
- Set Mocker Detections when API is not working.
- Future implementation:
  - Add an input to filter and display data from the last 24 hours, last week, or last month.
  - Sort Values
  - Pagination (API limit = 100)

## Clone project.

Clone the project: `git clone https://github.com/manoovau/tech-frontend-assessment`.
It includes all dependencies.

## Install package(s).

run `npm i` from the command line.

## Open project.

run script `npm run dev` in the command line.
