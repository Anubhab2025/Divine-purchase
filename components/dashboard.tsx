"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Eye,
  Calendar,
  FileText,
  TrendingUp,
} from "lucide-react";

// === NEW DATA (DIFFERENT FROM MOCK) ===
const inTransitData = [
  {
    erp: 892,
    material: "MS Billet",
    party: "JINDAL STEEL WORKS",
    truck: "RJ14GA1234",
    date: "02/11/2025",
    qty: 120.5,
  },
  {
    erp: 879,
    material: "Ferro Chrome",
    party: "TATA METALIKS",
    truck: "WB19AB5678",
    date: "02/11/2025",
    qty: 45.2,
  },
  {
    erp: 875,
    material: "Silico Manganese",
    party: "MAITHAN ALLOYS",
    truck: "OR05CD9012",
    date: "01/11/2025",
    qty: 88.7,
  },
  {
    erp: 861,
    material: "Sponge Iron",
    party: "RASHMI METALIKS",
    truck: "CG07XY4455",
    date: "01/11/2025",
    qty: 67.3,
  },
  {
    erp: 849,
    material: "MS Scrap",
    party: "BHUSHAN TRADERS",
    truck: "MH12PQ8899",
    date: "31/10/2025",
    qty: 29.1,
  },
  {
    erp: 837,
    material: "Pig Iron",
    party: "NEELACHAL ISPAT",
    truck: "OD02LM3344",
    date: "30/10/2025",
    qty: 55.8,
  },
  {
    erp: 824,
    material: "MS Ingot",
    party: "VANDANA STEELS",
    truck: "CG04AB1122",
    date: "29/10/2025",
    qty: 41.6,
  },
  {
    erp: 811,
    material: "Ferro Silicon",
    party: "IMFA LTD",
    truck: "OR11JK5566",
    date: "28/10/2025",
    qty: 33.9,
  },
  {
    erp: 799,
    material: "MS Billet",
    party: "ELECTROSTEEL",
    truck: "WB25MN7788",
    date: "27/10/2025",
    qty: 95.4,
  },
  {
    erp: 788,
    material: "Sponge Iron",
    party: "JAI BALAJI",
    truck: "CG10EF9900",
    date: "26/10/2025",
    qty: 72.1,
  },
];

const receivedData = [
  {
    erp: 891,
    material: "MS Billet",
    party: "JINDAL STEEL WORKS",
    truck: "RJ14GA1234",
    date: "02/11/2025",
    qty: 120.5,
  },
  {
    erp: 878,
    material: "Ferro Chrome",
    party: "TATA METALIKS",
    truck: "WB19AB5678",
    date: "01/11/2025",
    qty: 45.2,
  },
  {
    erp: 874,
    material: "Silico Manganese",
    party: "MAITHAN ALLOYS",
    truck: "OR05CD9012",
    date: "01/11/2025",
    qty: 88.7,
  },
  {
    erp: 860,
    material: "Sponge Iron",
    party: "RASHMI METALIKS",
    truck: "CG07XY4455",
    date: "31/10/2025",
    qty: 67.3,
  },
  {
    erp: 848,
    material: "MS Scrap",
    party: "BHUSHAN TRADERS",
    truck: "MH12PQ8899",
    date: "30/10/2025",
    qty: 29.1,
  },
  {
    erp: 836,
    material: "Pig Iron",
    party: "NEELACHAL ISPAT",
    truck: "OD02LM3344",
    date: "29/10/2025",
    qty: 55.8,
  },
  {
    erp: 823,
    material: "MS Ingot",
    party: "VANDANA STEELS",
    truck: "CG04AB1122",
    date: "28/10/2025",
    qty: 41.6,
  },
  {
    erp: 810,
    material: "Ferro Silicon",
    party: "IMFA LTD",
    truck: "OR11JK5566",
    date: "27/10/2025",
    qty: 33.9,
  },
  {
    erp: 798,
    material: "MS Billet",
    party: "ELECTROSTEEL",
    truck: "WB25MN7788",
    date: "26/10/2025",
    qty: 95.4,
  },
  {
    erp: 787,
    material: "Sponge Iron",
    party: "JAI BALAJI",
    truck: "CG10EF9900",
    date: "25/10/2025",
    qty: 72.1,
  },
];

