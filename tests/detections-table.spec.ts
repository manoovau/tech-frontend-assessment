import { test, expect, Locator } from "@playwright/test";
import {
  DetectionCategoryRef,
  DetectionResolutionStatus,
  DetectionSeverity,
  DetectionStatus,
} from "../src/types";

test.describe("Detections Table", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
  });

  test("should return title", async ({ page }) => {
    await expect(page).toHaveTitle("Detections Table");

    await expect(page.getByPlaceholder("Search")).toBeVisible();
  });

  test.describe("Status filter", () => {
    const STATUS_OPTIONS: DetectionStatus[] = [
      "acknowledged",
      "resolved",
      "triggered",
    ];
    test("defaults to checked", async ({ page }) => {
      for (const option of STATUS_OPTIONS) {
        const checkbox = page.getByLabel(option);
        await expect(checkbox).toBeChecked();

        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();
      }
    });

    test("filters the table when checkbox is unchecked", async ({ page }) => {
      const testCheckbox = async (option: string) => {
        const checkboxLabel = page.getByLabel(option);
        expect(checkboxLabel).toBeVisible();

        const rowsWithTerm = await page
          .getByRole("row", { name: option, exact: false })
          .count();

        if (rowsWithTerm > 0) {
          await checkboxLabel.uncheck();

          expect(
            (await page
              .getByRole("row", { name: option, exact: false })
              .count()) === 0
          );
        }
      };

      for (const option of STATUS_OPTIONS) {
        await testCheckbox(option);
      }

      expect(
        page.getByRole("heading", { name: "Status", exact: true }).isVisible()
      );
    });
  });

  test.describe("Resolution Status filter", () => {
    const RESOLUTION_STATUS_OPTIONS: DetectionResolutionStatus[] = ["FP", "TP"];

    test("defaults to checked", async ({ page }) => {
      for (const option of RESOLUTION_STATUS_OPTIONS) {
        const checkbox = page.getByLabel(option);
        await expect(checkbox).toBeChecked();

        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();
      }
    });

    test("filters the table when checkbox is unchecked", async ({ page }) => {
      const testCheckbox = async (option: string) => {
        const checkboxLabel = page.getByLabel(option);
        expect(checkboxLabel).toBeVisible();

        const rowsWithTerm = await page
          .getByRole("row", { name: option, exact: false })
          .count();

        if (rowsWithTerm > 0) {
          await checkboxLabel.uncheck();

          expect(
            (await page
              .getByRole("row", { name: option, exact: false })
              .count()) === 0
          );
        }
      };

      for (const option of RESOLUTION_STATUS_OPTIONS) {
        await testCheckbox(option);
      }

      expect(
        page
          .getByRole("heading", { name: "Resolution Status", exact: true })
          .isVisible()
      );
    });
  });

  test.describe("Severity filter", () => {
    const SEVERITY_OPTIONS: DetectionSeverity[] = ["high", "low"];
    test("defaults to checked", async ({ page }) => {
      for (const option of SEVERITY_OPTIONS) {
        const checkbox = page.getByLabel(option);
        await expect(checkbox).toBeChecked();

        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();
      }
    });

    test("filters the table when checkbox is unchecked", async ({ page }) => {
      const testCheckbox = async (option: string) => {
        const checkboxLabel = page.getByLabel(option);
        expect(checkboxLabel).toBeVisible();

        const rowsWithTerm = await page
          .getByRole("row", { name: option, exact: false })
          .count();

        if (rowsWithTerm > 0) {
          await checkboxLabel.uncheck();

          expect(
            (await page
              .getByRole("row", { name: option, exact: false })
              .count()) === 0
          );
        }
      };

      for (const option of SEVERITY_OPTIONS) {
        await testCheckbox(option);
      }

      expect(
        page.getByRole("heading", { name: "Severity", exact: true }).isVisible()
      );
    });
  });

  test.describe("Category Ref filter", () => {
    const DETECTIONS_CATEGORY_REF_OPTIONS: DetectionCategoryRef[] = [
      "execution_with_malicious_intent",
      "malicious_behavior_on_a_system",
      "unauthorized_data_access",
      "uncategorized",
      "unusual_login_or_user_activity",
      "unusual_software_activity",
    ];

    const CATEGORY_REF_OPTIONS: DetectionCategoryRef[] = [
      "execution_with_malicious_intent",
      "malicious_behavior_on_a_system",
      "unauthorized_data_access",
      "uncategorized",
      "unusual_login_or_user_activity",
      "unusual_software_activity",
    ];
    test("defaults to checked", async ({ page }) => {
      for (const option of CATEGORY_REF_OPTIONS) {
        const checkbox = page.getByLabel(option);
        await expect(checkbox).toBeChecked();

        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();
      }
    });

    test("filters the table when checkbox is unchecked", async ({ page }) => {
      const testCheckbox = async (option: string) => {
        const checkboxLabel = page.getByLabel(option);
        expect(checkboxLabel).toBeVisible();

        const rowsWithTerm = await page
          .getByRole("row", { name: option, exact: false })
          .count();

        if (rowsWithTerm > 0) {
          await checkboxLabel.uncheck();

          expect(
            (await page
              .getByRole("row", { name: option, exact: false })
              .count()) === 0
          );
        }
      };

      for (const option of CATEGORY_REF_OPTIONS) {
        await testCheckbox(option);
      }

      expect(
        page
          .getByRole("heading", { name: "Category Ref", exact: true })
          .isVisible()
      );
    });
  });
});
