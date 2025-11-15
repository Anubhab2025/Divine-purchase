"use client";

import React, { useState } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const HANDOVER_PERSONNEL = [
  "Vikram Singh",
  "Priya Sharma",
  "Rajesh Kumar",
  "Anita Patel",
  "Sneha Gupta",
];

const ACCOUNTS_PERSONNEL = [
  "Amit Shah",
  "Neha Jain",
  "Suresh Patel",
  "Kavita Rao",
  "Rohit Verma",
];

export default function Stage10() {
  const { records = [], updateRecord, moveToNextStage } = useWorkflow() || {};

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  const [formData, setFormData] = useState({
    handoverBy: "",
    receivedBy: "",
    invoiceSubmissionDate: new Date(), // Unique key
    invoiceNumber: "",
    vendorName: "",
  });

  const pending = (records || []).filter(
    (r: any) => r?.stage === 10 && r?.status === "pending"
  );
  const completed = (records || []).filter((r: any) =>
    Array.isArray(r?.history) ? r.history.some((h: any) => h?.stage === 10) : false
  );

  // Pending columns (without handover result fields)
  const pendingColumns = [
    { key: "indentNumber", label: "Indent #" },
    { key: "createdBy", label: "Created By" },
    { key: "category", label: "Category" },
    { key: "itemName", label: "Item" },
    { key: "quantity", label: "Qty" },
    { key: "warehouse", label: "Warehouse" },
    { key: "vendor", label: "Vendor" },
    { key: "ratePerQty", label: "Rate/Qty" },
    { key: "paymentTerms", label: "Payment Terms" },
    { key: "deliveryDate", label: "Exp. Delivery" },
    { key: "warranty", label: "Warranty" },
    { key: "attachment", label: "Attachment" },
    { key: "approvedBy", label: "Approved By" },
    { key: "poNumber", label: "PO Number" },
    { key: "basicValue", label: "Basic Value" },
    { key: "totalWithTax", label: "Total w/Tax" },
    { key: "poCopy", label: "PO Copy" },
    { key: "liftNumber", label: "Lift #" },
    { key: "liftQty", label: "Lift Qty" },
    { key: "transporter", label: "Transporter" },
    { key: "lrNumber", label: "LR #" },
    { key: "freight", label: "Freight" },
    { key: "advanceAmount", label: "Adv. Amt" },
    { key: "paymentDate", label: "Pay Date" },
    { key: "biltyNumber", label: "Bilty #" },
    { key: "invoiceNumber", label: "Invoice #" },
    { key: "invoiceDate", label: "Invoice Date" },
    { key: "srnNumber", label: "SRN #" },
    { key: "qcRequired", label: "QC Required" },
    { key: "receivedItemImage", label: "Rec. Item Img" },
    { key: "hydraAmount", label: "Hydra Amt" },
    { key: "labourAmount", label: "Labour Amt" },
    { key: "hemaliAmount", label: "Hemali Amt" },
    { key: "qcBy", label: "QC Done By" },
    { key: "qcDate", label: "QC Date" },
    { key: "qcStatus", label: "QC Status" },
    { key: "rejectQty", label: "Reject Qty" },
    { key: "rejectRemarks", label: "Reject Remarks" },
    { key: "returnStatus", label: "Return Status" },
    { key: "qcRemarks", label: "QC Remarks" },
    { key: "doneBy", label: "Tally Done By" },
    { key: "submissionDate", label: "Tally Date" },
    { key: "remarks", label: "Tally Remarks" },
  ];

  // History columns (includes handover result fields)
  const historyColumns = [
    ...pendingColumns,
    { key: "handoverBy", label: "Handover By" },
    { key: "receivedBy", label: "Received By" },
    { key: "invoiceSubmissionDate", label: "Invoice Submission Date" },
  ];

  const [selectedPendingColumns, setSelectedPendingColumns] = useState<string[]>(
    pendingColumns.map((c) => c.key)
  );

  const [selectedHistoryColumns, setSelectedHistoryColumns] = useState<string[]>(
    historyColumns.map((c) => c.key)
  );

  const handleOpenForm = (recordId: string) => {
    const record = records.find((r: any) => r.id === recordId);
    if (!record) return;

    const invoiceNumber = record.data?.invoiceNumber || "-";
    const vendorName =
      record.data?.vendor ||
      record.data?.vendorName ||
      record.data?.vendor_name ||
      "Unknown Vendor";

    setSelectedRecord(recordId);
    setFormData({
      handoverBy: "",
      receivedBy: "",
      invoiceSubmissionDate: new Date(),
      invoiceNumber,
      vendorName,
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const dataToSave = {
      handoverBy: formData.handoverBy,
      receivedBy: formData.receivedBy,
      invoiceSubmissionDate: formData.invoiceSubmissionDate.toISOString().split("T")[0],
      invoiceNumber: formData.invoiceNumber,
      vendorName: formData.vendorName,
    };

    updateRecord(selectedRecord, dataToSave);
    moveToNextStage(selectedRecord);

    setOpen(false);
    setSelectedRecord(null);
    setFormData({
      handoverBy: "",
      receivedBy: "",
      invoiceSubmissionDate: new Date(),
      invoiceNumber: "",
      vendorName: "",
    });
  };

  const isFormValid =
    formData.handoverBy &&
    formData.receivedBy &&
    formData.invoiceNumber &&
    formData.vendorName;

  // Get vendor data
  const getVendorData = (record: any) => {
    const selectedId = record?.data?.selectedVendor || "vendor1";
    const idx = parseInt(selectedId.replace("vendor", ""), 10) || 1;
    return {
      name: record?.data?.[`vendor${idx}Name`] || record?.data?.vendorName || "-",
      rate: record?.data?.[`vendor${idx}Rate`] || record?.data?.ratePerQty || "-",
      terms: record?.data?.[`vendor${idx}Terms`] || record?.data?.paymentTerms || "-",
      delivery: record?.data?.[`vendor${idx}DeliveryDate`] || record?.data?.deliveryDate,
      warrantyType: record?.data?.[`vendor${idx}WarrantyType`] || record?.data?.warrantyType || "-",
      attachment: record?.data?.[`vendor${idx}Attachment`] || record?.data?.vendorAttachment,
    };
  };

  const safeValue = (record: any, key: string, isHistory = false) => {
    try {
      const data = isHistory
        ? record?.history?.find((h: any) => h?.stage === 10)?.data || record?.data
        : record?.data;

      // Get lifting data
      const lift = (data?.liftingData as any[] ?? [])[0] ?? {};
      const vendor = getVendorData({ data });

      // Handle lifting data fields
      if (key === "liftNumber") return lift.liftNumber || "-";
      if (key === "liftQty") return lift.liftingQty || "-";
      if (key === "transporter") return lift.transporterName || "-";
      if (key === "lrNumber") return lift.lrNumber || "-";
      if (key === "freight") return lift.freightAmount ? `₹${lift.freightAmount}` : "-";
      if (key === "advanceAmount") return lift.advanceAmount ? `₹${lift.advanceAmount}` : "-";
      if (key === "paymentDate") return lift.paymentDate ? new Date(lift.paymentDate).toLocaleDateString("en-IN") : "-";
      if (key === "biltyNumber") return lift.biltyCopy?.name || "-";

      // Handle vendor data fields
      if (key === "vendor") return vendor.name;
      if (key === "ratePerQty") return vendor.rate ? `₹${vendor.rate}` : "-";
      if (key === "paymentTerms") return vendor.terms;
      if (key === "warranty") return vendor.warrantyType;
      if (key === "attachment") return vendor.attachment?.name || "-";

      // Handle warehouse
      if (key === "warehouse") return data?.warehouseLocation || data?.warehouse || "-";

      // Handle Stage 7 payment amounts
      if (key === "hydraAmount") return data?.paymentAmountHydra ? `₹${data.paymentAmountHydra}` : "-";
      if (key === "labourAmount") return data?.paymentAmountLabour ? `₹${data.paymentAmountLabour}` : "-";
      if (key === "hemaliAmount") return data?.paymentAmountHemali ? `₹${data.paymentAmountHemali}` : "-";

      // Handle QC Required
      if (key === "qcRequired") return data?.qcRequirement || "-";

      // Handle regular fields
      const val = data?.[key];
      if (val === undefined || val === null) return "-";
      return key.includes("Date") && val
        ? new Date(val).toLocaleDateString("en-IN")
        : String(val);
    } catch {
      return "-";
    }
  };

  if (!records) {
    return <div className="p-6 text-center text-red-600">Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 10: Submit Invoice to Accounts</h2>
            <p className="text-gray-600 mt-1">Hand over original invoice for payment</p>
          </div>

          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Show Columns:</Label>
            <Select value="" onValueChange={() => {}}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder={
                  activeTab === "pending"
                    ? `${selectedPendingColumns.length} selected`
                    : `${selectedHistoryColumns.length} selected`
                } />
              </SelectTrigger>
              <SelectContent className="w-64 max-h-96 overflow-y-auto">
                <div className="p-2">
                  <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
                    <Checkbox
                      checked={
                        activeTab === "pending"
                          ? selectedPendingColumns.length === pendingColumns.length
                          : selectedHistoryColumns.length === historyColumns.length
                      }
                      onCheckedChange={(checked) => {
                        if (activeTab === "pending") {
                          setSelectedPendingColumns(checked ? pendingColumns.map((c) => c.key) : []);
                        } else {
                          setSelectedHistoryColumns(checked ? historyColumns.map((c) => c.key) : []);
                        }
                      }}
                    />
                    <Label className="text-sm font-medium">All</Label>
                  </div>
                  {(activeTab === "pending" ? pendingColumns : historyColumns).map((col) => (
                    <div key={col.key} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        checked={
                          activeTab === "pending"
                            ? selectedPendingColumns.includes(col.key)
                            : selectedHistoryColumns.includes(col.key)
                        }
                        onCheckedChange={(checked) => {
                          if (activeTab === "pending") {
                            setSelectedPendingColumns(
                              checked
                                ? [...selectedPendingColumns, col.key]
                                : selectedPendingColumns.filter((c) => c !== col.key)
                            );
                          } else {
                            setSelectedHistoryColumns(
                              checked
                                ? [...selectedHistoryColumns, col.key]
                                : selectedHistoryColumns.filter((c) => c !== col.key)
                            );
                          }
                        }}
                      />
                      <Label className="text-sm">{col.label}</Label>
                    </div>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="history">History ({completed.length})</TabsTrigger>
        </TabsList>

        {/* Pending Tab */}
        <TabsContent value="pending" className="mt-6">
          {pending.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No pending submissions</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-white z-10">ID</TableHead>
                    {pendingColumns
                      .filter((c) => selectedPendingColumns.includes(c.key))
                      .map((col) => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                      ))}
                    <TableHead className="sticky right-0 bg-white z-10">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs sticky left-0 bg-white z-10">
                        {record.id}
                      </TableCell>
                      {pendingColumns
                        .filter((c) => selectedPendingColumns.includes(c.key))
                        .map((col) => (
                          <TableCell key={col.key}>
                            {safeValue(record, col.key)}
                          </TableCell>
                        ))}
                      <TableCell className="sticky right-0 bg-white z-10">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenForm(record.id)}
                        >
                          Submit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          {completed.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No submissions yet</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-white z-10">ID</TableHead>
                    {historyColumns
                      .filter((c) => selectedHistoryColumns.includes(c.key))
                      .map((col) => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completed.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs sticky left-0 bg-white z-10">
                        {record.id}
                      </TableCell>
                      {historyColumns
                        .filter((c) => selectedHistoryColumns.includes(c.key))
                        .map((col) => (
                          <TableCell key={col.key}>
                            {safeValue(record, col.key, true)}
                          </TableCell>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal with Calendar */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Submit Invoice to Accounts</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Invoice Summary */}
              <div className="p-4 bg-gray-50 border rounded-lg">
                <h3 className="font-medium mb-3">Invoice Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Invoice Number</Label>
                    <p className="font-mono text-lg">{formData.invoiceNumber}</p>
                  </div>
                  <div>
                    <Label>Vendor</Label>
                    <p className="text-lg">{formData.vendorName}</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="handoverBy">Handover By *</Label>
                    <Select
                      value={formData.handoverBy}
                      onValueChange={(v) => setFormData({ ...formData, handoverBy: v })}
                    >
                      <SelectTrigger id="handoverBy">
                        <SelectValue placeholder="Select submitter" />
                      </SelectTrigger>
                      <SelectContent>
                        {HANDOVER_PERSONNEL.map((n) => (
                          <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="receivedBy">Received By (Accounts) *</Label>
                    <Select
                      value={formData.receivedBy}
                      onValueChange={(v) => setFormData({ ...formData, receivedBy: v })}
                    >
                      <SelectTrigger id="receivedBy">
                        <SelectValue placeholder="Select accounts" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACCOUNTS_PERSONNEL.map((n) => (
                          <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="submissionDate">Invoice Submission Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="submissionDate"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {formData.invoiceSubmissionDate
                          ? format(formData.invoiceSubmissionDate, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.invoiceSubmissionDate}
                        onSelect={(date) =>
                          date && setFormData({ ...formData, invoiceSubmissionDate: date })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </form>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid}>
              Submit to Accounts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}