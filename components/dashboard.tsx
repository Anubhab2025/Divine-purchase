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
  Truck,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Eye,
  Calendar,
  FileText,
  TrendingUp,
  Plus,
  Package,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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
  {
    rank: 1,
    vendor: "JINDAL STEEL WORKS",
    qty: 18950.5,
    price: 42500,
    material: "MS Billet",
  },
  {
    rank: 2,
    vendor: "RASHMI METALIKS",
    qty: 14230.75,
    price: 41800,
    material: "MS Billet",
  },
  {
    rank: 3,
    vendor: "TATA METALIKS",
    qty: 8750.2,
    price: 42200,
    material: "Sponge Iron",
  },
  {
    rank: 4,
    vendor: "MAITHAN ALLOYS",
    qty: 7210.4,
    price: 42800,
    material: "Ferro Chrome",
  },
  {
    rank: 5,
    vendor: "BHUSHAN TRADERS",
    qty: 4855.3,
    price: 41500,
    material: "MS Scrap",
  },
  {
    rank: 6,
    vendor: "NEELACHAL ISPAT",
    qty: 3900.1,
    price: 42300,
    material: "MS Billet",
  },
  {
    rank: 7,
    vendor: "VANDANA STEELS",
    qty: 3200.8,
    price: 42700,
    material: "Sponge Iron",
  },
  {
    rank: 8,
    vendor: "IMFA LTD",
    qty: 2100.6,
    price: 42900,
    material: "Ferro Chrome",
  },
  {
    rank: 9,
    vendor: "JAI BALAJI",
    qty: 1800.9,
    price: 41600,
    material: "MS Scrap",
  },
  {
    rank: 10,
    vendor: "ELECTROSTEEL",
    qty: 1500.25,
    price: 43000,
    material: "MS Billet",
  },
];

