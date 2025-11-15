"use client";

import React, { useState, useEffect } from "react";
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
  SelectItem,        // ADDED THIS
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
import { Upload } from "lucide-react";

export default function Stage14() {
  const { records = [], updateRecord, moveToNextStage } = useWorkflow() || {};

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

  const [formData, setFormData] = useState({
    freightNumber: "",
    transportName: "",
    biltyNumber: "",
    paymentAmount: "",
    report: "",
    totalPayment: "",
    totalPaid: "",
    pending: "",
    biltyImage: null as File | null,
    invoiceImage: null as File | null,
    invoiceCopy: null as File | null,
    poInvoiceNumber: "",
    transporterDetails: "",
    vendorName: "",
    vehicleNo: "",
    lrNo: "",
    lrImage: null as File | null,
    paymentForm: "",
    amount: "",
    summaryReport: "",
  });

  // -----------------------------------------------------------------
  // FILTER RECORDS
  // -----------------------------------------------------------------
  const pending = (records || []).filter(
    (r: any) => r?.stage === 14 && r?.status === "pending"
  );

  const completed = (records || []).filter((r: any) =>
    Array.isArray(r?.history) ? r.history.some((h: any) => h?.stage === 14) : false
  );

  // -----------------------------------------------------------------
  // ALL COLUMNS – 60+ + NEW (HIDE Stage 14 fields in Pending)
  // -----------------------------------------------------------------
  const columns = [
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
    { key: "poAttachment", label: "PO Attachment" },
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
    { key: "qcReturnStatus", label: "Return Status" },
    { key: "qcRemarks", label: "QC Remarks" },
    { key: "doneBy", label: "Tally Done By" },
    { key: "submissionDate", label: "Tally Date" },
    { key: "remarks", label: "Tally Remarks" },
    { key: "handoverBy", label: "Handover By" },
    { key: "receivedBy", label: "Received By (Stage 10)" },
    { key: "invoiceSubmissionDate", label: "Invoice Submission Date" },
    { key: "verifiedReceivedBy", label: "Verified – Received By" },
    { key: "verifiedCheckedBy", label: "Verified – Checked By" },
    { key: "verificationDate", label: "Verification Date" },
    { key: "verificationRemarks", label: "Verification Remarks" },
    { key: "amount", label: "Amount" },
    { key: "vendorPayment", label: "Vendor Payment" },
    { key: "paymentDueDate", label: "Payment Due Date" },
    { key: "paymentStatus", label: "Payment Status" },
    { key: "paymentProof", label: "Payment Proof" },
    { key: "totalPaid", label: "Total Paid" },
    { key: "pendingAmount", label: "Pending Amount" },
    { key: "returnedQty", label: "Returned Qty" },
    { key: "returnRate", label: "Return Rate" },
    { key: "returnReason", label: "Return Reason" },
    { key: "returnRemarks", label: "Return Remarks" },
    { key: "returnPhoto", label: "Return Photo" },
    { key: "returnAttachment", label: "Return Attachment" },
    // Stage 14 – HIDDEN IN PENDING
    { key: "freightNumber", label: "Freight #", hideInPending: true },
    { key: "transportName", label: "Transport", hideInPending: true },
    { key: "biltyNumber", label: "Bilty #", hideInPending: true },
    { key: "paymentAmount", label: "Payment Amount", hideInPending: true },
    { key: "report", label: "Report", hideInPending: true },
    { key: "totalPayment", label: "Total Payment", hideInPending: true },
    { key: "totalPaid", label: "Freight Paid", hideInPending: true },
    { key: "pending", label: "Pending (Freight)", hideInPending: true },
    { key: "biltyImage", label: "Bilty Image", hideInPending: true },
    { key: "invoiceImage", label: "Invoice Image", hideInPending: true },
    { key: "invoiceCopy", label: "Invoice Copy", hideInPending: true },
    { key: "poInvoiceNumber", label: "PO Invoice #", hideInPending: true },
    { key: "transporterDetails", label: "Transporter Details", hideInPending: true },
    { key: "vendorName", label: "Vendor Name", hideInPending: true },
    { key: "vehicleNo", label: "Vehicle No", hideInPending: true },
    { key: "lrNo", label: "LR No", hideInPending: true },
    { key: "lrImage", label: "LR Image", hideInPending: true },
    { key: "paymentForm", label: "Payment Form", hideInPending: true },
    { key: "amount", label: "Amount", hideInPending: true },
    { key: "summaryReport", label: "Summary Report", hideInPending: true },
  ];

  const pendingColumns = columns.filter(col => !col.hideInPending);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    pendingColumns.map(c => c.key)
  );

  // -----------------------------------------------------------------
  // AUTO CALCULATE PENDING
  // -----------------------------------------------------------------
  useEffect(() => {
    const total = parseFloat(formData.totalPayment) || 0;
    const paid = parseFloat(formData.totalPaid) || 0;
    setFormData(prev => ({ ...prev, pending: (total - paid).toFixed(2) }));
  }, [formData.totalPayment, formData.totalPaid]);

  // -----------------------------------------------------------------
  // OPEN MODAL
  // -----------------------------------------------------------------
  const handleOpenForm = (recordId: string) => {
    const rec = records.find((r: any) => r.id === recordId);
    if (!rec) return;

    setSelectedRecord(recordId);
    setFormData({
      freightNumber: `FR-${Date.now().toString().slice(-6)}`,
      transportName: rec.data?.transporter || "",
      biltyNumber: rec.data?.biltyNumber || "",
      paymentAmount: "",
      report: "",
      totalPayment: rec.data?.freight || "",
      totalPaid: "",
      pending: "",
      biltyImage: null,
      invoiceImage: null,
      invoiceCopy: null,
      poInvoiceNumber: rec.data?.invoiceNumber || "",
      transporterDetails: "",
      vendorName: rec.data?.vendor || "",
      vehicleNo: "",
      lrNo: rec.data?.lrNumber || "",
      lrImage: null,
      paymentForm: "",
      amount: "",
      summaryReport: "",
    });
    setOpen(true);
  };

  // -----------------------------------------------------------------
  // SUBMIT
  // -----------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const payload = {
      ...formData,
      biltyImage: formData.biltyImage?.name || null,
      invoiceImage: formData.invoiceImage?.name || null,
      invoiceCopy: formData.invoiceCopy?.name || null,
      lrImage: formData.lrImage?.name || null,
    };

    updateRecord(selectedRecord, payload);
    moveToNextStage(selectedRecord);

    setOpen(false);
    setSelectedRecord(null);
    setFormData({
      freightNumber: "",
      transportName: "",
      biltyNumber: "",
      paymentAmount: "",
      report: "",
      totalPayment: "",
      totalPaid: "",
      pending: "",
      biltyImage: null,
      invoiceImage: null,
      invoiceCopy: null,
      poInvoiceNumber: "",
      transporterDetails: "",
      vendorName: "",
      vehicleNo: "",
      lrNo: "",
      lrImage: null,
      paymentForm: "",
      amount: "",
      summaryReport: "",
    });
  };

  const isFormValid =
    formData.transportName &&
    formData.biltyNumber &&
    formData.paymentAmount &&
    formData.paymentForm &&
    formData.amount &&
    formData.summaryReport;

  // -----------------------------------------------------------------
  // SAFE VALUE
  // -----------------------------------------------------------------
  const safeValue = (record: any, key: string, isHistory = false) => {
    try {
      const data = isHistory
        ? record?.history?.find((h: any) => h?.stage === 14)?.data || record?.data
        : record?.data;

      const val = data?.[key];
      if (val === undefined || val === null) return "-";
      return key.includes("Date") && val
        ? new Date(val).toLocaleDateString("en-IN")
        : String(val);
    } catch {
      return "-";
    }
  };

  // -----------------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------------
  if (!records) {
    return <div className="p-6 text-center text-red-600">Loading…</div>;
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 14: Freight Payments</h2>
            <p className="text-gray-600 mt-1">Process transport and handling charges</p>
          </div>

          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Show Columns:</Label>
            <Select value="" onValueChange={() => {}}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder={`${selectedColumns.length} selected`} />
              </SelectTrigger>
              <SelectContent className="w-64 max-h-96 overflow-y-auto">
                <div className="p-2">
                  <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
                    <Checkbox
                      checked={selectedColumns.length === pendingColumns.length}
                      onCheckedChange={(c) =>
                        setSelectedColumns(c ? pendingColumns.map(x => x.key) : [])
                      }
                    />
                    <Label className="text-sm font-medium">All</Label>
                  </div>
                  {pendingColumns.map((col) => (
                    <div key={col.key} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        checked={selectedColumns.includes(col.key)}
                        onCheckedChange={(c) =>
                          setSelectedColumns(
                            c
                              ? [...selectedColumns, col.key]
                              : selectedColumns.filter((x) => x !== col.key)
                          )
                        }
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

      {/* TABS */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>

        {/* PENDING */}
        <TabsContent value="pending" className="mt-6">
          {pending.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No pending freight payments</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-white z-10">ID</TableHead>
                    {pendingColumns
                      .filter((c) => selectedColumns.includes(c.key))
                      .map((col) => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                      ))}
                    <TableHead className="sticky right-0 bg-white z-10">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((rec: any) => (
                    <TableRow key={rec.id}>
                      <TableCell className="font-mono text-xs sticky left-0 bg-white z-10">
                        {rec.id}
                      </TableCell>
                      {pendingColumns
                        .filter((c) => selectedColumns.includes(c.key))
                        .map((col) => (
                          <TableCell key={col.key}>
                            {safeValue(rec, col.key)}
                          </TableCell>
                        ))}
                      <TableCell className="sticky right-0 bg-white z-10">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenForm(rec.id)}
                        >
                          Process Payment
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* COMPLETED (HISTORY) */}
        <TabsContent value="completed" className="mt-6">
          {completed.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No freight payments processed yet</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-white z-10">ID</TableHead>
                    {columns.map((col) => (
                      <TableHead key={col.key}>{col.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completed.map((rec: any) => (
                    <TableRow key={rec.id}>
                      <TableCell className="font-mono text-xs sticky left-0 bg-white z-10">
                        {rec.id}
                      </TableCell>
                      {columns.map((col) => (
                        <TableCell key={col.key}>
                          {safeValue(rec, col.key, true)}
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

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Freight Payment Processing</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Freight & Transport */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Freight No.</Label>
                  <Input value={formData.freightNumber} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="transportName">Transport Name *</Label>
                  <Input
                    id="transportName"
                    value={formData.transportName}
                    onChange={(e) => setFormData({ ...formData, transportName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="biltyNumber">Bilty Number *</Label>
                  <Input
                    id="biltyNumber"
                    value={formData.biltyNumber}
                    onChange={(e) => setFormData({ ...formData, biltyNumber: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* NEW FIELDS */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="poInvoiceNumber">PO Invoice #</Label>
                  <Input
                    id="poInvoiceNumber"
                    value={formData.poInvoiceNumber}
                    onChange={(e) => setFormData({ ...formData, poInvoiceNumber: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="vendorName">Vendor Name</Label>
                  <Input
                    id="vendorName"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleNo">Vehicle No</Label>
                  <Input
                    id="vehicleNo"
                    value={formData.vehicleNo}
                    onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="lrNo">LR No</Label>
                  <Input
                    id="lrNo"
                    value={formData.lrNo}
                    onChange={(e) => setFormData({ ...formData, lrNo: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="transporterDetails">Transporter Details</Label>
                  <Input
                    id="transporterDetails"
                    value={formData.transporterDetails}
                    onChange={(e) => setFormData({ ...formData, transporterDetails: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="paymentAmount">Payment Amount *</Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    step="0.01"
                    value={formData.paymentAmount}
                    onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Payment Form & Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentForm">Payment Form *</Label>
                  <Select
                    value={formData.paymentForm}
                    onValueChange={(v) => setFormData({ ...formData, paymentForm: v })}
                  >
                    <SelectTrigger id="paymentForm">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Total Payment, Paid, Pending */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="totalPayment">Total Payment</Label>
                  <Input
                    id="totalPayment"
                    type="number"
                    step="0.01"
                    value={formData.totalPayment}
                    onChange={(e) => setFormData({ ...formData, totalPayment: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="totalPaid">Total Paid</Label>
                  <Input
                    id="totalPaid"
                    type="number"
                    step="0.01"
                    value={formData.totalPaid}
                    onChange={(e) => setFormData({ ...formData, totalPaid: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Pending</Label>
                  <Input value={formData.pending} readOnly className="bg-gray-50" />
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="biltyImage">Bilty Image</Label>
                  <input
                    id="biltyImage"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => setFormData({ ...formData, biltyImage: e.target.files?.[0] || null })}
                    className="hidden"
                  />
                  <label
                    htmlFor="biltyImage"
                    className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {formData.biltyImage ? formData.biltyImage.name : "Upload Bilty"}
                    </span>
                  </label>
                </div>

                <div>
                  <Label htmlFor="invoiceImage">Invoice Image</Label>
                  <input
                    id="invoiceImage"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => setFormData({ ...formData, invoiceImage: e.target.files?.[0] || null })}
                    className="hidden"
                  />
                  <label
                    htmlFor="invoiceImage"
                    className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {formData.invoiceImage ? formData.invoiceImage.name : "Upload Invoice"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceCopy">Invoice Copy</Label>
                  <input
                    id="invoiceCopy"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData({ ...formData, invoiceCopy: e.target.files?.[0] || null })}
                    className="hidden"
                  />
                  <label
                    htmlFor="invoiceCopy"
                    className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {formData.invoiceCopy ? formData.invoiceCopy.name : "Upload Invoice Copy"}
                    </span>
                  </label>
                </div>

                <div>
                  <Label htmlFor="lrImage">LR Image</Label>
                  <input
                    id="lrImage"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => setFormData({ ...formData, lrImage: e.target.files?.[0] || null })}
                    className="hidden"
                  />
                  <label
                    htmlFor="lrImage"
                    className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {formData.lrImage ? formData.lrImage.name : "Upload LR Image"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Summary Report */}
              <div>
                <Label htmlFor="summaryReport">Summary Report *</Label>
                <textarea
                  id="summaryReport"
                  value={formData.summaryReport}
                  onChange={(e) => setFormData({ ...formData, summaryReport: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border rounded resize-none"
                  placeholder="Enter summary of freight payment, transporter details, and any remarks..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="report">Additional Report</Label>
                <Input
                  id="report"
                  value={formData.report}
                  onChange={(e) => setFormData({ ...formData, report: e.target.value })}
                  placeholder="Any extra notes..."
                />
              </div>
            </form>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid}>
              Complete Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}