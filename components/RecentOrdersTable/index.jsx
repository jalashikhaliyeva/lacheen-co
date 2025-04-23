"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import ReactPaginate from "react-paginate";
import { IoCaretDown, IoWarningOutline } from "react-icons/io5";
import { FiDownload, FiRefreshCw } from "react-icons/fi";
import { BsCheck } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Mock data
const mockOrders = [
  {
    orderId: "O001",
    customerEmail: "alice@example.com",
    customerName: "Alice Johnson",
    orderedSize: "8",
    price: 120.5,
    paymentMethod: "card",
    date: "2025-03-20 10:15 AM",
    status: "pending",
    selectedSize: "8",
  },
  {
    orderId: "O002",
    customerEmail: "bob@example.com",
    customerName: "Bob Smith",
    orderedSize: "9",
    price: 99.99,
    paymentMethod: "cash",
    date: "2025-03-19 04:30 PM",
    status: "delivered",
    selectedSize: "9",
  },
  {
    orderId: "O003",
    customerEmail: "carol@example.com",
    customerName: "Carol Davis",
    orderedSize: "7",
    price: 110.0,
    paymentMethod: "card",
    date: "2025-03-18 12:00 PM",
    status: "canceled",
    selectedSize: "7",
  },
  {
    orderId: "O004",
    customerEmail: "dave@example.com",
    customerName: "Dave Brown",
    orderedSize: "10",
    price: 130.75,
    paymentMethod: "cash",
    date: "2025-03-17 09:45 AM",
    status: "pending",
    selectedSize: "10",
  },
  {
    orderId: "O005",
    customerEmail: "eve@example.com",
    customerName: "Eve Martinez",
    orderedSize: "8",
    price: 150.0,
    paymentMethod: "card",
    date: "2025-03-16 11:20 AM",
    status: "delivered",
    selectedSize: "8",
  },
  {
    orderId: "O006",
    customerEmail: "frank@example.com",
    customerName: "Frank Garcia",
    orderedSize: "9",
    price: 85.0,
    paymentMethod: "cash",
    date: "2025-03-15 02:10 PM",
    status: "pending",
    selectedSize: "9",
  },
  {
    orderId: "O007",
    customerEmail: "grace@example.com",
    customerName: "Grace Lee",
    orderedSize: "7",
    price: 95.5,
    paymentMethod: "card",
    date: "2025-03-14 05:50 PM",
    status: "delivered",
    selectedSize: "7",
  },
  {
    orderId: "O008",
    customerEmail: "henry@example.com",
    customerName: "Henry Wilson",
    orderedSize: "10",
    price: 140.0,
    paymentMethod: "cash",
    date: "2025-03-13 01:30 PM",
    status: "pending",
    selectedSize: "10",
  },
];

