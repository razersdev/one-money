import { useEffect, useRef, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

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

  /* =========================
     Helpers
  ========================= */

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

  /* =========================
     Open Picker
  ========================= */

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

  /* =========================
     Close Outside
  ========================= */

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

  /* =========================
     Calendar Days
  ========================= */

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

  /* =========================
     Select Date
  ========================= */

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

  /* =========================
     Month Navigation
  ========================= */

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

  /* =========================
     Month Selection
  ========================= */

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

  /* =========================
     Year Selection
  ========================= */

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

  /* =========================
     Today
  ========================= */

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
            ry="2"
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

          {/* =========================
              Days View
          ========================= */}

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

          {/* =========================
              Month View
          ========================= */}

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

          {/* =========================
              Year View
          ========================= */}

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

  const [
    reportGenerated,
    setReportGenerated,
  ] = useState(false)

  /* =========================
     Dummy Data
  ========================= */

  const categoryData = [
    {
      name: "Food",
      value: 1000000,
    },
    {
      name: "Transport",
      value: 500000,
    },
    {
      name: "Shopping",
      value: 750000,
    },
  ]

  const totalIncome = 5000000

  const totalExpense = 2750000

  const balance =
    totalIncome - totalExpense

  /* =========================
     Format Currency
  ========================= */

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }
    ).format(value)
  }

  /* =========================
     Format Date
  ========================= */

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

  /* =========================
     Generate Report
  ========================= */

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      alert(
        "Please select start date and end date."
      )

      return
    }

    if (startDate > endDate) {
      alert(
        "Start date cannot be later than end date."
      )

      return
    }

    setReportGenerated(true)
  }

  return (
    <div className="page">

      {/* =========================
          Header
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
          Date Filters
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
        >
          Generate Report
        </button>

      </div>

      {/* =========================
          Report Period
      ========================= */}

      {reportGenerated && (
        <div className="report-period">

          <span>
            Report Period
          </span>

          <strong>
            {formatDate(startDate)}
            {" — "}
            {formatDate(endDate)}
          </strong>

        </div>
      )}

      {/* =========================
          Summary
      ========================= */}

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

      {/* =========================
          Report Content
      ========================= */}

      <div className="report-content-grid">

        {/* Chart */}

        <div className="report-section">

          <h2>
            Expense by Category
          </h2>

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
                          ][index]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip
                  formatter={(value) =>
                    formatCurrency(
                      value
                    )
                  }
                />

                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* Category Summary */}

        <div className="report-section">

          <h2>
            Category Summary
          </h2>

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

        </div>

      </div>

    </div>
  )
}

export default Reports