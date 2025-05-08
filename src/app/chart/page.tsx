"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Line } from "react-chartjs-2";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

type UserEntry = {
  id: string;
  value: number;
  date: string;
  notes?: string;
};

// Import Chart type from chart.js
import { Chart } from "chart.js";
import { Card } from "@/components/ui/Card";
import { useThemeColor } from "@/hooks/useThemeColor";
import ThemeManager from "@/lib/ThemeManager";

export default function ChartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDailyAverages, setShowDailyAverages] = useState(true);
  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [settings, setSettings] = useState({
    weightGoal: 0,
    lossRate: 0.0055,
    bufferValue: 0.0075,
    carbFatRatio: 0.6,
  });
  // Update the ref type to use the proper Chart.js type
  const chartRef = useRef<Chart<"line", (number | null)[], string> | null>(
    null,
  );
  const [isExporting, setIsExporting] = useState(false);
  const onSecondary = useThemeColor("On", "Secondary");
  const focusRing = useThemeColor("Focus Ring", "Assets");
  const infoText = useThemeColor("Text", "Info");
  const destructiveText = useThemeColor("Text", "Destructive");

  const isDarkMode = ThemeManager.getInstance().isDarkMode;

  // Export chart as HD image
  const exportChart = useCallback(() => {
    if (!chartRef.current) return;
    setIsExporting(true);

    try {
      // Set export canvas dimensions
      const HD_WIDTH = 3840;
      const HD_HEIGHT = 2160;

      // Create a high-resolution canvas for rendering
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = HD_WIDTH;
      exportCanvas.height = HD_HEIGHT;

      const ctx = exportCanvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Fill with white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, HD_WIDTH, HD_HEIGHT);

      // Calculate layout dimensions
      const padding = Math.round(HD_WIDTH * 0.05); // 5% padding
      const titleHeight = Math.round(HD_HEIGHT * 0.1); // 10% for title area
      const chartWidth = HD_WIDTH - padding * 2;
      const chartHeight = HD_HEIGHT - titleHeight - padding * 2;

      // Add title with appropriate font size
      const titleFontSize = Math.round(HD_WIDTH * 0.025); // 2.5% of width
      ctx.fillStyle = "black";
      ctx.font = `bold ${titleFontSize}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("Weight Tracking Chart", HD_WIDTH / 2, titleHeight / 2);

      // Add date range if filtering is applied
      if (dateRange.startDate || dateRange.endDate) {
        const subtitleFontSize = Math.round(HD_WIDTH * 0.015); // 1.5% of width
        ctx.font = `${subtitleFontSize}px Arial, sans-serif`;
        ctx.fillStyle = "#666";
        ctx.fillText(
          `Period: ${dateRange.startDate || "Start"} to ${dateRange.endDate || "End"}`,
          HD_WIDTH / 2,
          titleHeight / 2 + subtitleFontSize * 1.5,
        );
      }

      // Create a temporary container for the new chart
      const tempContainer = document.createElement("div");
      tempContainer.style.width = `${chartWidth}px`;
      tempContainer.style.height = `${chartHeight}px`;
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      document.body.appendChild(tempContainer);

      // Create a canvas element for the high-res chart
      const hdChartCanvas = document.createElement("canvas");
      hdChartCanvas.width = chartWidth;
      hdChartCanvas.height = chartHeight;
      tempContainer.appendChild(hdChartCanvas);

      // Clone the current chart configuration for HD rendering
      const hdChartConfig = {
        type: "line",
        data: JSON.parse(JSON.stringify(chartRef.current.data)),
        options: {
          ...JSON.parse(JSON.stringify(chartRef.current.options)),
          responsive: false,
          maintainAspectRatio: false,
          devicePixelRatio: 2, // Higher DPR for sharper rendering
          animation: false, // Disable animations for export
          plugins: {
            ...JSON.parse(JSON.stringify(chartRef.current.options.plugins)),
            legend: {
              ...JSON.parse(
                JSON.stringify(chartRef.current.options.plugins?.legend),
              ),
              labels: {
                ...JSON.parse(
                  JSON.stringify(
                    chartRef.current.options.plugins?.legend?.labels,
                  ),
                ),
                font: {
                  size: Math.round(HD_WIDTH * 0.014), // Larger font size for legend
                  family: "Arial, sans-serif",
                },
                color: "rgba(0, 0, 0, 0.7)", // Force black labels for export
              },
            },
            tooltip: {
              enabled: false, // Disable tooltips in export
            },
          },
          scales: {
            x: {
              ...JSON.parse(JSON.stringify(chartRef.current.options.scales?.x)),
              ticks: {
                ...JSON.parse(
                  JSON.stringify(chartRef.current.options.scales?.x?.ticks),
                ),
                font: {
                  size: Math.round(HD_WIDTH * 0.012),
                  family: "Arial, sans-serif",
                },
                color: "rgba(0, 0, 0, 0.7)", // Force black date description for export
              },
              grid: {
                ...JSON.parse(
                  JSON.stringify(chartRef.current.options.scales?.x?.grid),
                ),
                color: "rgba(0, 0, 0, 0.2)", // Force light grid for export
              },
            },
            y: {
              ...JSON.parse(JSON.stringify(chartRef.current.options.scales?.y)),
              ticks: {
                ...JSON.parse(
                  JSON.stringify(chartRef.current.options.scales?.y?.ticks),
                ),
                font: {
                  size: Math.round(HD_WIDTH * 0.012),
                  family: "Arial, sans-serif",
                },
                color: "rgba(0, 0, 0, 0.7)", // Force black weight description for export
              },
              grid: {
                ...JSON.parse(
                  JSON.stringify(chartRef.current.options.scales?.y?.grid),
                ),
                color: "rgba(0, 0, 0, 0.2)", // Force light grid for export
              },
            },
          },
        },
      };

      // Enhance dataset visuals for HD
      hdChartConfig.data.datasets = hdChartConfig.data.datasets.map(
        (dataset: { borderWidth?: number; pointRadius?: number }) => ({
          ...dataset,
          borderWidth: dataset.borderWidth ? dataset.borderWidth * 1.5 : 2, // Thicker lines
          pointRadius: dataset.pointRadius ? dataset.pointRadius * 1.5 : 0, // Larger points
        }),
      );

      // Create a new Chart.js instance for the HD export
      const hdChartInstance = new ChartJS(hdChartCanvas, hdChartConfig);

      // Wait for the chart to render
      setTimeout(() => {
        try {
          // Draw the HD chart onto our main export canvas
          ctx.drawImage(
            hdChartCanvas,
            padding,
            titleHeight,
            chartWidth,
            chartHeight,
          );

          // Add watermark/info at the bottom right
          const footerFontSize = Math.round(HD_WIDTH * 0.01);
          ctx.font = `${footerFontSize}px Arial, sans-serif`;
          ctx.fillStyle = "#999";
          ctx.textAlign = "right";
          /*
          ctx.fillText(
            `HD Export (${HD_WIDTH}×${HD_HEIGHT})`, 
            HD_WIDTH - padding, 
            HD_HEIGHT - padding / 2
          );
          */

          // Convert to blob and download
          exportCanvas.toBlob(
            (blob) => {
              if (!blob) {
                throw new Error("Failed to create image blob");
              }

              // Clean up temporary elements
              hdChartInstance.destroy();
              document.body.removeChild(tempContainer);

              // Create a download link
              const today = new Date();
              const formattedDate = today.toISOString().split("T")[0];
              const fileName = `weight-chart-${formattedDate}.png`;

              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = fileName;
              link.click();

              // Clean up object URL
              setTimeout(() => URL.revokeObjectURL(link.href), 100);
              setIsExporting(false);
            },
            "image/png",
            1.0,
          ); // Use maximum quality
        } catch (err) {
          console.error("Error during chart export:", err);
          hdChartInstance.destroy();
          document.body.removeChild(tempContainer);
          setIsExporting(false);
          alert("Failed to export chart. Please try again.");
        }
      }, 200); // Small delay to ensure chart is rendered fully
    } catch (err) {
      console.error("Error setting up chart export:", err);
      setIsExporting(false);
      alert("Failed to export chart. Please try again.");
    }
  }, [chartRef, dateRange.startDate, dateRange.endDate]);

  // Load user settings
  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings({
            weightGoal: data.settings.weightGoal || 0,
            lossRate: data.settings.lossRate || 0.0055,
            bufferValue: data.settings.bufferValue || 0.0075,
            carbFatRatio: data.settings.carbFatRatio || 0.6,
          });
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }, []);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/entries");

      if (response.status === 401) {
        // Unauthorized - redirect to login
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load data");
      }

      const data = await response.json();

      // Sort by date (oldest to newest)
      const sortedData = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      setEntries(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      loadEntries();
      loadSettings();
    }
  }, [status, router, loadEntries, loadSettings]);

  // Format date for chart labels - removing time component to group by day
  const formatDateForGrouping = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  // Format date for display on chart
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Process entries to get daily averages
  const getDailyAverages = (entries: UserEntry[]) => {
    const dailyEntries: { [key: string]: number[] } = {};

    // Group entries by date (ignoring time)
    entries.forEach((entry) => {
      const dateKey = formatDateForGrouping(entry.date);
      if (!dailyEntries[dateKey]) {
        dailyEntries[dateKey] = [];
      }
      dailyEntries[dateKey].push(entry.value);
    });

    // Calculate average for each day
    const result = Object.keys(dailyEntries).map((dateKey) => {
      const values = dailyEntries[dateKey];
      const sum = values.reduce((total, val) => total + val, 0);
      const average = sum / values.length;

      // Use the first date from that day to preserve the date object
      const dateObj = new Date(dateKey);

      return {
        date: dateObj.toISOString(),
        value: parseFloat(average.toFixed(2)), // Round to 2 decimal places
        count: values.length, // Include count of measurements
      };
    });

    // Sort by date
    return result.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  };

  // Calculate linear regression for trend line
  const calculateTrendLine = (data: { date: string; value: number }[]) => {
    if (data.length < 2) return [];

    // Convert dates to numeric values (days since first entry)
    const firstDate = new Date(data[0].date).getTime();
    const xValues = data.map(
      (point) =>
        (new Date(point.date).getTime() - firstDate) / (1000 * 60 * 60 * 24),
    );
    const yValues = data.map((point) => point.value);

    // Calculate means
    const xMean = xValues.reduce((sum, x) => sum + x, 0) / xValues.length;
    const yMean = yValues.reduce((sum, y) => sum + y, 0) / yValues.length;

    // Calculate linear regression coefficients
    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < xValues.length; i++) {
      numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
      denominator += (xValues[i] - xMean) * (xValues[i] - xMean);
    }

    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = yMean - slope * xMean;

    // Generate trend line points
    return data.map((point) => {
      const x =
        (new Date(point.date).getTime() - firstDate) / (1000 * 60 * 60 * 24);
      return {
        x,
        y: slope * x + intercept,
      };
    });
  };

  // Calculate floor line based on starting value and settings
  const calculateFloorLine = (
    dailyAverages: Array<{ date: string; value: number }>,
    settings: { weightGoal: number; lossRate: number; bufferValue: number },
  ) => {
    if (dailyAverages.length < 7) return [];

    // Calculate starting value (average of first 6 days)
    const first6DaysData = dailyAverages.slice(0, 6);
    const sumFirst6Days = first6DaysData.reduce(
      (sum, day) => sum + day.value,
      0,
    );
    const startValue = sumFirst6Days / 6;

    // Initialize result with empty values for the first 6 days
    const result: Array<number | null> = Array(6).fill(null);

    // Calculate floor value for day 7
    const day7FloorValue = startValue - startValue * settings.bufferValue * 0.5;
    result.push(day7FloorValue);

    // Calculate remaining floor values
    let previousFloor = day7FloorValue;

    for (let i = 7; i < dailyAverages.length; i++) {
      const newFloor =
        previousFloor -
        (previousFloor - settings.weightGoal) * settings.lossRate;
      result.push(newFloor);
      previousFloor = newFloor;
    }

    return result;
  };

  // Calculate ceiling line based on starting value and settings
  const calculateCeilingLine = (
    dailyAverages: Array<{ date: string; value: number }>,
    settings: {
      weightGoal: number;
      lossRate: number;
      bufferValue: number;
      carbFatRatio: number;
    },
  ) => {
    if (dailyAverages.length < 7) return [];

    // Calculate starting value (average of first 6 days)
    const first6DaysData = dailyAverages.slice(0, 6);
    const sumFirst6Days = first6DaysData.reduce(
      (sum, day) => sum + day.value,
      0,
    );
    const startValue = sumFirst6Days / 6;

    // Initialize result with empty values for the first 6 days
    const result: Array<number | null> = Array(6).fill(null);

    // Calculate ceiling value for day 7
    const day7CeilingValue =
      startValue + startValue * settings.bufferValue * 0.5;
    result.push(day7CeilingValue);

    // Calculate remaining ceiling values
    let previousCeiling = day7CeilingValue;

    for (let i = 7; i < dailyAverages.length; i++) {
      const adjustedGoal =
        settings.weightGoal + settings.weightGoal * settings.bufferValue;
      const newCeiling =
        previousCeiling -
        (previousCeiling - adjustedGoal) *
          settings.lossRate *
          settings.carbFatRatio;
      result.push(newCeiling);
      previousCeiling = newCeiling;
    }

    return result;
  };

  // Calculate ideal line as average of floor and ceiling
  const calculateIdealLine = (
    floorData: Array<number | null>,
    ceilingData: Array<number | null>,
  ) => {
    if (floorData.length !== ceilingData.length) return [];

    return floorData.map((floor, index) => {
      const ceiling = ceilingData[index];
      if (floor === null || ceiling === null) return null;
      return (floor + ceiling) / 2;
    });
  };

  // Filter entries by date range
  const getFilteredEntries = (entries: UserEntry[]) => {
    if (!dateRange.startDate && !dateRange.endDate) {
      return entries; // No filtering
    }

    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);

      // Check start date if set
      if (dateRange.startDate) {
        const startDate = new Date(dateRange.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (entryDate < startDate) return false;
      }

      // Check end date if set
      if (dateRange.endDate) {
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (entryDate > endDate) return false;
      }

      return true;
    });
  };

  // Reset date filters
  const resetDateRange = () => {
    setDateRange({
      startDate: null,
      endDate: null,
    });
  };

  // Handle date range change
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value || null,
    }));
  };

  // Apply common date ranges
  const applyPresetRange = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    setDateRange({
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    });
  };

  // Display loading state while checking authentication
  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!session) {
    return null;
  }

  if (error) {
    return (
      <Alert variant="error">
        <p>{error}</p>
        <Button
          onClick={() => loadEntries()}
          className="mt-2"
          variant="primary"
          size="sm"
        >
          Retry
        </Button>
      </Alert>
    );
  }

  // Process all entries for consistent calculations regardless of filter
  const allDailyAverages = getDailyAverages(entries);

  // Calculate reference lines based on ALL data
  const allTrendLineData = calculateTrendLine(
    showDailyAverages
      ? allDailyAverages.map((day) => ({ date: day.date, value: day.value }))
      : entries.map((entry) => ({ date: entry.date, value: entry.value })),
  );

  // Calculate floor and ceiling lines based on ALL data
  const allFloorLineData = calculateFloorLine(allDailyAverages, settings);
  const allCeilingLineData = calculateCeilingLine(allDailyAverages, {
    ...settings,
    carbFatRatio: settings.carbFatRatio || 0.6,
  });

  // Calculate ideal line as average of floor and ceiling from ALL data
  const allIdealLineData = calculateIdealLine(
    allFloorLineData,
    allCeilingLineData,
  );

  // Apply date filtering only for display
  const filteredEntries = getFilteredEntries(entries);
  const filteredDailyAverages = getDailyAverages(filteredEntries);

  // Find the indices in the complete dataset that correspond to the filtered range
  const getLineDataForFilteredRange = (
    completeData: Array<number | null>,
    filteredDates: Array<{ date: string }>,
  ) => {
    if (completeData.length === 0 || filteredDates.length === 0) return [];

    // If no filtering is active, return the full dataset
    if (!dateRange.startDate && !dateRange.endDate) {
      return completeData;
    }

    // Create result array with correct length
    const result: Array<number | null> = [];

    // For each date in the filtered range, find the corresponding value in the complete dataset
    filteredDates.forEach((dateItem) => {
      const date = new Date(dateItem.date).getTime();
      const allDates = allDailyAverages.map((d) => new Date(d.date).getTime());
      const allIndex = allDates.findIndex((d) => d >= date);

      // If date is found in complete dataset, use that value
      if (allIndex !== -1 && allIndex < completeData.length) {
        result.push(completeData[allIndex]);
      } else {
        result.push(null);
      }
    });

    return result;
  };

  // Get the trend, floor, ceiling and ideal data for the filtered view
  const filteredTrendLineData =
    allTrendLineData.length && filteredDailyAverages.length
      ? getLineDataForFilteredRange(
          allTrendLineData.map((point) => point.y),
          filteredDailyAverages,
        )
      : [];

  const filteredFloorLineData = getLineDataForFilteredRange(
    allFloorLineData,
    filteredDailyAverages,
  );
  const filteredCeilingLineData = getLineDataForFilteredRange(
    allCeilingLineData,
    filteredDailyAverages,
  );
  const filteredIdealLineData = getLineDataForFilteredRange(
    allIdealLineData,
    filteredDailyAverages,
  );

  // Set up Chart.js data
  const labels = showDailyAverages
    ? filteredDailyAverages.map((day) => formatDate(day.date))
    : filteredEntries.map((entry) => formatDate(entry.date));

  const dataPoints = showDailyAverages
    ? filteredDailyAverages.map((day) => day.value)
    : filteredEntries.map((entry) => entry.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: showDailyAverages ? "Daily Average" : "Individual Measurements",
        data: dataPoints,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.2,
        pointRadius: 4,
        pointBackgroundColor: "rgb(59, 130, 246)",
      },
      {
        label: "Trend Line",
        data: filteredTrendLineData,
        borderColor: "rgba(255, 99, 132, 0.8)",
        backgroundColor: "rgba(255, 99, 132, 0.4)",
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        tension: 0,
      },
      {
        label: "Floor Line",
        data: filteredFloorLineData,
        borderColor: "lime",
        backgroundColor: "rgba(0, 255, 0, 0.4)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0,
      },
      {
        label: "Ceiling Line",
        data: filteredCeilingLineData,
        borderColor: "rgba(255, 0, 0, 0.8)",
        backgroundColor: "rgba(255, 0, 0, 0.4)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0,
      },
      {
        label: "Ideal Line",
        data: filteredIdealLineData,
        borderColor: "rgba(128, 128, 128, 0.8)",
        backgroundColor: "rgba(128, 128, 128, 0.4)",
        borderWidth: 2,
        borderDash: [3, 3],
        pointRadius: 0,
        tension: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
        },
      },
      x: {
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
        },
      },
      tooltip: {
        titleColor: isDarkMode
          ? "rgba(255, 255, 255, 0.9)"
          : "rgba(0, 0, 0, 0.9)",
        bodyColor: isDarkMode
          ? "rgba(255, 255, 255, 0.9)"
          : "rgba(0, 0, 0, 0.9)",
        backgroundColor: isDarkMode
          ? "rgba(50, 50, 50, 0.9)"
          : "rgba(255, 255, 255, 0.9)",
        borderColor: isDarkMode
          ? "rgba(70, 70, 70, 0.9)"
          : "rgba(220, 220, 220, 0.9)",
      },
    },
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Chart</h1>

        {entries.length > 0 && (
          <div className="flex items-center space-x-3">
            <span className={`text-sm ${onSecondary}`}>View mode:</span>
            <div className="flex items-center">
              <Button
                onClick={() => setShowDailyAverages(true)}
                className={`px-0 rounded-l`}
                variant={showDailyAverages ? "primary" : "outline"}
                size="sm"
              >
                Daily Averages
              </Button>
              <Button
                onClick={() => setShowDailyAverages(false)}
                className={`px-0 rounded-r`}
                variant={!showDailyAverages ? "primary" : "outline"}
                size="sm"
              >
                All Data Points
              </Button>
            </div>
            <Button
              onClick={exportChart}
              variant="success"
              size="sm"
              disabled={isExporting}
              isLoading={isExporting}
            >
              {isExporting ? "Exporting..." : "Export Chart"}
            </Button>
          </div>
        )}
      </div>

      {entries.length > 0 && (
        <Card className={`mb-6 p-4 rounded-lg shadow-sm`} variant="default">
          <h2 className={`text-lg font-medium mb-3 ${onSecondary}`}>
            Date Range Selection
          </h2>
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="startDate"
                className={`text-sm font-medium mb-1 ${onSecondary}`}
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={dateRange.startDate || ""}
                onChange={handleDateRangeChange}
                className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 ${focusRing} ${onSecondary}`}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="endDate"
                className={`text-sm font-medium mb-1 ${onSecondary}`}
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={dateRange.endDate || ""}
                onChange={handleDateRangeChange}
                className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 ${focusRing} ${onSecondary}`}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={resetDateRange} variant="outline" size="sm">
                Reset
              </Button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`text-sm self-center mr-2 ${onSecondary}`}>
              Quick select:
            </span>
            {[7, 30, 90, 180, 365].map((days) => (
              <Button
                key={days}
                onClick={() => applyPresetRange(days)}
                variant="outline"
                size="xs"
              >
                {days === 7
                  ? "Last 7 Days"
                  : days === 30
                    ? "Last 30 Days"
                    : days === 90
                      ? "Last 3 Months"
                      : days === 180
                        ? "Last 6 Months"
                        : "Last Year"}
              </Button>
            ))}
          </div>

          {(dateRange.startDate || dateRange.endDate) && (
            <div className="mt-3 text-sm">
              <span className={`font-medium ${infoText}`}>
                Filtered data: {filteredEntries.length} entries
                {showDailyAverages
                  ? ` (${filteredDailyAverages.length} days)`
                  : ""}
              </span>
              {filteredEntries.length === 0 && (
                <span className={`ml-2 ${destructiveText}`}>
                  No data in selected range
                </span>
              )}
            </div>
          )}
        </Card>
      )}

      {entries.length === 0 ? (
        <Alert variant="info" icon={true}>
          No entries found. Create some entries on the homepage.
        </Alert>
      ) : (
        <div>
          <div className="w-full" style={{ height: "400px" }}>
            <Line ref={chartRef} data={chartData} options={chartOptions} />
          </div>

          {showDailyAverages && filteredDailyAverages.length > 0 && (
            <div className={`mt-4 text-sm ${onSecondary} text-center`}>
              Showing daily averages from {filteredDailyAverages.length} days of
              data
            </div>
          )}
        </div>
      )}
    </div>
  );
}