const pendingData = [
  {
    erp: 701,
    material: "MS Billet",
    party: "JINDAL STEEL WORKS",
    qty: 150,
    rate: 48500,
    pending: 150,
    lifted: 0,
    received: 0,
    returned: 0,
    cancelled: 0,
  },
  {
    erp: 702,
    material: "Sponge Iron",
    party: "RASHMI METALIKS",
    qty: 200,
    rate: 28500,
    pending: 180,
    lifted: 20,
    received: 20,
    returned: 0,
    cancelled: 0,
  },
  {
    erp: 703,
    material: "Ferro Chrome",
    party: "TATA METALIKS",
    qty: 50,
    rate: 125000,
    pending: 30,
    lifted: 20,
    received: 15,
    returned: 5,
    cancelled: 0,
  },
  {
    erp: 704,
    material: "MS Scrap",
    party: "BHUSHAN TRADERS",
    qty: 80,
    rate: 32000,
    pending: 80,
    lifted: 0,
    received: 0,
    returned: 0,
    cancelled: 0,
  },
  {
    erp: 705,
    material: "Silico Manganese",
    party: "MAITHAN ALLOYS",
    qty: 100,
    rate: 78000,
    pending: 70,
    lifted: 30,
    received: 25,
    returned: 5,
    cancelled: 0,
  },
];

const topMaterials = [
  { rank: 1, material: "MS Billet", qty: 18950.5 },
  { rank: 2, material: "Sponge Iron", qty: 14230.75 },
  { rank: 3, material: "Ferro Chrome", qty: 8750.2 },
  { rank: 4, material: "Silico Manganese", qty: 7210.4 },
  { rank: 5, material: "MS Scrap", qty: 4855.3 },
  { rank: 6, material: "Pig Iron", qty: 3900.1 },
  { rank: 7, material: "MS Ingot", qty: 3200.8 },
  { rank: 8, material: "Ferro Silicon", qty: 2100.6 },
  { rank: 9, material: "TMT Bar", qty: 1800.9 },
  { rank: 10, material: "Wire Rod", qty: 1500.25 },
];

const topVendors = [
  { rank: 1, vendor: "JINDAL STEEL WORKS", qty: 18950.5 },
  { rank: 2, vendor: "RASHMI METALIKS", qty: 14230.75 },
  { rank: 3, vendor: "TATA METALIKS", qty: 8750.2 },
  { rank: 4, vendor: "MAITHAN ALLOYS", qty: 7210.4 },
  { rank: 5, vendor: "BHUSHAN TRADERS", qty: 4855.3 },
  { rank: 6, vendor: "NEELACHAL ISPAT", qty: 3900.1 },
  { rank: 7, vendor: "VANDANA STEELS", qty: 3200.8 },
  { rank: 8, vendor: "IMFA LTD", qty: 2100.6 },
  { rank: 9, vendor: "JAI BALAJI", qty: 1800.9 },
  { rank: 10, vendor: "ELECTROSTEEL", qty: 1500.25 },
];

const vendorBarData = topVendors.map((v) => ({
  name: v.vendor.split(" ").slice(0, 2).join(" "),
  qty: v.qty,
}));
const pieData = [
  { name: "Complete", value: 88, color: "#10b981" },
  { name: "Pending", value: 12, color: "#f59e0b" },
];

