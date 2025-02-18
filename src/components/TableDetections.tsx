import { useState, ChangeEvent, useMemo, ReactElement, useEffect } from "react";
import {
  DetectionStatus,
  Detection,
  DetectionResolutionStatus,
  DetectionSeverity,
  DetectionCategoryRef,
} from "../types";
import { mockDetections } from "../data";
import { useDebounce } from "use-debounce";
import { DateELement } from "./DateElement";
import { AUTHORIZATION } from "../authentication/credentials";

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
  const [apiResponse, setApiResponse] = useState<Detection[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [searchStringDebounced] = useDebounce(searchString, 300);

  const [apiError, setApiError] = useState(false);

  const T_HEAD = [
    "Eyed",
    "Status",
    `Resolution Status`,
    "Service",
    "Title",
    "Severity",
    "Created At",
    "Updated At",
    "Triggered At",
    "Acknowledged",
    "Resolved",
    "Category Ref",
  ];
  const API_LIMIT = 20;
  const API_PAGE = 0;

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

  useEffect(() => {
    const fetchDetections = async () => {
      const url = `/api/detections?page=${API_PAGE}0&limit=${API_LIMIT}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: AUTHORIZATION,
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          setApiError(true);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setApiResponse(data);

        return data;
      } catch (error) {
        console.error("Error fetching detections:", error);
        setApiError(true);
        return [];
      }
    };

    fetchDetections();
  }, []);

  const result = useMemo(() => {
    const searchStringDebouncedLowerCase = searchStringDebounced.toLowerCase();
    const dataToFilter =
      apiResponse.length !== 0 ? apiResponse : mockDetections; // Default to mockDetections if API error

    return dataToFilter
      .filter(
        (item: Detection) =>
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
    apiResponse,
  ]);

  return (
    <div>
      <h1>Detections Table</h1>
      <div className="flex flex-row">
        <div className="text-sm w-[300px]">
          <div className="form-control self-center">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto text-base"
              value={searchString}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchString(e.target.value)
              }
            />
          </div>
          <div>
            <h3>Status</h3>
            <div id="status-filter" className="m-2 flex flex-col">
              {DETECTIONS_STATUS_OPTIONS.map((item) => (
                <label key={item}>
                  {" "}
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={detectionStatusFilter[item]}
                    onChange={() => onChangeStatusFilter(item)}
                  />
                  <span className="mr-2">{`${item}`}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div>
              <h3>Resolution Status</h3>
            </div>
            <div id="status-resolution-filter" className="m-2 flex flex-col">
              {" "}
              {DETECTIONS_RESOLUTION_STATUS_OPTIONS.map((item) => (
                <label key={item}>
                  {" "}
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={detectionResolutionStatusFilter[item]}
                    onChange={() => onChangeStatusResolutionFilter(item)}
                  />
                  <span className="mr-2">{`${item}`}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div>
              <h3>Severity</h3>
            </div>
            <div id="severity-filter" className="m-2 flex flex-col">
              {DETECTIONS_SEVERITY_OPTIONS.map((item) => (
                <label key={item}>
                  {" "}
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={detectionSeverityFilter[item]}
                    onChange={() => onChangeSeverityFilter(item)}
                  />
                  <span className="mr-2">{`${item}`}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <div>
              <h3>Category Ref</h3>
            </div>
            <div id="category-ref-filter" className="m-2 flex flex-col">
              {DETECTIONS_CATEGORY_REF_OPTIONS.map((item) => (
                <label key={item}>
                  {" "}
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={detectionCategoryRefFilter[item]}
                    onChange={() => onChangeCategoryRefFilter(item)}
                  />
                  <span className="mr-2">{`${item}`}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto border-1">
          {apiResponse.length === 0 && !apiError && <h3>Loading ....</h3>}
          {apiError && apiResponse.length === 0 && <h3>Mock API</h3>}
          <table className="w-full border-collapse border border-gray-200 shadow-lg rounded-lg">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                {T_HEAD.map((item) => (
                  <th key={item} className="px-4 py-2 border">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {result.map((item) => (
                <tr
                  key={item.id}
                  className="border hover:bg-gray-50 even:bg-gray-50 transition-all"
                >
                  <td className="px-4 py-2 border">{item.eyed}</td>
                  <td className="px-4 py-2 border">{item.status}</td>
                  <td className="px-4 py-2 border">{item.resolutionStatus}</td>
                  <td className="px-4 py-2 border">{item.service}</td>
                  <td className="px-4 py-2 border">{item.title}</td>
                  <td className="px-4 py-2 border">{item.severity}</td>
                  {item?.createdAt ? (
                    <td className="px-4 py-2 border">
                      <DateELement
                        date={item?.createdAt}
                        isContactEmail={false}
                      />
                    </td>
                  ) : (
                    <td className="px-4 py-2 border"></td>
                  )}
                  {item?.updatedAt ? (
                    <td className="px-4 py-2 border">
                      <DateELement
                        date={item?.updatedAt}
                        isContactEmail={false}
                      />
                    </td>
                  ) : (
                    <td className="px-4 py-2 border"></td>
                  )}
                  {item?.triggeredAt ? (
                    <td className="px-4 py-2 border">
                      <DateELement
                        date={item?.triggeredAt}
                        isContactEmail={false}
                      />
                    </td>
                  ) : (
                    <td className="px-4 py-2 border"></td>
                  )}
                  <td className="px-4 py-2 border">
                    {item.acknowledgedAt && (
                      <DateELement
                        date={item?.acknowledgedAt}
                        isContactEmail={true}
                        contactEmail={item?.acknowledgedBy}
                      />
                    )}
                  </td>

                  <td className="px-4 py-2 border">
                    {item.resolvedAt && (
                      <DateELement
                        date={item?.resolvedAt}
                        isContactEmail={true}
                        contactEmail={item?.resolvedBy}
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 border">{item.categoryRef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
