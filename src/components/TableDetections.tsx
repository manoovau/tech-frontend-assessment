import { useState, ChangeEvent, useMemo, ReactElement } from "react";
import {
  DetectionStatus,
  Detection,
  DetectionResolutionStatus,
  DetectionSeverity,
  DetectionCategoryRef,
} from "../types";
import { mockDetections } from "../data";
import { useDebounce } from "use-debounce";

const DETECTIONS_STATUS_OPTIONS: DetectionStatus[] = [
  "acknowledged",
  "resolved",
  "triggered",
];

const DETECTIONS_RESOLUTION_STATUS_OPTIONS: DetectionResolutionStatus[] = [
  "FP",
  "TP",
];

const DETECTIONS_SEVERITY_OPTIONS: DetectionSeverity[] = ["high", "low"];

const DETECTIONS_CATEGORY_REF_OPTIONS: DetectionCategoryRef[] = [
  "execution_with_malicious_intent",
  "malicious_behavior_on_a_system",
  "unauthorized_data_access",
  "uncategorized",
  "unusual_login_or_user_activity",
  "unusual_software_activity",
];

export const TableDetections = (): ReactElement => {
  const [searchString, setSearchString] = useState<string>("");
  const [searchStringDebounced] = useDebounce(searchString, 300);
  // add this value inside API url
  const [days, setDays] = useState<string>("");

  const MAX_DAYS_DIGITS = 4;

  const onChangeDaysValue = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove non-numeric characters
    value = value.replace(/\D/g, "");

    // Limit length to MAX_DAYS_DIGITS characters
    if (value.length > MAX_DAYS_DIGITS) {
      value = value.slice(0, MAX_DAYS_DIGITS);
    }

    setDays(value);
  };

  const [detectionStatusFilter, setDetectionStatusFilter] = useState<
    Record<DetectionStatus, boolean>
  >({
    acknowledged: true,
    resolved: true,
    triggered: true,
  });

  const [detectionResolutionStatusFilter, setDetectionResolutionStatusFilter] =
    useState<Record<DetectionResolutionStatus, boolean>>({
      TP: true,
      FP: true,
    });

  const [detectionSeverityFilter, setDetectionSeverityFilter] = useState<
    Record<DetectionSeverity, boolean>
  >({
    low: true,
    high: true,
  });

  const [detectionCategoryRefFilter, setDetectionCategoryRefFilter] = useState<
    Record<DetectionCategoryRef, boolean>
  >({
    execution_with_malicious_intent: true,
    malicious_behavior_on_a_system: true,
    unauthorized_data_access: true,
    uncategorized: true,
    unusual_login_or_user_activity: true,
    unusual_software_activity: true,
  });

  const onChangeStatusFilter = (detectionStatus: DetectionStatus): void => {
    setDetectionStatusFilter((current) => ({
      ...current,
      [detectionStatus]: !current[detectionStatus],
    }));
  };

  const onChangeStatusResolutionFilter = (
    detectionResolutionStatus: DetectionResolutionStatus
  ): void => {
    setDetectionResolutionStatusFilter((current) => ({
      ...current,
      [detectionResolutionStatus]: !current[detectionResolutionStatus],
    }));
  };

  const onChangeSeverityFilter = (
    detectionSeverity: DetectionSeverity
  ): void => {
    setDetectionSeverityFilter((current) => ({
      ...current,
      [detectionSeverity]: !current[detectionSeverity],
    }));
  };

  const onChangeCategoryRefFilter = (
    detectionCategoryRef: DetectionCategoryRef
  ): void => {
    setDetectionCategoryRefFilter((current) => ({
      ...current,
      [detectionCategoryRef]: !current[detectionCategoryRef],
    }));
  };

  const result = useMemo(() => {
    const searchStringDebouncedLowerCase = searchStringDebounced.toLowerCase();
    return mockDetections
      .filter(
        (item: Detection) =>
          item.id?.toLowerCase().includes(searchStringDebouncedLowerCase) ||
          item.eyed?.toLowerCase().includes(searchStringDebouncedLowerCase) ||
          item.title?.toLowerCase().includes(searchStringDebouncedLowerCase) ||
          item.acknowledgedBy
            ?.toLowerCase()
            .includes(searchStringDebouncedLowerCase) ||
          item.resolvedBy
            ?.toLowerCase()
            .includes(searchStringDebouncedLowerCase)
      )
      .filter((item) => {
        return !(item.status && detectionStatusFilter[item.status] === false);
      })
      .filter((item) => {
        return !(
          item.resolutionStatus &&
          detectionResolutionStatusFilter[item.resolutionStatus] === false
        );
      })
      .filter((item) => {
        return !(
          item.severity && detectionSeverityFilter[item.severity] === false
        );
      })
      .filter((item) => {
        return !(
          item.categoryRef &&
          detectionCategoryRefFilter[item.categoryRef] === false
        );
      });
  }, [
    searchStringDebounced,
    detectionStatusFilter,
    detectionResolutionStatusFilter,
    detectionSeverityFilter,
    detectionCategoryRefFilter,
  ]);

  return (
    <div>
      <h3>Table Detections</h3>
      <div className="form-control self-center">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
          value={searchString}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchString(e.target.value)
          }
        />
        <input
          id="days"
          type="text"
          value={days}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeDaysValue(e)}
          aria-label="Days input"
          // className={daysError ? "error-input" : ""}
          placeholder="Enter days"
          maxLength={MAX_DAYS_DIGITS}
          // onFocus={() => setFocusedDays(true)}
          // onBlur={() => setFocusedDays(false)}
        />
      </div>

      <div id="status-filter" className="m-2 flex">
        {DETECTIONS_STATUS_OPTIONS.map((item) => (
          <div key={item}>
            {" "}
            <input
              type="checkbox"
              className="mr-2"
              checked={detectionStatusFilter[item]}
              onChange={() => onChangeStatusFilter(item)}
            />
            <label htmlFor={`${item}`} className="mr-2">
              {`${item}`}
            </label>
          </div>
        ))}
      </div>
      <div id="status-resolution-filter" className="m-2 flex">
        {" "}
        {DETECTIONS_RESOLUTION_STATUS_OPTIONS.map((item) => (
          <div key={item}>
            {" "}
            <input
              type="checkbox"
              className="mr-2"
              checked={detectionResolutionStatusFilter[item]}
              onChange={() => onChangeStatusResolutionFilter(item)}
            />
            <label htmlFor={`${item}`} className="mr-2">
              {`${item}`}
            </label>
          </div>
        ))}
      </div>
      <div id="severity-filter" className="m-2 flex">
        {DETECTIONS_SEVERITY_OPTIONS.map((item) => (
          <div key={item}>
            {" "}
            <input
              type="checkbox"
              className="mr-2"
              checked={detectionSeverityFilter[item]}
              onChange={() => onChangeSeverityFilter(item)}
            />
            <label htmlFor={`${item}`} className="mr-2">
              {`${item}`}
            </label>
          </div>
        ))}
      </div>
      <div id="category-ref-filter" className="m-2 flex">
        {DETECTIONS_CATEGORY_REF_OPTIONS.map((item) => (
          <div key={item}>
            {" "}
            <input
              type="checkbox"
              className="mr-2"
              checked={detectionCategoryRefFilter[item]}
              onChange={() => onChangeCategoryRefFilter(item)}
            />
            <label htmlFor={`${item}`} className="mr-2">
              {`${item}`}
            </label>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto border-1">
        <table className="w-full border-collapse border border-gray-200 shadow-lg rounded-lg">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Eyed</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Resolution Status</th>
              <th className="px-4 py-2 border">Service</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Severity</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Updated At</th>
              <th className="px-4 py-2 border">Triggered At</th>
              <th className="px-4 py-2 border">Acknowledged</th>
              <th className="px-4 py-2 border">Resolved</th>
              <th className="px-4 py-2 border">Category Ref</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {result.map((item) => (
              <tr
                key={item.id}
                className="border hover:bg-gray-50 even:bg-gray-50 transition-all"
              >
                <td className="px-4 py-2 border">{item.id}</td>
                <td className="px-4 py-2 border">{item.eyed}</td>
                <td className="px-4 py-2 border">{item.status}</td>
                <td className="px-4 py-2 border">{item.resolutionStatus}</td>
                <td className="px-4 py-2 border">{item.service}</td>
                <td className="px-4 py-2 border">{item.title}</td>
                <td className="px-4 py-2 border">{item.severity}</td>
                {item?.createdAt ? (
                  <td className="px-4 py-2 border">
                    {new Date(item?.createdAt).toLocaleDateString()} <br />
                    {new Date(item?.createdAt).toLocaleTimeString()}
                  </td>
                ) : (
                  <td className="px-4 py-2 border"></td>
                )}
                {item?.updatedAt ? (
                  <td className="px-4 py-2 border">
                    {new Date(item?.updatedAt).toLocaleDateString()} <br />
                    {new Date(item?.updatedAt).toLocaleTimeString()}
                  </td>
                ) : (
                  <td className="px-4 py-2 border"></td>
                )}
                {item?.triggeredAt ? (
                  <td className="px-4 py-2 border">
                    {new Date(item?.triggeredAt).toLocaleDateString()} <br />
                    {new Date(item?.triggeredAt).toLocaleTimeString()}
                  </td>
                ) : (
                  <td className="px-4 py-2 border"></td>
                )}
                <td className="px-4 py-2 border">
                  {item?.acknowledgedAt && (
                    <>
                      {new Date(item?.acknowledgedAt).toLocaleDateString()}{" "}
                      {" - "}
                      {new Date(item?.acknowledgedAt).toLocaleTimeString()}
                      {item?.acknowledgedBy && <br />}
                    </>
                  )}
                  {item?.acknowledgedBy && item?.acknowledgedBy}
                </td>

                <td className="px-4 py-2 border">
                  {item?.resolvedAt && (
                    <>
                      {new Date(item?.resolvedAt).toLocaleDateString()} {" - "}
                      {new Date(item?.resolvedAt).toLocaleTimeString()}
                      {item?.resolvedBy && <br />}
                    </>
                  )}
                  {item?.acknowledgedBy && item?.acknowledgedBy}
                </td>
                <td className="px-4 py-2 border">{item.categoryRef}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