export default function PurchaseDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Filter states
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedParty, setSelectedParty] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Search states
  const [inTransitSearch, setInTransitSearch] = useState("");
  const [receivedSearch, setReceivedSearch] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");

  // Sort states
  const [inTransitSort, setInTransitSort] = useState({ key: "date", direction: "desc" });
  const [receivedSort, setReceivedSort] = useState({ key: "date", direction: "desc" });
  const [pendingSort, setPendingSort] = useState({ key: "erp", direction: "asc" });

  // Compute unique values for filters
  const allData = [...inTransitData, ...receivedData, ...pendingData];
  const uniqueParties = [...new Set(allData.map(item => item.party))].sort();
  const uniqueMaterials = [...new Set(allData.map(item => item.material))].sort();

  // Helper function to parse date dd-mm-yyyy
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Filtering function
  const applyFilters = (data, dataType) => {
    return data.filter((item) => {
      // Date filter
      if (dateFrom || dateTo) {
        const itemDate = parseDate(item.date);
        if (!itemDate) return false;
        if (dateFrom) {
          const fromDate = parseDate(dateFrom);
          if (fromDate && itemDate < fromDate) return false;
        }
        if (dateTo) {
          const toDate = parseDate(dateTo);
          if (toDate && itemDate > toDate) return false;
        }
      }

      // Party filter
      if (selectedParty && selectedParty !== "all" && item.party !== selectedParty) return false;

      // Material filter
      if (selectedMaterial && selectedMaterial !== "all" && item.material !== selectedMaterial) return false;

      // Status filter
      if (selectedStatus && selectedStatus !== "all" && selectedStatus !== dataType) return false;

      return true;
    });
  };

  // Apply filters to data
  const filteredInTransitData = applyFilters(inTransitData, "intransit");
  const filteredReceivedData = applyFilters(receivedData, "received");
  const filteredPendingData = applyFilters(pendingData, "pending");

  // Sorting function
  const sortData = (data, sortConfig) => {
    return [...data].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === "date") {
        aVal = parseDate(aVal);
        bVal = parseDate(bVal);
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Apply sorting
  const sortedInTransitData = sortData(filteredInTransitData, inTransitSort);
  const sortedReceivedData = sortData(filteredReceivedData, receivedSort);
  const sortedPendingData = sortData(filteredPendingData, pendingSort);

  // Apply search
  const searchData = (data, searchTerm) => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      item.erp.toString().includes(searchTerm.toLowerCase()) ||
      item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.party.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const finalInTransitData = searchData(sortedInTransitData, inTransitSearch);
  const finalReceivedData = searchData(sortedReceivedData, receivedSearch);
  const finalPendingData = searchData(sortedPendingData, pendingSearch);

  // Export to CSV function
  const exportToCSV = (data, filename) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Smart Filters */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <CardTitle className="text-sm font-medium">Smart Filters</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Refine your data view with advanced filtering options
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="dd-mm-yyyy"
                className="h-9 text-xs"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <span className="text-xs text-muted-foreground">to</span>
              <Input
                placeholder="dd-mm-yyyy"
                className="h-9 text-xs"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <Select value={selectedParty} onValueChange={setSelectedParty}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Party Names" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Party Names</SelectItem>
                {uniqueParties.map((party) => (
                  <SelectItem key={party} value={party}>
                    {party}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Materials" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Materials</SelectItem>
                {uniqueMaterials.map((material) => (
                  <SelectItem key={material} value={material}>
                    {material}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="intransit">In-Transit</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
                setSelectedParty("all");
                setSelectedMaterial("all");
                setSelectedStatus("all");
              }}
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-11">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="purchase" className="text-xs sm:text-sm">
            Purchase Data
          </TabsTrigger>
          <TabsTrigger value="intransit" className="text-xs sm:text-sm">
            In-Transit
          </TabsTrigger>
          <TabsTrigger value="received" className="text-xs sm:text-sm">
            Received
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Purchase Orders
                </CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">329</div>
                <p className="text-xs text-muted-foreground">Active Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending PO's
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
                <p className="text-xs text-muted-foreground">Awaiting Action</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed PO's
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">297</div>
                <p className="text-xs text-muted-foreground">Delivered</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">88%</div>
                <Progress value={88} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-purple-600" />
                  PO Quantity by Status
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Distribution of quantities across order statuses
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Complete: 88%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Pending: 12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Top Vendors
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Leading suppliers by order count
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={vendorBarData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={80}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip />
                    <Bar dataKey="qty" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Top Materials
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Most ordered materials by quantity
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  {topMaterials.slice(0, 5).map((m) => (
                    <div
                      key={m.rank}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="w-6 h-6 p-0 flex items-center justify-center text-[10px] font-bold"
                        >
                          {m.rank}
                        </Badge>
                        <span className="truncate max-w-32">{m.material}</span>
                      </div>
                      <span className="font-medium">{m.qty.toFixed(2)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Top Vendors by Quantity
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Leading suppliers by total quantity
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  {topVendors.slice(0, 5).map((v) => (
                    <div
                      key={v.rank}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="w-6 h-6 p-0 flex items-center justify-center text-[10px] font-bold"
                        >
                          {v.rank}
                        </Badge>
                        <span className="truncate max-w-32">
                          {v.vendor.split(" ").slice(0, 2).join(" ")}
                        </span>
                      </div>
                      <span className="font-medium">{v.qty.toFixed(2)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* IN-TRANSIT TAB */}
        <TabsContent value="intransit" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Materials In-Transit</h3>
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {finalInTransitData.length} Items
            </Badge>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by ERP, material, or party..."
              value={inTransitSearch}
              onChange={(e) => setInTransitSearch(e.target.value)}
              className="max-w-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(finalInTransitData, 'in-transit-data.csv')}
              className="flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
              Export CSV
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() => setInTransitSort({
                        key: "erp",
                        direction: inTransitSort.key === "erp" && inTransitSort.direction === "asc" ? "desc" : "asc"
                      })}
                    >
                      ERP PO Number {inTransitSort.key === "erp" && (inTransitSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() => setInTransitSort({
                        key: "material",
                        direction: inTransitSort.key === "material" && inTransitSort.direction === "asc" ? "desc" : "asc"
                      })}
                    >
                      Material Name {inTransitSort.key === "material" && (inTransitSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() => setInTransitSort({
                        key: "party",
                        direction: inTransitSort.key === "party" && inTransitSort.direction === "asc" ? "desc" : "asc"
                      })}
                    >
                      Party Name {inTransitSort.key === "party" && (inTransitSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-xs">Truck No.</TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() => setInTransitSort({
                        key: "date",
                        direction: inTransitSort.key === "date" && inTransitSort.direction === "asc" ? "desc" : "asc"
                      })}
                    >
                      Date {inTransitSort.key === "date" && (inTransitSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-xs text-right">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalInTransitData.map((item) => (
                    <TableRow key={item.erp}>
                      <TableCell className="font-medium text-xs">
                        {item.erp}
                      </TableCell>
                      <TableCell className="text-xs">{item.material}</TableCell>
                      <TableCell className="text-xs max-w-48 truncate">
                        {item.party}
                      </TableCell>
                      <TableCell className="text-xs">{item.truck}</TableCell>
                      <TableCell className="text-xs">{item.date}</TableCell>
                      <TableCell className="text-right font-medium text-xs">
                        {item.qty}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RECEIVED TAB */}
        <TabsContent value="received" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Received Materials</h3>
            </div>
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              {finalReceivedData.length} Items
            </Badge>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by ERP, material, or party..."
              value={receivedSearch}
              onChange={(e) => setReceivedSearch(e.target.value)}
              className="max-w-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(finalReceivedData, 'received-data.csv')}
              className="flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
              Export CSV
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() => setReceivedSort({
                        key: "erp",
                        direction: receivedSort.key === "erp" && receivedSort.direction === "asc" ? "desc" : "asc"
                      })}
                    >
                      ERP PO Number {receivedSort.key === "erp" && (receivedSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() => setReceivedSort({
                        key: "material",
                        direction: receivedSort.key === "material" && receivedSort.direction === "asc" ? "desc" : "asc"
                      })}
                    >
                      Material Name {receivedSort.key === "material" && (receivedSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() => setReceivedSort({
                        key: "party",
                        direction: receivedSort.key === "party" && receivedSort.direction === "asc" ? "desc" : "asc"
                      })}
                    >
                      Party Name {receivedSort.key === "party" && (receivedSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-xs">Bill Image</TableHead>
                    <TableHead className="text-xs">Truck No.</TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() => setReceivedSort({
                        key: "date",
                        direction: receivedSort.key === "date" && receivedSort.direction === "asc" ? "desc" : "asc"
                      })}
                    >
                      Date {receivedSort.key === "date" && (receivedSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-xs text-right">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalReceivedData.map((item) => (
                    <TableRow key={item.erp}>
                      <TableCell className="font-medium text-xs">
                        {item.erp}
                      </TableCell>
                      <TableCell className="text-xs">{item.material}</TableCell>
                      <TableCell className="text-xs max-w-48 truncate">
                        {item.party}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-xs">{item.truck}</TableCell>
                      <TableCell className="text-xs">{item.date}</TableCell>
                      <TableCell className="text-right font-medium text-xs">
                        {item.qty}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PURCHASE DATA → PENDING TAB */}
        <TabsContent value="purchase" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold">
                Pending Orders from PO Sheet
              </h3>
            </div>
            <Badge variant="secondary" className="bg-orange-50 text-orange-700">
              {finalPendingData.length} Orders
            </Badge>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by ERP, material, or party..."
              value={pendingSearch}
              onChange={(e) => setPendingSearch(e.target.value)}
              className="max-w-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(finalPendingData, 'pending-data.csv')}
              className="flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
              Export CSV
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() => setPendingSort({
                        key: "erp",
                        direction: pendingSort.key === "erp" && pendingSort.direction === "asc" ? "desc" : "asc"
                      })}
                    >
                      ERP PO Number {pendingSort.key === "erp" && (pendingSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() => setPendingSort({
                        key: "material",
                        direction: pendingSort.key === "material" && pendingSort.direction === "asc" ? "desc" : "asc"
                      })}
                    >
                      Material Name {pendingSort.key === "material" && (pendingSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() => setPendingSort({
                        key: "party",
                        direction: pendingSort.key === "party" && pendingSort.direction === "asc" ? "desc" : "asc"
                      })}
                    >
                      Party Name {pendingSort.key === "party" && (pendingSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-xs text-right">Quantity</TableHead>
                    <TableHead className="text-xs text-right">Rate</TableHead>
                    <TableHead className="text-xs text-right">Pending Qty</TableHead>
                    <TableHead className="text-xs text-right">Total Lifted</TableHead>
                    <TableHead className="text-xs text-right">Total Received</TableHead>
                    <TableHead className="text-xs text-right">Returned Qty</TableHead>
                    <TableHead className="text-xs text-right">Order Cancel Qty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalPendingData.map((item) => (
                    <TableRow key={item.erp}>
                      <TableCell className="font-medium text-xs">
                        {item.erp}
                      </TableCell>
                      <TableCell className="text-xs">{item.material}</TableCell>
                      <TableCell className="text-xs max-w-40 truncate">
                        {item.party}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {item.qty}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {item.rate.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {item.pending}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {item.lifted}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {item.received}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {item.returned}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {item.cancelled}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
