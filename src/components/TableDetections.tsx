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
    "Resolution Status",
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
      <div className="flex flex-row my-4">
        <h1 className="text-3xl ">Detections Table</h1>
        <div className="w-[400px] text-center pt-3">
          {apiResponse.length === 0 && !apiError ? (
            <h3>Loading ....</h3>
          ) : (
            apiError && apiResponse.length === 0 && <h3>Mock API</h3>
          )}
        </div>
      </div>
      <div className="flex flex-row">
        <div className="text-sm w-[300px]">
          <div className="form-control self-center m-4 border-none">
            <label className="input ">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="input input-bordered w-24 md:w-auto text-base focus:outline-none"
                value={searchString}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchString(e.target.value)
                }
              />
            </label>
          </div>

          <ul className="menu bg-base-200 rounded-box w-70 text-[12px]">
            <li>
              <h3 className="menu-title">Status</h3>
              <ul>
                {DETECTIONS_STATUS_OPTIONS.map((item) => (
                  <li key={item}>
                    <label>
                      {" "}
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={detectionStatusFilter[item]}
                        onChange={() => onChangeStatusFilter(item)}
                      />
                      <span className="mr-2">{`${item}`}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <h3 className="menu-title">Resolution Status</h3>
              <ul>
                {DETECTIONS_RESOLUTION_STATUS_OPTIONS.map((item) => (
                  <li key={item}>
                    <label>
                      {" "}
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={detectionResolutionStatusFilter[item]}
                        onChange={() => onChangeStatusResolutionFilter(item)}
                      />
                      <span className="mr-2">{`${item}`}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <h3 className="menu-title">Severity</h3>
              <ul>
                {DETECTIONS_SEVERITY_OPTIONS.map((item) => (
                  <li key={item}>
                    <label>
                      {" "}
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={detectionSeverityFilter[item]}
                        onChange={() => onChangeSeverityFilter(item)}
                      />
                      <span className="mr-2">{`${item}`}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <h3 className="menu-title">Category Ref</h3>
              <ul>
                {DETECTIONS_CATEGORY_REF_OPTIONS.map((item) => (
                  <li key={item}>
                    <label>
                      {" "}
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={detectionCategoryRefFilter[item]}
                        onChange={() => onChangeCategoryRefFilter(item)}
                      />
                      <span className="mr-2">{`${item}`}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>

        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm text-wrap">
              <tr>
                {T_HEAD.map((item) => (
                  <th key={item}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {result.map((item) => (
                <tr key={item.id} className="hover:bg-base-300">
                  <td>{item.eyed}</td>
                  <td>{item.status}</td>
                  <td>{item.resolutionStatus}</td>
                  <td>{item.service}</td>
                  <td>{item.title}</td>
                  <td>{item.severity}</td>
                  {item?.createdAt ? (
                    <td>
                      <DateELement
                        date={item?.createdAt}
                        isContactEmail={false}
                      />
                    </td>
                  ) : (
                    <td></td>
                  )}
                  {item?.updatedAt ? (
                    <td>
                      <DateELement
                        date={item?.updatedAt}
                        isContactEmail={false}
                      />
                    </td>
                  ) : (
                    <td></td>
                  )}
                  {item?.triggeredAt ? (
                    <td>
                      <DateELement
                        date={item?.triggeredAt}
                        isContactEmail={false}
                      />
                    </td>
                  ) : (
                    <td></td>
                  )}
                  <td>
                    {item.acknowledgedAt && (
                      <DateELement
                        date={item?.acknowledgedAt}
                        isContactEmail={true}
                        contactEmail={item?.acknowledgedBy}
                      />
                    )}
                  </td>

                  <td>
                    {item.resolvedAt && (
                      <DateELement
                        date={item?.resolvedAt}
                        isContactEmail={true}
                        contactEmail={item?.resolvedBy}
                      />
                    )}
                  </td>
                  <td>{item.categoryRef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
