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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ACCOUNTANTS = [
  "Priya Sharma",
  "Rajesh Kumar",
  "Anita Patel",
  "Vikram Singh",
  "Sneha Gupta",
];

export default function Stage9() {
  const { records = [], updateRecord, moveToNextStage } = useWorkflow() || {};

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [bulkData, setBulkData] = useState({
    doneBy: "",
    submissionDate: new Date().toISOString().split("T")[0],
    remarks: "",
  });
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  // Filter records
  const pending = (records || []).filter(
    (r: any) => r?.stage === 9 && r?.status === "pending"
  );
  const completed = (records || []).filter((r: any) =>
    Array.isArray(r?.history) ? r.history.some((h: any) => h?.stage === 9) : false
  );

  // Pending columns (without Tally result fields)
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
  ];

  // History columns (includes Tally result fields)
  const historyColumns = [
    ...pendingColumns,
    { key: "doneBy", label: "Tally Done By" },
    { key: "submissionDate", label: "Tally Date" },
    { key: "remarks", label: "Tally Remarks" },
  ];

  const [selectedPendingColumns, setSelectedPendingColumns] = useState<string[]>(
    pendingColumns.map((c) => c.key)
  );

  const [selectedHistoryColumns, setSelectedHistoryColumns] = useState<string[]>(
    historyColumns.map((c) => c.key)
  );

  // Toggle row
  const toggleRow = (id: string) => {
    const newSet = new Set(selectedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedRows(newSet);
  };

  // Toggle all
  const toggleAll = () => {
    if (selectedRows.size === pending.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(pending.map((r: any) => r.id)));
    }
  };

  // Bulk submit
  const handleBulkSubmit = () => {
    if (!bulkData.doneBy || selectedRows.size === 0) return;

    selectedRows.forEach((id) => {
      const tallyData = {
        doneBy: bulkData.doneBy,
        submissionDate: bulkData.submissionDate,
        remarks: bulkData.remarks,
      };
      updateRecord(id, tallyData);
      moveToNextStage(id);
    });

    setSelectedRows(new Set());
    setBulkData({
      doneBy: "",
      submissionDate: new Date().toISOString().split("T")[0],
      remarks: "",
    });
  };

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

  // Safe value getter with lifting data support
  const safeValue = (record: any, key: string, isHistory = false) => {
    try {
      const data = isHistory
        ? record?.history?.find((h: any) => h?.stage === 9)?.data || record?.data
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
            <h2 className="text-2xl font-bold">Stage 9: Tally Entry</h2>
            <p className="text-gray-600 mt-1">Record material receipt in Tally</p>
          </div>
        </div>

        {/* Bulk Tally Controls */}
        {selectedRows.size > 0 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Checkbox checked={true} disabled />
                <span className="font-medium">{selectedRows.size} selected</span>
              </div>

              <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap">Done By *</Label>
                <Select
                  value={bulkData.doneBy}
                  onValueChange={(v) => setBulkData({ ...bulkData, doneBy: v })}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNTANTS.map((n) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={bulkData.submissionDate}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, submissionDate: e.target.value })
                  }
                  className="w-40"
                />
              </div>

              <div className="flex items-center gap-2">
                <Label>Remarks</Label>
                <Input
                  value={bulkData.remarks}
                  onChange={(e) =>
                    setBulkData({ ...bulkData, remarks: e.target.value })
                  }
                  placeholder="Optional..."
                  className="w-64"
                />
              </div>

              <Button onClick={handleBulkSubmit} disabled={!bulkData.doneBy}>
                Done
              </Button>
            </div>
          </div>
        )}
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
              <p className="text-lg">No pending Tally entries</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 sticky left-0 bg-white z-20">
                      <Checkbox
                        checked={
                          selectedRows.size === pending.length && pending.length > 0
                        }
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead className="sticky left-12 bg-white z-20">ID</TableHead>
                    {pendingColumns
                      .filter((c) => selectedPendingColumns.includes(c.key))
                      .map((col) => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell className="w-12 sticky left-0 bg-white z-10">
                        <Checkbox
                          checked={selectedRows.has(record.id)}
                          onCheckedChange={() => toggleRow(record.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs sticky left-12 bg-white z-10">
                        {record.id}
                      </TableCell>
                      {pendingColumns
                        .filter((c) => selectedPendingColumns.includes(c.key))
                        .map((col) => (
                          <TableCell key={col.key}>
                            {safeValue(record, col.key)}
                          </TableCell>
                        ))}
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
              <p className="text-lg">No Tally history</p>
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
    </div>
  );
}