import { GetDetectionsResponse } from "./client";

export type Detection = GetDetectionsResponse[number];

export type DetectionStatus = NonNullable<Detection["status"]>;

export type DetectionResolutionStatus = NonNullable<
  Detection["resolutionStatus"]
>;

export type DetectionSeverity = NonNullable<Detection["severity"]>;

export type DetectionCategoryRef = NonNullable<Detection["categoryRef"]>;