// Define all purchase order stages with pending counts
const purchaseStages = [
  { id: 1, name: "Indent Approval", pending: 12, color: "bg-blue-500" },
  { id: 2, name: "Update 3 Vendors", pending: 8, color: "bg-purple-500" },
  { id: 3, name: "Negotiation", pending: 15, color: "bg-indigo-500" },
  { id: 4, name: "PO Entry", pending: 6, color: "bg-cyan-500" },
  { id: 5, name: "Follow-Up Vendor", pending: 10, color: "bg-teal-500" },
  { id: 6, name: "Material Received", pending: 5, color: "bg-green-500" },
  { id: 7, name: "QC Requirement", pending: 7, color: "bg-lime-500" },
  { id: 8, name: "Receipt in Tally", pending: 4, color: "bg-amber-500" },
  { id: 9, name: "Submit Invoice", pending: 9, color: "bg-orange-500" },
  { id: 10, name: "Verification", pending: 11, color: "bg-red-500" },
  { id: 11, name: "Vendor Payment", pending: 3, color: "bg-pink-500" },
  { id: 12, name: "Purchase Return", pending: 2, color: "bg-rose-500" },
  { id: 13, name: "Freight Payments", pending: 5, color: "bg-fuchsia-500" },
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

  // Forms modal states
  const [formsMenuOpen, setFormsMenuOpen] = useState(false);
  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [vendorFormOpen, setVendorFormOpen] = useState(false);
  const [transporterFormOpen, setTransporterFormOpen] = useState(false);

  // Form data states
  const [itemForm, setItemForm] = useState({
    category: "",
    itemName: "",
    uom: "",
  });

  const [vendorForm, setVendorForm] = useState({
    vendorName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
  });

  const [transporterForm, setTransporterForm] = useState({
    transporterName: "",
    contactPerson: "",
    phone: "",
    vehicleType: "",
  });

  // Sort states
  const [inTransitSort, setInTransitSort] = useState({
    key: "date",
    direction: "desc",
  });
  const [receivedSort, setReceivedSort] = useState({
    key: "date",
    direction: "desc",
  });
  const [pendingSort, setPendingSort] = useState({
    key: "erp",
    direction: "asc",
  });

  // Compute unique values for filters
  const allData = [...inTransitData, ...receivedData, ...pendingData];
  const uniqueParties = [...new Set(allData.map((item) => item.party))].sort();
  const uniqueMaterials = [
    ...new Set(allData.map((item) => item.material)),
  ].sort();

  // Helper function to parse date dd-mm-yyyy
  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Filtering function
  const applyFilters = (data: any[], dataType: string) => {
    return data.filter((item: any) => {
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
      if (
        selectedParty &&
        selectedParty !== "all" &&
        item.party !== selectedParty
      )
        return false;

      // Material filter
      if (
        selectedMaterial &&
        selectedMaterial !== "all" &&
        item.material !== selectedMaterial
      )
        return false;

      // Status filter
      if (
        selectedStatus &&
        selectedStatus !== "all" &&
        selectedStatus !== dataType
      )
        return false;

      return true;
    });
  };

  // Apply filters to data
  const filteredInTransitData = applyFilters(inTransitData, "intransit");
  const filteredReceivedData = applyFilters(receivedData, "received");
  const filteredPendingData = applyFilters(pendingData, "pending");

  // Sorting function
  const sortData = (data: any[], sortConfig: any) => {
    return [...data].sort((a: any, b: any) => {
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
  const searchData = (data: any[], searchTerm: string) => {
    if (!searchTerm) return data;
    return data.filter(
      (item: any) =>
        item.erp.toString().includes(searchTerm.toLowerCase()) ||
        item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.party.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const finalInTransitData = searchData(sortedInTransitData, inTransitSearch);
  const finalReceivedData = searchData(sortedReceivedData, receivedSearch);
  const finalPendingData = searchData(sortedPendingData, pendingSearch);

  // Export to CSV function
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row: any) =>
        headers.map((header) => `"${row[header]}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header with Forms Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Purchase Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage your purchase orders
          </p>
        </div>
        <Button
          onClick={() => {
            console.log("Forms button clicked");
            setFormsMenuOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Forms
        </Button>
      </div>

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
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Input
                  placeholder="dd-mm-yyyy"
                  className="h-9 text-xs"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  to
                </span>
                <Input
                  placeholder="dd-mm-yyyy"
                  className="h-9 text-xs"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
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
            <Select
              value={selectedMaterial}
              onValueChange={setSelectedMaterial}
            >
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

          {/* Pending Items by Stage */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Pending Items by Stage
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Track all pending items across different purchase stages
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs w-[200px]">Stage</TableHead>
                    <TableHead className="text-xs text-right w-[100px]">
                      Pending
                    </TableHead>
                    <TableHead className="text-xs w-[200px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseStages.map((stage) => (
                    <TableRow key={stage.id} className="hover:bg-gray-50">
                      <TableCell className="text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${stage.color}`}
                          ></div>
                          {stage.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="font-mono">
                          {stage.pending}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${stage.color}`}
                            style={{
                              width: `${Math.min(
                                100,
                                (stage.pending / 15) * 100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/*  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs">
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
          </div>
          */}
          {/* BEST PRICE PER MATERIAL – NEW MODERN SECTION */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Best Price per Material
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lowest rate offered by any vendor (Live Comparison)
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700"
                >
                  Smart Savings
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                {(() => {
                  // Group vendors by material and find the one with lowest rate
                  const materialMap = new Map<string, any>();

                  // Use both topVendors and pendingData (which has rate) to get full coverage
                  [...topVendors, ...pendingData].forEach((item: any) => {
                    const key = item.material;
                    if (!materialMap.has(key)) {
                      materialMap.set(key, item);
                    } else {
                      const existing = materialMap.get(key);
                      const existingRate = existing.rate || Infinity;
                      const currentRate = item.rate || Infinity;
                      if (currentRate < existingRate) {
                        materialMap.set(key, item);
                      }
                    }
                  });

                  // Sort by savings potential (higher rate difference = more savings)
                  const bestPrices = Array.from(materialMap.values())
                    .filter((i: any) => i.rate) // Only items with rate
                    .sort((a: any, b: any) => b.rate - a.rate)
                    .slice(0, 8); // Top 8 for clean UI

                  return bestPrices.length > 0 ? (
                    bestPrices.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.material}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {item.party || item.vendor}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-emerald-700">
                            ₹{item.rate?.toLocaleString() || "N/A"}
                          </p>
                          <p className="text-xs text-emerald-600 font-medium">
                            per unit
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No pricing data available yet
                    </p>
                  );
                })()}
              </div>

              {/* Optional: Show total potential savings */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Switching to best price could save
                  </span>
                  <span className="font-bold text-emerald-600 text-lg">
                    Up to ₹12.4L/month
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* <Card>
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
                      <span className="truncate max-w-32 sm:max-w-none">
                        {m.material}
                      </span>
                    </div>
                    <span className="font-medium">{m.qty.toFixed(2)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="lg:hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Top Vendors</CardTitle>
              <p className="text-xs text-muted-foreground">
                Leading suppliers by order count
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={vendorBarData.slice(0, 5)} layout="horizontal">
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

          <Card className="hidden lg:block">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Top Vendors</CardTitle>
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

          <Card className="lg:hidden">
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
                <div key={v.rank} className="flex items-center justify-between">
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

          {/* New Overview Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Purchase Order Overview
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Detailed view of all purchase orders
              </p>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Indent #</TableHead>
                    <TableHead className="text-xs">Created By</TableHead>
                    <TableHead className="text-xs">
                      Warehouse Location
                    </TableHead>
                    <TableHead className="text-xs">Lead Time</TableHead>
                    <TableHead className="text-xs">Category</TableHead>
                    <TableHead className="text-xs">Item</TableHead>
                    <TableHead className="text-xs text-right">Qty</TableHead>
                    <TableHead className="text-xs">Exp. Delivery</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingData.map((item) => (
                    <TableRow key={item.erp}>
                      <TableCell className="text-xs">IND-{item.erp}</TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                            {item.party.charAt(0)}
                          </div>
                          <span>{item.party.split(" ")[0]}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {
                          [
                            "Mumbai",
                            "Delhi",
                            "Bangalore",
                            "Hyderabad",
                            "Kolkata",
                          ][Math.floor(Math.random() * 5)]
                        }
                      </TableCell>
                      <TableCell className="text-xs">
                        {Math.floor(Math.random() * 10) + 5} days
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.material.split(" ")[0]}
                      </TableCell>
                      <TableCell className="text-xs">{item.material}</TableCell>
                      <TableCell className="text-xs text-right">
                        {item.qty.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(
                          Date.now() +
                            (Math.floor(Math.random() * 30) + 5) *
                              24 *
                              60 *
                              60 *
                              1000
                        ).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge
                          variant="outline"
                          className={
                            item.erp % 3 === 0
                              ? "bg-green-50 text-green-700 border-green-200"
                              : item.erp % 3 === 1
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {item.erp % 3 === 0
                            ? "In Progress"
                            : item.erp % 3 === 1
                            ? "Pending"
                            : "Delayed"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Input
              placeholder="Search by ERP, material, or party..."
              value={inTransitSearch}
              onChange={(e) => setInTransitSearch(e.target.value)}
              className="flex-1 sm:max-w-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportToCSV(finalInTransitData, "in-transit-data.csv")
              }
              className="flex items-center justify-center gap-1"
            >
              <Download className="h-3 w-3" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() =>
                        setInTransitSort({
                          key: "erp",
                          direction:
                            inTransitSort.key === "erp" &&
                            inTransitSort.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      ERP PO Number{" "}
                      {inTransitSort.key === "erp" &&
                        (inTransitSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() =>
                        setInTransitSort({
                          key: "material",
                          direction:
                            inTransitSort.key === "material" &&
                            inTransitSort.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      Material Name{" "}
                      {inTransitSort.key === "material" &&
                        (inTransitSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() =>
                        setInTransitSort({
                          key: "party",
                          direction:
                            inTransitSort.key === "party" &&
                            inTransitSort.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      Party Name{" "}
                      {inTransitSort.key === "party" &&
                        (inTransitSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-xs">Truck No.</TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() =>
                        setInTransitSort({
                          key: "date",
                          direction:
                            inTransitSort.key === "date" &&
                            inTransitSort.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      Date{" "}
                      {inTransitSort.key === "date" &&
                        (inTransitSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-xs text-right">
                      Quantity
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalInTransitData.map((item: any) => (
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Input
              placeholder="Search by ERP, material, or party..."
              value={receivedSearch}
              onChange={(e) => setReceivedSearch(e.target.value)}
              className="flex-1 sm:max-w-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportToCSV(finalReceivedData, "received-data.csv")
              }
              className="flex items-center justify-center gap-1"
            >
              <Download className="h-3 w-3" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() =>
                        setReceivedSort({
                          key: "erp",
                          direction:
                            receivedSort.key === "erp" &&
                            receivedSort.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      ERP PO Number{" "}
                      {receivedSort.key === "erp" &&
                        (receivedSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() =>
                        setReceivedSort({
                          key: "material",
                          direction:
                            receivedSort.key === "material" &&
                            receivedSort.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      Material Name{" "}
                      {receivedSort.key === "material" &&
                        (receivedSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() =>
                        setReceivedSort({
                          key: "party",
                          direction:
                            receivedSort.key === "party" &&
                            receivedSort.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      Party Name{" "}
                      {receivedSort.key === "party" &&
                        (receivedSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-xs">Bill Image</TableHead>
                    <TableHead className="text-xs">Truck No.</TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() =>
                        setReceivedSort({
                          key: "date",
                          direction:
                            receivedSort.key === "date" &&
                            receivedSort.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      Date{" "}
                      {receivedSort.key === "date" &&
                        (receivedSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-xs text-right">
                      Quantity
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalReceivedData.map((item: any) => (
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
              onClick={() => exportToCSV(finalPendingData, "pending-data.csv")}
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
                      onClick={() =>
                        setPendingSort({
                          key: "erp",
                          direction:
                            pendingSort.key === "erp" &&
                            pendingSort.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      ERP PO Number{" "}
                      {pendingSort.key === "erp" &&
                        (pendingSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() =>
                        setPendingSort({
                          key: "material",
                          direction:
                            pendingSort.key === "material" &&
                            pendingSort.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      Material Name{" "}
                      {pendingSort.key === "material" &&
                        (pendingSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() =>
                        setPendingSort({
                          key: "party",
                          direction:
                            pendingSort.key === "party" &&
                            pendingSort.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      Party Name{" "}
                      {pendingSort.key === "party" &&
                        (pendingSort.direction === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-xs text-right">
                      Quantity
                    </TableHead>
                    <TableHead className="text-xs text-right">Rate</TableHead>
                    <TableHead className="text-xs text-right">
                      Pending Qty
                    </TableHead>
                    <TableHead className="text-xs text-right">
                      Total Lifted
                    </TableHead>
                    <TableHead className="text-xs text-right">
                      Total Received
                    </TableHead>
                    <TableHead className="text-xs text-right">
                      Returned Qty
                    </TableHead>
                    <TableHead className="text-xs text-right">
                      Order Cancel Qty
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalPendingData.map((item: any) => (
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

      {/* Debug - Remove after testing */}
      {formsMenuOpen && (
        <div className="fixed top-0 left-0 bg-red-500 text-white p-2 z-50">
          Modal State: OPEN
        </div>
      )}

      {/* Forms Menu Modal */}
      <Dialog open={formsMenuOpen} onOpenChange={setFormsMenuOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Form Type</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="h-20 flex items-center justify-start gap-4"
              onClick={() => {
                setFormsMenuOpen(false);
                setItemFormOpen(true);
              }}
            >
              <Package className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold">Item Form</div>
                <div className="text-xs text-muted-foreground">
                  Add new item details
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex items-center justify-start gap-4"
              onClick={() => {
                setFormsMenuOpen(false);
                setVendorFormOpen(true);
              }}
            >
              <Users className="w-8 h-8 text-green-600" />
              <div className="text-left">
                <div className="font-semibold">Vendor Form</div>
                <div className="text-xs text-muted-foreground">
                  Add new vendor details
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex items-center justify-start gap-4"
              onClick={() => {
                setFormsMenuOpen(false);
                setTransporterFormOpen(true);
              }}
            >
              <Truck className="w-8 h-8 text-orange-600" />
              <div className="text-left">
                <div className="font-semibold">Transporter Form</div>
                <div className="text-xs text-muted-foreground">
                  Add new transporter details
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Form Modal */}
      <Dialog open={itemFormOpen} onOpenChange={setItemFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Item Form:", itemForm);
              setItemFormOpen(false);
              setItemForm({ category: "", itemName: "", uom: "" });
            }}
          >
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={itemForm.category}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, category: e.target.value })
                  }
                  required
                  placeholder="e.g. Electronics, Hardware"
                />
              </div>
              <div>
                <Label htmlFor="itemName">Item Name *</Label>
                <Input
                  id="itemName"
                  value={itemForm.itemName}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, itemName: e.target.value })
                  }
                  required
                  placeholder="e.g. Laptop, Screwdriver"
                />
              </div>
              <div>
                <Label htmlFor="uom">UOM (Unit of Measurement) *</Label>
                <Select
                  value={itemForm.uom}
                  onValueChange={(v) => setItemForm({ ...itemForm, uom: v })}
                >
                  <SelectTrigger id="uom">
                    <SelectValue placeholder="Select UOM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">Pieces (PCS)</SelectItem>
                    <SelectItem value="kg">Kilogram (KG)</SelectItem>
                    <SelectItem value="ltr">Liter (LTR)</SelectItem>
                    <SelectItem value="mtr">Meter (MTR)</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="set">Set</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setItemFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Vendor Form Modal */}
      <Dialog open={vendorFormOpen} onOpenChange={setVendorFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Vendor Form:", vendorForm);
              setVendorFormOpen(false);
              setVendorForm({
                vendorName: "",
                contactPerson: "",
                phone: "",
                email: "",
                address: "",
              });
            }}
          >
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="vendorName">Vendor Name *</Label>
                <Input
                  id="vendorName"
                  value={vendorForm.vendorName}
                  onChange={(e) =>
                    setVendorForm({ ...vendorForm, vendorName: e.target.value })
                  }
                  required
                  placeholder="e.g. ABC Suppliers"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={vendorForm.contactPerson}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        contactPerson: e.target.value,
                      })
                    }
                    required
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={vendorForm.phone}
                    onChange={(e) =>
                      setVendorForm({ ...vendorForm, phone: e.target.value })
                    }
                    required
                    placeholder="e.g. 9876543210"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={vendorForm.email}
                  onChange={(e) =>
                    setVendorForm({ ...vendorForm, email: e.target.value })
                  }
                  placeholder="e.g. vendor@example.com"
                />
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <textarea
                  id="address"
                  value={vendorForm.address}
                  onChange={(e) =>
                    setVendorForm({ ...vendorForm, address: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-3 py-2 border rounded resize-none"
                  placeholder="Enter complete address"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setVendorFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Vendor</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Transporter Form Modal */}
      <Dialog open={transporterFormOpen} onOpenChange={setTransporterFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Transporter</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Transporter Form:", transporterForm);
              setTransporterFormOpen(false);
              setTransporterForm({
                transporterName: "",
                contactPerson: "",
                phone: "",
                vehicleType: "",
              });
            }}
          >
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="transporterName">Transporter Name *</Label>
                <Input
                  id="transporterName"
                  value={transporterForm.transporterName}
                  onChange={(e) =>
                    setTransporterForm({
                      ...transporterForm,
                      transporterName: e.target.value,
                    })
                  }
                  required
                  placeholder="e.g. Fast Logistics"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transporterContact">Contact Person *</Label>
                  <Input
                    id="transporterContact"
                    value={transporterForm.contactPerson}
                    onChange={(e) =>
                      setTransporterForm({
                        ...transporterForm,
                        contactPerson: e.target.value,
                      })
                    }
                    required
                    placeholder="e.g. Jane Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="transporterPhone">Phone *</Label>
                  <Input
                    id="transporterPhone"
                    value={transporterForm.phone}
                    onChange={(e) =>
                      setTransporterForm({
                        ...transporterForm,
                        phone: e.target.value,
                      })
                    }
                    required
                    placeholder="e.g. 9876543210"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="vehicleType">Vehicle Type *</Label>
                <Select
                  value={transporterForm.vehicleType}
                  onValueChange={(v) =>
                    setTransporterForm({ ...transporterForm, vehicleType: v })
                  }
                >
                  <SelectTrigger id="vehicleType">
                    <SelectValue placeholder="Select Vehicle Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="trailer">Trailer</SelectItem>
                    <SelectItem value="container">Container</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setTransporterFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Transporter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
