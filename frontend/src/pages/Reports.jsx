import { useEffect, useRef, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import api from "../services/api"


function DatePicker({
  value,
  onChange,
  label,
  minDate,
  align = "left",
}) {
  const today = new Date()

  const [isOpen, setIsOpen] = useState(false)

  const [calendarMonth, setCalendarMonth] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    )

  const [calendarView, setCalendarView] =
    useState("days")

  const pickerRef = useRef(null)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const monthShortNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  // =========================
  // HELPERS
  // =========================

  const toDateString = (date) => {
    const year = date.getFullYear()

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0")

    const day = String(
      date.getDate()
    ).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  const formatDate = (date) => {
    if (!date) return ""

    const [year, month, day] =
      date.split("-").map(Number)

    return new Date(
      year,
      month - 1,
      day
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // =========================
  // OPEN PICKER
  // =========================

  const openPicker = () => {
    setIsOpen(true)
    setCalendarView("days")

    if (value) {
      const [year, month] =
        value.split("-").map(Number)

      setCalendarMonth(
        new Date(
          year,
          month - 1,
          1
        )
      )
    } else {
      setCalendarMonth(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        )
      )
    }
  }

  // =========================
  // CLOSE OUTSIDE
  // =========================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(
          event.target
        )
      ) {
        setIsOpen(false)
        setCalendarView("days")
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      )
    }
  }, [])

  // =========================
  // CALENDAR DAYS
  // =========================

  const getCalendarDays = () => {
    const year =
      calendarMonth.getFullYear()

    const month =
      calendarMonth.getMonth()

    const firstDay = new Date(
      year,
      month,
      1
    ).getDay()

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate()

    const days = []

    for (
      let index = 0;
      index < firstDay;
      index++
    ) {
      days.push(null)
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      days.push(
        new Date(
          year,
          month,
          day
        )
      )
    }

    return days
  }

  // =========================
  // SELECT DATE
  // =========================

  const handleSelectDate = (date) => {
    if (!date) return

    const selectedDate =
      toDateString(date)

    if (
      minDate &&
      selectedDate < minDate
    ) {
      return
    }

    onChange(selectedDate)

    setIsOpen(false)
    setCalendarView("days")
  }

  // =========================
  // MONTH NAVIGATION
  // =========================

  const previousMonth = () => {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() - 1,
        1
      )
    )
  }

  const nextMonth = () => {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + 1,
        1
      )
    )
  }

  // =========================
  // MONTH SELECTION
  // =========================

  const handleMonthSelect = (
    monthIndex
  ) => {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        monthIndex,
        1
      )
    )

    setCalendarView("days")
  }

  // =========================
  // YEAR SELECTION
  // =========================

  const currentYear =
    today.getFullYear()

  const years = []

  for (
    let year = currentYear - 10;
    year <= currentYear + 10;
    year++
  ) {
    years.push(year)
  }

  const handleYearSelect = (year) => {
    setCalendarMonth(
      new Date(
        year,
        calendarMonth.getMonth(),
        1
      )
    )

    setCalendarView("days")
  }

  // =========================
  // TODAY
  // =========================

  const handleToday = () => {
    const todayValue =
      toDateString(today)

    if (
      minDate &&
      todayValue < minDate
    ) {
      return
    }

    onChange(todayValue)

    setCalendarMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    )

    setIsOpen(false)
    setCalendarView("days")
  }

  return (
    <div
      className={`form-group date-picker-group ${
        align === "right"
          ? "end-date-picker"
          : ""
      }`}
      ref={pickerRef}
    >
      <label>
        {label}
      </label>

      <button
        type="button"
        className="date-picker-button"
        onClick={openPicker}
      >
        <span
          className={
            value
              ? "date-value"
              : "date-placeholder"
          }
        >
          {value
            ? formatDate(value)
            : `Select ${label.toLowerCase()}`}
        </span>

        <svg
          className="calendar-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="18"
            rx="2"
          />

          <line
            x1="16"
            y1="2"
            x2="16"
            y2="6"
          />

          <line
            x1="8"
            y1="2"
            x2="8"
            y2="6"
          />

          <line
            x1="3"
            y1="10"
            x2="21"
            y2="10"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="custom-calendar">

          {/* DAYS VIEW */}

          {calendarView === "days" && (
            <>
              <div className="calendar-header">

                <button
                  type="button"
                  className="calendar-nav-button"
                  onClick={
                    previousMonth
                  }
                >
                  ‹
                </button>

                <div className="calendar-title">

                  <button
                    type="button"
                    className="calendar-month-button"
                    onClick={() =>
                      setCalendarView(
                        "months"
                      )
                    }
                  >
                    {
                      monthNames[
                        calendarMonth.getMonth()
                      ]
                    }
                  </button>

                  <button
                    type="button"
                    className="calendar-year-button"
                    onClick={() =>
                      setCalendarView(
                        "years"
                      )
                    }
                  >
                    {
                      calendarMonth.getFullYear()
                    }
                  </button>

                </div>

                <button
                  type="button"
                  className="calendar-nav-button"
                  onClick={
                    nextMonth
                  }
                >
                  ›
                </button>

              </div>

              <div className="calendar-weekdays">

                {[
                  "Su",
                  "Mo",
                  "Tu",
                  "We",
                  "Th",
                  "Fr",
                  "Sa",
                ].map((day) => (
                  <span key={day}>
                    {day}
                  </span>
                ))}

              </div>

              <div className="calendar-days">

                {getCalendarDays().map(
                  (
                    date,
                    index
                  ) => {

                    if (!date) {
                      return (
                        <span
                          key={`empty-${index}`}
                        />
                      )
                    }

                    const dateValue =
                      toDateString(
                        date
                      )

                    const isSelected =
                      dateValue ===
                      value

                    const isToday =
                      dateValue ===
                      toDateString(
                        today
                      )

                    const isDisabled =
                      minDate &&
                      dateValue <
                        minDate

                    return (
                      <button
                        type="button"
                        key={dateValue}
                        disabled={
                          isDisabled
                        }
                        className={`
                          ${isSelected ? "selected" : ""}
                          ${isToday ? "today" : ""}
                          ${isDisabled ? "disabled" : ""}
                        `}
                        onClick={() =>
                          handleSelectDate(
                            date
                          )
                        }
                      >
                        {
                          date.getDate()
                        }
                      </button>
                    )
                  }
                )}

              </div>

              <div className="calendar-footer">

                <button
                  type="button"
                  onClick={
                    handleToday
                  }
                >
                  Today
                </button>

              </div>
            </>
          )}

          {/* MONTH VIEW */}

          {calendarView === "months" && (
            <div className="calendar-selection">

              <div className="calendar-selection-header">
                <strong>
                  Select Month
                </strong>
              </div>

              <div className="calendar-month-grid">

                {monthShortNames.map(
                  (
                    month,
                    index
                  ) => {

                    const isActive =
                      index ===
                      calendarMonth.getMonth()

                    return (
                      <button
                        type="button"
                        key={month}
                        className={
                          isActive
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          handleMonthSelect(
                            index
                          )
                        }
                      >
                        {month}
                      </button>
                    )
                  }
                )}

              </div>

              <button
                type="button"
                className="calendar-back-button"
                onClick={() =>
                  setCalendarView(
                    "days"
                  )
                }
              >
                Back to calendar
              </button>

            </div>
          )}

          {/* YEAR VIEW */}

          {calendarView === "years" && (
            <div className="calendar-selection">

              <div className="calendar-selection-header">
                <strong>
                  Select Year
                </strong>
              </div>

              <div className="calendar-year-grid">

                {years.map(
                  (year) => {

                    const isActive =
                      year ===
                      calendarMonth.getFullYear()

                    return (
                      <button
                        type="button"
                        key={year}
                        className={
                          isActive
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          handleYearSelect(
                            year
                          )
                        }
                      >
                        {year}
                      </button>
                    )
                  }
                )}

              </div>

              <button
                type="button"
                className="calendar-back-button"
                onClick={() =>
                  setCalendarView(
                    "days"
                  )
                }
              >
                Back to calendar
              </button>

            </div>
          )}

        </div>
      )}
    </div>
  )
}