//
// CUSTOM DATE RANGE PICKER COMPONENT
//
function CustomDateRangePicker({ selectedRange, setSelectedRange }) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempRange, setTempRange] = useState([null, null]);
  const pickerRef = useRef(null);

  useEffect(() => {
    if (selectedRange.from && selectedRange.to) {
      setTempRange([selectedRange.from, selectedRange.to]);
    } else {
      setTempRange([null, null]);
    }
  }, [selectedRange]);

  // Close calendar if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  const handleApply = () => {
    if (tempRange[0] && tempRange[1] && +tempRange[0] === +tempRange[1]) {
      // If both dates are the same, clear selection.
      setSelectedRange({ from: null, to: null });
    } else {
      setSelectedRange({ from: tempRange[0], to: tempRange[1] });
    }
    setShowPicker(false);
  };

  const displayLabel =
    selectedRange.from && selectedRange.to
      ? `${format(selectedRange.from, "PPP")} - ${format(
          selectedRange.to,
          "PPP"
        )}`
      : "Pick a date range";

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      ref={pickerRef}
    >
      <button
        onClick={() => setShowPicker(!showPicker)}
        style={{
          width: "240px",
          padding: "8px 12px",
          textAlign: "left",
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "#fff",
          cursor: "pointer",
        }}
      >
        {displayLabel}
        <span style={{ float: "right", opacity: 0.5 }}>📅</span>
      </button>
      {showPicker && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            left: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
            zIndex: 100,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <Calendar
            selectRange={true}
            onChange={(range) => {
              if (Array.isArray(range)) {
                setTempRange(range);
              }
            }}
            value={tempRange[0] && tempRange[1] ? tempRange : new Date()}
          />
          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <button
              onClick={handleApply}
              style={{
                marginRight: "8px",
                padding: "4px 8px",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "#0070f3",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Apply
            </button>
            <button
              onClick={() => setShowPicker(false)}
              style={{
                padding: "4px 8px",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "#ccc",
                color: "#000",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

//
// FILTERS COMPONENT (Payment Method, Date Range, and Price Range)
//
function Filters({ onFilterChange, resetTrigger }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // Notify parent of changes
  useEffect(() => {
    onFilterChange({ paymentMethod, dateRange, priceMin, priceMax });
  }, [paymentMethod, dateRange, priceMin, priceMax, onFilterChange]);

  // Reset internal state when resetTrigger changes
  useEffect(() => {
    setPaymentMethod("");
    setDateRange({ from: null, to: null });
    setPriceMin("");
    setPriceMax("");
  }, [resetTrigger]);

  return (
    <div className="flex flex-wrap justify-between gap-6 mt-4 font-gilroy">
      {/* Payment Method Filter */}
      <div>
        <label className="block text-sm font-medium text-neutral-500">
          Payment Method
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border w-full rounded px-2 py-2.5 border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All</option>
          <option value="card">Card</option>
          <option value="cash">Cash</option>
        </select>
      </div>
      {/* Date Range Filter */}
      <div>
        <label className="block text-sm font-medium text-neutral-500">
          Date Range
        </label>
        <CustomDateRangePicker
          selectedRange={dateRange}
          setSelectedRange={setDateRange}
        />
      </div>
      {/* Price Filters */}
      <div>
        <label className="block text-sm font-medium text-neutral-500">
          Min Price
        </label>
        <input
          type="number"
          placeholder="Min Price"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          className="border border-neutral-300 rounded px-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-500">
          Max Price
        </label>
        <input
          type="number"
          placeholder="Max Price"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          className="border border-neutral-300 rounded px-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>
  );
}

//
// MAIN TABLE COMPONENT
//
function RecentOrdersTable() {
  // Global orders and search state
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Other filters from Filters component: Payment Method, Date Range, and Price Range
  const [otherFilters, setOtherFilters] = useState({
    paymentMethod: "",
    dateRange: { from: null, to: null },
    priceMin: "",
    priceMax: "",
  });

  // A trigger to reset the internal state of Filters component
  const [resetTrigger, setResetTrigger] = useState(0);

  // Status change modal and dropdown state
  const [openStatusDropdown, setOpenStatusDropdown] = useState(null);
  const statusDropdownRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ orderId: null, newStatus: "" });
  const statusOptions = ["delivered", "pending", "canceled"];

  // Handle filters coming from the Filters component
  const handleOtherFiltersChange = useCallback((newFilters) => {
    setOtherFilters(newFilters);
    setCurrentPage(0);
  }, []);

  // Combine search term and all filters for filtered data
  const filteredData = useMemo(() => {
    return orders.filter((order) => {
      const lowerSearch = searchTerm.toLowerCase();
      const searchMatch =
        order.orderId.toLowerCase().includes(lowerSearch) ||
        order.customerEmail.toLowerCase().includes(lowerSearch) ||
        order.customerName.toLowerCase().includes(lowerSearch);

      const priceMinMatch = otherFilters.priceMin
        ? order.price >= parseFloat(otherFilters.priceMin)
        : true;
      const priceMaxMatch = otherFilters.priceMax
        ? order.price <= parseFloat(otherFilters.priceMax)
        : true;
      const paymentMatch = otherFilters.paymentMethod
        ? order.paymentMethod === otherFilters.paymentMethod
        : true;
      let dateMatch = true;
      if (otherFilters.dateRange.from && otherFilters.dateRange.to) {
        const orderDate = new Date(order.date);
        dateMatch =
          orderDate >= otherFilters.dateRange.from &&
          orderDate <= otherFilters.dateRange.to;
      }
      return (
        searchMatch &&
        priceMinMatch &&
        priceMaxMatch &&
        paymentMatch &&
        dateMatch
      );
    });
  }, [orders, searchTerm, otherFilters]);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setOtherFilters({
      paymentMethod: "",
      dateRange: { from: null, to: null },
      priceMin: "",
      priceMax: "",
    });
    setResetTrigger((prev) => prev + 1);
    setCurrentPage(0);
  };

  // Close inline status dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutsideStatus = (event) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setOpenStatusDropdown(null);
      }
    };
    if (openStatusDropdown) {
      document.addEventListener("mousedown", handleClickOutsideStatus);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideStatus);
    };
  }, [openStatusDropdown]);

  const downloadInvoice = (order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Centered Invoice title
    doc.setFontSize(22);
    doc.text("Invoice Lacheen.co", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(12);

    // Define positions for a two-column layout
    // (label on left, value next to it; then second column label + value)
    const col1LabelX = 20;
    const col1ValueX = 60; // Where the value of col1 goes
    const col2LabelX = 110;
    const col2ValueX = 150; // Where the value of col2 goes

    // We'll start printing rows at y = 40
    let currentY = 40;
    const lineHeight = 8;

    // Row 1
    doc.text("Order ID:", col1LabelX, currentY);
    doc.text(order.orderId, col1ValueX, currentY);
    doc.text("Customer Email:", col2LabelX, currentY);
    doc.text(order.customerEmail, col2ValueX, currentY);

    // Row 2
    currentY += lineHeight;
    doc.text("Customer Name:", col1LabelX, currentY);
    doc.text(order.customerName, col1ValueX, currentY);
    doc.text("Ordered Size:", col2LabelX, currentY);
    doc.text(String(order.orderedSize), col2ValueX, currentY);

    // Row 3
    currentY += lineHeight;
    doc.text("Selected Size:", col1LabelX, currentY);
    doc.text(String(order.selectedSize), col1ValueX, currentY);
    doc.text("Price:", col2LabelX, currentY);
    doc.text(`¼ ${order.price.toFixed(2)}`, col2ValueX, currentY);

    // Row 4
    currentY += lineHeight;
    doc.text("Payment Method:", col1LabelX, currentY);
    doc.text(order.paymentMethod, col1ValueX, currentY);
    doc.text("Date:", col2LabelX, currentY);
    doc.text(order.date, col2ValueX, currentY);

    // Row 5
    currentY += lineHeight;
    doc.text("Status:", col1LabelX, currentY);
    doc.text(order.status, col1ValueX, currentY);

    // --- Bottom section: Logo on left, contact info on right ---
    // Replace 'logoData' with your Base64 image string
    const logoData =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABKcAAASnCAYAAAAwgBt9AAAAAXNSR0IArs4c6QAAIABJREFUeF7s3QusXPl9H/b/mTkzc998LHe5S+5Ku1rqtfauLa1lJbHjqHUS2w2MtjFkt0KdWHYUB0hbp4gbIIZRx0CMxEBbF25sB238CCC7bZymcYumMKKmctNaD4uSI9uELHEpapekRC2f9zl3Hue0/zN3uCSXy3uX3OXvXvIzwOKS3LnzO+dzfvM43/n//6dIbgQIECBAgAABAgQIECBAgAABAgSCBIqgusoSIECAAAECBAgQIECAAAECBAgQSMIpTUCAAAECBAgQIECAAAECBAgQIBAmIJwKo1eYAAECBAgQIECAAAECBAgQIEBAOKUHCBAgQIAAAQIECBAgQIAAAQIEwgSEU2H0ChMgQIAAAQIECBAgQIAAAQIECAin9AABAgQIECBAgAABAgQIECBAgECYgHAqjF5hAgQIECBAgAABAgQIECBAgAAB4ZQeIECAAAECBAgQIECAAAECBAgQCBMQToXRK0yAAAECBAgQIECAAAECBAgQICCc0gMECBAgQIAAAQIECBAgQIAAAQJhAsKpMHqFCRAgQIAAAQIECBAgQIAAAQIEhFN6gAABAgQIECBAgAABAgQIECBAIExAOBVGrzABAgQIECBAgAABAgQIECBAgIBwSg8QIECAAAECBAgQIECAAAECBAiECQinwugVJkCAAAECBAgQIECAAAECBAgQEE7pAQIECBAgQIAAAQIECBAgQIAAgTAB4VQYvcIECBAgQIAAAQIECBAgQIAAAQLCKT1AgAABAgQIECBAgAABAgQIECAQJiCcCqNXmAABAgQIECBAgAABAgQIECBAQDilBwgQIECAAAECBAgQIECAAAECBMIEhFNh9AoTIECAAAECBAgQIECAAAECBAgIp/QAAQIECBAgQIAAAQIECBAgQIBAmIBwKoxeYQIECBAgQIAAAQIECBAgQIAAAeGUHiBAgAABAgQIECBAgAABAgQIEAgTEE6F0StMgAABAgQIECBAgAABAgQIECAgnNIDBAgQIECAAAECBAgQIECAAAECYQLCqTB6hQkQIECAAAECBAgQIECAAAECBIRTeoAAAQIECBAgQIAAAQIECBAgQCBMQDgVRq8wAQIECBAgQIAAAQIECBAgQICAcEoPECBAgAABAgQIECBAgAABAgQIhAkIp8LoFSZAgAABAgQIECBAgAABAgQIEBBO6QECBAgQIECAAAECBAgQIECAAIEwAeFUGL3CBAgQIECAAAECBAgQIECAAAECwik9QIAAAQIECBAgQIAAAQIECBAgECYgnAqjV5gAAQIECBAgQIAAAQIECBAgQEA4pQcIECBAgAABAgQIECBAgAABAgTCBIRTYfQKEyBAgAABAgQIECBAgAABAgQICKf0AAECBAgQIECAAAECBAgQIECAQJiAcCqMXmECBAgQIECAAAECBAgQIECAAAHhlB4gQIAAAQIECBAgQIAAAQIECBAIExBOhdErTIAAAQIECBAgQIAAAQIECBAgIJzSAwQIECBAgAABAgQIECBAgAABAmECwqkweoUJECBAgAABAgQIECBAgAABAgSEU3qAAAECBAgQIECAAAECBAgQIEAgTEA4FUavMAECBAgQIECAAAECBAgQIECAgHBKDxAgQIAAAQIECBAgQIAAAQIECIQJCKfC6BUmQIAAAQIECBAgQIAAAQIECBAQTukBAgQIECBAgAABAgQIECBAgACBMAHhVBi9wgQIECBAgAABAgQIECBAgAABAsIpPUCAAAECBAgQIECAAAECBAgQIBAmIJwKo1eYAAECBAgQIECAAAECBAgQIEBAOKUHCBAgQIAAAQIECBAgQIAAAQIEwgSEU2H0ChMgQIAAAQIECBAgQIAAAQIECAin9AABAgQIECBAgAABAgQIECBAgECYgHAqjF5hAgQIECBAgAABAgQIECBAgAAB4ZQeIECAAAECBAgQIECAAAECBAgQCBMQToXRK0yAAAECBAgQIECAAAECBAgQICCc0gMECBAgQIAAAQIECBAgQIAAAQJhAsKpMHqFCRAgQIAAAQIECBAgQIAAAQIEhFN6gAABAgQIECBAgAABAgQIECBAIExAOBVGrzABAgQIECBAgAABAgQIECBAgIBwSg8QIECAAAECBAgQIECAAAECBAiECQinwugVJkCAAAECBAgQIECAAAECBAgQEE7pAQIECBAgQIAAAQIECBAgQIAAgTAB4VQYvcIECBAgQIAAAQIECBAgQIAAAQLCKT1AgAABAgQIECBAgAABAgQIECAQJiCcCqNXmAABAgQIECBAgAABAgQIECBAQDilBwgQIECAAAECBAgQIECAAAECBMIEhFNh9AoTIECAAAECBAgQIECAAAECBAgIp/QAAQIECBAgQIAAAQIECBAgQIBAmIBwKoxeYQIECBAgQIAAAQIECBAgQIAAAeGUHiBAgAABAgQIECBAgAABAgQIEAgTEE6F0StMgAABAgQIECBAgAABAgQIECAgnNIDBAgQIECAAAECBAgQIECAAAECYQLCqTB6hQkQIECAAAECBAgQIECAAAECBIRTeoAAAQIECBAgQIAAAQIECBAgQCBMQDgVRq8wAQIECBAgQIAAAQIECBAgQICAcEoPECBAgAABAgQIECBAgAABAgQIhAkIp8LoFSZAgAABAgQIECBAgAABAgQIEBBO6QECBAgQIECAAAECBAgQIECAAIEwAeFUGL3CBAgQIECAAAECBAgQIECAAAECwik9QIAAAQIECBAgQIAAAQIECBAgECYgnAqjV5gAAQIECBAgQIAAAQIECBAgQEA4pQcIECBAgAABAgQIECBAgAABAgTCBIRTYfQKEyBAgAABAgQIECBAgAABAgQICKf0AAECBAgQIECAAAECBAgQIECAQJiAcCqMXmECBAgQIECAAAECBAgQIECAAAHhlB4gQIAAAQIECBAgQIAAAQIECBAIExBOhdErTIAAAQIECBAgQIAAAQIECBAgIJzSAwQIECBAgAABAgQIECBAgAABAmECwqkweoUJECBAgAABAgQIECBAgAABAgSEU3qAAAECBAgQIECAAAECBAgQIEAgTEA4FUavMAECBAgQIECAAAECBAgQIECAgHBKDxAgQIAAAQIECBAgQIAAAQIECIQJCKfC6BUmQIAAAQIECBAgQIAAAQIECBAQTukBAgQIECBAgAABAgQIECBAgACBMAHhVBi9wgQIECBAgAABAgQIECBAgAABAsIpPUCAAAECBAgQIECAAAECBAgQIBAmIJwKo1eYAAECBAgQIECAAAECBAgQIEBAOKUHCBAgQIAAAQIECBAgQIAAAQIEwgSEU2H0ChMgQIAAAQIECBAgQIAAAQIECAin9AABAgQIECBAgAABAgQIECBAgECYgHAqjF5hAgQIECBAgAABAgQIECBAgAAB4ZQeIECAAAECBAgQIECAAAECBAgQCBMQToXRK0yAAAECBAgQIECAAAECBAgQICCc0gMECBAgQIAAAQIECBAgQIAAAQJhAsKpMHqFCRAgQIAAAQIECBAgQIAAAQIEhFN6gAABAgQIECBAgAABAgQIECBAIExAOBVGrzABAgQIECBAgAABAgQIECBAgIBwSg8QIECAAAECBAgQIECAAAECBAiECQinwugVJkCAAAECBAgQIECAAAECBAgQEE7pAQIECBAgQIAAAQIECBAgQIAAgTAB4VQYvcIECBAgQIAAAQIECBAgQIAAAQLCKT1AgAABAgQIECBAgAABAgQIECAQJiCcCqNXmAABAgQIECBAgAABAgQIECBAQDilBwgQIECAAAECBAgQIECAAAECBMIEhFNh9AoTIECAAAECBAgQIECAAAECBAgIp/QAAQIECBAgQIAAAQIECBAgQIBAmIBwKoxeYQIECBAgQIAAAQIECBAgQIAAAeGUHiBAgAABAgQIECBAgAABAgQIEAgTEE6F0StMgAABAgQIECBAgAABAgQIECAgnNIDBAgQIECAAAECBAgQIECAAAECYQLCqTB6hQkQIECAAAECBAgQIECAAAECBIRTeoAAAQIECBAgQIAAAQIECBAgQCBMQDgVRq8wAQIECBAgQIAAAQIECBAgQICAcEoPECBAgAABAgQIECBAgAABAgQIhAkIp8LoFSZAgAABAgQIECBAgAABAgQIEBBO6QECBAgQIECAAAECBAgQIECAAIEwAeFUGL3CBAgQIECAAAECBAgQIECAAAECwik9QIAAAQIECBAgQIAAAQIECBAgECYgnAqjV5gAAQIECBAgQIAAAQIECBAgQEA4pQcIECBAgAABAgQIECBAgAABAgTCBIRTYfQKEyBAgAABAgQIECBAgAABAgQICKf0AAECBAgQIECAAAECBAgQIECAQJiAcCqMXmECBAgQIECAAAECBAgQIECAAAHhlB4gQIAAAQIECBAgQIAAAQIECBAIExBOhdErTIAAAQIECBAgQIAAAQIECBAgIJzSAwQIECBAgAABAgQIECBAgAABAmECwqkweoUJECBAgAABAgQIECBAgAABAgSEU3qAAAECBAgQIECAAAECBAgQIEAgTEA4FUavMAECBAgQIECAAAECBAgQIECAgHBKDxAgQIAAAQIECBAgQIAAAQIECIQJCKfC6BUmQIAAAQIECBAgQIAAAQIECBAQTukBAgQIECBAgAABAgQIECBAgACBMAHhVBi9wgQIECBAgAABAgQIECBAgAABAsIpPUCAAAECBAgQIECAAAECBAgQIBAmIJwKo1eYAAECBAgQIECAAAECBAgQIEBAOKUHCBAgQIAAAQIECBAgQIAAAQIEwgSEU2H0ChMgQIAAAQIECBAgQIAAAQIECAin9AABAgQIECBAgAABAgQIECBAgECYgHAqjF5hAgQIECBAgAABAgQIECBAgAAB4ZQeIECAAAECBAgQIECAAAECBAgQCBMQToXRK0yAAAECBAgQIECAAAECBAgQICCc0gMECBAgQIAAAQIECBAgQIAAAQJhAsKpMHqFCRAgQIAAAQIECBAgQIAAAQIEhFN6gAABAgQIECBAgAABAgQIECBAIExAOBVGrzABAgQIECBAgAABAgQIECBAgIBwSg8QIECAAAECBAgQIECAAAECBAiECQinwugVJkCAAAECBAgQIECAAAECBAgQEE7pAQIECBAgQIAAAQIECBAgQIAAgTAB4VQYvcIECBAgQIAAAQIECBAgQIAAAQLCKT1AgAABAgQIECBAgAABAgQIECAQJiCcCqNXmAABAgQIECBAgAABAgQIECBAQDilBwgQIECAAAECBAgQIECAAAECBMIEhFNh9AoTIECAAAECBAgQIECAAAECBAgIp/QAAQIECBAgQIAAAQIECBAgQIBAmIBwKoxeYQIECBAgQIAAAQIECBAgQIAAAeGUHiBAgAABAgQIECBAgAABAgQIEAgTEE6F0StMgAABAgQIECBAgAABAgQIECAgnNIDBAgQIECAAAECBAgQIECAAAECYQLCqTB6hQkQIECAAAECBAgQIECAAAECBIRTeoAAAQIECBAgQIAAAQIECBAgQCBMQDgVRq8wAQIECBAgQIAAAQIECBAgQICAcEoPECBAgAABAgQIECBAgAABAgQIhAkIp8LoFSZAgAABAgQIECBAgAABAgQIEBBO6QECBAgQIECAAAECBAgQIECAAIEwAeFUGL3CBAgQIECAAAECBAgQIECAAAECwik9QIAAAQIECBAgQIAAAQIECBAgECYgnAqjV5gAAQIECBAgQIAAAQIECBAgQEA4pQcIECBAgAABAgQIECBAgAABAgTCBIRTYfQKEyBAgAABAgQIECBAgAABAgQICKf0AAECBAgQIECAAAECBAgQIECAQJiAcCqMXmECBAgQIECAAAECBAgQIECAAAHhlB4gQIAAAQIECBAgQIAAAQIECBAIExBOhdErTIAAAQIECBAgQIAAAQIECBAgIJzSAwQIECBAgAABAgQIECBAgAABAmECwqkweoUJECBAgAABAgQIECBAgAABAgSEU3qAAAECBAgQIECAAAECBAgQIEAgTEA4FUavMAECBAgQIECAAAECBAgQIECAgHBKDxAgQIAAAQIECBAgQIAAAQIECIQJCKfC6BUmQIAAAQIECBAgQIAAAQIECBAQTukBAgQIECBAgAABAgQIECBAgACBMAHhVBi9wgQIECBAgAABAgQIECBAgAABAsIpPUCAAAECBAgQIECAAAECBAgQIBAmIJwKo1eYAAECBAgQIECAAAECBAgQIEBAOKUHCBAgQIAAAQIECBAgQIAAAQIEwgSEU2H0ChMgQIAAAQIECBAgQIAAAQIECAin9AABAgQIECBAgAABAgQIECBAgECYgHAqjF5hAgQIECBAgAABAgQIECBAgAAB4ZQeIECAAAECBAgQIECAAAECBAgQCBMQToXRK0yAAAECBAgQIECAAAECBAgQICCc0gMECBAgQIAAAQIECBAgQIAAAQJhAsKpMHqFCRAgQIAAAQIECBAgQIAAAQIEhFN6gAABAgQIECBAgAABAgQIECBAIExAOBVGrzABAgQIECBAgAABAgQIECBAgIBwSg8QIECAAAECBAgQIECAAAECBAiECQinwugVJkCAAAECBAgQIECAAAECBAgQEE7pAQIECBAgQIAAAQIECBAgQIAAgTAB4VQYvcIECBAgQIAAAQIECBAgQIAAAQLCKT1AgAABAgQIECBAgAABAgQIECAQJiCcCqNXmAABAgQIECBAgAABAgQIECBAQDilBwgQIECAAAECBAgQIECAAAECBMIEhFNh9AoTIECAAAECBAgQIECAAAECBAgIp/QAAQIECBAgQIAAAQIECBAgQIBAmIBwKoxeYQIECBAgQIAAAQIECBAgQIAAAeGUHiBAgAABAgQIECBAgAABAgQIEAgTEE6F0StMgAABAgQIECBAgAABAgQIECAgnNIDBAgQIECAAAECBAgQIECAAAECYQLCqTB6hQkQIECAAAECBAgQIECAAAECBIRTeoAAAQIECBAgQIAAAQIECBAgQCBMQDgVRq8wAQIECBAgQIAAAQIECBAgQICAcEoPECBAgAABAgQIECBAgAABAgQIhAkIp8LoFSZAgAABAgQIECBAgAABAgQIEBBO6QECBAgQIECAAAECBAgQIECAAIEwAeFUGL3CBAgQIECAAAECBAgQIECAAAECwik9QIAAAQIECBAgQIAAAQIECBAgECYgnAqjV5gAAQIECBAgQIAAAQIECBAgQEA4pQcIECBAgAABAgQIECBAgAABAgTCBIRTYfQKEyBAgAABAgQIECBAgAABAgQICKf0AAECBAgQIECAAAECBAgQIECAQJiAcCqMXmECBAgQIECAAAECBAgQIECAAAHhlB4gQIAAAQIECBAgQIAAAQIECBAIExBOhdErTIAAAQIECBAgQIAAAQIECBAgIJzSAwQIECBAgAABAgQIECBAgAABAmECwqkweoUJECBAgAABAgQIECBAgAABAgSEU3qAAAECBAgQIECAAAECBAgQIEAgTEA4FUavMAECBAgQIECAAAECBAgQIECAgHBKDxAgQIAAAQIECBAgQIAAAQIECIQJCKfC6BUmQIAAAQIECBAgQIAAAQIECBAQTukBAgQIECBAgAABAgQIECBAgACBMAHhVBi9wgQIECBAgAABAgQIECBAgAABAsIpPUCAAAECBAgQIECAAAECBAgQIBAmIJwKo1eYAAECBAgQIECAAAECBAgQIEBAOKUHCBAgQIAAAQIECBAgQIAAAQIEwgSEU2H0ChMgQIAAAQIECBAgQIAAAQIECAin9AABAgQIECBAgAABAgQIECBAgECYgHAqjF5hAgQIECBAgAABAgQIECBAgAAB4ZQeIECAAAECBAgQIECAAAECBAgQCBMQToXRK0yAAAECBAgQIECAAAECBAgQICCc0gMECBAgQIAAAQIECBAgQIAAAQJhAsKpMHqFCRAgQIAAAQIECBAgQIAAAQIEhFN6gAABAgQIECBAgAABAgQIECBAIExAOBVGrzABAgQIECBAgAABAgQIECBAgIBwSg8QIECAAAECBAgQIECAAAECBAiECQinwugVJkCAAAECBAgQIECAAAECBAgQEE7pAQIECBAgQIAAAQIECBAgQIAAgTAB4VQYvcIECBAgQIAAAQIECBAgQIAAAQLCKT1AgAABAgQIECBAgAABAgQIECAQJiCcCqNXmAABAgQIECBAgAABAgQIECBAQDilBwgQIECAAAECBAgQIECAAAECBMIEhFNh9AoTIECAAAECBAgQIECAAAECBAgIp/QAAQIECBAgQIAAAQIECBAgQIBAmIBwKoxeYQIECBAgQIAAAQIECBAgQIAAAeGUHiBAgAABAgQIECBAgAABAgQIEAgTEE6F0StMgAABAgQIECBAgAABAgQIECAgnNIDBAgQIECAAAECBAgQIECAAAECYQLCqTB6hQkQIECAAAECBAgQIECAAAECBIRTeoAAAQIECBAgQIAAAQIECBAgQCBMQDgVRq8wAQIECBAgQIAAAQIECBAgQICAcEoPECBAgAABAgQIECBAgAABAgQIhAkIp8LoFSZAgAABAgQIECBAgAABAgQIEBBO6QECBAgQIECAAAECBAgQIECAAIEwAeFUGL3CBAgQIECAAAECBAgQIECAAAECwik9QIAAAQIECBAgQIAAAQIECBAgECYgnAqjV5gAAQIECBAgQIAAAQIECBAgQEA4pQcIECBAgAABAgQIECBAgAABAgTCBIRTYfQKEyBAgAABAgQIECBAgAABAgQICKf0AAECBAgQIECAAAECBAgQIECAQJiAcCqMXmECBAgQIECAAAECBAgQIECAAAHhlB4gQIAAAQIECBAgQIAAAQIECBAIExBOhdErTIAAAQIECBAgQIAAAQIECBAgIJzSAwQIECBAgAABAgQIECBAgAABAmECwqkweoUJECBAgAABAgQIECBAgAABAgSEU3qAAAECBAgQIECAAAECBAgQIEAgTEA4FUavMAECBAgQIECAAAECBAgQIECAgHBKDxAgQIAAAQIECBAgQIAAAQIECIQJCKfC6BUmQIAAAQIECBAgQIAAAQIECBAQTukBAgQIECBAgAABAgQIECBAgACBMAHhVBi9wgQIECBAgAABAgQIECBAgAABAsIpPUCAAAECBAgQIECAAAECBAgQIBAmIJwKo1eYAAECBAgQIECAAAECBAgQIEBAOKUHCBAgQIAAAQIECBAgQIAAAQIEwgSEU2H0ChMgQIAAAQIECBAgQIAAAQIECAin9AABAgQIECBAgAABAgQIECBAgECYgHAqjF5hAgQIECBAgAABAgQIECBAgAAB4ZQeIECAAAECBAgQIECAAAECBAgQCBMQToXRK0yAAAECBAgQIECAAAECBAgQICCc0gMECBAgQIAAAQIECBAgQIAAAQJhAsKpMHqFCRAgQIAAAQIECBAgQIAAAQIEhFN6gAABAgQIECBAgAABAgQIECBAIExAOBVGrzABAgQIECBAgAABAgQIECBAgIBwSg8QIECAAAECBAgQIECAAAECBAiECQinwugVJkCAAAECBAgQIECAAAECBAgQEE7pAQIECBAgQIAAAQIECBAgQIAAgTAB4VQYvcIECBAgQIAAAQIECBAgQIAAAQLCKT1AgAABAgQIECBAgAABAgQIECAQJiCcCqNXmAABAgQIECBAgAABAgQIECBAQDilBwgQIECAAAECBAgQIECAAAECBMIEhFNh9AoTIECAAAECBAgQIECAAAECBAgIp/QAAQIECBAgQIAAAQIECBAgQIBAmIBwKoxeYQIECBAgQIAAAQIECBAgQIAAAeGUHiBAgAABAgQIECBAgAABAgQIEAgTEE6F0StMgAABAgQIECBAgAABAgQIECAgnNIDBAgQIECAAAECBAgQIECAAAECYQLCqTB6hQkQIECAAAECBAgQIECAAAECBIRTeoAAAQIECBAgQIAAAQIECBAgQCBMQDgVRq8wAQIECBAgQIAAAQIECBAgQICAcEoPECBAgAABAgQIECBAgAABAgQIhAkIp8LoFSZAgAABAgQIECBAgAABAgQIEBBO6QECBAgQIECAAAECBAgQIECAAIEwAeFUGL3CBAgQIECAAAECBAgQIECAAAECwik9QIAAAQIECBAgQIAAAQIECBAgECYgnAqjV5gAAQIECBAgQIAAAQIECBAgQEA4pQcIECBAgAABAgQIECBAgAABAgTCBIRTYfQKEyBAgAABAgQIECBAgAABAgQICKf0AAECBAgQIECAAAECBAgQIECAQJiAcCqMXmECBAgQIECAAAECBAgQIECAAAHhlB4gQIAAAQIECBAgQIAAAQIECBAIExBOhdErTIAAAQIECBAgQIAAAQIECBAgIJzSAwQIECBAgAABAgQIECBAgAABAmECwqkweoUJECBAgAABAgQIECBAgAABAgSEU3qAAAECBAgQIECAAAECBAgQIEAgTEA4FUavMAECBAgQIECAAAECBAgQIECAgHBKDxAgQIAAAQIECBAgQIAAAQIECIQJCKfC6BUmQIAAAQIECBAgQIAAAQIECBAQTukBAgQIECBAgAABAgQIECBAgACBMAHhVBi9wgQIECBAgAABAgQIECBAgAABAsIpPUCAAAECBAgQIECAAAECBAgQIBAmIJwKo1eYAAECBAgQIECAAAECBAgQIEBAOKUHCBAgQIAAAQIECBAgQIAAAQIEwgSEU2H0ChMgQIAAAQIECBAgQIAAAQIECAin9AABAgQIECBAgAABAgQIECBAgECYgHAqjF5hAgQIECBAgAABAgQIECBAgAAB4ZQeIECAAAECBAgQIECAAAECBAgQCBMQToXRK0yAAAHZquhrAAAgAElEQVQCBAgQIECAAAECBAgQICCc0gMECBAgQIAAAQIECBAgQIAAAQJhAsKpMHqFCRAgQIAAAQIECBAgQIAAAQIEhFN6gAABAgQIECBAgAABAgQIECBAIExAOBVGrzABAgQIECBAgAABAgQIECBAgIBwSg8QIECAAAECBAgQIECAAAECBAiECQinwugVJkCAAAECBAgQIECAAAECBAgQEE7pAQIECBAgQIAAAQIECBAgQIAAgTAB4VQYvcIECBAgQIAAAQIECBAgQIAAAQLCKT1AgAABAgQIECBAgAABAgQIECAQJiCcCqNXmAABAgQIECBAgAABAgQIECBAQDilBwgQIECAAAECBAgQIECAAAECBMIEhFNh9AoTIECAAAECBAgQIECAAAECBAgIp/QAAQIECBAgQIAAAQIECBAgQIBAmIBwKoxeYQIECBAgQIAAAQIECBAgQIAAAeGUHiBAgAABAgQIECBAgAABAgQIEAgTEE6F0StMgAABAgQIECBAgAABAgQIECAgnNIDBAgQIECAAAECBAgQIECAAAECYQLCqTB6hQkQIECAAAECBAgQIECAAAECBIRTeoAAAQIECBAgQIAAAQIECBAgQCBMQDgVRq8wAQIECBAgQIAAAQIECBAgQICAcEoPECBAgAABAgQIECBAgAABAgQIhAkIp8LoFSZAgAABAgQIECBAgAABAgQIEBBO6QECBAgQIECAAAECBAgQIECAAIEwAeFUGL3CBAgQIECAAAECBAgQIECAAAECwik9QIAAAQIECBAgQIAAAQIECBAgECYgnAqjV5gAAQIECBAgQIAAAQIECBAgQEA4pQcIECBAgAABAgQIECBAgAABAgTCBIRTYfQKEyBAgAABAgQIECBAgAABAgQICKf0AAECBAgQIECAAAECBAgQIECAQJiAcCqMXmECBAgQIECAAAECBAgQIECAAAHhlB4gQIAAAQIECBAgQIAAAQIECBAIExBOhdErTIAAAQIECBAgQIAAAQIECBAgIJzSAwQIECBAgAABAgQIECBAgAABAmECwqkweoUJECBAgAABAgQIECBAgAABAgSEU3qAAAECBAgQIECAAAECBAgQIEAgTEA4FUavMAECBAgQIECAAAECBAgQIECAgHBKDxAgQIAAAQIECBAgQIAAAQIECIQJCKfC6BUmQIAAAQIECBAgQIAAAQIECBAQTukBAgQIECBAgAABAgQIECBAgACBMAHhVBi9wgQIECBAgAABAgQIECBAgAABAsIpPUCAAAECBAgQIECAAAECBAgQIBAmIJwKo1eYAAECBAgQIECAAAECBAgQIEBAOKUHCBAgQIAAAQIECBAgQIAAAQIEwgSEU2H0ChMgQIAAAQIECBAgQIAAAQIECAin9AABAgQIECBAgAABAgQIECBAgECYgHAqjF5hAgQIECBAgAABAgQIECBAgAAB4ZQeIECAAAECBAgQIECAAAECBAgQCBMQToXRK0yAAAECBAgQIECAAAECBAgQICCc0gMECBAgQIAAAQIECBAgQIAAAQJhAsKpMHqFCRAgQIAAAQIECBAgQIAAAQIEhFN6gAABAgQIECBAgAABAgQIECBAIExAOBVGrzABAgQIECBAgAABAgQIECBAgIBwSg8QIECAAAECBAgQIECAAAECBAiECQinwugVJkCAAAECBAgQIECAAAECBAgQEE7pAQIECBAgQIAAAQIECBAgQIAAgTAB4VQYvcIECBAgQIAAAQIECBAgQIAAAQLCKT1AgAABAgQIECBAgAABAgQIECAQJiCcCqNXmAABAgQIECBAgAABAgQIECBAQDilBwgQIECAAAECBAgQIECAAAECBMIEhFNh9AoTIECAAAECBAgQIECAAAECBAgIp/QAAQIECBAgQIAAAQIECBAgQIBAmIBwKoxeYQIECBAgQIAAAQIECBAgQIAAAeGUHiBAgAABAgQIECBAgAABAgQIEAgTEE6F0StMgAABAgQIECBAgAABAgQIECAgnNIDBAgQIECAAAECBAgQIECAAAECYQLCqTB6hQkQIECAAAECBAgQIECAAAECBIRTeoAAAQIECBAgQIAAAQIECBAgQCBMQDgVRq8wAQIECBAgQIAAAQIECBAgQICAcEoPECBAgAABAgQIECBAgAABAgQIhAkIp8LoFSZAgAABAgQIECBAgAABAgQIEBBO6QECBAgQIECAAAECBAgQIECAAIEwAeFUGL3CBAgQIECAAAECBAgQIECAAAECwik9QIAAAQIECBAgQIAAAQIECBAgECYgnAqjV5gAAQIECBAgQIAAAQIECBAgQEA4pQcIECBAgAABAgQIECBAgAABAgTCBIRTYfQKEyBAgAABAgQIECBAgAABAgQICKf0AAECBAgQIECAAAECBAgQIECAQJiAcCqMXmECBAgQIECAAAECBAgQIECAAAHhlB4gQIAAAQIECBAgQIAAAQIECBAIExBOhdErTIAAAQIECBAgQIAAAQIECBAgIJzSAwQIECBAgAABAgQIECBAgAABAmECwqkweoUJECBAgAABAgQIECBAgAABAgSEU3qAAAECBAgQIECAAAECBAgQIEAgTEA4FUavMAECBAgQIECAAAECBAgQIECAgHBKDxAgQIAAAQIECBAgQIAAAQIECIQJCKfC6BUmQIAAAQIECBAgQIAAAQIECBAQTukBAgQIECBAgAABAgQIECBAgACBMAHhVBi9wgQIECBAgAABAgQIECBAgAABAsIpPUCAAAECBAgQIECAAAECBAgQIBAmIJwKo1eYAAECBAgQIECAAAECBAgQIEBAOKUHCBAgQIAAAQIECBAgQIAAAQIEwgSEU2H0ChMgQIAAAQIECBAgQIAAAQIECAin9AABAgQIECBAgAABAgQIECBAgECYgHAqjF5hAgQIECBAgAABAgQIECBAgAAB4ZQeIECAAAECBAgQIECAAAECBAgQCBMQToXRK0yAAAECBAgQIECAAAECBAgQICCc0gMECBAgQIAAAQIECBAgQIAAAQJhAsKpMHqFCRAgQIAAAQIECBAgQIAAAQIEhFN6gAABAgQIECBAgAABAgQIECBAIExAOBVGrzABAgQIECBAgAABAgQIECBAgIBwSg8QIECAAAECBAgQIECAAAECBAiECQinwugVJkCAAAECBAgQIECAAAECBAgQEE7pAQIECBAgQIAAAQIECBAgQIAAgTAB4VQYvcIECBAgQIAAAQIECBAgQIAAAQLCKT1AgAABAgQIECBAgAABAgQIECAQJiCcCqNXmAABAgQIECBAgAABAgQIECBAQDilBwgQIECAAAECBAgQIECAAAECBMIEhFNh9AoTIECAAAECBAgQIECAAAECBAgIp/QAAQIECBAgQIAAAQIECBAgQIBAmIBwKoxeYQIECBAgQIAAAQIECBAgQIAAAeGUHiBAgAABAgQIECBAgAABAgQIEAgTEE6F0StMgAABAgQIECBAgAABAgQIECAgnNIDBAgQIECAAAECBAgQIECAAAECYQLCqTB6hQkQIECAAAECBAgQIECAAAECBIRTeoAAAQIECBAgQIAAAQIECBAgQCBMQDgVRq8wAQIECBAgQIAAAQIECBAgQICAcEoPECBAgAABAgQIECBAgAABAgQIhAkIp8LoFSZAgAABAgQIECBAgAABAgQIEBBO6QECBAgQIECAAAECBAgQIECAAIEwAeFUGL3CBAgQIECAAAECBAgQIECAAAECwik9QIAAAQIECBAgQIAAAQIECBAgECYgnAqjV5gAAQIECBAgQIAAAQIECBAgQEA4pQcIECBAgAABAgQIECBAgAABAgTCBIRTYfQKEyBAgAABAgQIECBAgAABAgQICKf0AAECBAgQIECAAAECBAgQIECAQJiAcCqMXmECBAgQIECAAAECBAgQIECAAAHhlB4gQIAAAQIECBAgQIAAAQIECBAIExBOhdErTIAAAQIECBAgQIAAAQIECBAgIJzSAwQIECBAgAABAgQIECBAgAABAmECwqkweoUJECBAgAABAgQIECBAgAABAgSEU3qAAAECBAgQIECAAAECBAgQIEAgTEA4FUavMAECBAgQIECAAAECBAgQIECAgHBKDxAgQIAAAQIECBAgQIAAAQIECIQJCKfC6BUmQIAAAQIECBAgQIAAAQIECBAQTukBAgQIECBAgAABAgQIECBAgACBMAHhVBi9wgQIECBAgAABAgQIECBAgAABAsIpPUCAAAECBAgQIECAAAECBAgQIBAmIJwKo1eYAAECBAgQIECAAAECBAgQIEBAOKUHCBAgQIAAAQIECBAgQIAAAQIEwgSEU2H0ChMgQIAAAQIECBAgQIAAAQIECAin9AABAgQIECBAgAABAgQIECBAgECYgHAqjF5hAgQIECBAgAABAgQIECBAgAAB4ZQeIECAAAECBAgQIECAAAECBAgQCBMQToXRK0yAAAECBAgQIECAAAECBAgQICCc0gMECBAgQIAAAQIECBAgQIAAAQJhAsKpMHqFCRAgQIAAAQIECBAgQIAAAQIEhFN6gAABAgQIECBAgAABAgQIECBAIExAOBVGrzABAgQIECBAgAABAgQIECBAgIBwSg8QIECAAAECBAgQIECAAAECBAiECQinwugVJkCAAAECBAgQIECAAAECBAgQEE7pAQIECBAgQIAAAQIECBAgQIAAgTAB4VQYvcIECBAgQIAAAQIECBAgQIAAAQLCKT1AgAABAgQIECBAgAABAgQIECAQJiCcCqNXmAABAgQIECBAgAABAgQIECBAQDilBwgQIECAAAECBAgQIECAAAECBMIEhFNh9AoTIECAAAECBAgQIECAAAECBAgIp/QAAQIECBAgQIAAAQIECBAgQIBAmIBwKoxeYQIECBAgQIAAAQIECBAgQIAAAeGUHiBAgAABAgQIECBAgAABAgQIEAgTEE6F0StMgAABAgQIECBAgAABAgQIECAgnNIDBAgQIECAAAECBAgQIECAAAECYQLCqTB6hQkQIECAAAECBAgQIECAAAECBIRTeoAAAQIECBAgQIAAAQIECBAgQCBMQDgVRq8wAQIECBAgQIAAAQIECBAgQICAcEoPECBAgAABAgQIECBAgAABAgQIhAkIp8LoFSZAgAABAgQIECBAgAABAgQIEBBO6QECBAgQIECAAAECBAgQIECAAIEwAeFUGL3CBAgQIECAAAECBAgQIECAAAECwik9QIAAAQIECBAgQIAAAQIECBAgECYgnAqjV5gAAQIECBAgQIAAAQIECBAgQEA4pQcIECBAgAABAgQIECBAgAABAgTCBIRTYfQKEyBAgAABAgQIECBAgAABAgQICKf0AAECBAgQIECAAAECBAgQIECAQJiAcCqMXmECBAgQIECAAAECBAgQIECAAAHhlB4gQIAAAQIECBAgQIAAAQIECBAIExBOhdErTIAAAQIECBAgQIAAAQIECBAgIJzSAwQIECBAgAABAgQIECBAgAABAmECwqkweoUJECBAgAABAgQIECBAgAABAgSEU3qAAAECBAgQIECAAAECBAgQIEAgTEA4FUavMAECBAgQIECAAAECBAgQIECAgHBKDxAgQIAAAQIECBAgQIAAAQIECIQJCKfC6BUmQIAAAQIECBAgQIAAAQIECBAQTukBAgQIECBAgAABAgQIECBAgACBMAHhVBi9wgQIECBAgAABAgQIECBAgAABAsIpPUCAAAECBAgQIECAAAECBAgQIBAmIJwKo1eYAAECBAgQIECAAAECBAgQIEBAOKUHCBAgQIAAAQIECBAgQIAAAQIEwgSEU2H0ChMgQIAAAQIECBAgQIAAAQIECAin9AABAgQIECBAgAABAgQIECBAgECYgHAqjF5hAgQIECBAgAABAgQIECBAgAAB4ZQeIECAAAECBAgQIECAAAECBAgQCBMQToXRK0yAAAECBAgQIECAAAECBAgQICCc0gMECBAgQIAAAQIECBAgQIAAAQJhAsKpMHqFCRAgQIAAAQIECBAgQIAAAQIEhFN6gAABAgQIECBAgAABAgQIECBAIExAOBVGrzABAgQIECBAgAABAgQIECBAgIBwSg8QIECAAAECBAgQIECAAAECBAiECQinwugVJkCAAAECBAgQIECAAAECBAgQEE7pAQIECBAgQIAAAQIECBAgQIAAgTAB4VQYvcIECBAgQIAAAQIECBAgQIAAAQLCKT1AgAABAgQIECBAgAABAgQIECAQJiCcCqNXmAABAgQIECBAgAABAgQIECBAQDilBwgQIECAAAECBAgQIECAAAECBMIEhFNh9AoTIECAAAECBAgQIECAAAECBAgIp/QAAQIECBAgQIAAAQIECBAgQIBAmIBwKoxeYQIECBAgQIAAAQIECBAgQIAAAeGUHiBAgAABAgQIECBAgAABAgQIEAgTEE6F0StMgAABAgQIECBAgAABAgQIECAgnNIDBAgQIECAAAECBAgQIECAAAECYQLCqTB6hQkQIECAAAECBAgQIECAAAECBIRTeoAAAQIECBAgQIAAAQIECBAgQCBMQDgVRq/w6xToPP744+WZM2c2UkrtlI6VKZ3cfJ2P4e4EpgKtlFKV/3Ls2PuXTp781HJKKb8e1ogIbAlc3w/X+uU1dFrHjh3r7Nu3r3316tXxe06+Z/Sb6TfHx44d6508eXKw1Vf6K6a1OseOHWtddxzysZwez+rJJ5+cOX36dD9m0+6qqn66K74bfvm694MbnrNvXIX4R9ruNSx+C4O2YOs1YJxSGk434ZlnnumeOHEiv3bfD7d2Sinvn9urBboppelxzq+p+XmSrYqUnumk1PTA/fxaO5tSyudVbgR2jYBwatccChtyO4H5+f1/OZ/gFUVanZmZna3rcatXdsdVUXeLoihbrVZrNBpdPX/+3P9EksDtBI4dO/ae5eXlb1xaWqrH49bsaDQq53ozy1VRddrtzqC/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CBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiA3OkkIwAAIABJREFUcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAC/rCgiAAALL0lEQVQBAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQIKKcSUjADAQIECBAgQIAAAQIECBAgQKCogHKqaPDWJkCAAAECBAgQIECAAAECBAgkCCinElIwAwECBAgQIECAAAECBAgQIECgqIByqmjw1iZAgAABAgQIECBAgAABAgQIJAgopxJSMAMBAgQIECBAgAABAgQIECBAoKiAcqpo8NYmQIAAAQIECBAgQIAAAQIECCQI/B9dF1/Rrl+h4wAAAABJRU5ErkJggg==";
    // [truncated for brevity; use your full Base64 data here]

    // Place the logo near bottom-left
    doc.addImage(logoData, "PNG", 10, pageHeight - 60, 50, 50);

    // Contact information on the bottom-right
    const address = "1234 Some Address St.\nCity, Country";
    const phone = "Phone: +994 50 123 45 67";
    let textY = pageHeight - 50;
    const addressLines = address.split("\n");
    addressLines.forEach((line) => {
      doc.text(line, pageWidth - 10, textY, { align: "right" });
      textY += 6;
    });
    doc.text(phone, pageWidth - 10, textY, { align: "right" });

    // Finally, save the PDF
    doc.save(`Invoice_${order.orderId}.pdf`);
  };

  return (
    <div className="p-4 my-5 border border-neutral-300 font-gilroy rounded-lg bg-white relative">
      {/* Top bar: search and reset */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 gap-2">
        <div className="relative w-full sm:w-1/3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <CiSearch />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full pl-10 pr-3 py-2 border border-neutral-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-3 py-2 text-blue-400 cursor-pointer rounded transition-colors"
        >
          Reset Filters <FiRefreshCw />
        </button>
      </div>

      {/* Payment Method, Date Range, and Price Filters */}
      <Filters
        onFilterChange={handleOtherFiltersChange}
        resetTrigger={resetTrigger}
      />

      {/* Orders Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Customer Email</th>
              <th className="px-4 py-2 text-left">Customer Name</th>
              {/* <th className="px-4 py-2 text-left">Ordered Size</th> */}
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Payment Method</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Selected Size</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-neutral-100 transition-colors border-b border-neutral-300 relative"
                >
                  <td className="px-4 py-3">{order.orderId}</td>
                  <td className="px-4 py-3">{order.customerEmail}</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  {/* <td className="px-4 py-3">{order.orderedSize}</td> */}
                  <td className="px-4 py-3">₼ {order.price.toFixed(2)}</td>
                  <td className="px-4 py-3 capitalize">
                    {order.paymentMethod}
                  </td>
                  <td className="px-4 py-3">{order.date}</td>
                  <td className="px-4 py-3 capitalize relative">
                    <div
                      className={`flex items-center justify-center py-1 px-2 rounded-md cursor-pointer ${
                        order.status === "delivered"
                          ? "bg-[#effaf3] text-[#50cc89]"
                          : order.status === "pending"
                          ? "bg-[#FFF4E5] text-[#FFA500]"
                          : "bg-[#FFE1E2] text-[#f0426d]"
                      }`}
                      onClick={() =>
                        setOpenStatusDropdown(
                          openStatusDropdown === order.orderId
                            ? null
                            : order.orderId
                        )
                      }
                    >
                      <span>{order.status}</span>
                      <IoCaretDown className="ml-1" />
                    </div>
                    {openStatusDropdown === order.orderId && (
                      <div
                        ref={statusDropdownRef}
                        className="absolute z-50 mt-2 p-2 bg-white rounded shadow-lg"
                      >
                        {statusOptions.map((statusOption) => (
                          <div
                            key={statusOption}
                            className="flex items-center gap-2 px-2 py-1 hover:bg-gray-200 cursor-pointer"
                            onClick={() => {
                              if (statusOption !== order.status) {
                                setModalData({
                                  orderId: order.orderId,
                                  newStatus: statusOption,
                                });
                                setModalVisible(true);
                              } else {
                                setOpenStatusDropdown(null);
                              }
                            }}
                          >
                            <span>{statusOption}</span>
                            {statusOption === order.status && <BsCheck />}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">{order.selectedSize}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center">
                      <FiDownload
                        className="cursor-pointer hover:text-green-500"
                        onClick={() => downloadInvoice(order)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-2 text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <label htmlFor="itemsPerPage" className="text-sm">
            Show per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(0);
            }}
            className="px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {[5, 10, 15].map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
        {pageCount > 1 && (
          <ReactPaginate
            forcePage={currentPage}
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName="flex gap-2 mt-2 sm:mt-0"
            pageClassName="border border-neutral-300 rounded flex items-center justify-center"
            pageLinkClassName="px-3 py-1 cursor-pointer hover:bg-gray-200"
            activeClassName="bg-blue-500 text-white"
            previousClassName={`border border-neutral-300 rounded flex items-center justify-center ${
              currentPage === 0 ? "hidden" : ""
            }`}
            previousLinkClassName="px-3 py-1 cursor-pointer hover:bg-gray-200"
            nextClassName={`border border-neutral-300 rounded flex items-center justify-center ${
              currentPage === pageCount - 1 ? "hidden" : ""
            }`}
            nextLinkClassName="px-3 py-1 cursor-pointer hover:bg-gray-200"
          />
        )}
      </div>

      {/* Modal for confirming status change */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white max-w-[340px] p-6 rounded z-50">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-200">
                <IoWarningOutline
                  className="text-slate-800 fill-teal-700"
                  style={{ fontSize: "32px" }}
                />
              </div>
            </div>
            <p>
              Are you sure you want to change status to{" "}
              <span className="font-bold">{modalData.newStatus}</span>?
            </p>
            <div className="mt-4 flex justify-end gap-2 w-full">
              <button
                onClick={() => {
                  setOrders((prev) =>
                    prev.map((order) =>
                      order.orderId === modalData.orderId
                        ? { ...order, status: modalData.newStatus }
                        : order
                    )
                  );
                  setModalVisible(false);
                  setOpenStatusDropdown(null);
                }}
                className="px-3 py-1 bg-teal-700 hover:bg-teal-500 cursor-pointer duration-300 text-white rounded w-full"
              >
                Confirm
              </button>
              <button
                onClick={() => setModalVisible(false)}
                className="px-3 py-1 bg-neutral-300 hover:bg-neutral-400 text-neutral-700 duration-200 cursor-pointer rounded w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecentOrdersTable;