function Reports() {
  const [startDate, setStartDate] =
    useState("")

  const [endDate, setEndDate] =
    useState("")

  const [report, setReport] =
    useState(null)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")


  // =========================
  // FORMAT CURRENCY
  // =========================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }
    ).format(value || 0)
  }


  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) return ""

    const [year, month, day] =
      date.split("-").map(Number)

    return new Date(
      year,
      month - 1,
      day
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }


  // =========================
  // GENERATE REPORT
  // =========================

  const handleGenerateReport =
    async () => {

      if (!startDate || !endDate) {
        setError(
          "Please select start date and end date."
        )

        return
      }

      if (startDate > endDate) {
        setError(
          "Start date cannot be later than end date."
        )

        return
      }

      try {
        setLoading(true)
        setError("")

        const response =
          await api.get(
            "/reports",
            {
              params: {
                start_date:
                  startDate,
                end_date:
                  endDate,
              },
            }
          )

        setReport(
          response.data.data
        )
      } catch (error) {
        console.error(error)

        setReport(null)

        setError(
          error.response?.data?.detail ||
            "Gagal mengambil financial report."
        )
      } finally {
        setLoading(false)
      }
    }


  // =========================
  // EXPENSE CATEGORY DATA
  // =========================

  const categoryData =
    report
      ? Object.entries(
          report.expense_by_category || {}
        ).map(
          ([name, value]) => ({
            name,
            value: Number(value),
          })
        )
      : []


  // =========================
  // SUMMARY VALUES
  // =========================

  const totalIncome =
    Number(
      report?.total_income || 0
    )

  const totalExpense =
    Number(
      report?.total_expense || 0
    )

  const balance =
    Number(
      report?.balance || 0
    )


  return (
    <div className="page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">

        <div>

          <h1>
            Financial Reports
          </h1>

          <p>
            Analyze your income and expenses.
          </p>

        </div>

      </div>


      {/* =========================
          DATE FILTERS
      ========================= */}

      <div className="report-filters">

        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={setStartDate}
        />

        <DatePicker
          label="End Date"
          value={endDate}
          onChange={setEndDate}
          minDate={startDate}
          align="right"
        />

        <button
          type="button"
          className="primary-button"
          onClick={
            handleGenerateReport
          }
          disabled={loading}
        >
          {loading
            ? "Generating..."
            : "Generate Report"}
        </button>

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}


      {/* =========================
          REPORT PERIOD
      ========================= */}

      {report && (
        <div className="report-period">

          <span>
            Report Period
          </span>

          <strong>
            {formatDate(
              report.start_date
            )}

            {" — "}

            {formatDate(
              report.end_date
            )}
          </strong>

        </div>
      )}


      {/* =========================
          SUMMARY
      ========================= */}

      {report && (
        <div className="report-summary">

          <div className="report-card">

            <span>
              Total Income
            </span>

            <strong>
              {formatCurrency(
                totalIncome
              )}
            </strong>

          </div>


          <div className="report-card">

            <span>
              Total Expense
            </span>

            <strong>
              {formatCurrency(
                totalExpense
              )}
            </strong>

          </div>


          <div className="report-card">

            <span>
              Balance
            </span>

            <strong>
              {formatCurrency(
                balance
              )}
            </strong>

            <small className="report-status">
              {balance >= 0
                ? "Positive Balance"
                : "Negative Balance"}
            </small>

          </div>

        </div>
      )}


      {/* =========================
          REPORT CONTENT
      ========================= */}

      {report && (
        <div className="report-content-grid">

          {/* =========================
              EXPENSE CHART
          ========================= */}

          <div className="report-section">

            <h2>
              Expense by Category
            </h2>

            {categoryData.length === 0 ? (

              <div className="report-chart">

                <p>
                  No expense data for
                  this period.
                </p>

              </div>

            ) : (

              <div className="report-chart">

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <PieChart>

                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={95}
                      label={({
                        percent,
                      }) =>
                        `${Math.round(
                          percent * 100
                        )}%`
                      }
                    >

                      {categoryData.map(
                        (
                          category,
                          index
                        ) => (
                          <Cell
                            key={
                              category.name
                            }
                            fill={
                              [
                                "#2563eb",
                                "#16a34a",
                                "#f59e0b",
                                "#dc2626",
                                "#7c3aed",
                                "#0891b2",
                              ][
                                index %
                                  6
                              ]
                            }
                          />
                        )
                      )}

                    </Pie>


                    <Tooltip
                      formatter={(
                        value
                      ) =>
                        formatCurrency(
                          value
                        )
                      }
                    />


                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            )}

          </div>


          {/* =========================
              CATEGORY SUMMARY
          ========================= */}

          <div className="report-section">

            <h2>
              Category Summary
            </h2>

            {categoryData.length === 0 ? (

              <div className="category-summary-list">

                <p>
                  No category expense
                  data for this period.
                </p>

              </div>

            ) : (

              <div className="category-summary-list">

                {categoryData.map(
                  (category) => {

                    const percentage =
                      totalExpense > 0
                        ? Math.round(
                            (category.value /
                              totalExpense) *
                              100
                          )
                        : 0

                    return (
                      <div
                        className="report-category"
                        key={
                          category.name
                        }
                      >

                        <div>

                          <span>
                            {category.name}
                          </span>

                          <small>
                            {percentage}%
                            {" "}
                            of expenses
                          </small>

                        </div>

                        <strong>
                          {formatCurrency(
                            category.value
                          )}
                        </strong>

                      </div>
                    )
                  }
                )}

              </div>

            )}

          </div>

        </div>
      )}


      {/* =========================
          EMPTY STATE
      ========================= */}

      {!report && !loading && !error && (
        <div
          className="report-section"
          style={{
            marginTop: "24px",
          }}
        >
          <h2>
            Generate a Report
          </h2>

          <p>
            Select a start date and end
            date to analyze your financial
            activity.
          </p>
        </div>
      )}

    </div>
  )
}

export default Reports